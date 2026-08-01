import { useCallback, useEffect, useState } from 'react'
import {
  dashboardService,
  type DocumentResponse,
  type NotificationResponse,
  type OverviewResponse,
  type PageResponse,
  type PaymentSummaryResponse,
  type ProjectResponse,
  type TimelinePhaseResponse,
  type UpdateResponse,
} from '../services/dashboardService'

// ---------------------------------------------------------------------------
// Shape of all dashboard data in one place
// ---------------------------------------------------------------------------

export type DashboardData = {
  overview: OverviewResponse | null
  project: ProjectResponse | null
  timeline: TimelinePhaseResponse[]
  updates: UpdateResponse[]
  totalUpdatePages: number
  paymentSummary: PaymentSummaryResponse | null
  notifications: NotificationResponse[]
  documents: DocumentResponse[]
}

const EMPTY: DashboardData = {
  overview: null,
  project: null,
  timeline: [],
  updates: [],
  totalUpdatePages: 0,
  paymentSummary: null,
  notifications: [],
  documents: [],
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Parallel fetch everything
      const [overview, project, timeline, updatesPage, paymentSummary, notifications, documents] =
        await Promise.allSettled([
          dashboardService.getOverview(),
          dashboardService.getProject(),
          dashboardService.getTimeline(),
          dashboardService.getUpdates(0, 10),
          dashboardService.getPaymentSummary(),
          dashboardService.getNotifications(),
          dashboardService.getDocuments(),
        ])

      setData({
        overview:          overview.status          === 'fulfilled' ? overview.value           : null,
        project:           project.status           === 'fulfilled' ? project.value            : null,
        timeline:          timeline.status          === 'fulfilled' ? timeline.value           : [],
        updates:           updatesPage.status       === 'fulfilled' ? (updatesPage.value as PageResponse<UpdateResponse>).content : [],
        totalUpdatePages:  updatesPage.status       === 'fulfilled' ? (updatesPage.value as PageResponse<UpdateResponse>).totalPages : 0,
        paymentSummary:    paymentSummary.status    === 'fulfilled' ? paymentSummary.value     : null,
        notifications:     notifications.status     === 'fulfilled' ? notifications.value      : [],
        documents:         documents.status         === 'fulfilled' ? documents.value          : [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Optimistic notification update (no refetch needed)
  const markNotificationRead = useCallback(async (id: number) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    }))
    try {
      await dashboardService.markNotificationRead(id)
    } catch {
      // Revert optimistic update on failure
      fetchAll()
    }
  }, [fetchAll])

  const markAllNotificationsRead = useCallback(async () => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }))
    try {
      await dashboardService.markAllNotificationsRead()
    } catch {
      fetchAll()
    }
  }, [fetchAll])

  const refreshPayments = useCallback(async () => {
    try {
      const paymentSummary = await dashboardService.getPaymentSummary()
      setData((prev) => ({ ...prev, paymentSummary }))
    } catch {
      // silent
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchAll,
    markNotificationRead,
    markAllNotificationsRead,
    refreshPayments,
  }
}
