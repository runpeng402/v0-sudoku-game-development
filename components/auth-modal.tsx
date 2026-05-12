"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, User, AlertCircle } from "lucide-react"
import { authService, type User as AuthUser } from "@/services/auth-service"

const authModalCopy = {
  en: {
    accountAccess: "Account Access",
    requiredDefault: "Sign in to your account to access all features",
    requiredDownload: "Sign in to download puzzles and access premium features",
    requiredMedium: "Sign in to play medium difficulty puzzles",
    requiredHard: "Sign in to play hard difficulty puzzles",
    requiredGenerator: "Sign in to use the custom puzzle generator",
    signIn: "Sign In",
    signUp: "Sign Up",
    welcomeBack: "Welcome Back",
    signInDescription: "Sign in to your account to access all features",
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
    resetUnavailable: "Password reset functionality would be implemented here",
    signingIn: "Signing In...",
    createAccount: "Create Account",
    createAccountIntro: "Join us to access all premium features",
    creatingAccount: "Creating Account...",
    orContinueWith: "Or continue with",
    continueAsGuest: "Continue as Guest",
    back: "Back",
    guestUser: "Guest User",
    invalidCredentials: "Invalid email or password. Please try again.",
    passwordsNoMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long",
    registrationFailed: "Registration failed. Please try again.",
  },
  zh: {
    accountAccess: "账户登录",
    requiredDefault: "登录账户后即可使用全部功能",
    requiredDownload: "登录后可下载题目并使用更多功能",
    requiredMedium: "登录后可挑战中等难度题目",
    requiredHard: "登录后可挑战困难难度题目",
    requiredGenerator: "登录后可使用自定义题目生成器",
    signIn: "登录",
    signUp: "注册",
    welcomeBack: "欢迎回来",
    signInDescription: "登录账户以访问游戏记录和个人数据",
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
    resetUnavailable: "密码重置功能后续可接入邮件服务",
    signingIn: "登录中...",
    createAccount: "创建账户",
    createAccountIntro: "创建账户后可保存你的数独进度",
    creatingAccount: "创建账户中...",
    orContinueWith: "或继续使用",
    continueAsGuest: "以访客身份继续",
    back: "返回",
    guestUser: "访客用户",
    invalidCredentials: "邮箱或密码无效，请重试。",
    passwordsNoMatch: "两次输入的密码不一致",
    passwordTooShort: "密码至少需要 6 个字符",
    registrationFailed: "注册失败，请重试。",
  },
  es: {
    accountAccess: "Acceso a la cuenta",
    requiredDefault: "Inicia sesión para acceder a todas las funciones",
    requiredDownload: "Inicia sesión para descargar puzzles y acceder a más funciones",
    requiredMedium: "Inicia sesión para jugar puzzles de dificultad media",
    requiredHard: "Inicia sesión para jugar puzzles difíciles",
    requiredGenerator: "Inicia sesión para usar el generador personalizado",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    welcomeBack: "Bienvenido de vuelta",
    signInDescription: "Inicia sesión para acceder a tu progreso y datos de juego",
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
    resetUnavailable: "La recuperación de contraseña se puede conectar más adelante",
    signingIn: "Iniciando sesión...",
    createAccount: "Crear cuenta",
    createAccountIntro: "Crea una cuenta para guardar tu progreso",
    creatingAccount: "Creando cuenta...",
    orContinueWith: "O continuar con",
    continueAsGuest: "Continuar como invitado",
    back: "Atrás",
    guestUser: "Usuario invitado",
    invalidCredentials: "Correo o contraseña inválidos. Inténtalo de nuevo.",
    passwordsNoMatch: "Las contraseñas no coinciden",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
    registrationFailed: "El registro falló. Inténtalo de nuevo.",
  },
} as const

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: AuthUser) => void
  requiredFor?: string
  pendingAction?: () => void // Function to execute after successful login
}

export function AuthModal({ isOpen, onClose, onSuccess, requiredFor, pendingAction }: AuthModalProps) {
  const { i18n } = useTranslation()
  const locale = i18n.language?.startsWith("zh") ? "zh" : i18n.language?.startsWith("es") ? "es" : "en"
  const copy = authModalCopy[locale]
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

  const getRequiredForMessage = () => {
    switch (requiredFor) {
      case "download":
        return copy.requiredDownload
      case "medium":
        return copy.requiredMedium
      case "hard":
        return copy.requiredHard
      case "generator":
        return copy.requiredGenerator
      default:
        return copy.requiredDefault
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await authService.login(loginForm.email, loginForm.password)
      onSuccess(user)

      // Execute pending action after successful login
      if (pendingAction) {
        setTimeout(() => {
          pendingAction()
        }, 100) // Small delay to ensure state updates
      }

      onClose()
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
      const user = await authService.register(registerForm.username, registerForm.email, registerForm.password)
      onSuccess(user)

      // Execute pending action after successful registration
      if (pendingAction) {
        setTimeout(() => {
          pendingAction()
        }, 100) // Small delay to ensure state updates
      }

      onClose()
    } catch (err) {
      setError(copy.registrationFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueAsGuest = () => {
    // Create a guest user
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      username: copy.guestUser,
      email: "guest@example.com",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isGuest: true,
      preferences: {
        theme: "light",
        language: locale,
        difficulty: "easy",
      },
    }

    onSuccess(guestUser)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="text-center bg-white">
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">{copy.accountAccess}</DialogTitle>
          <DialogDescription className="text-gray-600">{getRequiredForMessage()}</DialogDescription>
        </DialogHeader>

        <div className="bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                {copy.signIn}
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                {copy.signUp}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{copy.welcomeBack}</h3>
                  <p className="text-gray-600 text-sm">{copy.signInDescription}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 font-medium text-sm">
                      {copy.email}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={copy.enterEmail}
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-gray-700 font-medium text-sm">
                        {copy.password}
                      </Label>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        onClick={() => alert(copy.resetUnavailable)}
                      >
                        {copy.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder={copy.enterPassword}
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? copy.signingIn : copy.signIn}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">{copy.orContinueWith}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleContinueAsGuest}
                >
                  {copy.continueAsGuest}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{copy.createAccount}</h3>
                  <p className="text-gray-600 text-sm">{copy.createAccountIntro}</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-gray-700 font-medium text-sm">
                      {copy.username}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder={copy.chooseUsername}
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-700 font-medium text-sm">
                      {copy.email}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder={copy.enterEmail}
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-700 font-medium text-sm">
                      {copy.password}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder={copy.createPassword}
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-700 font-medium text-sm">
                      {copy.confirmPassword}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder={copy.confirmPasswordPlaceholder}
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? copy.creatingAccount : copy.createAccount}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">{copy.orContinueWith}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleContinueAsGuest}
                >
                  {copy.continueAsGuest}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 font-medium">
              {copy.back}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
