"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  Home,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react"
import { authService, type UserProfile, type UserStats, type GameSession } from "@/lib/auth"

interface UserCenterProps {
  onNavigate: (page: string) => void
}

export function UserCenter({ onNavigate }: UserCenterProps) {
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
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const user = await authService.register(email, password, username)
      setCurrentUser(user)
      setShowAuthForm(false)
    } catch (err) {
      setError("Registration failed. Please try again.")
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
      setError("Guest login failed")
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
        achievements.push({ name: "First Victory", icon: "🏆", description: "Complete your first puzzle" })
      if (stats.gamesCompleted >= 10)
        achievements.push({ name: "Dedicated Player", icon: "🎯", description: "Complete 10 puzzles" })
      if (stats.gamesCompleted >= 50)
        achievements.push({ name: "Sudoku Master", icon: "👑", description: "Complete 50 puzzles" })
      if (stats.currentStreak >= 5)
        achievements.push({ name: "On Fire", icon: "🔥", description: "Win 5 games in a row" })
      if (stats.longestStreak >= 10)
        achievements.push({ name: "Unstoppable", icon: "⚡", description: "Win 10 games in a row" })
      if (stats.bestTimes.hard)
        achievements.push({ name: "Hard Mode Hero", icon: "💪", description: "Complete a hard puzzle" })
      if (stats.totalPlayTime > 3600000)
        achievements.push({ name: "Time Master", icon: "⏰", description: "Play for over 1 hour total" })
      if (stats.totalHintsUsed === 0 && stats.gamesCompleted > 0)
        achievements.push({ name: "No Help Needed", icon: "🧠", description: "Complete puzzles without hints" })
    }

    return achievements
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!currentUser && !showAuthForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile</p>
          <div className="space-x-4">
            <Button onClick={() => setShowAuthForm(true)}>Sign In</Button>
            <Button variant="outline" onClick={() => onNavigate("home")}>
              Go to Home
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
            <CardTitle className="text-2xl text-center">Account Access</CardTitle>
            <CardDescription className="text-center">Sign in to your account to access all features</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Welcome Back</h3>
                  <p className="text-gray-600">Sign in to your account to access all features</p>
                </div>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                  <p className="text-gray-600">Join our community of Sudoku enthusiasts</p>
                </div>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        className="pl-10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
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
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGuestLogin} disabled={isLoading}>
              Continue as Guest
            </Button>
            <Button variant="ghost" className="w-full mt-2" onClick={() => setShowAuthForm(false)}>
              Back
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onNavigate("home")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {currentUser.username}!</h1>
              <p className="text-gray-600">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{stats?.gamesCompleted || 0}</div>
              <div className="text-sm text-gray-600">Games Won</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{getCompletionRate()}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">{Math.round((stats?.totalPlayTime || 0) / 60000)}m</div>
              <div className="text-sm text-gray-600">Total Play Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">Game History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best Times */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Best Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(["easy", "medium", "hard"] as const).map((difficulty) => (
                    <div key={difficulty} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{difficulty}</span>
                      <Badge variant={stats?.bestTimes[difficulty] ? "default" : "secondary"}>
                        {stats?.bestTimes[difficulty]
                          ? formatTime(Math.floor(stats.bestTimes[difficulty]! / 1000))
                          : "Not played"}
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
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{getCompletionRate()}%</span>
                    </div>
                    <Progress value={getCompletionRate()} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Streak</span>
                      <span>{stats?.currentStreak || 0} games</span>
                    </div>
                    <Progress value={Math.min((stats?.currentStreak || 0) * 10, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Experience Level</span>
                      <span>Level {Math.floor((stats?.gamesCompleted || 0) / 10) + 1}</span>
                    </div>
                    <Progress value={((stats?.gamesCompleted || 0) % 10) * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
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
                            <div className="font-medium">{session.completed ? "Completed" : "Abandoned"}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(session.startTime).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {session.completionTime && (
                            <div className="font-medium">{formatTime(Math.floor(session.completionTime / 1000))}</div>
                          )}
                          {session.score && <div className="text-sm text-gray-600">{session.score} pts</div>}
                        </div>
                      </div>
                    ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No games played yet</p>
                      <Button onClick={() => onNavigate("play")} className="mt-4">
                        Start Playing
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
                  Achievements
                </CardTitle>
                <CardDescription>Unlock achievements by playing and improving your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAchievements().map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-green-50">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <div className="text-sm text-green-600 font-medium">Unlocked ✓</div>
                      </div>
                    </div>
                  ))}

                  {/* Locked achievements */}
                  {getAchievements().length < 8 && (
                    <>
                      <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 opacity-60">
                        <div className="text-3xl">🔒</div>
                        <div>
                          <div className="font-medium">Speed Demon</div>
                          <div className="text-sm text-gray-600">Complete a puzzle in under 5 minutes</div>
                          <div className="text-sm text-gray-500">Locked</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 opacity-60">
                        <div className="text-3xl">🔒</div>
                        <div>
                          <div className="font-medium">Perfect Week</div>
                          <div className="text-sm text-gray-600">Play every day for a week</div>
                          <div className="text-sm text-gray-500">Locked</div>
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
                  Game History
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
                          <div className="font-medium">{session.completed ? "✅ Completed" : "❌ Abandoned"}</div>
                          <div className="text-sm text-gray-600">{new Date(session.startTime).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            Hints: {session.hintsUsed} | Errors: {session.errorsCount}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {session.completionTime && (
                          <div className="font-medium text-lg">
                            {formatTime(Math.floor(session.completionTime / 1000))}
                          </div>
                        )}
                        {session.score && (
                          <div className="text-sm text-blue-600 font-medium">{session.score} points</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No game history yet</p>
                      <p className="mb-4">Start playing to see your game history here</p>
                      <Button onClick={() => onNavigate("play")}>Play Your First Game</Button>
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
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Games:</span>
                    <span className="font-medium">{stats?.totalGames || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Games Completed:</span>
                    <span className="font-medium">{stats?.gamesCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Games Abandoned:</span>
                    <span className="font-medium">{stats?.abandonedGames || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hints Used:</span>
                    <span className="font-medium">{stats?.totalHintsUsed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Errors:</span>
                    <span className="font-medium">{stats?.totalErrors || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak:</span>
                    <span className="font-medium">{stats?.longestStreak || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Days:</span>
                    <span className="font-medium">{Object.keys(stats?.dailyActivity || {}).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Session:</span>
                    <span className="font-medium">
                      {stats?.totalGames && stats.totalGames > 0
                        ? formatTime(Math.floor((stats.totalPlayTime || 0) / stats.totalGames / 1000))
                        : "0:00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Play Time:</span>
                    <span className="font-medium">{Math.floor((stats?.totalPlayTime || 0) / 60000)} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Type:</span>
                    <span className="font-medium">{currentUser.isGuest ? "Guest" : "Registered"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => onNavigate("play")}>Play New Game</Button>
                  <Button variant="outline" onClick={() => onNavigate("strategies")}>
                    Learn Strategies
                  </Button>
                  <Button variant="outline" onClick={() => onNavigate("how-to-play")}>
                    How to Play
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Progress
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
