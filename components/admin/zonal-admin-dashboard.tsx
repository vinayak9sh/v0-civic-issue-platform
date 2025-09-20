"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IssueManagement } from "@/components/admin/issue-management"
import { ZoneAnalytics } from "@/components/admin/zone-analytics"
import { CitizenManagement } from "@/components/admin/citizen-management"
import type { User } from "@/types"
import { JHARKHAND_ZONES } from "@/lib/constants"
import { LogOut, AlertTriangle, CheckCircle, Clock, Users, MapPin, TrendingUp } from "lucide-react"

interface ZonalAdminDashboardProps {
  user: User
  onLogout: () => void
}

// Mock data for demonstration
const mockStats = {
  totalIssues: 156,
  pendingIssues: 23,
  inProgressIssues: 45,
  resolvedIssues: 88,
  activeCitizens: 1247,
  avgResolutionTime: 4.2,
}

export function ZonalAdminDashboard({ user, onLogout }: ZonalAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const userZone = JHARKHAND_ZONES.find((zone) => zone.id === user.zone)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">Civic Connect Admin</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {userZone?.name} Zone
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">Zonal Administrator</p>
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="citizens">
              <Users className="h-4 w-4 mr-2" />
              Citizens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}</h2>
              <p className="text-muted-foreground mb-4">
                Managing civic issues for {userZone?.name} zone covering {userZone?.districts.join(", ")}
              </p>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Zone Coverage: {userZone?.districts.length} districts</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalIssues}</div>
                  <p className="text-xs text-muted-foreground">All time reports</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{mockStats.pendingIssues}</div>
                  <p className="text-xs text-muted-foreground">Awaiting action</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{mockStats.inProgressIssues}</div>
                  <p className="text-xs text-muted-foreground">Being resolved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockStats.resolvedIssues}</div>
                  <p className="text-xs text-muted-foreground">Successfully completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Zone Performance</CardTitle>
                  <CardDescription>Key metrics for {userZone?.name} zone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Citizens</span>
                    <span className="text-lg font-bold text-primary">{mockStats.activeCitizens}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg Resolution Time</span>
                    <span className="text-lg font-bold text-secondary">{mockStats.avgResolutionTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Resolution Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {Math.round((mockStats.resolvedIssues / mockStats.totalIssues) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates in your zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pothole on Main Street resolved</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                      <Badge variant="secondary">Resolved</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Street light repair assigned</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New garbage collection report</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                      <Badge variant="outline">New</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => setActiveTab("issues")}
                  >
                    <AlertTriangle className="h-6 w-6" />
                    <span>Review Pending Issues</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => setActiveTab("citizens")}
                  >
                    <Users className="h-6 w-6" />
                    <span>Manage Citizens</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <IssueManagement user={user} />
          </TabsContent>

          <TabsContent value="analytics">
            <ZoneAnalytics user={user} />
          </TabsContent>

          <TabsContent value="citizens">
            <CitizenManagement user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
