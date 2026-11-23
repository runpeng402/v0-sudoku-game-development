import { NextResponse } from "next/server"
import fixtures from "@/lib/sudoku-training-exercises.json"
import { hasTrainingPurchase, trainingBuyer, trainingPack, trainingPaymentServices, trainingPaymentsEnabled } from "@/lib/sudoku-training-payments"
import type { TrainingExercise, TrainingResponse } from "@/lib/sudoku-training-types"

export const dynamic = "force-dynamic"

const topics = [
  { id: "single", name: "Naked singles" },
  { id: "hidden", name: "Hidden singles" },
  { id: "locked", name: "Locked candidates" },
] as const

const lessons: TrainingExercise[] = topics.flatMap((topic) =>
  fixtures[topic.id].map((exercise, index, group) => ({
    ...exercise, topic, check: index === group.length - 1,
  })),
)
const sample = lessons.filter((_, index) => index % 4 === 0)

function reply(body: TrainingResponse | { error: string } | { url: string; }, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } })
}

async function paymentStatus(request: Request, services: ReturnType<typeof trainingPaymentServices>, buyerId: string): Promise<TrainingResponse["paymentStatus"]> {
  const id = new URL(request.url).searchParams.get("payment_id")
  if (!id || !/^pay_[A-Za-z0-9]{1,100}$/.test(id)) return

  try {
    const payment = await services.dodo.payments.retrieve(id)
    if (payment.metadata?.sudoku_buyer_id !== buyerId ||
        payment.metadata.sudoku_pack !== trainingPack ||
        payment.metadata.sudoku_mode !== services.mode ||
        !payment.product_cart?.some((item) => item.product_id === services.productId)) return

    switch (payment.status) {
      case "failed":
      case "cancelled":
      case "succeeded":
        return payment.status
      default:
        return "processing"
    }
  } catch {
    // An unavailable payment lookup must not prevent checking existing access.
    return
  }
}

export async function GET(request: Request) {
  if (!trainingPaymentsEnabled()) return reply({ access: "free", exercises: lessons })

  try {
    const services = trainingPaymentServices()
    const buyer = await trainingBuyer(request, services.db)
    if (!buyer) return reply({ access: "signed-out", exercises: sample })
    const purchased = await hasTrainingPurchase(services, buyer.id)
    if (purchased) return reply({ access: "unlocked", exercises: lessons })
    return reply({ access: "locked", exercises: sample, paymentStatus: await paymentStatus(request, services, buyer.id) })
  } catch {
    return reply({ error: "Training access is temporarily unavailable. Please try again." }, 503)
  }
}

export async function POST(request: Request) {
  if (!trainingPaymentsEnabled()) return reply({ error: "Checkout is unavailable." }, 503)

  try {
    const services = trainingPaymentServices()
    const buyer = await trainingBuyer(request, services.db)
    if (!buyer) return reply({ error: "Sign in with a verified email first." }, 401)
    if (await hasTrainingPurchase(services, buyer.id)) return reply({ error: "You already own the training pack. Refresh your access." }, 409)
    const params = new URL(request.url).searchParams
    const status = await paymentStatus(request, services, buyer.id)
    if (params.has("payment_id") && status !== "failed" && status !== "cancelled") {
      return reply({ error: "A payment already exists for this checkout. Refresh access before trying again." }, 409)
    }

    const key = { mode: services.mode, pack: trainingPack, buyer_id: buyer.id }
    const checkouts = services.db.from("sudoku_training_checkouts")
    const { data: existing, error: readError } = await checkouts.select("session_id, checkout_url").match(key).maybeSingle()
    if (readError) throw readError

    const alreadyOpening = () => reply({ error: "A checkout is already opening or awaiting confirmation. Wait a moment and check again." }, 409)
    if (existing) {
      if (!existing.session_id || !existing.checkout_url) return alreadyOpening()
      const session = await services.dodo.checkoutSessions.retrieve(existing.session_id)
      const fullyRefunded = session.payment_status === "succeeded" && session.payment_id &&
        (await services.dodo.payments.retrieve(session.payment_id)).refund_status === "full"
      if (session.payment_status !== "failed" && session.payment_status !== "cancelled" && !fullyRefunded) {
        if (!session.payment_id || session.payment_status === "requires_payment_method") {
          return reply({ url: existing.checkout_url })
        }
        return alreadyOpening()
      }
      // Compare against the retired session so a concurrent request cannot remove its replacement.
      const { error } = await checkouts.delete().match({ ...key, session_id: existing.session_id })
      if (error) throw error
    }

    // A unique row is reserved before calling Dodo, across tabs and server instances.
    const { error: reservationError } = await checkouts.insert(key)
    if (reservationError?.code === "23505") return alreadyOpening()
    if (reservationError) throw reservationError

    const entry = services.mode === "test_mode" && params.get("entry") === "pricing" ? "/pricing" : "/sudoku-practice"
    const topic = topics.find((item) => item.id === params.get("topic"))
    const back = new URL(entry, services.origin)
    if (entry === "/sudoku-practice" && topic) back.searchParams.set("topic", topic.id)
    back.hash = entry === "/pricing" ? "training-purchase" : "exercises"
    back.searchParams.set("checkout", "returned")
    const returnUrl = back.href
    back.searchParams.set("checkout", "cancelled")
    const checkout = await services.dodo.checkoutSessions.create({
      product_cart: [{ product_id: services.productId, quantity: 1 }],
      customer: { email: buyer.email, name: buyer.email.split("@")[0] },
      metadata: { sudoku_buyer_id: buyer.id, sudoku_pack: trainingPack, sudoku_mode: services.mode },
      return_url: returnUrl,
      cancel_url: back.href,
    })
    if (!checkout.session_id || !checkout.checkout_url || new URL(checkout.checkout_url).protocol !== "https:") {
      return reply({ error: "The checkout link is unavailable. Please try again." }, 502)
    }
    const { error: saveError } = await checkouts.update({ session_id: checkout.session_id, checkout_url: checkout.checkout_url }).match(key)
    if (saveError) throw saveError
    return reply({ url: checkout.checkout_url })
  } catch {
    return reply({ error: "Could not open checkout. Please try again." }, 502)
  }
}
