"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trophy,
  Clock,
  Target,
  Brain,
  Calendar,
  TrendingUp,
  Award,
  Share2,
  User,
  Settings,
  LogOut,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react"
import { authService, type UserProfile, type UserStats, type GameSession } from "@/lib/auth"

interface UserCenterProps {
  onNavigate: (page: string) => void
}

export function UserCenter({ onNavigate }: UserCenterProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language?.startsWith("zh") ? "zh" : i18n.language?.startsWith("es") ? "es" : "en"
  const ui = {
    en: {
      loadingProfile: "Loading your profile...",
      pleaseLogin: "Please Log In",
      loginRequired: "You need to be logged in to view your profile",
      goHome: "Go to Home",
      accountAccess: "Account Access",
      createAccountIntro: "Join our community of Sudoku enthusiasts",
      forgotPassword: "Forgot Password?",
      orContinueWith: "Or continue with",
      continueAsGuest: "Continue as Guest",
      back: "Back",
      notPlayed: "Not played",
      games: "games",
      level: "Level",
      pts: "pts",
      points: "points",
      noHistoryText: "Start playing to see your game history here",
      unlocked: "Unlocked",
      locked: "Locked",
      speedDemon: "Speed Demon",
      speedDemonDescription: "Complete a puzzle in under 5 minutes",
      perfectWeek: "Perfect Week",
      perfectWeekDescription: "Play every day for a week",
      minutes: "minutes",
      invalidCredentials: "Invalid email or password",
      passwordsNoMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      registrationFailed: "Registration failed. Please try again.",
      guestLoginFailed: "Guest login failed",
    },
    zh: {
      loadingProfile: "正在加载个人资料...",
      pleaseLogin: "请先登录",
      loginRequired: "你需要登录后才能查看个人资料",
      goHome: "返回首页",
      accountAccess: "账户登录",
      createAccountIntro: "加入 SudokuStudio，保存你的游戏进度",
      forgotPassword: "忘记密码？",
      orContinueWith: "或继续使用",
      continueAsGuest: "以访客身份继续",
      back: "返回",
      notPlayed: "尚未游玩",
      games: "局",
      level: "等级",
      pts: "分",
      points: "分",
      noHistoryText: "开始游戏后，这里会显示你的历史记录",
      unlocked: "已解锁",
      locked: "未解锁",
      speedDemon: "速度达人",
      speedDemonDescription: "在 5 分钟内完成一局",
      perfectWeek: "完美一周",
      perfectWeekDescription: "连续一周每天游玩",
      minutes: "分钟",
      invalidCredentials: "邮箱或密码无效",
      passwordsNoMatch: "两次输入的密码不一致",
      passwordTooShort: "密码至少需要 6 个字符",
      registrationFailed: "注册失败，请重试。",
      guestLoginFailed: "访客登录失败",
    },
    es: {
      loadingProfile: "Cargando tu perfil...",
      pleaseLogin: "Inicia sesión",
      loginRequired: "Debes iniciar sesión para ver tu perfil",
      goHome: "Ir al inicio",
      accountAccess: "Acceso a la cuenta",
      createAccountIntro: "Únete a SudokuStudio y guarda tu progreso",
      forgotPassword: "¿Olvidaste tu contraseña?",
      orContinueWith: "O continuar con",
      continueAsGuest: "Continuar como invitado",
      back: "Atrás",
      notPlayed: "No jugado",
      games: "juegos",
      level: "Nivel",
      pts: "pts",
      points: "puntos",
      noHistoryText: "Empieza a jugar para ver tu historial aquí",
      unlocked: "Desbloqueado",
      locked: "Bloqueado",
      speedDemon: "Demonio de velocidad",
      speedDemonDescription: "Completa un puzzle en menos de 5 minutos",
      perfectWeek: "Semana perfecta",
      perfectWeekDescription: "Juega todos los días durante una semana",
      minutes: "minutos",
      invalidCredentials: "Correo o contraseña inválidos",
      passwordsNoMatch: "Las contraseñas no coinciden",
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
      registrationFailed: "El registro falló. Inténtalo de nuevo.",
      guestLoginFailed: "Error al entrar como invitado",
    },
  }[locale]
  const achievementsCopy = {
    en: {
      firstVictory: ["First Victory", "Complete your first puzzle"],
      dedicatedPlayer: ["Dedicated Player", "Complete 10 puzzles"],
      sudokuMaster: ["Sudoku Master", "Complete 50 puzzles"],
      onFire: ["On Fire", "Win 5 games in a row"],
      unstoppable: ["Unstoppable", "Win 10 games in a row"],
      hardModeHero: ["Hard Mode Hero", "Complete a hard puzzle"],
      timeMaster: ["Time Master", "Play for over 1 hour total"],
      noHelpNeeded: ["No Help Needed", "Complete puzzles without hints"],
    },
    zh: {
      firstVictory: ["首次胜利", "完成你的第一道题"],
      dedicatedPlayer: ["专注玩家", "完成 10 道题"],
      sudokuMaster: ["数独高手", "完成 50 道题"],
      onFire: ["连胜状态", "连续赢得 5 局"],
      unstoppable: ["势不可挡", "连续赢得 10 局"],
      hardModeHero: ["困难模式英雄", "完成一道困难题"],
      timeMaster: ["时间大师", "累计游玩超过 1 小时"],
      noHelpNeeded: ["无需提示", "不使用提示完成题目"],
    },
    es: {
      firstVictory: ["Primera Victoria", "Completa tu primer puzzle"],
      dedicatedPlayer: ["Jugador Dedicado", "Completa 10 puzzles"],
      sudokuMaster: ["Maestro de Sudoku", "Completa 50 puzzles"],
      onFire: ["En Racha", "Gana 5 juegos seguidos"],
      unstoppable: ["Imparable", "Gana 10 juegos seguidos"],
      hardModeHero: ["Héroe del Modo Difícil", "Completa un puzzle difícil"],
      timeMaster: ["Maestro del Tiempo", "Juega más de 1 hora en total"],
      noHelpNeeded: ["Sin Ayuda", "Completa puzzles sin pistas"],
    },
  }[locale]
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      const userStats = authService.getUserStats()
      const gameSessions = authService.getGameSessions()

      setStats(userStats)
      setSessions(gameSessions.filter((s) => s.userId === user.id))
    }
    setLoading(false)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const user = await authService.login(email, password)
      setCurrentUser(user)
      setShowAuthForm(false)
    } catch (err) {
      setError(ui.invalidCredentials)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(ui.passwordsNoMatch)
      return
    }

    if (password.length < 6) {
      setError(ui.passwordTooShort)
      return
    }

    setIsLoading(true)

    try {
      const user = await authService.register(email, password, username)
      setCurrentUser(user)
      setShowAuthForm(false)
    } catch (err) {
      setError(ui.registrationFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setCurrentUser(null)
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      const user = await authService.loginAsGuest()
      setCurrentUser(user)
      setShowAuthForm(false)
    } catch (err) {
      setError(ui.guestLoginFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getCompletionRate = () => {
    if (!stats || stats.totalGames === 0) return 0
    return Math.round((stats.gamesCompleted / stats.totalGames) * 100)
  }

  const getAchievements = () => {
    const achievements = []

    if (stats) {
      if (stats.gamesCompleted >= 1)
        achievements.push({ name: achievementsCopy.firstVictory[0], icon: "🏆", description: achievementsCopy.firstVictory[1] })
      if (stats.gamesCompleted >= 10)
        achievements.push({
          name: achievementsCopy.dedicatedPlayer[0],
          icon: "🎯",
          description: achievementsCopy.dedicatedPlayer[1],
        })
      if (stats.gamesCompleted >= 50)
        achievements.push({ name: achievementsCopy.sudokuMaster[0], icon: "👑", description: achievementsCopy.sudokuMaster[1] })
      if (stats.currentStreak >= 5)
        achievements.push({ name: achievementsCopy.onFire[0], icon: "🔥", description: achievementsCopy.onFire[1] })
      if (stats.longestStreak >= 10)
        achievements.push({ name: achievementsCopy.unstoppable[0], icon: "⚡", description: achievementsCopy.unstoppable[1] })
      if (stats.bestTimes.hard)
        achievements.push({ name: achievementsCopy.hardModeHero[0], icon: "💪", description: achievementsCopy.hardModeHero[1] })
      if (stats.totalPlayTime > 3600000)
        achievements.push({ name: achievementsCopy.timeMaster[0], icon: "⏰", description: achievementsCopy.timeMaster[1] })
      if (stats.totalHintsUsed === 0 && stats.gamesCompleted > 0)
        achievements.push({ name: achievementsCopy.noHelpNeeded[0], icon: "🧠", description: achievementsCopy.noHelpNeeded[1] })
    }

    return achievements
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{ui.loadingProfile}</p>
        </div>
      </div>
    )
  }

  if (!currentUser && !showAuthForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{ui.pleaseLogin}</h2>
          <p className="text-gray-600 mb-4">{ui.loginRequired}</p>
          <div className="space-x-4">
            <Button onClick={() => setShowAuthForm(true)}>{t("auth.signIn")}</Button>
            <Button variant="outline" onClick={() => onNavigate("home")}>
              {ui.goHome}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser && showAuthForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{ui.accountAccess}</CardTitle>
            <CardDescription className="text-center">{t("auth.signInDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t("auth.signIn")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.signUp")}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{t("auth.welcomeBack")}</h3>
                  <p className="text-gray-600">{t("auth.signInDescription")}</p>
                </div>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("auth.enterEmail")}
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t("auth.password")}</Label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                        {ui.forgotPassword}
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("auth.enterPassword")}
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("auth.signingIn") : t("auth.signIn")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{t("auth.createAccount")}</h3>
                  <p className="text-gray-600">{ui.createAccountIntro}</p>
                </div>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t("auth.username")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder={t("auth.chooseUsername")}
                        className="pl-10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder={t("auth.enterEmail")}
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t("auth.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder={t("auth.createPassword")}
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder={t("auth.confirmPasswordPlaceholder")}
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <div className="px-6 pb-6">
            <div className="relative w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{ui.orContinueWith}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGuestLogin} disabled={isLoading}>
              {ui.continueAsGuest}
            </Button>
            <Button variant="ghost" className="w-full mt-2" onClick={() => setShowAuthForm(false)}>
              {ui.back}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t("userCenter.welcome", { username: currentUser.username })}</h1>
              <p className="text-gray-600">
                {t("userCenter.memberSince", { date: new Date(currentUser.createdAt).toLocaleDateString() })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              {t("userCenter.settings")}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t("userCenter.logout")}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{stats?.gamesCompleted || 0}</div>
              <div className="text-sm text-gray-600">{t("userCenter.gamesWon")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{getCompletionRate()}%</div>
              <div className="text-sm text-gray-600">{t("userCenter.successRate")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
              <div className="text-sm text-gray-600">{t("userCenter.currentStreak")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{Math.round((stats?.totalPlayTime || 0) / 60000)}m</div>
              <div className="text-sm text-gray-600">{t("userCenter.totalPlayTime")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t("userCenter.overview")}</TabsTrigger>
            <TabsTrigger value="achievements">{t("userCenter.achievements")}</TabsTrigger>
            <TabsTrigger value="history">{t("userCenter.gameHistory")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("userCenter.analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best Times */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {t("userCenter.bestTimes")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(["easy", "medium", "hard"] as const).map((difficulty) => (
                    <div key={difficulty} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{difficulty}</span>
                      <Badge variant={stats?.bestTimes[difficulty] ? "default" : "secondary"}>
                        {stats?.bestTimes[difficulty]
                          ? formatTime(Math.floor(stats.bestTimes[difficulty]! / 1000))
                          : ui.notPlayed}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t("userCenter.progress")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t("userCenter.completionRate")}</span>
                      <span>{getCompletionRate()}%</span>
                    </div>
                    <Progress value={getCompletionRate()} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t("userCenter.currentStreak")}</span>
                      <span>{stats?.currentStreak || 0} {ui.games}</span>
                    </div>
                    <Progress value={Math.min((stats?.currentStreak || 0) * 10, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t("userCenter.experienceLevel")}</span>
                      <span>{ui.level} {Math.floor((stats?.gamesCompleted || 0) / 10) + 1}</span>
                    </div>
                    <Progress value={((stats?.gamesCompleted || 0) % 10) * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t("userCenter.recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions
                    .slice(-5)
                    .reverse()
                    .map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={session.completed ? "default" : "destructive"}>{session.difficulty}</Badge>
                          <div>
                            <div className="font-medium">
                              {session.completed ? t("userCenter.completed") : t("userCenter.abandoned")}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(session.startTime).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {session.duration && (
                            <div className="font-medium">{formatTime(session.duration)}</div>
                          )}
                          {session.score && <div className="text-sm text-gray-600">{session.score} {ui.pts}</div>}
                        </div>
                      </div>
                    ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t("userCenter.noGamesYet")}</p>
                      <Button onClick={() => onNavigate("play")} className="mt-4">
                        {t("userCenter.startPlaying")}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t("userCenter.achievements")}
                </CardTitle>
                <CardDescription>{t("userCenter.unlockAchievements")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAchievements().map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-green-50">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <div className="text-sm text-green-600 font-medium">{ui.unlocked}</div>
                      </div>
                    </div>
                  ))}

                  {/* Locked achievements */}
                  {getAchievements().length < 8 && (
                    <>
                      <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 opacity-60">
                        <div className="text-3xl">🔒</div>
                        <div>
                          <div className="font-medium">{ui.speedDemon}</div>
                          <div className="text-sm text-gray-600">{ui.speedDemonDescription}</div>
                          <div className="text-sm text-gray-500">{ui.locked}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 opacity-60">
                        <div className="text-3xl">🔒</div>
                        <div>
                          <div className="font-medium">{ui.perfectWeek}</div>
                          <div className="text-sm text-gray-600">{ui.perfectWeekDescription}</div>
                          <div className="text-sm text-gray-500">{ui.locked}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("userCenter.gameHistory")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.reverse().map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant={session.completed ? "default" : "destructive"}>{session.difficulty}</Badge>
                        <div>
                          <div className="font-medium">
                            {session.completed ? t("userCenter.completed") : t("userCenter.abandoned")}
                          </div>
                          <div className="text-sm text-gray-600">{new Date(session.startTime).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            {t("userCenter.hintsUsed")}: {session.hintsUsed} | {t("userCenter.totalErrors")}:{" "}
                            {session.errorsCount}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {session.duration && (
                          <div className="font-medium text-lg">{formatTime(session.duration)}</div>
                        )}
                        {session.score && (
                          <div className="text-sm text-blue-600 font-medium">
                            {session.score} {ui.points}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">{t("userCenter.noGameHistory")}</p>
                      <p className="mb-4">{ui.noHistoryText}</p>
                      <Button onClick={() => onNavigate("play")}>{t("userCenter.playFirstGame")}</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("userCenter.performanceMetrics")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("userCenter.totalGames")}:</span>
                    <span className="font-medium">{stats?.totalGames || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.gamesCompleted")}:</span>
                    <span className="font-medium">{stats?.gamesCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.gamesAbandoned")}:</span>
                    <span className="font-medium">{stats?.gamesAbandoned || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.hintsUsed")}:</span>
                    <span className="font-medium">{stats?.totalHintsUsed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.totalErrors")}:</span>
                    <span className="font-medium">{stats?.totalErrors || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.longestStreak")}:</span>
                    <span className="font-medium">{stats?.longestStreak || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("userCenter.activitySummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("userCenter.activeDays")}:</span>
                    <span className="font-medium">{Object.keys(stats?.dailyActivity || {}).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.averageSession")}:</span>
                    <span className="font-medium">
                      {stats?.totalGames && stats.totalGames > 0
                        ? formatTime(Math.floor((stats.totalPlayTime || 0) / stats.totalGames / 1000))
                        : "0:00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.totalPlayTime")}:</span>
                    <span className="font-medium">
                      {Math.floor((stats?.totalPlayTime || 0) / 60000)} {ui.minutes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("userCenter.accountType")}:</span>
                    <span className="font-medium">
                      {currentUser.isGuest ? t("userCenter.guest") : t("userCenter.registered")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("userCenter.quickActions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => onNavigate("play")}>{t("userCenter.playNewGame")}</Button>
                  <Button variant="outline" onClick={() => onNavigate("strategies")}>
                    {t("userCenter.learnStrategies")}
                  </Button>
                  <Button variant="outline" onClick={() => onNavigate("how-to-play")}>
                    {t("userCenter.howToPlay")}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    {t("userCenter.shareProgress")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
