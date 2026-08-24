import { apiFetch, apiGet, apiPatch, apiPost } from './api'

// ---------------------------------------------------------------------------
// Types — matching backend DTOs + extended project features
// ---------------------------------------------------------------------------

// GET /api/admin/overview → AdminOverviewResponse
export type AdminOverviewResponse = {
  totalClients: number
  activeProjects: number
  totalRevenueCollected: number
  pendingPayments: number
}

export type TimelinePhaseStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export type TimelinePhaseItem = {
  name: string
  status: TimelinePhaseStatus
}

export type PaymentInstallment = {
  id: string
  amount: number | ''
  dueDate: string
  isPaid?: boolean
}

// GET /api/admin/projects → List<AdminProjectListItem>
export type AdminProjectListItem = {
  projectId: number
  clientName: string
  email?: string
  phone?: string
  title: string
  location: string
  builtUpArea?: string
  bedrooms?: string
  durationMonths?: number
  overallProgress: number
  currentStage: string
  stageStartDate?: string      // YYYY-MM-DD
  stageEstCompletion?: string  // YYYY-MM-DD
  nextMilestoneName?: string
  nextMilestoneDate?: string   // YYYY-MM-DD
  totalBudget: number
  paidAmount: number
  status?: 'On Track' | 'Delayed' | 'Completed'
  timeline?: TimelinePhaseItem[]
  payments?: PaymentInstallment[]
}

// PATCH /api/admin/projects/{id} → AdminProjectUpdateRequest
export type TimelinePhaseUpdateRequest = {
  id: number          // phase id from backend (we use index as proxy)
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
  percent: number
}

export type AdminProjectUpdateRequest = {
  clientName?: string
  email?: string
  phone?: string
  title?: string
  location?: string
  builtUpArea?: string
  bedrooms?: string
  durationMonths?: number
  overallProgress?: number
  currentStage?: string
  stageStartDate?: string    // YYYY-MM-DD
  stageEstCompletion?: string
  nextMilestoneName?: string
  nextMilestoneDate?: string
  totalBudget?: number
  paidAmount?: number
  status?: 'On Track' | 'Delayed' | 'Completed'
  timeline?: TimelinePhaseItem[]
  payments?: PaymentInstallment[]
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

export type AdminCreateProjectRequest = {
  clientName: string
  email?: string
  phone?: string
  title: string
  location: string
  builtUpArea?: string
  bedrooms?: string
  durationMonths?: number
  totalBudget: number
  currentStage?: string
  overallProgress?: number
  paidAmount?: number
  stageStartDate?: string
  stageEstCompletion?: string
  nextMilestoneName?: string
  nextMilestoneDate?: string
  status?: 'On Track' | 'Delayed' | 'Completed'
  timeline?: TimelinePhaseItem[]
  payments?: PaymentInstallment[]
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export const adminService = {
  getOverview: () =>
    apiGet<AdminOverviewResponse>('/api/admin/overview'),

  getProjects: () =>
    apiGet<AdminProjectListItem[]>('/api/admin/projects'),

  createProject: (req: AdminCreateProjectRequest) =>
    apiPost<AdminProjectListItem>('/api/admin/projects', req),

  updateProject: (id: number, req: AdminProjectUpdateRequest) =>
    apiPatch<void>(`/api/admin/projects/${id}`, req),

  deleteProject: (id: number) =>
    apiFetch<void>(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  postUpdate: (req: AdminPostUpdateRequest) =>
    apiPost<void>('/api/admin/updates', req),

  sendNotification: (req: AdminNotificationRequest) =>
    apiPost<void>('/api/admin/notifications', req),

  getLeads: (page = 0, size = 50) =>
    apiGet<PageResponse<BackendLead>>(`/api/admin/leads?page=${page}&size=${size}`),

  updateLeadStatus: (id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED') =>
    apiPatch<void>(`/api/admin/leads/${id}/status?status=${status}`),
}


