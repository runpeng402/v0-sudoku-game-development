"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SudokuTraining } from "@/components/sudoku-training"
import { supabase } from "@/lib/supabase"
import { freeExerciseCount, paidExerciseCount } from "@/lib/sudoku-training-catalog"
import type { TrainingResponse } from "@/lib/sudoku-training-types"

const endpoint = "/api/sudoku-training"

export function SudokuTrainingAccess({ entry = "practice" }: { entry?: "practice" | "pricing" }) {
  const [token, setToken] = useState<string | null>(null)
  const [sessionEmail, setSessionEmail] = useState("")
  const [sessionReady, setSessionReady] = useState(false)
  const [training, setTraining] = useState<TrainingResponse | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [manualRefresh, setManualRefresh] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState("")
  const [status, setStatus] = useState("")
  const [loadError, setLoadError] = useState("")
  const [sending, setSending] = useState(false)
  const [email, setEmail] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [checkoutReturn, setCheckoutReturn] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const [autoChecksEnded, setAutoChecksEnded] = useState(false)
  const [resumeTopic, setResumeTopic] = useState("")
  const [intent, setIntent] = useState<"buy" | "restore" | null>(null)
  const topic = useRef("")
  const opening = useRef(false)
  const pricing = entry === "pricing"
  const loadedToken = useRef<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCheckoutReturn(params.get("checkout") ?? "")
    setPaymentId(params.get("payment_id") ?? "")
    topic.current = params.get("topic") ?? ""
    setResumeTopic(topic.current)
    if (!supabase) {
      setSessionReady(true)
      return
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token ?? null)
      setSessionEmail(session?.user.email ?? "")
      setSessionReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!sessionReady) return
    const request = new AbortController()
    setLoadError("")
    void (async () => {
      try {
        const query = paymentId ? `?${new URLSearchParams({ payment_id: paymentId })}` : ""
        const response = await fetch(endpoint + query, {
          signal: request.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!response.ok) throw new Error("Training is temporarily unavailable. Try refreshing access.")
        const data: TrainingResponse = await response.json()
        if (!request.signal.aborted) {
          loadedToken.current = token
          setTraining(data)
          setRefreshMessage(data.access === "locked"
            ? "Access checked. No purchase confirmed for this training account yet."
            : data.access === "signed-out" ? "Access checked. Verify your checkout email to restore access." : `Access checked. All ${data.exercises.length} exercises are available.`)
        }
      } catch (error) {
        if (!request.signal.aborted) setLoadError(error instanceof Error ? error.message : "Training is unavailable.")
      } finally {
        if (!request.signal.aborted) setManualRefresh(false)
      }
    })()
    return () => request.abort()
  }, [token, sessionReady, refresh, paymentId])

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    const address = String(new FormData(event.currentTarget).get("email")).trim()
    setSending(true)
    setStatus("")
    const slow = window.setTimeout(() => {
      setStatus("The email service is taking longer than usual. Please wait for this request to finish.")
    }, 4000)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: address })
      if (error) {
        if (error.status === 429) {
          setStatus("Too many code requests. Wait a minute before trying again.")
        } else if (error.status === 0) {
          setStatus("The email service did not respond. Check your inbox first, then try again if no code arrives.")
        } else {
          setStatus("The email service could not send a code. Check the address and try again shortly.")
        }
        return
      }
      setEmail(address)
      setCodeSent(true)
      setStatus("Email request accepted. Check your inbox and spam folder for the latest code.")
    } catch {
      setStatus("Could not send a sign-in code. Wait a moment and try again.")
    } finally {
      window.clearTimeout(slow)
      setSending(false)
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    const code = String(new FormData(event.currentTarget).get("code")).trim()
    setSending(true)
    setStatus("")
    try {
      const { error, data } = await supabase.auth.verifyOtp({ email, token: code, type: "email" })
      if (error) throw error
      setCodeSent(false)
      if (intent === "buy" && checkoutReturn !== "returned" && data.session) {
        await checkout(data.session.access_token)
      }
      setIntent(null)
    } catch {
      setStatus("That code could not be verified. Check the email or request a new code.")
    } finally {
      if (!opening.current) setSending(false)
    }
  }

  async function checkout(accessToken: string | null, confirmedRetry = false) {
    if (!accessToken || opening.current || (checkoutReturn === "returned" && !confirmedRetry)) return
    opening.current = true
    setSending(true)
    setStatus("")
    let leaving = false
    try {
      const params = new URLSearchParams({ entry, topic: topic.current })
      if (paymentId) params.set("payment_id", paymentId)
      const response = await fetch(`${endpoint}?${params}`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } })
      const result = await response.json()
      if (!response.ok || typeof result.url !== "string") {
        setStatus(result.error ?? "Checkout is temporarily unavailable.")
        return
      }
      window.location.assign(result.url)
      leaving = true
    } catch {
      setStatus("Could not open checkout. Please try again.")
    } finally {
      if (!leaving) {
        opening.current = false
        setSending(false)
      }
    }
  }

  async function signOut() {
    setStatus("")
    try {
      const result = await supabase?.auth.signOut({ scope: "local" })
      if (result?.error) throw result.error
    } catch {
      setStatus("Could not sign out. Please try again.")
    }
  }

  const visible = training && (training.access !== "unlocked" || loadedToken.current === token)
  const gated = visible && (training.access === "signed-out" || training.access === "locked")
  const paymentState = loadedToken.current === token ? training?.paymentStatus : undefined
  const paymentFailed = paymentState === "failed" || paymentState === "cancelled"
  const checkingPurchase = checkoutReturn === "returned" && Boolean(token) && training?.access === "locked" && !paymentFailed
  const refreshAccess = () => {
    setManualRefresh(true)
    setRefreshMessage("")
    setRefresh((value) => value + 1)
  }

  useEffect(() => {
    if (!checkingPurchase) return
    setAutoChecksEnded(false)
    const checks = [2000, 5000, 10000, 20000].map((delay) =>
      window.setTimeout(() => setRefresh((value) => value + 1), delay),
    )
    const end = window.setTimeout(() => setAutoChecksEnded(true), 22000)
    return () => {
      checks.forEach((check) => window.clearTimeout(check))
      window.clearTimeout(end)
    }
  }, [checkingPurchase, token])

  return (
    <div className="space-y-5">
      {!visible && !loadError && <p role="status">Checking training access…</p>}
      {loadError && <p role="status">{loadError}</p>}
      {visible && (
        <p role="status" className="rounded-lg border bg-slate-50 p-4 text-sm">
          {training.access === "unlocked" && <>All {training.exercises.length} exercises are unlocked. Signed in for training as <strong className="break-all">{sessionEmail}</strong>.</>}
          {training.access === "signed-out" && <>Not signed in for training. Verify the email you used for checkout to restore your purchase. <a href="#training-purchase" className="underline">Go to sign-in</a></>}
          {training.access === "locked" && <>Signed in for training as <strong className="break-all">{sessionEmail}</strong>. No training purchase confirmed for this account yet. <a href="#training-purchase" className="underline">Check access</a></>}
          {training.access === "free" && `All ${freeExerciseCount} free samples are available. Paid checkout is not open yet.`}
        </p>
      )}
      {visible && !pricing && <SudokuTraining key={training.access === "unlocked" || training.access === "free" ? "full" : "sample"} lessons={training.exercises} resumeTopic={resumeTopic} onTopicChange={(value) => {
        topic.current = value
        setResumeTopic(value)
      }} />}
      {(gated || (visible && training.access === "unlocked")) && (
        <section aria-labelledby="training-purchase" className="space-y-4 rounded-lg border p-4 sm:p-6">
          <h2 id="training-purchase" className="text-xl font-semibold text-slate-950">
            {gated ? `Unlock ${paidExerciseCount} additional exercises` : "Training pack unlocked"}
          </h2>
          {gated && <p>Try one exercise per module for free. A one-time purchase unlocks 10 additional exercises in each module.</p>}
          {pricing && training.access === "unlocked" && <Button asChild><Link href="/sudoku-practice#exercises">Start training</Link></Button>}
          {checkoutReturn === "returned" && training.access === "locked" && (
            <div className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950">
              <p role="status">{paymentFailed
                ? "Payment did not complete. You can try again with another card."
                : paymentState === "succeeded"
                  ? "Payment succeeded. We’re waiting for your training access to update."
                  : autoChecksEnded
                ? "Automatic checks ended. Your training pack is still locked. If your receipt shows the payment succeeded, refresh access before trying to pay again."
                : "You’re back from checkout. We’re checking for a confirmed purchase. Your training pack is still locked."}</p>
              {paymentFailed && <Button type="button" disabled={sending || manualRefresh || !token} onClick={() => checkout(token, true)}>
                {sending ? "Opening checkout…" : "Retry checkout"}
              </Button>}
              {autoChecksEnded && !paymentId && !paymentState && !loadError && <details>
                <summary className="cursor-pointer font-medium underline">Payment failed or was cancelled?</summary>
                <p className="my-2">If you confirmed the payment failed or was cancelled, you can start a new checkout.</p>
                <Button type="button" variant="outline" disabled={sending || manualRefresh || !token}
                  onClick={() => checkout(token, true)}>
                  {sending ? "Opening checkout…" : "Retry checkout"}
                </Button>
              </details>}
            </div>
          )}
          {checkoutReturn === "cancelled" && gated && <p role="status">Checkout was cancelled. You can try again whenever you’re ready.</p>}
          {training.access === "signed-out" && supabase && !intent && (
            <div className="flex flex-wrap gap-2">
              {checkoutReturn !== "returned" && <Button type="button" onClick={() => setIntent("buy")}>Buy the training pack</Button>}
              <Button type="button" variant="outline" onClick={() => setIntent("restore")}>Restore purchase</Button>
            </div>
          )}
          {training.access === "signed-out" && supabase && intent && (
            <div className="space-y-3">
              <p className="text-sm">{intent === "buy" ? "Verify your email to continue to checkout." : "Verify the email you used for checkout to restore access."}</p>
              {codeSent ? (
                <form key="verify-code" onSubmit={verifyCode} className="max-w-sm space-y-2">
                  <p className="text-sm">Code sent to <strong className="break-all">{email}</strong></p>
                  <label htmlFor="training-code" className="block text-sm font-medium">Email sign-in code</label>
                  <Input id="training-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]+" required />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={sending}>{sending ? "Verifying code…" : "Verify code"}</Button>
                    <Button type="button" variant="outline" disabled={sending} onClick={() => { setCodeSent(false); setStatus("") }}>Change email or resend</Button>
                  </div>
                </form>
              ) : (
                <form key="request-code" onSubmit={sendCode} className="max-w-sm space-y-2">
                  <label htmlFor="training-email" className="block text-sm font-medium">Email address</label>
                  <Input id="training-email" name="email" type="email" autoComplete="email" spellCheck={false} defaultValue={email} readOnly={sending} required />
                  <Button type="submit" disabled={sending}>{sending ? "Sending code…" : "Send sign-in code"}</Button>
                </form>
              )}
              <p role="status">{status}</p>
            </div>
          )}
          {training.access === "locked" && checkoutReturn !== "returned" && (
            <Button type="button" onClick={() => checkout(token)} disabled={sending || !token}>
              {sending ? "Opening checkout…" : checkoutReturn === "cancelled" ? "Retry checkout" : "Buy the training pack"}
            </Button>
          )}
          {token && <Button type="button" variant="ghost" onClick={signOut}>Sign out</Button>}
          {gated && <Button type="button" variant="outline" disabled={manualRefresh} onClick={refreshAccess}>{manualRefresh ? "Checking access…" : "Refresh access"}</Button>}
          {gated && refresh > 0 && <p role="status" className="text-sm">{manualRefresh ? "Checking training access…" : loadError || refreshMessage}</p>}
          {!(training.access === "signed-out" && supabase && intent) && <p role="status">{status}</p>}
        </section>
      )}
      {loadError && !gated && <Button type="button" variant="outline" disabled={manualRefresh} onClick={refreshAccess}>{manualRefresh ? "Checking access…" : "Refresh access"}</Button>}
    </div>
  )
}
