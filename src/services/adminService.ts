import { apiGet, apiPatch, apiPost } from './api'

// ---------------------------------------------------------------------------
// Types — matching backend DTOs exactly
// ---------------------------------------------------------------------------

// GET /api/admin/overview → AdminOverviewResponse
export type AdminOverviewResponse = {
  totalClients: number
  activeProjects: number
  totalRevenueCollected: number
  pendingPayments: number
}

// GET /api/admin/projects → List<AdminProjectListItem>
export type AdminProjectListItem = {
  projectId: number
  clientName: string
  title: string
  location: string
  overallProgress: number
  currentStage: string
  totalBudget: number
  paidAmount: number
}

// PATCH /api/admin/projects/{id} → AdminProjectUpdateRequest
export type TimelinePhaseUpdateRequest = {
  id: number          // phase id from backend (we use index as proxy)
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
  percent: number
}

export type AdminProjectUpdateRequest = {
  overallProgress?: number
  currentStage?: string
  stageStartDate?: string    // YYYY-MM-DD
  stageEstCompletion?: string
  nextMilestoneName?: string
  nextMilestoneDate?: string
  totalBudget?: number
  phases?: TimelinePhaseUpdateRequest[]
}

// POST /api/admin/updates → AdminPostUpdateRequest
export type AdminPostUpdateRequest = {
  projectId: number
  title: string
  description: string
  thumbnailUrl?: string
}

// POST /api/admin/notifications → AdminNotificationRequest
export type AdminNotificationRequest = {
  clientId: number | null      // null when broadcastToAll = true
  broadcastToAll: boolean
  message: string
}

// GET /api/admin/leads → Page<ConsultationLead>
export type BackendLead = {
  id: number
  name: string
  phone: string
  message: string
  createdAt: string   // ISO datetime
  status: 'NEW' | 'CONTACTED' | 'CLOSED'
}

export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export const adminService = {
  getOverview: () =>
    apiGet<AdminOverviewResponse>('/api/admin/overview'),

  getProjects: () =>
    apiGet<AdminProjectListItem[]>('/api/admin/projects'),

  updateProject: (id: number, req: AdminProjectUpdateRequest) =>
    apiPatch<void>(`/api/admin/projects/${id}`, req),

  postUpdate: (req: AdminPostUpdateRequest) =>
    apiPost<void>('/api/admin/updates', req),

  sendNotification: (req: AdminNotificationRequest) =>
    apiPost<void>('/api/admin/notifications', req),

  getLeads: (page = 0, size = 50) =>
    apiGet<PageResponse<BackendLead>>(`/api/admin/leads?page=${page}&size=${size}`),

  updateLeadStatus: (id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED') =>
    apiPatch<void>(`/api/admin/leads/${id}/status?status=${status}`),
}
