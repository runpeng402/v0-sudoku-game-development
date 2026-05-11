"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, MessageSquare, GamepadIcon, TrendingUp, Download, RefreshCw, AlertTriangle } from "lucide-react"
import { supabaseService } from "@/services/supabase-service"
import { isSupabaseAvailable } from "@/lib/supabase"

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setRefreshing(true)
      setError(null)

      if (!isSupabaseAvailable()) {
        setError("Supabase is not configured. Please set up your environment variables.")
        return
      }

      const dashboardData = await supabaseService.getAdminDashboardData()
      setData(dashboardData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const exportData = (dataType: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sudoku-${dataType}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuration Error:</strong> {error}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard Setup Required</CardTitle>
              <CardDescription>To use the admin dashboard, you need to configure Supabase integration.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Please follow these steps:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Create a Supabase project at{" "}
                    <a
                      href="https://supabase.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      supabase.com
                    </a>
                  </li>
                  <li>Get your project URL and anon key from the Supabase dashboard</li>
                  <li>
                    Set the following environment variables:
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>
                        <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                      </li>
                      <li>
                        <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                      </li>
                    </ul>
                  </li>
                  <li>Run the database schema script to create the required tables</li>
                </ol>
                <Button onClick={loadData} className="mt-4">
                  Retry Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, feedback, and game analytics</p>
          </div>
          <Button onClick={loadData} disabled={refreshing} className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">{data?.stats.activeUsers || 0} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.totalFeedback || 0}</div>
              <p className="text-xs text-muted-foreground">User feedback submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Game Sessions</CardTitle>
              <GamepadIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground">Total games played</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.sessions && data.sessions.length > 0
                  ? Math.round((data.sessions.filter((s: any) => s.completed).length / data.sessions.length) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Games completed successfully</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Data */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="sessions">Game Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>All users who have registered on the platform</CardDescription>
                </div>
                <Button
                  onClick={() => exportData("users", data?.users)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!data?.users?.length}
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.users?.length > 0 ? (
                    data.users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.is_guest && <Badge variant="secondary">Guest</Badge>}
                          <Badge variant="outline">{user.preferences?.language || "en"}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No users found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Feedback</CardTitle>
                  <CardDescription>Feedback and suggestions from users</CardDescription>
                </div>
                <Button
                  onClick={() => exportData("feedback", data?.feedback)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!data?.feedback?.length}
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.feedback?.length > 0 ? (
                    data.feedback.map((feedback: any) => (
                      <div key={feedback.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <Badge variant="outline">{feedback.rating}/5</Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {feedback.feedback_text && (
                          <p className="text-sm text-gray-700 mb-2">{feedback.feedback_text}</p>
                        )}
                        {feedback.email && <p className="text-xs text-gray-500">From: {feedback.email}</p>}
                        {feedback.improvements?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {feedback.improvements.map((improvement: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No feedback found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Game Sessions</CardTitle>
                  <CardDescription>Recent game sessions and statistics</CardDescription>
                </div>
                <Button
                  onClick={() => exportData("sessions", data?.sessions)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!data?.sessions?.length}
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.sessions?.length > 0 ? (
                    data.sessions.slice(0, 20).map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{session.users?.username || "Unknown User"}</h3>
                            <Badge variant="outline">{session.difficulty}</Badge>
                            {session.completed ? (
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            ) : session.abandoned ? (
                              <Badge variant="destructive">Abandoned</Badge>
                            ) : (
                              <Badge variant="secondary">In Progress</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Started: {new Date(session.start_time).toLocaleString()}
                          </p>
                          {session.completion_time && (
                            <p className="text-xs text-gray-500">
                              Completed in: {Math.floor(session.completion_time / 60)}m {session.completion_time % 60}s
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {session.score && <p className="font-medium text-blue-600">{session.score} pts</p>}
                          <p className="text-xs text-gray-500">
                            Hints: {session.hints_used} | Errors: {session.errors_count}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No game sessions found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
