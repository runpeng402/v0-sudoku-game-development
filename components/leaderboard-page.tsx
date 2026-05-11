"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Target, Users, Medal, Crown, Home, Play, BookOpen, Brain } from "lucide-react"
import { I18nProvider } from "@/components/i18n-provider"

function LeaderboardContent() {
  const { t } = useTranslation()

  const topPlayers = [
    {
      rank: 1,
      username: "SudokuMaster2024",
      country: "Japan",
      totalScore: 15420,
      averageTime: "2:34",
      puzzlesSolved: 1247,
      winStreak: 23,
      level: "Grandmaster",
    },
    {
      rank: 2,
      username: "LogicQueen",
      country: "Germany",
      totalScore: 14890,
      averageTime: "2:41",
      puzzlesSolved: 1156,
      winStreak: 18,
      level: "Expert",
    },
    {
      rank: 3,
      username: "NumberNinja",
      country: "USA",
      totalScore: 14235,
      averageTime: "2:52",
      puzzlesSolved: 1089,
      winStreak: 15,
      level: "Expert",
    },
    {
      rank: 4,
      username: "PuzzlePro",
      country: "UK",
      totalScore: 13876,
      averageTime: "3:05",
      puzzlesSolved: 1034,
      winStreak: 12,
      level: "Expert",
    },
    {
      rank: 5,
      username: "BrainTrainer",
      country: "Canada",
      totalScore: 13542,
      averageTime: "3:12",
      puzzlesSolved: 987,
      winStreak: 9,
      level: "Advanced",
    },
  ]

  const weeklyChallenge = {
    title: "Speed Solving Championship",
    description: "Solve 10 medium puzzles as fast as possible",
    timeLeft: "3 days",
    participants: 2847,
    prize: "Premium Badge + 1000 Points",
  }

  const achievements = [
    {
      title: "Speed Demon",
      description: "Solve a puzzle in under 2 minutes",
      icon: Clock,
      rarity: "Rare",
      holders: 234,
    },
    {
      title: "Perfect Week",
      description: "Solve puzzles 7 days in a row",
      icon: Target,
      rarity: "Common",
      holders: 1456,
    },
    {
      title: "Puzzle Master",
      description: "Solve 1000 puzzles",
      icon: Trophy,
      rarity: "Epic",
      holders: 89,
    },
    {
      title: "No Hints Hero",
      description: "Solve 50 puzzles without using hints",
      icon: Medal,
      rarity: "Legendary",
      holders: 23,
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">{rank}</span>
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-700"
      case "Rare":
        return "bg-blue-100 text-blue-700"
      case "Epic":
        return "bg-purple-100 text-purple-700"
      case "Legendary":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Global Sudoku Leaderboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compete with Sudoku enthusiasts worldwide and climb the rankings
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link href="/play">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Play className="w-5 h-5" />
              <span className="text-sm">Play Now</span>
            </Button>
          </Link>
          <Link href="/how-to-play">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">How to Play</span>
            </Button>
          </Link>
          <Link href="/strategies">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Brain className="w-5 h-5" />
              <span className="text-sm">Strategies</span>
            </Button>
          </Link>
          <Link href="/user-center">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Users className="w-5 h-5" />
              <span className="text-sm">My Profile</span>
            </Button>
          </Link>
        </div>

        {/* Weekly Challenge */}
        <Card className="mb-12 border-0 shadow-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              Weekly Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{weeklyChallenge.title}</h3>
                <p className="mb-4 opacity-90">{weeklyChallenge.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {weeklyChallenge.timeLeft} left
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {weeklyChallenge.participants.toLocaleString()} participants
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Prize</h4>
                  <p className="opacity-90">{weeklyChallenge.prize}</p>
                </div>
                <Button variant="secondary" size="lg">
                  Join Challenge
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Players */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Players</h2>
          <div className="space-y-4">
            {topPlayers.map((player) => (
              <Card
                key={player.rank}
                className={`border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  player.rank <= 3 ? "ring-2 ring-yellow-200" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                        {getRankIcon(player.rank)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{player.username}</h3>
                        <p className="text-gray-600">{player.country}</p>
                      </div>
                      <Badge className={player.level === "Grandmaster" ? "bg-purple-100 text-purple-700" : ""}>
                        {player.level}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{player.totalScore.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Score</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{player.averageTime}</p>
                        <p className="text-sm text-gray-600">Avg Time</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{player.puzzlesSolved}</p>
                        <p className="text-sm text-gray-600">Solved</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{player.winStreak}</p>
                        <p className="text-sm text-gray-600">Streak</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <achievement.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                  </div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{achievement.holders} players earned this</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Global Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900">127,543</p>
                <p className="text-gray-600">Active Players</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900">2.4M</p>
                <p className="text-gray-600">Puzzles Solved</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900">1:47</p>
                <p className="text-gray-600">World Record</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900">8,934</p>
                <p className="text-gray-600">Competitions</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h3 className="text-3xl font-bold mb-4">Ready to Climb the Rankings?</h3>
          <p className="text-xl mb-8 opacity-90">Start playing now and see how you stack up against the best!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/play">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Start Playing
              </Button>
            </Link>
            <Link href="/user-center">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <Users className="w-5 h-5 mr-2" />
                View My Stats
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export function LeaderboardPageContent() {
  return (
    <I18nProvider>
      <LeaderboardContent />
    </I18nProvider>
  )
}
