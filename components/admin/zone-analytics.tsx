"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { User } from "@/types"
import { JHARKHAND_ZONES, MINISTRIES } from "@/lib/constants"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Clock, CheckCircle, Users } from "lucide-react"

interface ZoneAnalyticsProps {
  user: User
}

// Mock analytics data
const issuesByCategory = [
  { name: "Pothole", value: 45, color: "#8884d8" },
  { name: "Street Light", value: 32, color: "#82ca9d" },
  { name: "Garbage", value: 28, color: "#ffc658" },
  { name: "Water", value: 25, color: "#ff7300" },
  { name: "Electricity", value: 18, color: "#00ff00" },
  { name: "Other", value: 8, color: "#ff0000" },
]

const monthlyTrends = [
  { month: "Aug", submitted: 45, resolved: 38 },
  { month: "Sep", submitted: 52, resolved: 41 },
  { month: "Oct", submitted: 48, resolved: 45 },
  { month: "Nov", submitted: 61, resolved: 52 },
  { month: "Dec", submitted: 58, resolved: 55 },
  { month: "Jan", submitted: 67, resolved: 48 },
]

const districtPerformance = [
  { district: "Ranchi", issues: 89, resolved: 76, rate: 85 },
  { district: "Khunti", issues: 34, resolved: 28, rate: 82 },
  { district: "Lohardaga", issues: 33, resolved: 25, rate: 76 },
]

export function ZoneAnalytics({ user }: ZoneAnalyticsProps) {
  const userZone = JHARKHAND_ZONES.find((zone) => zone.id === user.zone)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">+0.3</span> days from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Citizens</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Issues submitted vs resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submitted" fill="#8884d8" name="Submitted" />
                <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
            <CardDescription>Distribution of issue types in {userZone?.name} zone</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issuesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issuesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* District Performance */}
      <Card>
        <CardHeader>
          <CardTitle>District Performance</CardTitle>
          <CardDescription>Performance metrics across districts in {userZone?.name} zone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {districtPerformance.map((district) => (
              <div key={district.district} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{district.district}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      {district.resolved}/{district.issues} resolved
                    </span>
                    <Badge
                      variant={district.rate >= 80 ? "secondary" : district.rate >= 70 ? "outline" : "destructive"}
                    >
                      {district.rate}%
                    </Badge>
                  </div>
                </div>
                <Progress value={district.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ministry Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Ministry Performance</CardTitle>
          <CardDescription>Resolution performance by ministry departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MINISTRIES.map((ministry) => (
              <div key={ministry.id} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{ministry.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Issues Assigned</span>
                    <span className="font-medium">
                      {ministry.id === "transport"
                        ? "45"
                        : ministry.id === "urban_dev"
                          ? "67"
                          : ministry.id === "water"
                            ? "23"
                            : "15"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resolved</span>
                    <span className="font-medium text-green-600">
                      {ministry.id === "transport"
                        ? "38"
                        : ministry.id === "urban_dev"
                          ? "52"
                          : ministry.id === "water"
                            ? "19"
                            : "12"}
                    </span>
                  </div>
                  <Progress
                    value={
                      ministry.id === "transport"
                        ? 84
                        : ministry.id === "urban_dev"
                          ? 78
                          : ministry.id === "water"
                            ? 83
                            : 80
                    }
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    Avg Resolution:{" "}
                    {ministry.id === "transport"
                      ? "3.8"
                      : ministry.id === "urban_dev"
                        ? "4.5"
                        : ministry.id === "water"
                          ? "3.2"
                          : "5.1"}{" "}
                    days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
