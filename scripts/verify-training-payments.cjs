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
let enabled = true
let configReady = true
let checkoutBody
let payment = {
  payment_id: "payment-1",
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
  return { checkout_url: "https://checkout.example.com/training" }
}

const services = {
  mode: "test_mode",
  origin: "https://sudoku.example.com",
  productId: "training-product",
  dodo,
  db: {
    from(table) {
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

function request(token, method = "GET") {
  return new Request("https://sudoku.example.com/api/sudoku-training", {
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
  assert.equal((await training.POST(request("verified", "POST"))).status, 200)
  assert.deepEqual(checkoutBody.product_cart, [{ product_id: "training-product", quantity: 1 }])
  assert.equal(checkoutBody.metadata.sudoku_buyer_id, "buyer")
  assert.equal(checkoutBody.cancel_url, "https://sudoku.example.com/sudoku-practice?checkout=cancelled")

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

  console.log("Passed: free fallback, authorization, checkout, signed webhooks, duplicate delivery, cancel, refund, and delayed success.")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
