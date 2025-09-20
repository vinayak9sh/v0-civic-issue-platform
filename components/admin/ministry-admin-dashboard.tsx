"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "@/types"
import { MINISTRIES } from "@/lib/constants"
import { LogOut, Building, FileText, TrendingUp, AlertTriangle, CheckCircle, Plug } from "lucide-react"
import { MinistryIntegrationComponent } from "./ministry-integration"

interface MinistryAdminDashboardProps {
  user: User
  onLogout: () => void
}

export function MinistryAdminDashboard({ user, onLogout }: MinistryAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const userMinistry = MINISTRIES.find((ministry) => ministry.id === user.ministry)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">Ministry Dashboard</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {userMinistry?.name}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">Ministry Administrator</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Building className="h-4 w-4 mr-2" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Plug className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}</h2>
              <p className="text-muted-foreground mb-4">
                Managing civic issues for {userMinistry?.name} across all zones in Jharkhand
              </p>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Departments: {userMinistry?.departments.join(", ")}</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Issues</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.ministry === "transport"
                      ? "89"
                      : user.ministry === "urban_dev"
                        ? "134"
                        : user.ministry === "water"
                          ? "67"
                          : "45"}
                  </div>
                  <p className="text-xs text-muted-foreground">Across all zones</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {user.ministry === "transport"
                      ? "23"
                      : user.ministry === "urban_dev"
                        ? "38"
                        : user.ministry === "water"
                          ? "15"
                          : "12"}
                  </div>
                  <p className="text-xs text-muted-foreground">Being resolved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {user.ministry === "transport"
                      ? "66"
                      : user.ministry === "urban_dev"
                        ? "96"
                        : user.ministry === "water"
                          ? "52"
                          : "33"}
                  </div>
                  <p className="text-xs text-muted-foreground">Successfully completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {user.ministry === "transport"
                      ? "74%"
                      : user.ministry === "urban_dev"
                        ? "72%"
                        : user.ministry === "water"
                          ? "78%"
                          : "73%"}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Ministry Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Ministry Performance Overview</CardTitle>
                <CardDescription>Key metrics and recent activity for {userMinistry?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-8 bg-muted/30 rounded-lg">
                    <Building className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ministry Dashboard</h3>
                    <p className="text-muted-foreground">
                      Comprehensive ministry-level analytics and management tools are being developed.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This will include cross-zone coordination, resource allocation, and policy implementation
                      tracking.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ministry Issue Management</h3>
                <p className="text-muted-foreground text-center">
                  Advanced issue management interface for ministry-level coordination is in development.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Department Management</h3>
                <p className="text-muted-foreground text-center">
                  Department coordination and resource management tools are being developed.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <MinistryIntegrationComponent ministry={user.ministry || "urban_dev"} />
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ministry Reports</h3>
                <p className="text-muted-foreground text-center">
                  Comprehensive reporting and analytics dashboard for ministry oversight is in development.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
