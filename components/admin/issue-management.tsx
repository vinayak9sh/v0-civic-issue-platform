"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { User, CivicIssue } from "@/types"
import { ISSUE_CATEGORIES, MINISTRIES } from "@/lib/constants"
import {
  Search,
  Filter,
  Eye,
  AlertTriangle,
  MapPin,
  Calendar,
  UserIcon,
  MessageSquare,
  Play,
  Pause,
} from "lucide-react"

interface IssueManagementProps {
  user: User
}

// Mock issues data for the zone
const mockZoneIssues: CivicIssue[] = [
  {
    id: "1",
    title: "Large pothole on Main Street causing traffic issues",
    description: "Deep pothole near the city center intersection causing vehicle damage and traffic congestion",
    category: "pothole",
    priority: "high",
    status: "submitted",
    location: {
      latitude: 23.3441,
      longitude: 85.3096,
      address: "Main Street, Near City Center, Ranchi",
      zone: "ranchi",
    },
    images: ["/pothole.png"],
    voiceNote: "/voice-note-1.wav",
    reportedBy: "citizen-1",
    ministry: "transport",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    timeline: [
      {
        id: "1",
        status: "submitted",
        message: "Issue reported by citizen",
        timestamp: new Date("2024-01-15T10:30:00"),
        updatedBy: "citizen-1",
      },
    ],
  },
  {
    id: "2",
    title: "Street light not working for 2 weeks",
    description: "Street light has been non-functional affecting night visibility and safety",
    category: "streetlight",
    priority: "medium",
    status: "acknowledged",
    location: {
      latitude: 23.3629,
      longitude: 85.3346,
      address: "Park Street, Residential Area, Ranchi",
      zone: "ranchi",
    },
    images: ["/broken-streetlight.jpg"],
    reportedBy: "citizen-2",
    ministry: "urban_dev",
    createdAt: new Date("2024-01-14T14:20:00"),
    updatedAt: new Date("2024-01-15T09:15:00"),
    timeline: [
      {
        id: "1",
        status: "submitted",
        message: "Issue reported by citizen",
        timestamp: new Date("2024-01-14T14:20:00"),
        updatedBy: "citizen-2",
      },
      {
        id: "2",
        status: "acknowledged",
        message: "Report acknowledged by zonal admin",
        timestamp: new Date("2024-01-15T09:15:00"),
        updatedBy: "admin-ranchi",
      },
    ],
  },
  {
    id: "3",
    title: "Overflowing garbage bins in residential area",
    description: "Multiple garbage bins overflowing for past 3 days, creating hygiene issues",
    category: "garbage",
    priority: "urgent",
    status: "in_progress",
    location: {
      latitude: 23.3525,
      longitude: 85.3272,
      address: "Sector 5, Housing Colony, Ranchi",
      zone: "ranchi",
    },
    images: ["/garbage-overflow.jpg"],
    reportedBy: "citizen-3",
    assignedTo: "ministry-urban",
    ministry: "urban_dev",
    createdAt: new Date("2024-01-13T16:45:00"),
    updatedAt: new Date("2024-01-15T11:30:00"),
    timeline: [
      {
        id: "1",
        status: "submitted",
        message: "Issue reported by citizen",
        timestamp: new Date("2024-01-13T16:45:00"),
        updatedBy: "citizen-3",
      },
      {
        id: "2",
        status: "acknowledged",
        message: "Report acknowledged by zonal admin",
        timestamp: new Date("2024-01-14T08:00:00"),
        updatedBy: "admin-ranchi",
      },
      {
        id: "3",
        status: "in_progress",
        message: "Assigned to Urban Development Ministry",
        timestamp: new Date("2024-01-15T11:30:00"),
        updatedBy: "admin-ranchi",
      },
    ],
  },
]

export function IssueManagement({ user }: IssueManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const { toast } = useToast()

  const filteredIssues = mockZoneIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter
    const matchesZone = issue.location.zone === user.zone

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesZone
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const handleViewDetails = (issue: CivicIssue) => {
    setSelectedIssue(issue)
    setNewStatus(issue.status)
    setIsDetailModalOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedIssue || !newStatus || !updateMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a status and provide an update message.",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Issue Updated",
        description: `Issue status updated to ${newStatus.replace("_", " ")}`,
      })

      setIsDetailModalOpen(false)
      setUpdateMessage("")
      setSelectedIssue(null)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const playVoiceNote = () => {
    // Mock voice playback
    setIsPlayingVoice(true)
    setTimeout(() => setIsPlayingVoice(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {ISSUE_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              <span>{filteredIssues.length} issues found</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="grid gap-4">
        {filteredIssues.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
              <p className="text-muted-foreground text-center">
                No issues match your current filters in {user.zone} zone.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl">{ISSUE_CATEGORIES.find((cat) => cat.id === issue.category)?.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {issue.location.address}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {issue.createdAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          Citizen Report
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="outline" className={`${getStatusColor(issue.status)} text-white`}>
                      {issue.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                      {issue.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {MINISTRIES.find((m) => m.id === issue.ministry)?.name || "Unknown Ministry"}
                    </Badge>
                    {issue.voiceNote && (
                      <Badge variant="outline" className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Voice Note
                      </Badge>
                    )}
                    {issue.images.length > 0 && (
                      <Badge variant="outline">
                        {issue.images.length} Photo{issue.images.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(issue)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Issue Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{ISSUE_CATEGORIES.find((cat) => cat.id === selectedIssue?.category)?.icon}</span>
              <span>{selectedIssue?.title}</span>
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedIssue?.location.address}
                </span>
                <span>Priority: {selectedIssue?.priority}</span>
                <span>Reported: {selectedIssue?.createdAt.toLocaleDateString()}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedIssue && (
            <div className="space-y-6">
              {/* Issue Details */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedIssue.description}</p>
              </div>

              {/* Voice Note */}
              {selectedIssue.voiceNote && (
                <div>
                  <h4 className="font-medium mb-2">Voice Description</h4>
                  <Button
                    variant="outline"
                    onClick={playVoiceNote}
                    className="flex items-center bg-transparent"
                    disabled={isPlayingVoice}
                  >
                    {isPlayingVoice ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlayingVoice ? "Playing..." : "Play Voice Note"}
                  </Button>
                </div>
              )}

              {/* Images */}
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

              {/* Timeline */}
              <div>
                <h4 className="font-medium mb-4">Timeline</h4>
                <div className="space-y-4">
                  {selectedIssue.timeline.map((event) => (
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

              {/* Update Status */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Update Issue Status</h4>
                <div className="space-y-4">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acknowledged">Acknowledge</SelectItem>
                      <SelectItem value="in_progress">Mark In Progress</SelectItem>
                      <SelectItem value="resolved">Mark Resolved</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Add update message for citizen..."
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateStatus}>Update Status</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
