import { NextResponse } from "next/server"
import { trainingPack, trainingPaymentServices } from "@/lib/sudoku-training-payments"

export async function POST(request: Request) {
  let services: ReturnType<typeof trainingPaymentServices>
  try {
    services = trainingPaymentServices()
  } catch {
    return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 })
  }

  let event: ReturnType<typeof services.dodo.webhooks.unwrap>
  try {
    event = services.dodo.webhooks.unwrap(await request.text(), {
      headers: Object.fromEntries(request.headers.entries()),
    })
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (!["payment.succeeded", "refund.succeeded", "dispute.lost", "dispute.accepted"].includes(event.type)) {
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case "payment.succeeded":
      case "refund.succeeded":
      case "dispute.lost":
      case "dispute.accepted": {
        const payment = await services.dodo.payments.retrieve(event.data.payment_id)
        const buyer = payment.metadata?.sudoku_buyer_id
        if (!buyer || payment.metadata.sudoku_pack !== trainingPack ||
            payment.metadata.sudoku_mode !== services.mode ||
            !payment.product_cart?.some((item) => item.product_id === services.productId)) break

        const revoked = payment.refund_status === "full" ||
          (event.type === "refund.succeeded" && !event.data.is_partial) ||
          event.type === "dispute.lost" || event.type === "dispute.accepted"

        if (!revoked && (event.type !== "payment.succeeded" || payment.status !== "succeeded")) break

        const { error } = await services.db.from("sudoku_training_payments").upsert({
          mode: services.mode,
          payment_id: payment.payment_id,
          pack: trainingPack,
          buyer_id: buyer,
          revoked,
        }, {
          onConflict: "mode,payment_id",
          // A delayed success delivery cannot reactivate a fully refunded or lost payment.
          ignoreDuplicates: !revoked,
        })
        if (error) throw error
      }
    }
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Payment could not be processed" }, { status: 503 })
  }
}
