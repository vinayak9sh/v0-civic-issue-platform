"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LeaderboardWidget } from "@/components/gamification/leaderboard-widget"
import type { User } from "@/types"
import { CITIZEN_LEVELS } from "@/lib/constants"
import { Search, Users, Trophy, Star, TrendingUp, Award } from "lucide-react"

interface CitizenManagementProps {
  user: User
}

// Mock citizen data for the zone
const mockZoneCitizens = [
  {
    id: "1",
    name: "Rahul Kumar",
    email: "rahul.kumar@email.com",
    points: 450,
    level: 3,
    reportsSubmitted: 12,
    reportsResolved: 8,
    badges: ["first_report", "weekly_streak"],
    joinedDate: new Date("2024-01-15"),
    lastActive: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya.singh@email.com",
    points: 680,
    level: 4,
    reportsSubmitted: 18,
    reportsResolved: 15,
    badges: ["first_report", "photo_reporter", "weekly_streak"],
    joinedDate: new Date("2023-12-10"),
    lastActive: new Date("2024-01-19"),
  },
  {
    id: "3",
    name: "Amit Sharma",
    email: "amit.sharma@email.com",
    points: 320,
    level: 2,
    reportsSubmitted: 8,
    reportsResolved: 5,
    badges: ["first_report"],
    joinedDate: new Date("2024-01-08"),
    lastActive: new Date("2024-01-18"),
  },
  {
    id: "4",
    name: "Sunita Devi",
    email: "sunita.devi@email.com",
    points: 890,
    level: 4,
    reportsSubmitted: 25,
    reportsResolved: 22,
    badges: ["first_report", "photo_reporter", "weekly_streak", "monthly_champion"],
    joinedDate: new Date("2023-11-20"),
    lastActive: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Rajesh Gupta",
    email: "rajesh.gupta@email.com",
    points: 180,
    level: 2,
    reportsSubmitted: 5,
    reportsResolved: 3,
    badges: ["first_report"],
    joinedDate: new Date("2024-01-12"),
    lastActive: new Date("2024-01-17"),
  },
]

const leaderboardData = mockZoneCitizens
  .sort((a, b) => b.points - a.points)
  .map((citizen, index) => ({
    rank: index + 1,
    name: citizen.name,
    points: citizen.points,
    level: citizen.level,
    zone: "Ranchi",
  }))

export function CitizenManagement({ user }: CitizenManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [sortBy, setSortBy] = useState("points")

  const filteredCitizens = mockZoneCitizens
    .filter((citizen) => {
      const matchesSearch =
        citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = levelFilter === "all" || citizen.level.toString() === levelFilter
      return matchesSearch && matchesLevel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "points":
          return b.points - a.points
        case "reports":
          return b.reportsSubmitted - a.reportsSubmitted
        case "resolved":
          return b.reportsResolved - a.reportsResolved
        case "recent":
          return b.lastActive.getTime() - a.lastActive.getTime()
        default:
          return 0
      }
    })

  const totalCitizens = mockZoneCitizens.length
  const activeCitizens = mockZoneCitizens.filter(
    (citizen) => citizen.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length
  const totalReports = mockZoneCitizens.reduce((sum, citizen) => sum + citizen.reportsSubmitted, 0)
  const avgPointsPerCitizen = Math.round(
    mockZoneCitizens.reduce((sum, citizen) => sum + citizen.points, 0) / totalCitizens,
  )

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citizens</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCitizens}</div>
            <p className="text-xs text-muted-foreground">Registered in zone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Citizens</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCitizens}</div>
            <p className="text-xs text-muted-foreground">Active in last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalReports}</div>
            <p className="text-xs text-muted-foreground">Issues reported</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Points</CardTitle>
            <Star className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{avgPointsPerCitizen}</div>
            <p className="text-xs text-muted-foreground">Per citizen</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citizens List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Citizen Directory</CardTitle>
              <CardDescription>Manage and view citizen participation in your zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search citizens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {CITIZEN_LEVELS.map((level) => (
                      <SelectItem key={level.level} value={level.level.toString()}>
                        Level {level.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="recent">Recent Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Citizens Grid */}
          <div className="grid gap-4">
            {filteredCitizens.map((citizen) => {
              const citizenLevel = CITIZEN_LEVELS.find((level) => level.level === citizen.level)
              return (
                <Card key={citizen.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {citizen.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{citizen.name}</h3>
                          <p className="text-sm text-muted-foreground">{citizen.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className={citizenLevel?.color}>
                              Level {citizen.level} - {citizenLevel?.name}
                            </Badge>
                            <Badge variant="outline">{citizen.points} points</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          <p>Reports: {citizen.reportsSubmitted}</p>
                          <p>Resolved: {citizen.reportsResolved}</p>
                          <p>Badges: {citizen.badges.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Joined: {citizen.joinedDate.toLocaleDateString()}</span>
                        <span className="text-muted-foreground">
                          Last active: {citizen.lastActive.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {citizen.badges.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {citizen.badges.map((badge) => (
                          <Badge key={badge} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {badge.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <LeaderboardWidget entries={leaderboardData} title="Zone Leaderboard" showZone={false} />
        </div>
      </div>
    </div>
  )
}
