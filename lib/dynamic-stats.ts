// 动态统计数据生成器
// 基于日期生成逼真的、持续增长的统计数据

export interface DynamicStats {
  activePlayers: number
  bestTimeToday: string
  topAccuracy: number
  longestStreak: number
  onlinePlayers: number
  gamesPlayedToday: number
  newPlayersToday: number
}

// 基础种子值（2024年1月1日的基准）
const BASE_DATE = new Date("2024-01-01")
const BASE_STATS = {
  activePlayers: 850,
  baseTime: 85, // 秒
  baseAccuracy: 95.2,
  baseLongestStreak: 45,
  onlinePlayers: 120,
  gamesPlayedToday: 450,
  newPlayersToday: 25,
}

// 获取当前日期的天数偏移
function getDayOffset(): number {
  const today = new Date()
  const diffTime = today.getTime() - BASE_DATE.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// 生成伪随机数（基于日期确保同一天返回相同值）
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// 生成每日变化系数
function getDailyVariation(dayOffset: number, variationSeed: number): number {
  const random = seededRandom(dayOffset + variationSeed)
  // 生成-0.1到0.1之间的变化
  return (random - 0.5) * 0.2
}

// 格式化时间为 MM:SS
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

// 生成动态统计数据
export function generateDynamicStats(): DynamicStats {
  const dayOffset = getDayOffset()

  // 总体增长趋势（每天0.5-2%的增长）
  const growthFactor = Math.pow(1.012, dayOffset) // 年化增长约450%

  // 每日随机波动
  const playerVariation = getDailyVariation(dayOffset, 1)
  const timeVariation = getDailyVariation(dayOffset, 2)
  const accuracyVariation = getDailyVariation(dayOffset, 3)
  const streakVariation = getDailyVariation(dayOffset, 4)
  const onlineVariation = getDailyVariation(dayOffset, 5)
  const gamesVariation = getDailyVariation(dayOffset, 6)
  const newPlayersVariation = getDailyVariation(dayOffset, 7)

  // 计算活跃玩家数（持续增长 + 每日波动）
  const activePlayers = Math.floor(BASE_STATS.activePlayers * growthFactor * (1 + playerVariation))

  // 计算当日最佳时间（随着玩家增多，最佳时间趋向更快）
  const skillImprovement = Math.pow(0.999, dayOffset) // 技能提升因子
  const bestTimeSeconds = Math.floor(BASE_STATS.baseTime * skillImprovement * (1 + timeVariation * 0.3))
  const bestTimeToday = formatTime(Math.max(45, bestTimeSeconds)) // 最快不低于45秒

  // 计算最高准确率（缓慢提升 + 波动）
  const accuracyImprovement = Math.min(4.5, dayOffset * 0.01) // 最多提升4.5%
  const topAccuracy = Number(
    Math.min(99.9, BASE_STATS.baseAccuracy + accuracyImprovement + accuracyVariation).toFixed(1),
  )

  // 计算最长连胜（随机增长）
  const streakGrowth = Math.floor(dayOffset * 0.3 * (1 + streakVariation))
  const longestStreak = BASE_STATS.baseLongestStreak + streakGrowth

  // 计算在线玩家数（活跃玩家的8-15%）
  const onlineRatio = 0.12 + onlineVariation * 0.05
  const onlinePlayers = Math.floor(activePlayers * onlineRatio)

  // 计算今日游戏数（活跃玩家的2-4倍）
  const gamesRatio = 2.8 + gamesVariation * 1.2
  const gamesPlayedToday = Math.floor(activePlayers * gamesRatio)

  // 计算今日新玩家（总活跃玩家的1-3%）
  const newPlayerRatio = 0.02 + newPlayersVariation * 0.015
  const newPlayersToday = Math.floor(activePlayers * newPlayerRatio)

  return {
    activePlayers,
    bestTimeToday,
    topAccuracy,
    longestStreak,
    onlinePlayers,
    gamesPlayedToday,
    newPlayersToday,
  }
}

// 生成动态排行榜数据
export function generateDynamicLeaderboard() {
  const dayOffset = getDayOffset()
  const baseMultiplier = Math.pow(1.008, dayOffset) // 分数增长

  // 生成排行榜用户名（更真实的用户名）
  const usernames = [
    "SudokuMaster2024",
    "PuzzleGenius",
    "NumberNinja",
    "LogicLord",
    "GridGuru",
    "FastSolver",
    "BrainBox",
    "QuickThink",
    "PuzzlePro",
    "MindBender",
    "DigitWizard",
    "PatternKing",
    "LogicQueen",
    "CellMaster",
    "GridSolver",
    "NumberCrunch",
    "PuzzleAce",
    "SudokuStar",
    "LogicLegend",
    "GridGoddess",
  ]

  return {
    overall: usernames.slice(0, 10).map((username, index) => {
      const baseScore = 15420 - index * 530
      const variation = getDailyVariation(dayOffset, index + 100)
      const score = Math.floor(baseScore * baseMultiplier * (1 + variation * 0.1))

      return {
        rank: index + 1,
        username: index === 9 ? "You" : username,
        score,
        avatar: index === 9 ? "😊" : ["🏆", "🧠", "🥷", "👑", "🎯", "⚡", "🧩", "💡", "🎲", "🔮"][index],
        country: index === 9 ? "🌍" : ["🇺🇸", "🇯🇵", "🇰🇷", "🇬🇧", "🇩🇪", "🇫🇷", "🇨🇦", "🇦🇺", "🇮🇹", "🇪🇸"][index],
        isCurrentUser: index === 9,
      }
    }),
  }
}

// 获取历史趋势数据
export function getGrowthTrend(): { date: string; players: number }[] {
  const trends = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dayOffset = Math.floor((date.getTime() - BASE_DATE.getTime()) / (1000 * 60 * 60 * 24))
    const growthFactor = Math.pow(1.012, dayOffset)
    const variation = getDailyVariation(dayOffset, 999)

    const players = Math.floor(BASE_STATS.activePlayers * growthFactor * (1 + variation))

    trends.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      players,
    })
  }

  return trends
}

