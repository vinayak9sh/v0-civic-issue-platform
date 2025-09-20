"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User, Badge as BadgeType } from "@/types"
import { CITIZEN_LEVELS, POINT_SYSTEM } from "@/lib/constants"
import { Trophy, Star, Award, Target, Calendar, TrendingUp, Medal, Crown } from "lucide-react"

interface CitizenProfileProps {
  user: User
}

// Mock badges data
const availableBadges: BadgeType[] = [
  {
    id: "first_report",
    name: "First Reporter",
    description: "Submitted your first civic issue report",
    icon: "🎯",
    earnedAt: new Date("2024-01-15"),
  },
  {
    id: "weekly_streak",
    name: "Weekly Warrior",
    description: "Reported issues for 7 consecutive days",
    icon: "🔥",
    earnedAt: new Date("2024-01-20"),
  },
  {
    id: "photo_reporter",
    name: "Photo Reporter",
    description: "Submitted 10 reports with photos",
    icon: "📸",
    earnedAt: new Date("2024-01-25"),
  },
  {
    id: "voice_reporter",
    name: "Voice Reporter",
    description: "Submitted 5 reports with voice descriptions",
    icon: "🎙️",
    earnedAt: new Date("2024-01-28"),
  },
]

const upcomingBadges: Omit<BadgeType, "earnedAt">[] = [
  {
    id: "monthly_champion",
    name: "Monthly Champion",
    description: "Report 20 issues in a single month",
    icon: "🏆",
  },
  {
    id: "resolution_tracker",
    name: "Resolution Tracker",
    description: "Have 10 of your reports resolved",
    icon: "✅",
  },
  {
    id: "community_leader",
    name: "Community Leader",
    description: "Reach 1000 points",
    icon: "👑",
  },
]

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, name: "Priya Sharma", points: 1250, level: 5, zone: "Ranchi" },
  { rank: 2, name: "Amit Kumar", points: 980, level: 4, zone: "Dhanbad" },
  { rank: 3, name: "Rahul Singh", points: 750, level: 4, zone: "Jamshedpur" },
  { rank: 4, name: "Sunita Devi", points: 650, level: 3, zone: "Hazaribagh" },
  { rank: 5, name: "Rajesh Gupta", points: 580, level: 3, zone: "Deoghar" },
  { rank: 6, name: "Rahul Kumar", points: 450, level: 3, zone: "Ranchi", isCurrentUser: true },
  { rank: 7, name: "Anita Kumari", points: 420, level: 3, zone: "Palamu" },
  { rank: 8, name: "Vikash Yadav", points: 380, level: 2, zone: "Ranchi" },
]

export function CitizenProfile({ user }: CitizenProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const currentLevel = CITIZEN_LEVELS.find(
    (level) => user.points! >= level.minPoints && user.points! <= level.maxPoints,
  )
  const nextLevel = CITIZEN_LEVELS.find((level) => level.level === (currentLevel?.level || 1) + 1)
  const progressToNext = nextLevel
    ? ((user.points! - currentLevel!.minPoints) / (nextLevel.minPoints - currentLevel!.minPoints)) * 100
    : 100

  const earnedBadges = availableBadges.filter((badge) => user.badges?.includes(badge.id))
  const userRank = leaderboardData.find((entry) => entry.isCurrentUser)?.rank || 0

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="flex items-center">
                      <Crown className="h-3 w-3 mr-1" />
                      {currentLevel?.name}
                    </Badge>
                    <Badge variant="outline">#{userRank} in Jharkhand</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{user.points}</div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${currentLevel?.color}`} />
                  <span className="font-medium">Level {currentLevel?.level}</span>
                  <span className="text-muted-foreground">({currentLevel?.name})</span>
                </div>
                {nextLevel && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Next:</span>
                    <div className={`w-4 h-4 rounded-full ${nextLevel.color}`} />
                    <span className="text-sm font-medium">{nextLevel.name}</span>
                  </div>
                )}
              </div>
              <Progress value={progressToNext} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{currentLevel?.minPoints} points</span>
                {nextLevel ? (
                  <span>{nextLevel.minPoints - user.points!} points to next level</span>
                ) : (
                  <span>Max level reached!</span>
                )}
                <span>{nextLevel?.minPoints || "∞"} points</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-sm text-muted-foreground">Issues Reported</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">8</div>
                <p className="text-sm text-muted-foreground">Issues Resolved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">{earnedBadges.length}</div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-chart-1">#{userRank}</div>
                <p className="text-sm text-muted-foreground">State Rank</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-secondary" />
                Recent Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {earnedBadges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <p className="text-xs text-muted-foreground">Earned {badge.earnedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid gap-6">
            {/* Earned Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Medal className="h-5 w-5 mr-2 text-primary" />
                  Earned Badges ({earnedBadges.length})
                </CardTitle>
                <CardDescription>Badges you've unlocked through your civic participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id} className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h3 className="font-semibold text-primary">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                        <Badge variant="secondary" className="mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {badge.earnedAt.toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-muted-foreground" />
                  Upcoming Badges
                </CardTitle>
                <CardDescription>Badges you can earn with continued participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingBadges.map((badge) => (
                    <div key={badge.id} className="p-4 border rounded-lg bg-muted/30 border-muted">
                      <div className="text-center">
                        <div className="text-4xl mb-2 opacity-50">{badge.icon}</div>
                        <h3 className="font-semibold text-muted-foreground">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                        <Badge variant="outline" className="mt-2">
                          Not Earned
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Jharkhand State Leaderboard
              </CardTitle>
              <CardDescription>Top civic contributors across all zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1
                            ? "bg-yellow-500 text-white"
                            : entry.rank === 2
                              ? "bg-gray-400 text-white"
                              : entry.rank === 3
                                ? "bg-amber-600 text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <div>
                        <p className={`font-medium ${entry.isCurrentUser ? "text-primary" : ""}`}>
                          {entry.name} {entry.isCurrentUser && "(You)"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {CITIZEN_LEVELS.find((level) => level.level === entry.level)?.name} • {entry.zone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{entry.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-secondary" />
                Point System Guide
              </CardTitle>
              <CardDescription>How you earn points for civic participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span>Submit an issue report</span>
                  <Badge variant="secondary">+{POINT_SYSTEM.REPORT_SUBMITTED} points</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span>Report gets acknowledged</span>
                  <Badge variant="secondary">+{POINT_SYSTEM.REPORT_ACKNOWLEDGED} points</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span>Issue gets resolved</span>
                  <Badge variant="secondary">+{POINT_SYSTEM.ISSUE_RESOLVED} points</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span>First report bonus</span>
                  <Badge variant="secondary">+{POINT_SYSTEM.FIRST_REPORT_BONUS} points</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span>Weekly reporting streak</span>
                  <Badge variant="secondary">+{POINT_SYSTEM.WEEKLY_STREAK} points</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span>Monthly reporting streak</span>
                  <Badge variant="secondary">+{POINT_SYSTEM.MONTHLY_STREAK} points</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Level System</CardTitle>
              <CardDescription>Progress through citizen levels as you earn points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CITIZEN_LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      currentLevel?.level === level.level ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${level.color}`} />
                      <div>
                        <span className="font-medium">
                          Level {level.level}: {level.name}
                        </span>
                        {currentLevel?.level === level.level && (
                          <Badge variant="secondary" className="ml-2">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {level.minPoints}
                      {level.maxPoints !== Number.POSITIVE_INFINITY ? `-${level.maxPoints}` : "+"} points
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
