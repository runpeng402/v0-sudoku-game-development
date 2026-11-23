const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const { randomBytes } = require("node:crypto")
const ts = require("typescript")
const { Webhook } = require("standardwebhooks")
const DodoPayments = require("dodopayments").default

const pack = "sudoku-techniques-v1"
const key = randomBytes(32).toString("base64")
const dodo = new DodoPayments({ bearerToken: "local-test-only", environment: "test_mode", webhookKey: key })
const rows = new Map()
let activeCheckout = null
let sessionStatus = {}
let sessionsCreated = 0
let enabled = true
let configReady = true
let checkoutBody
let payment = {
  payment_id: "pay_test1",
  status: "succeeded",
  product_cart: [{ product_id: "training-product" }],
  metadata: { sudoku_buyer_id: "buyer", sudoku_pack: pack, sudoku_mode: "test_mode" },
}

dodo.payments.retrieve = async (id) => {
  assert.equal(id, payment.payment_id)
  return payment
}
dodo.checkoutSessions.create = async (body) => {
  checkoutBody = body
  return { session_id: "cks_" + ++sessionsCreated, checkout_url: "https://checkout.example.com/training/" + sessionsCreated }
}
dodo.checkoutSessions.retrieve = async () => sessionStatus

const services = {
  mode: "test_mode",
  origin: "https://sudoku.example.com",
  productId: "training-product",
  dodo,
  db: {
    from(table) {
      if (table === "sudoku_training_checkouts") return {
        select: () => ({ match: () => ({ maybeSingle: async () => ({ data: activeCheckout }) }) }),
        async insert(key) {
          if (activeCheckout) return { error: { code: "23505" } }
          activeCheckout = { ...key, session_id: null, checkout_url: null }
          return { error: null }
        },
        update: (data) => ({ match: async () => {
          activeCheckout = { ...activeCheckout, ...data }
          return { error: null }
        } }),
        delete: () => ({ match: async (key) => {
          if (activeCheckout?.session_id === key.session_id) activeCheckout = null
          return { error: null }
        } }),
      }
      assert.equal(table, "sudoku_training_payments")
      return {
        async upsert(row, { ignoreDuplicates }) {
          if (!ignoreDuplicates || !rows.has(row.payment_id)) rows.set(row.payment_id, row)
          return { error: null }
        },
      }
    },
  },
}

const fakePayments = {
  trainingPack: pack,
  trainingPaymentsEnabled: () => enabled,
  trainingPaymentServices: () => {
    if (!configReady) throw new Error("unconfigured")
    return services
  },
  trainingBuyer: async (request) => request.headers.get("authorization") === "Bearer verified" ?
    { id: "buyer", email: "buyer@example.com" } : null,
  hasTrainingPurchase: async (_services, id) => [...rows.values()].some((row) => row.buyer_id === id && !row.revoked),
}

