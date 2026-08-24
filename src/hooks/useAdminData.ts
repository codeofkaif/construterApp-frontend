import { useCallback, useEffect, useState } from 'react'
import {
  adminService,
  type AdminCreateProjectRequest,
  type AdminOverviewResponse,
  type AdminProjectListItem,
  type AdminProjectUpdateRequest,
  type BackendLead,
} from '../services/adminService'

export type AdminData = {
  overview: AdminOverviewResponse | null
  projects: AdminProjectListItem[]
  leads: BackendLead[]
}

const DEFAULT_PROJECTS: AdminProjectListItem[] = [
  {
    projectId: 1,
    clientName: 'Adil Khan',
    title: 'Modern Luxury Villa',
    location: 'Lucknow, Uttar Pradesh',
    overallProgress: 45,
    currentStage: 'Brick Work',
    totalBudget: 3800000,
    paidAmount: 500000,
  },
  {
    projectId: 2,
    clientName: 'Rahul Sharma',
    title: 'Contemporary Duplex',
    location: 'Gomti Nagar, Lucknow',
    overallProgress: 60,
    currentStage: 'Roof Slab',
    totalBudget: 5200000,
    paidAmount: 3000000,
  },
  {
    projectId: 3,
    clientName: 'Priya Verma',
    title: 'Heritage Estate Bungalow',
    location: 'Hazratganj, Lucknow',
    overallProgress: 90,
    currentStage: 'Interior Finishing',
    totalBudget: 8500000,
    paidAmount: 6000000,
  },
]

const DEFAULT_OVERVIEW: AdminOverviewResponse = {
  totalClients: 3,
  activeProjects: 3,
  totalRevenueCollected: 9500000,
  pendingPayments: 8000000,
}

const DEFAULT_LEADS: BackendLead[] = [
  {
    id: 1,
    name: 'Rohit Mehta',
    phone: '+91 98765 43210',
    message: 'Interested in 4BHK turnkey construction in Gomti Nagar. Need site visit and cost estimation.',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'NEW',
  },
  {
    id: 2,
    name: 'Ananya Singh',
    phone: '+91 91234 56789',
    message: 'Looking for interior design & civil renovation for residential bungalow in Hazratganj.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    status: 'CONTACTED',
  },
]

const LS_PROJECTS_KEY = 'admin_projects_cache'
const LS_OVERVIEW_KEY = 'admin_overview_cache'
const LS_LEADS_KEY = 'admin_leads_cache'

function readProjectsCache(): AdminProjectListItem[] {
  try {
    const s = localStorage.getItem(LS_PROJECTS_KEY)
    return s ? JSON.parse(s) : DEFAULT_PROJECTS
  } catch {
    return DEFAULT_PROJECTS
  }
}

function writeProjectsCache(data: AdminProjectListItem[]) {
  try {
    localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(data))
  } catch {}
}

function readOverviewCache(): AdminOverviewResponse {
  try {
    const s = localStorage.getItem(LS_OVERVIEW_KEY)
    return s ? JSON.parse(s) : DEFAULT_OVERVIEW
  } catch {
    return DEFAULT_OVERVIEW
  }
}

function writeOverviewCache(data: AdminOverviewResponse) {
  try {
    localStorage.setItem(LS_OVERVIEW_KEY, JSON.stringify(data))
  } catch {}
}

function readLeadsCache(): BackendLead[] {
  try {
    const s = localStorage.getItem(LS_LEADS_KEY)
    return s ? JSON.parse(s) : DEFAULT_LEADS
  } catch {
    return DEFAULT_LEADS
  }
}

function writeLeadsCache(data: BackendLead[]) {
  try {
    localStorage.setItem(LS_LEADS_KEY, JSON.stringify(data))
  } catch {}
}

