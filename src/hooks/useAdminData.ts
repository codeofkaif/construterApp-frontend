import { useCallback, useEffect, useState } from 'react'
import {
  adminService,
  type AdminCreateProjectRequest,
  type AdminOverviewResponse,
  type AdminProjectListItem,
  type AdminProjectUpdateRequest,
  type BackendLead,
  type TimelinePhaseItem,
} from '../services/adminService'

export type AdminData = {
  overview: AdminOverviewResponse | null
  projects: AdminProjectListItem[]
  leads: BackendLead[]
}

const DEFAULT_TIMELINE_PHASES: TimelinePhaseItem[] = [
  { name: 'Foundation', status: 'PENDING' },
  { name: 'Plinth', status: 'PENDING' },
  { name: 'Brick Work', status: 'PENDING' },
  { name: 'Roof', status: 'PENDING' },
  { name: 'Plaster', status: 'PENDING' },
  { name: 'Finishing', status: 'PENDING' },
]

const DEFAULT_PROJECTS: AdminProjectListItem[] = [
  {
    projectId: 1,
    clientName: 'Adil Khan',
    email: 'adil@example.com',
    phone: '+91 98765 43210',
    title: 'Modern Luxury Villa',
    location: 'Lucknow, Uttar Pradesh',
    builtUpArea: '2500 Sqft',
    bedrooms: '5 BHK',
    durationMonths: 10,
    overallProgress: 45,
    currentStage: 'Brick Work',
    stageStartDate: '2026-02-01',
    stageEstCompletion: '2026-04-15',
    nextMilestoneName: 'Ground Floor Brick Work',
    nextMilestoneDate: '2026-03-10',
    totalBudget: 3800000,
    paidAmount: 500000,
    status: 'On Track',
    timeline: [
      { name: 'Foundation', status: 'COMPLETED' },
      { name: 'Plinth', status: 'COMPLETED' },
      { name: 'Brick Work', status: 'IN_PROGRESS' },
      { name: 'Roof', status: 'PENDING' },
      { name: 'Plaster', status: 'PENDING' },
      { name: 'Finishing', status: 'PENDING' },
    ],
    payments: [
      { id: 'p1', amount: 500000, dueDate: '2026-01-15', isPaid: true },
      { id: 'p2', amount: 1000000, dueDate: '2026-03-01', isPaid: false },
      { id: 'p3', amount: 2300000, dueDate: '2026-06-01', isPaid: false },
    ],
  },
  {
    projectId: 2,
    clientName: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 91234 56780',
    title: 'Contemporary Duplex',
    location: 'Gomti Nagar, Lucknow',
    builtUpArea: '3200 Sqft',
    bedrooms: '4 BHK',
    durationMonths: 12,
    overallProgress: 60,
    currentStage: 'Roof Slab',
    stageStartDate: '2026-01-10',
    stageEstCompletion: '2026-05-20',
    nextMilestoneName: 'First Floor Roof Casting',
    nextMilestoneDate: '2026-03-25',
    totalBudget: 5200000,
    paidAmount: 3000000,
    status: 'On Track',
    timeline: [
      { name: 'Foundation', status: 'COMPLETED' },
      { name: 'Plinth', status: 'COMPLETED' },
      { name: 'Brick Work', status: 'COMPLETED' },
      { name: 'Roof', status: 'IN_PROGRESS' },
      { name: 'Plaster', status: 'PENDING' },
      { name: 'Finishing', status: 'PENDING' },
    ],
    payments: [
      { id: 'p1', amount: 1500000, dueDate: '2026-01-10', isPaid: true },
      { id: 'p2', amount: 1500000, dueDate: '2026-02-20', isPaid: true },
      { id: 'p3', amount: 2200000, dueDate: '2026-05-15', isPaid: false },
    ],
  },
  {
    projectId: 3,
    clientName: 'Priya Verma',
    email: 'priya@example.com',
    phone: '+91 99887 76655',
    title: 'Heritage Estate Bungalow',
    location: 'Hazratganj, Lucknow',
    builtUpArea: '4500 Sqft',
    bedrooms: '6 BHK',
    durationMonths: 16,
    overallProgress: 90,
    currentStage: 'Interior Finishing',
    stageStartDate: '2025-08-01',
    stageEstCompletion: '2026-03-31',
    nextMilestoneName: 'Final Woodwork & Fixture Handover',
    nextMilestoneDate: '2026-03-15',
    totalBudget: 8500000,
    paidAmount: 6000000,
    status: 'On Track',
    timeline: [
      { name: 'Foundation', status: 'COMPLETED' },
      { name: 'Plinth', status: 'COMPLETED' },
      { name: 'Brick Work', status: 'COMPLETED' },
      { name: 'Roof', status: 'COMPLETED' },
      { name: 'Plaster', status: 'COMPLETED' },
      { name: 'Finishing', status: 'IN_PROGRESS' },
    ],
    payments: [
      { id: 'p1', amount: 3000000, dueDate: '2025-10-01', isPaid: true },
      { id: 'p2', amount: 3000000, dueDate: '2026-01-15', isPaid: true },
      { id: 'p3', amount: 2500000, dueDate: '2026-04-01', isPaid: false },
    ],
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
    if (!s) return DEFAULT_PROJECTS
    const parsed = JSON.parse(s)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROJECTS
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
      email: req.email,
      phone: req.phone,
      title: req.title,
      location: req.location,
      builtUpArea: req.builtUpArea,
      bedrooms: req.bedrooms,
      durationMonths: req.durationMonths ?? 10,
      overallProgress: req.overallProgress ?? 0,
      currentStage: req.currentStage ?? 'Planning & Approval',
      stageStartDate: req.stageStartDate,
      stageEstCompletion: req.stageEstCompletion,
      nextMilestoneName: req.nextMilestoneName,
      nextMilestoneDate: req.nextMilestoneDate,
      totalBudget: req.totalBudget,
      paidAmount: req.paidAmount ?? 0,
      status: req.status ?? 'On Track',
      timeline: req.timeline ?? DEFAULT_TIMELINE_PHASES,
      payments: req.payments ?? [],
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
            clientName: req.clientName !== undefined ? req.clientName : p.clientName,
            email: req.email !== undefined ? req.email : p.email,
            phone: req.phone !== undefined ? req.phone : p.phone,
            title: req.title !== undefined ? req.title : p.title,
            location: req.location !== undefined ? req.location : p.location,
            builtUpArea: req.builtUpArea !== undefined ? req.builtUpArea : p.builtUpArea,
            bedrooms: req.bedrooms !== undefined ? req.bedrooms : p.bedrooms,
            durationMonths: req.durationMonths !== undefined ? req.durationMonths : p.durationMonths,
            overallProgress: req.overallProgress !== undefined ? req.overallProgress : p.overallProgress,
            currentStage: req.currentStage !== undefined ? req.currentStage : p.currentStage,
            stageStartDate: req.stageStartDate !== undefined ? req.stageStartDate : p.stageStartDate,
            stageEstCompletion: req.stageEstCompletion !== undefined ? req.stageEstCompletion : p.stageEstCompletion,
            nextMilestoneName: req.nextMilestoneName !== undefined ? req.nextMilestoneName : p.nextMilestoneName,
            nextMilestoneDate: req.nextMilestoneDate !== undefined ? req.nextMilestoneDate : p.nextMilestoneDate,
            totalBudget: req.totalBudget !== undefined ? req.totalBudget : p.totalBudget,
            paidAmount: req.paidAmount !== undefined ? req.paidAmount : p.paidAmount,
            status: req.status !== undefined ? req.status : p.status,
            timeline: req.timeline !== undefined ? req.timeline : p.timeline,
            payments: req.payments !== undefined ? req.payments : p.payments,
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

  const deleteProject = useCallback(async (id: number) => {
    setData((prev) => {
      const updated = prev.projects.filter((p) => p.projectId !== id)
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
      await adminService.deleteProject(id)
    } catch {
      // Keep optimistic delete
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
    deleteProject,
    refreshLeads,
    refreshProjects,
    refreshOverview,
  }
}


