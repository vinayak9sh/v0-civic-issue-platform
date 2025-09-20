// Ministry Integration Service for connecting with external government databases
export interface MinistryIntegration {
  id: string
  name: string
  ministry: string
  endpoint: string
  status: "connected" | "disconnected" | "error"
  lastSync: Date
  apiKey?: string
}

export interface ExternalIssue {
  externalId: string
  source: string
  title: string
  status: string
  priority: string
  assignedDepartment: string
  lastUpdated: Date
}

export class MinistryIntegrationService {
  private static instance: MinistryIntegrationService
  private integrations: MinistryIntegration[] = []

  static getInstance(): MinistryIntegrationService {
    if (!MinistryIntegrationService.instance) {
      MinistryIntegrationService.instance = new MinistryIntegrationService()
    }
    return MinistryIntegrationService.instance
  }

  constructor() {
    // Initialize with mock integrations
    this.integrations = [
      {
        id: "urban-portal",
        name: "Urban Development Portal",
        ministry: "urban_dev",
        endpoint: "https://urban.jharkhand.gov.in/api",
        status: "connected",
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "transport-mgmt",
        name: "Transport Management System",
        ministry: "transport",
        endpoint: "https://transport.jharkhand.gov.in/api",
        status: "connected",
        lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: "water-board",
        name: "Water Resources Board",
        ministry: "water",
        endpoint: "https://water.jharkhand.gov.in/api",
        status: "error",
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      },
      {
        id: "env-clearance",
        name: "Environment Clearance Portal",
        ministry: "environment",
        endpoint: "https://environment.jharkhand.gov.in/api",
        status: "disconnected",
        lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        id: "rural-dev",
        name: "Rural Development Database",
        ministry: "rural_dev",
        endpoint: "https://rural.jharkhand.gov.in/api",
        status: "connected",
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    ]
  }

  getIntegrations(ministry?: string): MinistryIntegration[] {
    if (ministry) {
      return this.integrations.filter((integration) => integration.ministry === ministry)
    }
    return this.integrations
  }

  async syncWithExternal(integrationId: string): Promise<ExternalIssue[]> {
    const integration = this.integrations.find((i) => i.id === integrationId)
    if (!integration) {
      throw new Error("Integration not found")
    }

    // Mock API call - in production, this would make actual HTTP requests
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay

    // Update last sync time
    integration.lastSync = new Date()
    integration.status = "connected"

    // Return mock external issues
    const mockExternalIssues: ExternalIssue[] = [
      {
        externalId: "EXT-001",
        source: integration.name,
        title: "Road maintenance required on NH-33",
        status: "In Progress",
        priority: "High",
        assignedDepartment: "Public Works",
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        externalId: "EXT-002",
        source: integration.name,
        title: "Water supply disruption in Sector 5",
        status: "Pending",
        priority: "Urgent",
        assignedDepartment: "Water Supply",
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ]

    return mockExternalIssues
  }

  async testConnection(integrationId: string): Promise<boolean> {
    const integration = this.integrations.find((i) => i.id === integrationId)
    if (!integration) {
      return false
    }

    // Mock connection test
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Randomly succeed or fail for demo purposes
    const success = Math.random() > 0.3
    integration.status = success ? "connected" : "error"

    return success
  }

  async updateIntegration(integrationId: string, updates: Partial<MinistryIntegration>): Promise<void> {
    const index = this.integrations.findIndex((i) => i.id === integrationId)
    if (index !== -1) {
      this.integrations[index] = { ...this.integrations[index], ...updates }
    }
  }
}
