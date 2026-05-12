"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LogOut, Settings, User, Award, Clock, Calendar } from "lucide-react"
import type { GameSession, User as AuthUser, UserStats } from "@/services/auth-service"

type UserProfileType = AuthUser & {
  stats?: Partial<UserStats> & {
    gamesCompleted?: number
  }
  gameSessions?: GameSession[]
}

interface UserProfileProps {
  user: UserProfileType
  onClose?: () => void
  onLogout?: () => void
}

export function UserProfile({ user, onClose, onLogout }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">用户资料</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            关闭
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-xl">{user.username}</CardTitle>
              <p className="text-sm text-gray-500">注册于 {new Date(user.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-2 mt-2">
                <Badge>{user.isGuest ? "访客账户" : "注册用户"}</Badge>
                <Badge variant="outline">等级 {Math.floor((user.stats?.gamesCompleted || 0) / 10) + 1}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">已完成游戏</span>
                <span className="font-medium">{user.stats?.gamesCompleted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">当前连胜</span>
                <span className="font-medium">{user.stats?.currentStreak || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">最长连胜</span>
                <span className="font-medium">{user.stats?.longestStreak || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">总游戏时间</span>
                <span className="font-medium">{Math.floor((user.stats?.totalPlayTime || 0) / 60000)} 分钟</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">成就</TabsTrigger>
              <TabsTrigger value="history">游戏历史</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    已解锁成就
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.stats?.gamesCompleted && user.stats.gamesCompleted >= 1 ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <div className="font-medium">首次胜利</div>
                          <div className="text-sm text-gray-600">完成你的第一个谜题</div>
                        </div>
                      </div>
                    ) : null}

                    {user.stats?.gamesCompleted && user.stats.gamesCompleted >= 10 ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                        <div className="text-2xl">🎯</div>
                        <div>
                          <div className="font-medium">专注玩家</div>
                          <div className="text-sm text-gray-600">完成10个谜题</div>
                        </div>
                      </div>
                    ) : null}

                    {user.stats?.currentStreak && user.stats.currentStreak >= 3 ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                        <div className="text-2xl">🔥</div>
                        <div>
                          <div className="font-medium">连胜高手</div>
                          <div className="text-sm text-gray-600">连续完成3个谜题</div>
                        </div>
                      </div>
                    ) : null}

                    {/* 锁定的成就 */}
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 opacity-60">
                      <div className="text-2xl">🔒</div>
                      <div>
                        <div className="font-medium">数独大师</div>
                        <div className="text-sm text-gray-600">完成50个谜题</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    最近游戏
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.gameSessions && user.gameSessions.length > 0 ? (
                    <div className="space-y-3">
                      {user.gameSessions.slice(0, 5).map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant={session.completed ? "default" : "destructive"}>{session.difficulty}</Badge>
                            <div>
                              <div className="font-medium">{session.completed ? "已完成" : "未完成"}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(session.startTime).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {session.completionTime
                                ? `${Math.floor(session.completionTime / 60000)}:${Math.floor(
                                    (session.completionTime % 60000) / 1000,
                                  )
                                    .toString()
                                    .padStart(2, "0")}`
                                : "未完成"}
                            </div>
                            <div className="text-sm text-gray-600">
                              提示: {session.hintsUsed} | 错误: {session.errorsCount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">暂无游戏记录</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    账户设置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                      <input type="text" className="w-full p-2 border rounded-md" value={user.username} disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-md"
                        value={user.email || "未设置"}
                        disabled
                      />
                    </div>
                    <div className="pt-4">
                      <Button>更新资料</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