function loadRoute(filename) {
  const source = fs.readFileSync(path.join(__dirname, "..", filename), "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  })
  const exports = {}
  new Function("exports", "require", outputText)(exports, (name) => {
    if (name === "@/lib/sudoku-training-payments") return fakePayments
    if (name.startsWith("@/")) return require(path.join(__dirname, "..", name.slice(2)))
    return require(name)
  })
  return exports
}

const training = loadRoute("app/api/sudoku-training/route.ts")
const webhook = loadRoute("app/api/webhooks/dodo/route.ts")

function request(token, method = "GET", query = "") {
  return new Request("https://sudoku.example.com/api/sudoku-training" + query, {
    method, headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

function notify(type, data, valid = true) {
  const body = JSON.stringify({ type, data })
  const timestamp = new Date()
  const id = "msg_" + randomBytes(8).toString("hex")
  const signature = new Webhook(key).sign(id, timestamp, body)
  return webhook.POST(new Request("https://sudoku.example.com/api/webhooks/dodo", {
    method: "POST",
    body,
    headers: {
      "webhook-id": id,
      "webhook-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
      "webhook-signature": valid ? signature : "v1,invalid",
    },
  }))
}

async function expectAccess(token, access, count) {
  const response = await training.GET(request(token))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("cache-control"), "private, no-store")
  const result = await response.json()
  assert.equal(result.access, access)
  assert.equal(result.exercises.length, count)
  return result.exercises
}

async function main() {
  enabled = false
  await expectAccess(null, "free", 12)
  assert.equal((await training.POST(request("verified", "POST"))).status, 503)
  enabled = true
  configReady = false
  assert.equal((await training.GET(request(null))).status, 503)
  configReady = true

  const sample = await expectAccess(null, "signed-out", 3)
  assert.equal(new Set(sample.map((entry) => entry.topic.id)).size, 3)
  assert.equal((await training.POST(request("unverified", "POST"))).status, 401)
  await expectAccess("verified", "locked", 3)
  const start = sessionsCreated
  const parallel = await Promise.all(["pricing", "practice"].map((entry) =>
    training.POST(request("verified", "POST", "?entry=" + entry))))
  assert.deepEqual(parallel.map((response) => response.status).sort(), [200, 409])
  assert.equal(sessionsCreated - start, 1)
  const [firstUrl, reusedUrl] = await Promise.all([
    parallel.find((response) => response.ok).json(),
    training.POST(request("verified", "POST")).then((response) => response.json()),
  ])
  assert.deepEqual(firstUrl, reusedUrl)
  assert.equal(sessionsCreated - start, 1)
  sessionStatus = { payment_status: "processing", payment_id: payment.payment_id }
  assert.equal((await training.POST(request("verified", "POST"))).status, 409)
  sessionStatus = { payment_status: "failed", payment_id: payment.payment_id }
  assert.equal((await training.POST(request("verified", "POST"))).status, 200)
  assert.deepEqual(checkoutBody.product_cart, [{ product_id: "training-product", quantity: 1 }])
  assert.equal(checkoutBody.metadata.sudoku_buyer_id, "buyer")
  assert.equal(checkoutBody.cancel_url, "https://sudoku.example.com/sudoku-practice?checkout=cancelled#exercises")
  assert.equal((await training.POST(request("verified", "POST", "?entry=pricing&topic=hidden"))).status, 200)
  assert.equal(checkoutBody.return_url, "https://sudoku.example.com/pricing?checkout=returned#training-purchase")
  assert.equal(checkoutBody.cancel_url, "https://sudoku.example.com/pricing?checkout=cancelled#training-purchase")
  services.mode = "live_mode"
  assert.equal((await training.POST(request("verified", "POST", "?entry=pricing"))).status, 200)
  assert.equal(checkoutBody.return_url, "https://sudoku.example.com/pricing?checkout=returned#training-purchase")
  assert.equal(checkoutBody.cancel_url, "https://sudoku.example.com/pricing?checkout=cancelled#training-purchase")
  services.mode = "test_mode"
  assert.equal((await training.POST(request("verified", "POST", "?entry=practice&topic=locked"))).status, 200)
  assert.equal(checkoutBody.return_url, "https://sudoku.example.com/sudoku-practice?topic=locked&checkout=returned#exercises")
  assert.equal((await training.POST(request("verified", "POST", "?entry=https://untrusted.example&topic=untrusted"))).status, 200)
  assert.equal(checkoutBody.return_url, "https://sudoku.example.com/sudoku-practice?checkout=returned#exercises")

  const paymentQuery = "?payment_id=" + payment.payment_id
  for (const [provider, expected] of [["failed", "failed"], ["cancelled", "cancelled"], ["processing", "processing"], ["succeeded", "succeeded"]]) {
    payment.status = provider
    const result = await (await training.GET(request("verified", "GET", paymentQuery + "&status=untrusted"))).json()
    assert.equal(result.paymentStatus, expected)
    assert.equal(result.access, "locked", "provider status alone does not unlock access")
    assert.equal((await training.POST(request("verified", "POST", paymentQuery))).status,
      provider === "processing" || provider === "succeeded" ? 409 : 200)
  }
  payment.metadata.sudoku_buyer_id = "another-buyer"
  assert.equal((await (await training.GET(request("verified", "GET", paymentQuery))).json()).paymentStatus, undefined)
  assert.equal((await training.POST(request("verified", "POST", paymentQuery))).status, 409)
  payment.metadata.sudoku_buyer_id = "buyer"

  const eventPayment = { payment_id: payment.payment_id }
  assert.equal((await notify("payment.succeeded", eventPayment, false)).status, 400)
  await expectAccess("verified", "locked", 3)
  await notify("payment.cancelled", eventPayment)
  await expectAccess("verified", "locked", 3)
  payment.metadata.sudoku_mode = "live_mode"
  await notify("payment.succeeded", eventPayment)
  await expectAccess("verified", "locked", 3)
  payment.metadata.sudoku_mode = "test_mode"

  assert.equal((await notify("payment.succeeded", eventPayment)).status, 200)
  await notify("payment.succeeded", eventPayment)
  assert.equal(rows.size, 1)
  await expectAccess("verified", "unlocked", 12)
  await expectAccess("unverified", "signed-out", 3)
  assert.equal((await training.POST(request("verified", "POST"))).status, 409)

  await notify("refund.succeeded", { ...eventPayment, is_partial: true })
  await expectAccess("verified", "unlocked", 12)
  await notify("refund.succeeded", { ...eventPayment, is_partial: false })
  await notify("payment.succeeded", eventPayment)
  await expectAccess("verified", "locked", 3)

  sessionStatus = { payment_status: "succeeded", payment_id: payment.payment_id }
  payment.refund_status = "full"
  const afterRefund = sessionsCreated
  assert.equal((await training.POST(request("verified", "POST"))).status, 200)
  assert.equal(sessionsCreated - afterRefund, 1)

  activeCheckout = null
  dodo.checkoutSessions.create = async () => { throw new Error("Provider response could not be read") }
  assert.equal((await training.POST(request("verified", "POST"))).status, 502)
  assert.equal((await training.POST(request("verified", "POST"))).status, 409)

  console.log("Passed: checkout concurrency and reuse, payment states, post-refund repurchase, uncertain creation, signed webhooks, and delayed success.")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
