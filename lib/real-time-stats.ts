// 实时统计数据模块
export interface RealTimeStats {
  onlinePlayers: number
  newPlayersToday: number
  gamesPlayedToday: number
}

// 基础统计数据
let baseStats = {
  activePlayers: 403625,
  onlinePlayers: 47085,
  newPlayersToday: 8626,
  bestTimeToday: "0:50",
  topAccuracy: 99.7,
  longestStreak: 209,
  gamesPlayedToday: 1098856,
  lastUpdateTime: Date.now(),
}

// 实时波动范围（百分比）
const FLUCTUATION_RANGES = {
  onlinePlayers: { min: -0.05, max: 0.08 }, // 在线玩家波动较小
  newPlayersToday: { min: 0.01, max: 0.03 }, // 新玩家稳定增长
  gamesPlayedToday: { min: 0.02, max: 0.05 }, // 游戏数量稳定增长
}

// 生成随机波动值
function getRandomFluctuation(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

// 模拟实时数据变化
export function simulateRealTimeChanges(): RealTimeStats {
  const now = Date.now()
  const timeDiff = (now - baseStats.lastUpdateTime) / 1000 // 秒数

  // 根据时间差计算变化量
  const onlineChange = Math.floor(
    baseStats.onlinePlayers *
      getRandomFluctuation(FLUCTUATION_RANGES.onlinePlayers.min, FLUCTUATION_RANGES.onlinePlayers.max) *
      (timeDiff / 60),
  ) // 每分钟变化率

  const newPlayersChange = Math.floor(
    baseStats.newPlayersToday *
      getRandomFluctuation(FLUCTUATION_RANGES.newPlayersToday.min, FLUCTUATION_RANGES.newPlayersToday.max) *
      (timeDiff / 60),
  ) // 每分钟变化率

  const gamesPlayedChange = Math.floor(
    baseStats.gamesPlayedToday *
      getRandomFluctuation(FLUCTUATION_RANGES.gamesPlayedToday.min, FLUCTUATION_RANGES.gamesPlayedToday.max) *
      (timeDiff / 60),
  ) // 每分钟变化率

  // 更新基础数据
  baseStats = {
    ...baseStats,
    onlinePlayers: Math.max(10000, baseStats.onlinePlayers + onlineChange), // 最少10000人在线
    newPlayersToday: baseStats.newPlayersToday + Math.max(0, newPlayersChange),
    gamesPlayedToday: baseStats.gamesPlayedToday + Math.max(0, gamesPlayedChange),
    lastUpdateTime: now,
  }

  // 返回更新后的数据
  return {
    onlinePlayers: baseStats.onlinePlayers,
    newPlayersToday: baseStats.newPlayersToday,
    gamesPlayedToday: baseStats.gamesPlayedToday,
  }
}

// 模拟高峰期和低谷期
export function getTimeBasedMultiplier(): number {
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.getDay() // 0 = 周日, 1-6 = 周一至周六

  // 基础乘数
  let multiplier = 1.0

  // 工作日与周末的差异
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    multiplier *= 1.3 // 周末玩家更多
  }

  // 一天中的高峰期和低谷期
  if (hour >= 8 && hour < 12) {
    multiplier *= 1.1 // 上午高峰
  } else if (hour >= 12 && hour < 14) {
    multiplier *= 1.05 // 午休时间
  } else if (hour >= 18 && hour < 23) {
    multiplier *= 1.4 // 晚间高峰
  } else if (hour >= 0 && hour < 6) {
    multiplier *= 0.6 // 凌晨低谷
  }

  return multiplier
}

// 获取实时在线玩家数量（考虑时间因素）
export function getRealTimeOnlinePlayers(): number {
  const baseOnline = baseStats.onlinePlayers
  const timeMultiplier = getTimeBasedMultiplier()

  // 添加一些随机波动
  const randomFactor = 0.98 + Math.random() * 0.04 // 0.98-1.02之间的随机数

  // 计算最终在线人数
  const finalOnline = Math.floor(baseOnline * timeMultiplier * randomFactor)

  return Math.max(5000, finalOnline) // 最少5000人在线
}

// 模拟实时游戏完成事件
export interface GameCompletionEvent {
  username: string
  difficulty: string
  timeSpent: string
  accuracy: number
  points: number
  timestamp: Date
}

// 随机用户名生成
const usernames = [
  "SudokuMaster",
  "PuzzleGenius",
  "NumberNinja",
  "LogicLord",
  "GridGuru",
  "FastSolver",
  "BrainBox",
  "QuickThink",
  "PuzzlePro",
  "MindBender",
]

// 随机游戏难度
const difficulties = ["Easy", "Medium", "Hard"]

// 生成随机游戏完成事件
export function generateRandomGameCompletion(): GameCompletionEvent {
  const username = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000)
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]

  // 根据难度生成完成时间
  let minutes, seconds
  switch (difficulty) {
    case "Easy":
      minutes = Math.floor(Math.random() * 3) + 1
      seconds = Math.floor(Math.random() * 60)
      break
    case "Medium":
      minutes = Math.floor(Math.random() * 5) + 3
      seconds = Math.floor(Math.random() * 60)
      break
    case "Hard":
      minutes = Math.floor(Math.random() * 8) + 6
      seconds = Math.floor(Math.random() * 60)
      break
    default:
      minutes = Math.floor(Math.random() * 5) + 2
      seconds = Math.floor(Math.random() * 60)
  }

  const timeSpent = `${minutes}:${seconds.toString().padStart(2, "0")}`

  // 生成准确率和分数
  const accuracy = 85 + Math.floor(Math.random() * 15) // 85%-100%
  const basePoints = { Easy: 100, Medium: 250, Hard: 500 }[difficulty] || 100

  // 根据时间和准确率调整分数
  const timeBonus = Math.max(0, 1 - minutes / 30) // 时间越短，奖励越高
  const accuracyMultiplier = accuracy / 100
  const points = Math.floor(basePoints * (1 + timeBonus) * accuracyMultiplier)

  return {
    username,
    difficulty,
    timeSpent,
    accuracy,
    points,
    timestamp: new Date(),
  }
}

// 获取最近游戏完成事件队列
const recentCompletions: GameCompletionEvent[] = []

// 添加新的游戏完成事件
export function addGameCompletion(event: GameCompletionEvent) {
  recentCompletions.unshift(event) // 添加到队列开头

  // 保持队列长度不超过10
  if (recentCompletions.length > 10) {
    recentCompletions.pop()
  }
}

// 获取最近游戏完成事件
export function getRecentCompletions(): GameCompletionEvent[] {
  return [...recentCompletions]
}

// 初始化一些游戏完成事件
if (recentCompletions.length === 0) {
  for (let i = 0; i < 5; i++) {
    const event = generateRandomGameCompletion()
    // 设置一些随机的过去时间
    event.timestamp = new Date(Date.now() - Math.floor(Math.random() * 300000)) // 过去5分钟内
    addGameCompletion(event)
  }
}
