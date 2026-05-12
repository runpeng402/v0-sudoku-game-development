"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, User, AlertCircle } from "lucide-react"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { I18nProvider } from "@/components/i18n-provider"
import { localizedPath, type SeoLocale } from "@/lib/seo-locales"

const loginCopy = {
  en: {
    title: "Welcome to SudokuStudio",
    subtitle: "Sign in to your account to access all features",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    username: "Username",
    confirmPassword: "Confirm Password",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    chooseUsername: "Choose a username",
    createPassword: "Create a password",
    confirmPasswordPlaceholder: "Confirm your password",
    forgotPassword: "Forgot Password?",
    signingIn: "Signing In...",
    creatingAccount: "Creating Account...",
    createAccount: "Create Account",
    orContinueWith: "Or continue with",
    continueAsGuest: "Continue as Guest",
    loggingInAsGuest: "Logging in as guest...",
    invalidCredentials: "Invalid email or password",
    passwordsNoMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    registrationFailed: "Registration failed. Please try again.",
    guestLoginFailed: "Guest login failed",
  },
  zh: {
    title: "欢迎来到 SudokuStudio",
    subtitle: "登录账户以访问游戏记录和个人数据",
    signIn: "登录",
    signUp: "注册",
    email: "邮箱",
    password: "密码",
    username: "用户名",
    confirmPassword: "确认密码",
    enterEmail: "输入邮箱",
    enterPassword: "输入密码",
    chooseUsername: "选择用户名",
    createPassword: "创建密码",
    confirmPasswordPlaceholder: "再次输入密码",
    forgotPassword: "忘记密码？",
    signingIn: "登录中...",
    creatingAccount: "创建账户中...",
    createAccount: "创建账户",
    orContinueWith: "或继续使用",
    continueAsGuest: "以访客身份继续",
    loggingInAsGuest: "正在以访客身份进入...",
    invalidCredentials: "邮箱或密码无效",
    passwordsNoMatch: "两次输入的密码不一致",
    passwordTooShort: "密码至少需要 6 个字符",
    registrationFailed: "注册失败，请重试。",
    guestLoginFailed: "访客登录失败",
  },
  es: {
    title: "Bienvenido a SudokuStudio",
    subtitle: "Inicia sesión para acceder a tu progreso y datos de juego",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    email: "Correo",
    password: "Contraseña",
    username: "Usuario",
    confirmPassword: "Confirmar contraseña",
    enterEmail: "Ingresa tu correo",
    enterPassword: "Ingresa tu contraseña",
    chooseUsername: "Elige un usuario",
    createPassword: "Crea una contraseña",
    confirmPasswordPlaceholder: "Confirma tu contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    signingIn: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",
    createAccount: "Crear cuenta",
    orContinueWith: "O continuar con",
    continueAsGuest: "Continuar como invitado",
    loggingInAsGuest: "Entrando como invitado...",
    invalidCredentials: "Correo o contraseña inválidos",
    passwordsNoMatch: "Las contraseñas no coinciden",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
    registrationFailed: "El registro falló. Inténtalo de nuevo.",
    guestLoginFailed: "Error al entrar como invitado",
  },
} as const

function LoginPageContent({ locale }: { locale: SeoLocale }) {
  const router = useRouter()
  const copy = loginCopy[locale]
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await authService.login(loginForm.email, loginForm.password)
      router.push(localizedPath(locale, "/user-center"))
    } catch (err) {
      setError(copy.invalidCredentials)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (registerForm.password !== registerForm.confirmPassword) {
      setError(copy.passwordsNoMatch)
      setIsLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError(copy.passwordTooShort)
      setIsLoading(false)
      return
    }

    try {
      await authService.register(registerForm.username, registerForm.email, registerForm.password)
      router.push(localizedPath(locale, "/user-center"))
    } catch (err) {
      setError(copy.registrationFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      await authService.loginAsGuest()
      router.push(localizedPath(locale, "/user-center"))
    } catch (err) {
      setError(copy.guestLoginFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{copy.title}</CardTitle>
          <CardDescription className="text-center">{copy.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">{copy.signIn}</TabsTrigger>
              <TabsTrigger value="register">{copy.signUp}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{copy.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={copy.enterEmail}
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">{copy.password}</Label>
                    <Button variant="link" className="p-0 h-auto text-sm" type="button">
                      {copy.forgotPassword}
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder={copy.enterPassword}
                      className="pl-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? copy.signingIn : copy.signIn}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">{copy.username}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder={copy.chooseUsername}
                      className="pl-10"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">{copy.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder={copy.enterEmail}
                      className="pl-10"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">{copy.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder={copy.createPassword}
                      className="pl-10"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{copy.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder={copy.confirmPasswordPlaceholder}
                      className="pl-10"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? copy.creatingAccount : copy.createAccount}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">{copy.orContinueWith}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGuestLogin} disabled={isLoading}>
            {isLoading ? copy.loggingInAsGuest : copy.continueAsGuest}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage({ locale = "en" }: { locale?: SeoLocale }) {
  return (
    <I18nProvider initialLanguage={locale}>
      <LoginPageContent locale={locale} />
    </I18nProvider>
  )
}
