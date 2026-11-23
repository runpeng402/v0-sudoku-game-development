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

export async function GET(request: Request) {
  if (!trainingPaymentsEnabled()) return reply({ access: "free", exercises: lessons })

  try {
    const services = trainingPaymentServices()
    const buyer = await trainingBuyer(request, services.db)
    if (!buyer) return reply({ access: "signed-out", exercises: sample })
    const purchased = await hasTrainingPurchase(services, buyer.id)
    return reply(purchased ? { access: "unlocked", exercises: lessons } : { access: "locked", exercises: sample })
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
    if (!checkout.checkout_url || new URL(checkout.checkout_url).protocol !== "https:") {
      return reply({ error: "The checkout link is unavailable. Please try again." }, 502)
    }
    return reply({ url: checkout.checkout_url })
  } catch {
    return reply({ error: "Could not open checkout. Please try again." }, 502)
  }
}
