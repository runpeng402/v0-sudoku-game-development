import DodoPayments from "dodopayments"
import { createClient } from "@supabase/supabase-js"

export const trainingPack = "sudoku-techniques-v1"

export function trainingPaymentsEnabled() {
  return Boolean(process.env.DODO_TRAINING_MODE && process.env.DODO_TRAINING_MODE !== "disabled")
}

export function trainingPaymentServices() {
  const mode = process.env.DODO_TRAINING_MODE
  const apiKey = process.env.DODO_PAYMENTS_API_KEY
  const webhookKey = process.env.DODO_WEBHOOK_KEY
  const productId = process.env.DODO_TRAINING_PRODUCT_ID
  const origin = process.env.SUDOKU_SITE_URL
  const databaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if ((mode !== "test_mode" && mode !== "live_mode") || !apiKey || !webhookKey ||
      !productId || !origin || !databaseUrl || !serviceKey || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Training payments are not configured")
  }

  return {
    mode,
    productId,
    origin: new URL(origin).origin,
    dodo: new DodoPayments({ bearerToken: apiKey, environment: mode, webhookKey, timeout: 10000, maxRetries: 0 }),
    db: createClient(databaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    }),
  }
}

export async function trainingBuyer(request: Request, db: ReturnType<typeof trainingPaymentServices>["db"]) {
  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/i)?.[1]
  if (!token) return null

  const { data, error } = await db.auth.getUser(token)
  if (error && error.status !== 400 && error.status !== 401 && error.status !== 403) throw error
  const user = data?.user
  if (error || !user?.email || !user.email_confirmed_at) return null
  return { id: user.id, email: user.email }
}

export async function hasTrainingPurchase(services: ReturnType<typeof trainingPaymentServices>, userId: string) {
  const { data, error } = await services.db.from("sudoku_training_payments")
    .select("payment_id")
    .eq("buyer_id", userId)
    .eq("mode", services.mode)
    .eq("pack", trainingPack)
    .eq("revoked", false)
    .limit(1)
  if (error) throw error
  return data.length > 0
}