// 生成不同时间段的排行榜数据
export function generateTimeFilteredLeaderboard(timeFilter: "allTime" | "monthly" | "weekly" | "daily") {
  const dayOffset = getDayOffset()
  const baseMultiplier = Math.pow(1.008, dayOffset)

  // 根据时间筛选调整数据
  const getFilterMultiplier = () => {
    switch (timeFilter) {
      case "daily":
        return 0.1 // 日榜分数较低
      case "weekly":
        return 0.3 // 周榜分数中等
      case "monthly":
        return 0.6 // 月榜分数较高
      case "allTime":
      default:
        return 1.0 // 总榜分数最高
    }
  }

  const filterMultiplier = getFilterMultiplier()

  // 生成排行榜数据
  const generateRankingData = (baseScore: number, index: number) => {
    const variation = getDailyVariation(dayOffset, index + 200)
    const score = Math.floor(baseScore * baseMultiplier * filterMultiplier * (1 + variation))

    const usernames = [
      "SudokuMaster2024",
      "PuzzleGenius",
      "NumberNinja",
      "LogicLord",
      "GridGuru",
      "FastSolver",
      "BrainBox",
      "QuickThink",
      "PuzzlePro",
      "You",
    ]

    return {
      rank: index + 1,
      username: usernames[index],
      score,
      avatar: index === 9 ? "😊" : ["🏆", "🧠", "🥷", "👑", "🎯", "⚡", "🧩", "💡", "🎲"][index],
      country: index === 9 ? "🌍" : ["🇺🇸", "🇯🇵", "🇰🇷", "🇬🇧", "🇩🇪", "🇫🇷", "🇨🇦", "🇦🇺", "🇮🇹"][index],
      isCurrentUser: index === 9,
    }
  }

  return {
    overall: Array.from({ length: 10 }, (_, index) => generateRankingData(15420 - index * 500, index)),
  }
}

// 生成不同时间段的统计数据
export function generateTimeFilteredStats(timeFilter: "allTime" | "monthly" | "weekly" | "daily"): DynamicStats {
  const baseStats = generateDynamicStats()

  switch (timeFilter) {
    case "daily":
      return {
        ...baseStats,
        activePlayers: Math.floor(baseStats.activePlayers * 0.15), // 日活跃用户
        newPlayersToday: Math.floor(baseStats.newPlayersToday * 0.8),
        gamesPlayedToday: Math.floor(baseStats.gamesPlayedToday * 0.6),
        onlinePlayers: Math.floor(baseStats.onlinePlayers * 0.9),
      }
    case "weekly":
      return {
        ...baseStats,
        activePlayers: Math.floor(baseStats.activePlayers * 0.4), // 周活跃用户
        newPlayersToday: Math.floor(baseStats.newPlayersToday * 1.2),
        gamesPlayedToday: Math.floor(baseStats.gamesPlayedToday * 1.8),
      }
    case "monthly":
      return {
        ...baseStats,
        activePlayers: Math.floor(baseStats.activePlayers * 0.7), // 月活跃用户
        newPlayersToday: Math.floor(baseStats.newPlayersToday * 1.5),
        gamesPlayedToday: Math.floor(baseStats.gamesPlayedToday * 2.5),
      }
    case "allTime":
    default:
      return baseStats // 全时段数据
  }
}
