"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { User, CivicIssue } from "@/types"
import { ISSUE_CATEGORIES, JHARKHAND_ZONES, POINT_SYSTEM } from "@/lib/constants"
import { Camera, MapPin, Upload, X } from "lucide-react"
import { VoiceRecorder } from "@/components/ui/voice-recorder"

interface ReportIssueFormProps {
  user: User
  onSuccess: () => void
}

export function ReportIssueForm({ user, onSuccess }: ReportIssueFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as const,
    location: {
      address: "",
      zone: "",
      latitude: 0,
      longitude: 0,
    },
  })
  const [images, setImages] = useState<File[]>([])
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ lat: latitude, lng: longitude })
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude,
              longitude,
            },
          }))
          toast({
            title: "Location Captured",
            description: "Your current location has been added to the report.",
          })
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter address manually.",
            variant: "destructive",
          })
        },
      )
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (images.length + files.length > 3) {
      toast({
        title: "Too Many Images",
        description: "You can upload maximum 3 images per report.",
        variant: "destructive",
      })
      return
    }
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob)
    toast({
      title: "Voice Note Recorded",
      description: "Your voice description has been added to the report.",
    })
  }

  const handleRecordingDelete = () => {
    setAudioBlob(null)
    toast({
      title: "Voice Note Deleted",
      description: "Voice description has been removed from the report.",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock submission - In production, send to API
      const newIssue: Omit<CivicIssue, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title,
        description: formData.description,
        category: formData.category as CivicIssue["category"],
        priority: formData.priority,
        status: "submitted",
        location: {
          ...formData.location,
          latitude: formData.location.latitude || currentLocation?.lat || 0,
          longitude: formData.location.longitude || currentLocation?.lng || 0,
        },
        images: images.map((img) => URL.createObjectURL(img)),
        voiceNote: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
        reportedBy: user.id,
        ministry: ISSUE_CATEGORIES.find((cat) => cat.id === formData.category)?.ministry || "urban_dev",
        timeline: [
          {
            id: "1",
            status: "submitted",
            message: "Issue reported by citizen",
            timestamp: new Date(),
            updatedBy: user.id,
          },
        ],
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Issue Reported Successfully!",
        description: `You earned ${POINT_SYSTEM.REPORT_SUBMITTED} points for reporting this issue.`,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        location: { address: "", zone: "", latitude: 0, longitude: 0 },
      })
      setImages([])
      setAudioBlob(null)
      setCurrentLocation(null)

      onSuccess()
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Report Civic Issue</CardTitle>
        <CardDescription>Help improve your community by reporting civic issues in your area.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label>Location *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="flex-shrink-0 bg-transparent"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
              {currentLocation && (
                <Badge variant="secondary" className="flex items-center">
                  Location captured
                </Badge>
              )}
            </div>
            <Input
              value={formData.location.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value },
                })
              }
              placeholder="Enter detailed address"
              required
            />
            <Select
              value={formData.location.zone}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, zone: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {JHARKHAND_ZONES.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information about the issue..."
              rows={4}
              required
            />
          </div>

          {/* Voice Recording */}
          <div className="space-y-2">
            <Label>Voice Description (Optional)</Label>
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              onRecordingDelete={handleRecordingDelete}
              maxDuration={180} // 3 minutes for issue reports
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photos (Optional - Max 3)</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 3}
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Submitting Report...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Issue Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
