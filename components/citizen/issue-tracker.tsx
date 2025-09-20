"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import type { User, CivicIssue } from "@/types"
import { ISSUE_CATEGORIES } from "@/lib/constants"
import { DatabaseService } from "@/lib/database"
import { Search, MapPin, Clock, CheckCircle, AlertCircle, Eye, RefreshCw } from "lucide-react"

interface IssueTrackerProps {
  user: User
}

export function IssueTracker({ user }: IssueTrackerProps) {
  const [issues, setIssues] = useState<CivicIssue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)

  const dbService = DatabaseService.getInstance()

  useEffect(() => {
    loadUserIssues()

    // Set up real-time listener for user's issues
    const unsubscribe = dbService.subscribeToIssues((allIssues) => {
      console.log("[v0] Real-time issues update received:", allIssues.length)
      const userIssues = allIssues.filter((issue) => issue.reportedBy === user.id)
      setIssues(userIssues)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user.id])

  const loadUserIssues = async () => {
    try {
      console.log("[v0] Loading user issues...")
      const userIssues = await dbService.getIssuesByUser(user.id)
      setIssues(userIssues)
    } catch (error) {
      console.log("[v0] Error loading issues, using fallback data:", error)
      // Fallback to mock data
      setIssues(getMockIssues())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockIssues = (): CivicIssue[] => [
    {
      id: "1",
      title: "Large pothole on Main Street",
      description: "Deep pothole causing traffic issues and vehicle damage",
      category: "pothole",
      priority: "high",
      status: "in_progress",
      location: {
        latitude: 23.3441,
        longitude: 85.3096,
        address: "Main Street, Near City Center, Ranchi",
        zone: "ranchi",
      },
      images: ["/pothole-on-road.jpg"],
      reportedBy: user.id,
      ministry: "transport",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-12"),
      timeline: [
        {
          id: "1",
          status: "submitted",
          message: "Issue reported by citizen",
          timestamp: new Date("2024-01-10"),
          updatedBy: user.id,
        },
        {
          id: "2",
          status: "acknowledged",
          message: "Report acknowledged by zonal admin",
          timestamp: new Date("2024-01-11"),
          updatedBy: "admin-ranchi",
        },
        {
          id: "3",
          status: "in_progress",
          message: "Work assigned to Public Works Department",
          timestamp: new Date("2024-01-12"),
          updatedBy: "ministry-transport",
        },
      ],
    },
    {
      id: "2",
      title: "Street light not working",
      description: "Street light has been non-functional for 2 weeks",
      category: "streetlight",
      priority: "medium",
      status: "resolved",
      location: {
        latitude: 23.3629,
        longitude: 85.3346,
        address: "Park Street, Residential Area, Ranchi",
        zone: "ranchi",
      },
      images: ["/broken-street-light.png"],
      reportedBy: user.id,
      ministry: "urban_dev",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-08"),
      timeline: [
        {
          id: "1",
          status: "submitted",
          message: "Issue reported by citizen",
          timestamp: new Date("2024-01-05"),
          updatedBy: user.id,
        },
        {
          id: "2",
          status: "acknowledged",
          message: "Report acknowledged by zonal admin",
          timestamp: new Date("2024-01-06"),
          updatedBy: "admin-ranchi",
        },
        {
          id: "3",
          status: "resolved",
          message: "Street light repaired and tested",
          timestamp: new Date("2024-01-08"),
          updatedBy: "ministry-urban",
        },
      ],
    },
  ]

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500"
      case "acknowledged":
        return "bg-yellow-500"
      case "in_progress":
        return "bg-orange-500"
      case "resolved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "submitted":
        return 25
      case "acknowledged":
        return 50
      case "in_progress":
        return 75
      case "resolved":
        return 100
      default:
        return 0
    }
  }

  const refreshIssues = () => {
    setIsLoading(true)
    loadUserIssues()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your issues...</p>
        </div>
      </div>
    )
  }

  if (selectedIssue) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedIssue(null)} className="cursor-pointer">
            ← Back to Issues
          </Button>
          <Badge variant="outline" className={getStatusColor(selectedIssue.status)}>
            {selectedIssue.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{ISSUE_CATEGORIES.find((cat) => cat.id === selectedIssue.category)?.icon}</span>
              <span>{selectedIssue.title}</span>
            </CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedIssue.location.address}
                </span>
                <span>Priority: {selectedIssue.priority}</span>
                <span>Reported: {selectedIssue.createdAt.toLocaleDateString()}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{selectedIssue.description}</p>
            </div>

            {selectedIssue.images.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedIssue.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-4">Progress Timeline</h4>
              <div className="space-y-4">
                {selectedIssue.timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(event.status)}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.timestamp.toLocaleDateString()} at {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{getProgressPercentage(selectedIssue.status)}%</span>
              </div>
              <Progress value={getProgressPercentage(selectedIssue.status)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your reported issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 cursor-pointer">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All Status
            </SelectItem>
            <SelectItem value="submitted" className="cursor-pointer">
              Submitted
            </SelectItem>
            <SelectItem value="acknowledged" className="cursor-pointer">
              Acknowledged
            </SelectItem>
            <SelectItem value="in_progress" className="cursor-pointer">
              In Progress
            </SelectItem>
            <SelectItem value="resolved" className="cursor-pointer">
              Resolved
            </SelectItem>
            <SelectItem value="rejected" className="cursor-pointer">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={refreshIssues} className="cursor-pointer bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredIssues.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || statusFilter !== "all"
                  ? "No issues match your current filters."
                  : "You haven't reported any issues yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{ISSUE_CATEGORIES.find((cat) => cat.id === issue.category)?.icon}</span>
                    <div>
                      <h3 className="font-medium text-lg">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(issue.status)} text-white`}>
                    {getStatusIcon(issue.status)}
                    <span className="ml-1">{issue.status.replace("_", " ")}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {issue.location.address}
                  </span>
                  <span>{issue.createdAt.toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">Progress</span>
                      <span className="text-xs text-muted-foreground">{getProgressPercentage(issue.status)}%</span>
                    </div>
                    <Progress value={getProgressPercentage(issue.status)} className="h-1" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIssue(issue)}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
