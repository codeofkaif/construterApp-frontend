import { apiGet, apiPatch, apiPost } from './api'

// ---------------------------------------------------------------------------
// Types — matching backend DTOs exactly
// ---------------------------------------------------------------------------

// GET /api/dashboard/overview → OverviewResponse
export type OverviewResponse = {
  overallProgress: number
  currentStage: string
  stageStartDate: string      // ISO date: "2025-05-12"
  stageEstCompletion: string  // ISO date
  nextMilestoneName: string
  nextMilestoneDate: string   // ISO date
}

// GET /api/dashboard/project → ProjectResponse
export type ProjectResponse = {
  title: string
  location: string
  builtUpAreaSqft: number
  bedrooms: number
  durationMonths: number
  totalBudget: number
}

// GET /api/dashboard/timeline → List<TimelinePhaseResponse>
export type TimelinePhaseResponse = {
  name: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
  percent: number
}

// GET /api/dashboard/updates → Page<UpdateResponse>
export type UpdateResponse = {
  title: string
  description: string
  thumbnailUrl: string
  createdAt: string  // ISO datetime
}

export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// GET /api/dashboard/payments → PaymentSummaryResponse
export type PaymentSummaryResponse = {
  totalBudget: number
  paidAmount: number
  remainingAmount: number
}

// POST /api/dashboard/payments/pay → PaymentSummaryResponse
export type PayRequest = {
  amount: number
  method: 'UPI' | 'CARD' | 'CASH'
}

// GET /api/dashboard/notifications → List<NotificationResponse>
export type NotificationResponse = {
  id: number
  message: string
  isRead: boolean
  createdAt: string  // ISO datetime
}

// GET /api/dashboard/documents → List<DocumentResponse>
export type DocumentResponse = {
  fileName: string
  fileUrl: string
  uploadedAt: string  // ISO datetime
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export const dashboardService = {
  getOverview: () =>
    apiGet<OverviewResponse>('/api/dashboard/overview'),

  getProject: () =>
    apiGet<ProjectResponse>('/api/dashboard/project'),

  getTimeline: () =>
    apiGet<TimelinePhaseResponse[]>('/api/dashboard/timeline'),

  getUpdates: (page = 0, size = 10) =>
    apiGet<PageResponse<UpdateResponse>>(`/api/dashboard/updates?page=${page}&size=${size}`),

  getPaymentSummary: () =>
    apiGet<PaymentSummaryResponse>('/api/dashboard/payments'),

  pay: (req: PayRequest) =>
    apiPost<PaymentSummaryResponse>('/api/dashboard/payments/pay', req),

  getNotifications: () =>
    apiGet<NotificationResponse[]>('/api/dashboard/notifications'),

  markNotificationRead: (id: number) =>
    apiPatch<void>(`/api/dashboard/notifications/${id}/read`),

  markAllNotificationsRead: () =>
    apiPatch<void>('/api/dashboard/notifications/read-all'),

  getDocuments: () =>
    apiGet<DocumentResponse[]>('/api/dashboard/documents'),
}
