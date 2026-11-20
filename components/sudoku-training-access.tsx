"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SudokuTraining } from "@/components/sudoku-training"
import { supabase } from "@/lib/supabase"
import type { TrainingResponse } from "@/lib/sudoku-training-types"

const endpoint = "/api/sudoku-training"

export function SudokuTrainingAccess() {
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
  const loadedToken = useRef<string | null>(null)

  useEffect(() => {
    setCheckoutReturn(new URLSearchParams(window.location.search).get("checkout") ?? "")
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
        const response = await fetch(endpoint, {
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
  }, [token, sessionReady, refresh])

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    const address = String(new FormData(event.currentTarget).get("email")).trim()
    setSending(true)
    setStatus("")
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: address })
      if (error) throw error
      setEmail(address)
      setCodeSent(true)
      setStatus("Check your email for your sign-in code.")
    } catch {
      setStatus("Could not send a sign-in code. Wait a moment and try again.")
    } finally {
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
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" })
      if (error) throw error
      setCodeSent(false)
    } catch {
      setStatus("That code could not be verified. Check the email or request a new code.")
    } finally {
      setSending(false)
    }
  }

  async function checkout() {
    if (!token) return
    setSending(true)
    setStatus("")
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      const result = await response.json()
      if (!response.ok || typeof result.url !== "string") {
        setStatus(result.error ?? "Checkout is temporarily unavailable.")
        return
      }
      window.location.assign(result.url)
    } catch {
      setStatus("Could not open checkout. Please try again.")
    } finally {
      setSending(false)
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
  const checkingPurchase = checkoutReturn === "returned" && Boolean(token) && training?.access === "locked" && !loadError
  const refreshAccess = () => {
    setManualRefresh(true)
    setRefreshMessage("")
    setRefresh((value) => value + 1)
  }

  useEffect(() => {
    if (!checkingPurchase) return
    const checks = [2000, 5000, 10000, 20000].map((delay) =>
      window.setTimeout(() => setRefresh((value) => value + 1), delay),
    )
    return () => checks.forEach((check) => window.clearTimeout(check))
  }, [checkingPurchase, token])

  return (
    <div className="space-y-5">
      {!visible && !loadError && <p role="status">Loading exercises…</p>}
      {loadError && <p role="status">{loadError}</p>}
      {visible && (
        <p role="status" className="rounded-lg border bg-slate-50 p-4 text-sm">
          {training.access === "unlocked" && <>All {training.exercises.length} exercises are unlocked. Signed in for training as <strong className="break-all">{sessionEmail}</strong>.</>}
          {training.access === "signed-out" && <>Not signed in for training. Verify the email you used for checkout to restore your purchase. <a href="#training-purchase" className="underline">Go to sign-in</a></>}
          {training.access === "locked" && <>Signed in for training as <strong className="break-all">{sessionEmail}</strong>. No training purchase confirmed for this account yet. <a href="#training-purchase" className="underline">Check access</a></>}
          {training.access === "free" && `All ${training.exercises.length} exercises are available.`}
        </p>
      )}
      {visible && <SudokuTraining key={training.access === "unlocked" || training.access === "free" ? "full" : "sample"} lessons={training.exercises} />}
      {(gated || (visible && training.access === "unlocked")) && (
        <section aria-labelledby="training-purchase" className="space-y-4 rounded-lg border p-4 sm:p-6">
          <h2 id="training-purchase" className="text-xl font-semibold text-slate-950">
            {gated ? "Unlock all 12 exercises" : "Training pack unlocked"}
          </h2>
          {gated && <p>Try one exercise per technique for free. A one-time purchase adds nine exercises with explanations and independent checks. See the price and currency before paying on Dodo Payments.</p>}
          {checkoutReturn === "returned" && training.access === "locked" && (
            <p>If you completed payment, use Refresh access to check again before placing another order.</p>
          )}
          {checkoutReturn === "cancelled" && gated && <p role="status">Checkout was cancelled. You can try again whenever you’re ready.</p>}
          {training.access === "signed-out" && supabase && (
            <div className="space-y-3">
              <p className="text-sm">Training uses a separate email verification step. Use the email you used for checkout to restore access.</p>
              {codeSent ? (
                <form key="verify-code" onSubmit={verifyCode} className="max-w-sm space-y-2">
                  <p className="text-sm">Code sent to <strong className="break-all">{email}</strong></p>
                  <label htmlFor="training-code" className="block text-sm font-medium">Email sign-in code</label>
                  <Input id="training-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]+" required />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={sending}>Verify code</Button>
                    <Button type="button" variant="outline" disabled={sending} onClick={() => { setCodeSent(false); setStatus("") }}>Change email or resend</Button>
                  </div>
                </form>
              ) : (
                <form key="request-code" onSubmit={sendCode} className="max-w-sm space-y-2">
                  <label htmlFor="training-email" className="block text-sm font-medium">Email address</label>
                  <Input id="training-email" name="email" type="email" autoComplete="email" spellCheck={false} defaultValue={email} required />
                  <Button type="submit" disabled={sending}>Send sign-in code</Button>
                </form>
              )}
            </div>
          )}
          {training.access === "locked" && (
            <Button type="button" onClick={checkout} disabled={sending || !token}>
              {sending ? "Opening checkout…" : "Buy the training pack"}
            </Button>
          )}
          {token && <Button type="button" variant="ghost" onClick={signOut}>Sign out</Button>}
          {gated && <Button type="button" variant="outline" disabled={manualRefresh} onClick={refreshAccess}>{manualRefresh ? "Checking access…" : "Refresh access"}</Button>}
          {gated && refresh > 0 && <p role="status" className="text-sm">{manualRefresh ? "Checking training access…" : loadError || refreshMessage}</p>}
          <p role="status">{status}</p>
        </section>
      )}
      {loadError && !gated && <Button type="button" variant="outline" disabled={manualRefresh} onClick={refreshAccess}>{manualRefresh ? "Checking access…" : "Refresh access"}</Button>}
    </div>
  )
}