export function useAdminData() {
  const [data, setData] = useState<AdminData>(() => ({
    overview: readOverviewCache(),
    projects: readProjectsCache(),
    leads: readLeadsCache(),
  }))
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [overview, projects, leadsPage] = await Promise.allSettled([
        adminService.getOverview(),
        adminService.getProjects(),
        adminService.getLeads(),
      ])

      const isLiveSuccess = projects.status === 'fulfilled' || overview.status === 'fulfilled'
      setIsOffline(!isLiveSuccess)

      setData((prev) => {
        const nextProjects =
          projects.status === 'fulfilled' && Array.isArray(projects.value) && projects.value.length > 0
            ? projects.value
            : prev.projects.length > 0
              ? prev.projects
              : DEFAULT_PROJECTS

        const nextOverview =
          overview.status === 'fulfilled' && overview.value
            ? overview.value
            : prev.overview ?? {
                totalClients: nextProjects.length,
                activeProjects: nextProjects.filter((p) => p.overallProgress < 100).length,
                totalRevenueCollected: nextProjects.reduce((s, p) => s + (p.paidAmount || 0), 0),
                pendingPayments: nextProjects.reduce((s, p) => s + Math.max(0, p.totalBudget - p.paidAmount), 0),
              }

        const nextLeads =
          leadsPage.status === 'fulfilled' && leadsPage.value?.content && leadsPage.value.content.length > 0
            ? leadsPage.value.content
            : prev.leads.length > 0
              ? prev.leads
              : DEFAULT_LEADS

        // Persist to cache
        writeProjectsCache(nextProjects)
        writeOverviewCache(nextOverview)
        writeLeadsCache(nextLeads)

        return {
          overview: nextOverview,
          projects: nextProjects,
          leads: nextLeads,
        }
      })
    } catch (err) {
      setIsOffline(true)
      setError(err instanceof Error ? err.message : 'Backend connection unavailable.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const refreshProjects = useCallback(async () => {
    try {
      const projects = await adminService.getProjects()
      if (Array.isArray(projects) && projects.length > 0) {
        setData((prev) => {
          writeProjectsCache(projects)
          return { ...prev, projects }
        })
        setIsOffline(false)
      }
    } catch {
      setIsOffline(true)
    }
  }, [])

  const addProject = useCallback(async (req: AdminCreateProjectRequest): Promise<AdminProjectListItem> => {
    const tempId = Date.now()
    const newProject: AdminProjectListItem = {
      projectId: tempId,
      clientName: req.clientName,
      title: req.title,
      location: req.location,
      overallProgress: req.overallProgress ?? 0,
      currentStage: req.currentStage ?? 'Planning & Approval',
      totalBudget: req.totalBudget,
      paidAmount: req.paidAmount ?? 0,
    }

    setData((prev) => {
      const updated = [newProject, ...prev.projects]
      writeProjectsCache(updated)
      const updatedOverview: AdminOverviewResponse = {
        totalClients: updated.length,
        activeProjects: updated.filter((p) => p.overallProgress < 100).length,
        totalRevenueCollected: updated.reduce((s, p) => s + (p.paidAmount || 0), 0),
        pendingPayments: updated.reduce((s, p) => s + Math.max(0, p.totalBudget - p.paidAmount), 0),
      }
      writeOverviewCache(updatedOverview)
      return {
        ...prev,
        projects: updated,
        overview: updatedOverview,
      }
    })

    try {
      const created = await adminService.createProject(req)
      if (created && created.projectId) {
        setData((prev) => {
          const finalProjects = prev.projects.map((p) => (p.projectId === tempId ? created : p))
          writeProjectsCache(finalProjects)
          return { ...prev, projects: finalProjects }
        })
        return created
      }
    } catch {
      // Keep optimistic local project
    }
    return newProject
  }, [])

  const updateProject = useCallback(async (id: number, req: AdminProjectUpdateRequest) => {
    setData((prev) => {
      const updated = prev.projects.map((p) => {
        if (p.projectId === id) {
          return {
            ...p,
            overallProgress: req.overallProgress !== undefined ? req.overallProgress : p.overallProgress,
            totalBudget: req.totalBudget !== undefined ? req.totalBudget : p.totalBudget,
            currentStage: req.currentStage !== undefined ? req.currentStage : p.currentStage,
          }
        }
        return p
      })
      writeProjectsCache(updated)
      const updatedOverview: AdminOverviewResponse = {
        totalClients: updated.length,
        activeProjects: updated.filter((p) => p.overallProgress < 100).length,
        totalRevenueCollected: updated.reduce((s, p) => s + (p.paidAmount || 0), 0),
        pendingPayments: updated.reduce((s, p) => s + Math.max(0, p.totalBudget - p.paidAmount), 0),
      }
      writeOverviewCache(updatedOverview)
      return { ...prev, projects: updated, overview: updatedOverview }
    })

    try {
      await adminService.updateProject(id, req)
    } catch {
      // Keep optimistic local update
    }
  }, [])

  const refreshLeads = useCallback(async () => {
    try {
      const page = await adminService.getLeads()
      if (page?.content) {
        setData((prev) => {
          writeLeadsCache(page.content)
          return { ...prev, leads: page.content }
        })
      }
    } catch { /* silent */ }
  }, [])

  const refreshOverview = useCallback(async () => {
    try {
      const overview = await adminService.getOverview()
      if (overview) {
        setData((prev) => {
          writeOverviewCache(overview)
          return { ...prev, overview }
        })
      }
    } catch { /* silent */ }
  }, [])

  return {
    data,
    isLoading,
    isOffline,
    error,
    refetch: fetchAll,
    addProject,
    updateProject,
    refreshLeads,
    refreshProjects,
    refreshOverview,
  }
}

