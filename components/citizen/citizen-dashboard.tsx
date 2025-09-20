"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportIssueForm } from "@/components/citizen/report-issue-form"
import { IssueTracker } from "@/components/citizen/issue-tracker"
import { CitizenProfile } from "@/components/citizen/citizen-profile"
import type { User } from "@/types"
import { CITIZEN_LEVELS } from "@/lib/constants"
import { LogOut, Plus, MapPin, Trophy, UserIcon } from "lucide-react"

interface CitizenDashboardProps {
  user: User
  onLogout: () => void
}

export function CitizenDashboard({ user, onLogout }: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const currentLevel = CITIZEN_LEVELS.find(
    (level) => user.points! >= level.minPoints && user.points! <= level.maxPoints,
  )
  const nextLevel = CITIZEN_LEVELS.find((level) => level.level === (currentLevel?.level || 1) + 1)
  const progressToNext = nextLevel
    ? ((user.points! - currentLevel!.minPoints) / (nextLevel.minPoints - currentLevel!.minPoints)) * 100
    : 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">Civic Connect</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Jharkhand Government
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentLevel?.name} • {user.points} points
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="report">
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
            </TabsTrigger>
            <TabsTrigger value="track">
              <MapPin className="h-4 w-4 mr-2" />
              Track Issues
            </TabsTrigger>
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
              <p className="text-muted-foreground mb-4">
                Thank you for being an active citizen. Your contributions make Jharkhand better.
              </p>
              <Button onClick={() => setActiveTab("report")} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{currentLevel?.name}</div>
                  <p className="text-xs text-muted-foreground">Level {currentLevel?.level}</p>
                  <div className="mt-2">
                    <Progress value={progressToNext} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {nextLevel
                        ? `${nextLevel.minPoints - user.points!} points to ${nextLevel.name}`
                        : "Max level reached!"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{user.points}</div>
                  <p className="text-xs text-muted-foreground">Earned from civic participation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{user.badges?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Achievement badges</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest civic contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reported pothole on Main Street</p>
                      <p className="text-xs text-muted-foreground">2 days ago • +10 points</p>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Street light issue resolved</p>
                      <p className="text-xs text-muted-foreground">1 week ago • +50 points</p>
                    </div>
                    <Badge variant="secondary">Resolved</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Earned "First Report" badge</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago • +25 points</p>
                    </div>
                    <Badge variant="outline">Achievement</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <ReportIssueForm user={user} onSuccess={() => setActiveTab("track")} />
          </TabsContent>

          <TabsContent value="track">
            <IssueTracker user={user} />
          </TabsContent>

          <TabsContent value="profile">
            <CitizenProfile user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
