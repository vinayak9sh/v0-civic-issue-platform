"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { MinistryIntegrationService, type MinistryIntegration, type ExternalIssue } from "@/lib/ministry-integration"
import { Plug, RefreshCw, AlertTriangle, CheckCircle, Clock, Settings, ExternalLink, Database } from "lucide-react"

interface MinistryIntegrationProps {
  ministry: string
}

export function MinistryIntegrationComponent({ ministry }: MinistryIntegrationProps) {
  const [integrations, setIntegrations] = useState<MinistryIntegration[]>([])
  const [externalIssues, setExternalIssues] = useState<ExternalIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<MinistryIntegration | null>(null)
  const { toast } = useToast()
  const integrationService = MinistryIntegrationService.getInstance()

  useEffect(() => {
    loadIntegrations()
  }, [ministry])

  const loadIntegrations = () => {
    const ministryIntegrations = integrationService.getIntegrations(ministry)
    setIntegrations(ministryIntegrations)
  }

  const handleSync = async (integrationId: string) => {
    setIsLoading(true)
    try {
      const issues = await integrationService.syncWithExternal(integrationId)
      setExternalIssues((prev) => [...prev, ...issues])
      loadIntegrations() // Refresh to show updated sync time
      toast({
        title: "Sync Successful",
        description: `Retrieved ${issues.length} issues from external system`,
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to sync with external system",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async (integrationId: string) => {
    setIsLoading(true)
    try {
      const success = await integrationService.testConnection(integrationId)
      loadIntegrations()
      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success ? "Integration is working properly" : "Unable to connect to external system",
        variant: success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test connection",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: MinistryIntegration["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        )
    }
  }

  const formatLastSync = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ministry Integrations</h2>
          <p className="text-muted-foreground">Connect with external government databases and portals</p>
        </div>
        <Button onClick={loadIntegrations} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList>
          <TabsTrigger value="integrations">Active Integrations</TabsTrigger>
          <TabsTrigger value="external-issues">External Issues</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.endpoint}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Last sync: {formatLastSync(integration.lastSync)}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(integration.id)}
                        disabled={isLoading}
                      >
                        <Plug className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        disabled={isLoading || integration.status === "error"}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(integration)}>
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Configure Integration</DialogTitle>
                            <DialogDescription>Update settings for {integration.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="endpoint">API Endpoint</Label>
                              <Input id="endpoint" value={integration.endpoint} readOnly />
                            </div>
                            <div>
                              <Label htmlFor="api-key">API Key</Label>
                              <Input id="api-key" type="password" placeholder="Enter API key" />
                            </div>
                            <Button className="w-full">Save Configuration</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="external-issues" className="space-y-4">
          {externalIssues.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No External Issues</h3>
                <p className="text-muted-foreground text-center">
                  Sync with external systems to view issues from other government portals
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {externalIssues.map((issue) => (
                <Card key={issue.externalId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <Badge variant={issue.priority === "Urgent" ? "destructive" : "secondary"}>
                        {issue.priority}
                      </Badge>
                    </div>
                    <CardDescription>
                      From {issue.source} • {issue.assignedDepartment}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        External ID: {issue.externalId} • Updated {formatLastSync(issue.lastUpdated)}
                      </div>
                      <Badge variant="outline">{issue.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure ministry-level integration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Auto-sync Interval</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                  <option>Every 4 hours</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>Notify on sync failures</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>Notify on new external issues</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span>Daily sync summary</span>
                  </label>
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
