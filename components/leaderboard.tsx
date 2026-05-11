"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Clock, Target, Zap, Users, Play, ArrowLeft, Home, Crown, TrendingUp } from "lucide-react"
import {
  generateDynamicStats,
  generateDynamicLeaderboard,
  getGrowthTrend,
  generateTimeFilteredStats,
  generateTimeFilteredLeaderboard,
} from "@/lib/dynamic-stats"
import { useEffect, useState } from "react"

interface LeaderboardProps {
  onNavigate?: (page: "home" | "play" | "how-to-play" | "strategies" | "articles" | "variants" | "user-center") => void
}

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  time?: string
  accuracy?: number
  streak?: number
  avatar: string
  country: string
  isCurrentUser?: boolean
}

export function Leaderboard({ onNavigate }: LeaderboardProps) {
  const { t } = useTranslation()
  const [showGrowthTrend, setShowGrowthTrend] = useState(false)
  const [activeTimeFilter, setActiveTimeFilter] = useState<"allTime" | "monthly" | "weekly" | "daily">("allTime")
  const [filteredStats, setFilteredStats] = useState(generateDynamicStats())
  const [filteredLeaderboard, setFilteredLeaderboard] = useState(generateDynamicLeaderboard())
  const [onlinePlayers, setOnlinePlayers] = useState(47085)

  // 更新数据当时间筛选改变时
  useEffect(() => {
    const updateData = () => {
      try {
        const newStats = generateTimeFilteredStats(activeTimeFilter)
        const newLeaderboard = generateTimeFilteredLeaderboard(activeTimeFilter)
        setFilteredStats(newStats)
        setFilteredLeaderboard(newLeaderboard)
      } catch (error) {
        console.error("Error updating data:", error)
      }
    }

    updateData()

    const interval = setInterval(updateData, 60000) // 60秒更新一次
    return () => clearInterval(interval)
  }, [activeTimeFilter])

  // 简单的在线玩家数量更新
  useEffect(() => {
    const updateOnlinePlayers = () => {
      const baseOnline = 47085
      const variation = (Math.random() - 0.5) * 0.1 // ±5% 变化
      const newOnline = Math.floor(baseOnline * (1 + variation))
      setOnlinePlayers(Math.max(30000, newOnline))
    }

    const interval = setInterval(updateOnlinePlayers, 10000) // 10秒更新一次
    return () => clearInterval(interval)
  }, [])

  // 修改生成速度排行榜数据函数，添加时间筛选支持
  const generateSpeedLeaderboard = (timeFilter: "allTime" | "monthly" | "weekly" | "daily") => {
    const baseTime = 83 // 秒

    // 根据时间筛选调整基础时间和变化范围
    const getTimeMultiplier = () => {
      switch (timeFilter) {
        case "daily":
          return { base: 0.9, range: 0.8 } // 日榜时间更快
        case "weekly":
          return { base: 0.95, range: 0.9 }
        case "monthly":
          return { base: 0.98, range: 0.95 }
        case "allTime":
        default:
          return { base: 1.0, range: 1.0 }
      }
    }

    const { base, range } = getTimeMultiplier()

    return Array.from({ length: 10 }, (_, index) => {
      const variation = Math.sin((Date.now() / 86400000 + index) * Math.PI) * 0.1
      const timeInSeconds = Math.floor(baseTime * base + index * 8 * range + variation * 10)
      const minutes = Math.floor(timeInSeconds / 60)
      const seconds = timeInSeconds % 60

      return {
        rank: index + 1,
        username: index === 9 ? "You" : `SpeedRunner${index + 1}`,
        time: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        score: 0,
        avatar: index === 9 ? "😊" : ["⚡", "👹", "🚀", "💨", "🎯", "🏎️", "🦅", "🔥", "💫", "⭐"][index],
        country: index === 9 ? "🌍" : ["🇰🇷", "🇯🇵", "🇺🇸", "🇬🇧", "🇩🇪", "🇫🇷", "🇨🇦", "🇦🇺", "🇮🇹", "🇪🇸"][index],
        isCurrentUser: index === 9,
      }
    })
  }

  // 生成准确率排行榜数据，添加时间筛选支持
  const generateAccuracyLeaderboard = (timeFilter: "allTime" | "monthly" | "weekly" | "daily", topAccuracy: number) => {
    // 根据时间筛选调整准确率范围
    const getAccuracyMultiplier = () => {
      switch (timeFilter) {
        case "daily":
          return 0.95 // 日榜准确率稍低
        case "weekly":
          return 0.97
        case "monthly":
          return 0.98
        case "allTime":
        default:
          return 1.0
      }
    }

    const multiplier = getAccuracyMultiplier()

    return [
      {
        rank: 1,
        username: "PerfectPlayer",
        accuracy: Number((topAccuracy * multiplier).toFixed(1)),
        score: 0,
        avatar: "💯",
        country: "🇯🇵",
        isCurrentUser: false,
      },
      ...Array.from({ length: 9 }, (_, index) => ({
        rank: index + 2,
        username: index === 8 ? "You" : `AccuracyPro${index + 1}`,
        accuracy: Number((topAccuracy * multiplier - (index + 1) * 0.2).toFixed(1)),
        score: 0,
        avatar: index === 8 ? "😊" : ["💎", "🎯", "✨", "🧠", "🏹", "🎪", "🔍", "🤝", "⭐"][index],
        country: index === 8 ? "🌍" : ["🇰🇷", "🇺🇸", "🇬🇧", "🇩🇪", "🇫🇷", "🇨🇦", "🇦🇺", "🇮🇹", "🇪🇸"][index],
        isCurrentUser: index === 8,
      })),
    ]
  }

  // 生成连胜排行榜数据，添加时间筛选支持
  const generateStreakLeaderboard = (timeFilter: "allTime" | "monthly" | "weekly" | "daily", longestStreak: number) => {
    // 根据时间筛选调整连胜数量
    const getStreakMultiplier = () => {
      switch (timeFilter) {
        case "daily":
          return 0.3 // 日榜连胜较短
        case "weekly":
          return 0.5
        case "monthly":
          return 0.7
        case "allTime":
        default:
          return 1.0
      }
    }

    const multiplier = getStreakMultiplier()

    return [
      {
        rank: 1,
        username: "StreakKing",
        streak: Math.floor(longestStreak * multiplier),
        score: 0,
        avatar: "👑",
        country: "🇺🇸",
        isCurrentUser: false,
      },
      ...Array.from({ length: 9 }, (_, index) => ({
        rank: index + 2,
        username: index === 8 ? "You" : `StreakMaster${index + 1}`,
        streak: Math.floor(longestStreak * multiplier - (index + 1) * 8),
        score: 0,
        avatar: index === 8 ? "😊" : ["🔥", "⭐", "💪", "⛓️", "🏃", "🌪️", "🤖", "🔗", "💫"][index],
        country: index === 8 ? "🌍" : ["🇯🇵", "🇰🇷", "🇬🇧", "🇩🇪", "🇫🇷", "🇨🇦", "🇦🇺", "🇮🇹", "🇪🇸"][index],
        isCurrentUser: index === 8,
      })),
    ]
  }

  // 处理时间筛选按钮点击
  const handleTimeFilterChange = (filter: "allTime" | "monthly" | "weekly" | "daily") => {
    setActiveTimeFilter(filter)
  }

  const stats = [
    {
      icon: Users,
      value: filteredStats.activePlayers.toLocaleString(),
      label: t("leaderboard.activePlayers"),
      subtitle: `+${filteredStats.newPlayersToday.toLocaleString()} ${activeTimeFilter === "daily" ? "today" : "new"}`,
      trend: "up",
    },
    {
      icon: Clock,
      value: filteredStats.bestTimeToday,
      label: t("leaderboard.bestTimeToday"),
      subtitle: `${onlinePlayers.toLocaleString()} online now`,
      trend: "stable",
    },
    {
      icon: Target,
      value: `${filteredStats.topAccuracy}%`,
      label: t("leaderboard.topAccuracy"),
      subtitle: "Record breaking!",
      trend: "up",
    },
    {
      icon: Zap,
      value: filteredStats.longestStreak.toString(),
      label: t("leaderboard.longestStreak"),
      subtitle: `${filteredStats.gamesPlayedToday.toLocaleString()} games ${activeTimeFilter === "daily" ? "today" : "total"}`,
      trend: "up",
    },
  ]

  const mockLeaderboard = {
    overall: filteredLeaderboard.overall,
    speed: generateSpeedLeaderboard(activeTimeFilter),
    accuracy: generateAccuracyLeaderboard(activeTimeFilter, filteredStats.topAccuracy),
    streak: generateStreakLeaderboard(activeTimeFilter, filteredStats.longestStreak),
  }

  const timeFilters = [
    { key: "allTime", label: t("leaderboard.allTime") },
    { key: "monthly", label: t("leaderboard.monthly") },
    { key: "weekly", label: t("leaderboard.weekly") },
    { key: "daily", label: t("leaderboard.daily") },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const renderLeaderboardEntry = (entry: LeaderboardEntry, category: string) => (
    <div
      key={entry.rank}
      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
        entry.isCurrentUser ? "bg-blue-50 border-blue-200 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8 h-8">{getRankIcon(entry.rank)}</div>
        <div className="text-2xl">{entry.avatar}</div>
        <div>
          <div className={`font-semibold ${entry.isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
            {entry.username}
            {entry.isCurrentUser && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">You</span>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>{entry.country}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        {category === "overall" && (
          <div className="font-bold text-lg text-gray-900">{entry.score.toLocaleString()}</div>
        )}
        {category === "speed" && <div className="font-bold text-lg text-gray-900">{entry.time}</div>}
        {category === "accuracy" && <div className="font-bold text-lg text-gray-900">{entry.accuracy}%</div>}
        {category === "streak" && <div className="font-bold text-lg text-gray-900">{entry.streak}</div>}
        <div className="text-xs text-gray-500">
          {category === "overall" && "points"}
          {category === "speed" && "best time"}
          {category === "accuracy" && "accuracy"}
          {category === "streak" && "wins in a row"}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => onNavigate?.("home")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <Home className="w-4 h-4" />
            {t("common.home")}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("leaderboard.title")}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("leaderboard.subtitle")}</p>

          {/* 实时更新指示器 */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live • Updates every minute
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                  {stat.value}
                  {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                </div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">{stat.subtitle}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Growth Trend Button */}
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setShowGrowthTrend(!showGrowthTrend)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {showGrowthTrend ? "Hide" : "Show"} 7-Day Growth Trend
          </Button>
        </div>

        {/* Growth Trend Chart */}
        {showGrowthTrend && (
          <Card className="mb-8 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Player Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 gap-2">
                {getGrowthTrend().map((data, index) => {
                  const maxPlayers = Math.max(...getGrowthTrend().map((d) => d.players))
                  const height = (data.players / maxPlayers) * 100

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="bg-blue-500 rounded-t min-h-[20px] w-full mb-2 transition-all duration-500"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-600 text-center">
                        <div>{data.date}</div>
                        <div className="font-semibold">{data.players.toLocaleString()}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Tabs */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t("leaderboard.rankings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overall" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overall" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {t("leaderboard.overall")}
                </TabsTrigger>
                <TabsTrigger value="speed" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t("leaderboard.speed")}
                </TabsTrigger>
                <TabsTrigger value="accuracy" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {t("leaderboard.accuracy")}
                </TabsTrigger>
                <TabsTrigger value="streak" className="flex items-center gap-2">
                  <Medal className="w-4 h-4" />
                  {t("leaderboard.streak")}
                </TabsTrigger>
              </TabsList>

              {/* Time Filter Buttons */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {timeFilters.map((filter) => (
                  <Button
                    key={filter.key}
                    variant={activeTimeFilter === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeFilterChange(filter.key as "allTime" | "monthly" | "weekly" | "daily")}
                    className={`transition-all duration-200 ${
                      activeTimeFilter === filter.key
                        ? "bg-blue-600 text-white shadow-md"
                        : "hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>

              {Object.entries(mockLeaderboard).map(([category, data]) => (
                <TabsContent key={category} value={category}>
                  <div className="space-y-3">{data.map((entry) => renderLeaderboardEntry(entry, category))}</div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">{t("leaderboard.readyToCompete")}</h2>
              <p className="text-xl mb-8 opacity-90">{t("leaderboard.joinCompetition")}</p>
              <Button size="lg" variant="secondary" onClick={() => onNavigate?.("play")} className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                {t("leaderboard.startPlayingNow")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
