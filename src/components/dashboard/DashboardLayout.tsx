import { useCallback, useEffect, useState } from 'react'
import { DashboardProvider } from '../../context/DashboardContext'
import { useAuth } from '../../context/AuthContext'
import { type DashboardViewId } from '../../data/dashboardNav'
import { useDashboardData } from '../../hooks/useDashboardData'
import { dashboardService } from '../../services/dashboardService'
import { ApiError } from '../../services/api'
import DashboardHomeView from './DashboardHomeView'
import DashboardSidebar from './DashboardSidebar'
import DashboardSkeleton from './DashboardSkeleton'
import DashboardTopBar from './DashboardTopBar'
import DocumentsView from './DocumentsView'
import LogoutView from './LogoutView'
import MessagesView from './MessagesView'
import MyProjectView from './MyProjectView'
import NotificationsView from './NotificationsView'
import PaymentsView from './PaymentsView'
import ProfileView from './ProfileView'
import ProgressUpdatesView from './ProgressUpdatesView'

// ---------------------------------------------------------------------------
// Types used internally — mapped from API responses
// ---------------------------------------------------------------------------

type TimelinePhaseStatus = 'completed' | 'in-progress' | 'pending'

const phaseStatusMap: Record<string, TimelinePhaseStatus> = {
  COMPLETED:   'completed',
  IN_PROGRESS: 'in-progress',
  PENDING:     'pending',
}

function getSidebarMode(width: number) {
  if (width < 640) return 'drawer' as const
  if (width < 1024) return 'icon' as const
  return 'full' as const
}

function formatTime() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ---------------------------------------------------------------------------
// DashboardLayout
// ---------------------------------------------------------------------------

export default function DashboardLayout() {
  const { user } = useAuth()

  const {
    data,
    isLoading,
    error: dataError,
    markNotificationRead,
    markAllNotificationsRead,
    refreshPayments,
  } = useDashboardData()

  const [activeView, setActiveView] = useState<DashboardViewId>('dashboard')
  const [sidebarMode, setSidebarMode] = useState<'drawer' | 'icon' | 'full'>(() =>
    getSidebarMode(typeof window !== 'undefined' ? window.innerWidth : 1024),
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCollapsed, setIsCollapsed]   = useState(false)

  // Payment state — updated after API pay call
  const [payError, setPayError] = useState<string | null>(null)

  const handleResize = useCallback(() => {
    const mode = getSidebarMode(window.innerWidth)
    setSidebarMode(mode)
    if (mode === 'drawer') { setIsDrawerOpen(false); setIsCollapsed(true) }
    else if (mode === 'icon') { setIsDrawerOpen(false); setIsCollapsed(true) }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const handleNavigate = useCallback((viewId: DashboardViewId) => {
    setActiveView(viewId)
    if (sidebarMode === 'drawer') setIsDrawerOpen(false)
  }, [sidebarMode])

  // Pay Now — calls real API
  const confirmPayment = useCallback(async (amount: number, method: 'UPI' | 'CARD' | 'CASH') => {
    setPayError(null)
    try {
      await dashboardService.pay({ amount, method })
      await refreshPayments()
    } catch (err) {
      setPayError(err instanceof ApiError ? err.message : 'Payment failed. Please try again.')
    }
  }, [refreshPayments])

  // Notifications — optimistic via hook
  const markRead = useCallback((id: number) => {
    markNotificationRead(id)
  }, [markNotificationRead])

  const markAllRead = useCallback(() => {
    markAllNotificationsRead()
  }, [markAllNotificationsRead])

  // Chat — no backend API, local only
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'client' | 'engineer'; text: string; time: string }[]>([])
  const appendChatMessage = useCallback((text: string) => {
    setChatMessages((msgs) => [
      ...msgs,
      { id: `${Date.now()}`, sender: 'client', text, time: formatTime() },
    ])
  }, [])

  // ---------------------------------------------------------------------------
  // Map API data → component-expected shapes
  // ---------------------------------------------------------------------------

  const mappedUser = user
    ? { name: user.name, avatar: '', email: user.email, phone: '' }
    : { name: '', avatar: '', email: '', phone: '' }

  const mappedTimeline = data.timeline.map((p) => ({
    name: p.name,
    status: phaseStatusMap[p.status] ?? 'pending' as TimelinePhaseStatus,
    percent: p.percent,
    icon: 'layers' as const,  // API doesn't return icons; default all to 'layers' (cosmetic only)
  }))

  const mappedUpdates = data.updates.map((u, i) => ({
    id: String(i),
    date: new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date(u.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
    description: u.description ?? u.title,
    thumbnailUrl: u.thumbnailUrl ?? '',
  }))

  const mappedProjectData = data.overview && data.project ? {
    title: data.project.title,
    location: data.project.location,
    progress: data.overview.overallProgress,
    lastUpdated: 'Live',
    thumbnail: '',
    currentStage: {
      name: data.overview.currentStage,
      status: 'In Progress',
      startedOn: data.overview.stageStartDate,
      estimatedCompletion: data.overview.stageEstCompletion,
    },
    nextMilestone: {
      name: data.overview.nextMilestoneName,
      expectedOn: data.overview.nextMilestoneDate,
    },
  } : null

  const mappedPaymentData = data.paymentSummary ? {
    paid: data.paymentSummary.paidAmount,
    remaining: data.paymentSummary.remainingAmount,
    nextPayment: { amount: 0, dueDate: '—' },  // No next-payment endpoint; show summary only
  } : { paid: 0, remaining: 0, nextPayment: { amount: 0, dueDate: '—' } }

  const mappedNotifications = data.notifications.map((n) => ({
    id: String(n.id),
    message: n.message,
    timestamp: new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    isRead: n.isRead,
  }))

  const mappedDocuments = data.documents.map((d, i) => ({
    id: String(i),
    name: d.fileName,
    size: '',
    fileUrl: d.fileUrl,
  }))

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------

  const contextValue = {
    activeView,
    navigate: handleNavigate,
    paymentData: mappedPaymentData,
    confirmPayment: () => {},  // handled at view level now
    notifications: mappedNotifications,
    markNotificationRead: (id: string) => markRead(Number(id)),
    markAllNotificationsRead: markAllRead,
    chatMessages,
    appendChatMessage,
    isDashboardLoading: isLoading,
  }

  // ---------------------------------------------------------------------------
  // Render current view
  // ---------------------------------------------------------------------------

  const renderView = () => {
    if (isLoading) return <DashboardSkeleton />

    if (dataError) {
      return (
        <div className="flex min-h-[400px] items-center justify-center text-center">
          <div>
            <p className="text-lg font-semibold text-brand-dark">Unable to load data</p>
            <p className="mt-1 text-sm text-gray-500">{dataError}</p>
          </div>
        </div>
      )
    }

    switch (activeView) {
      case 'dashboard':
        return mappedProjectData ? (
          <DashboardHomeView
            project={mappedProjectData}
            timelinePhases={mappedTimeline}
            updates={mappedUpdates}
            sitePhotos={[]}
            documents={mappedDocuments}
            paymentHistoryEntries={[]}
            chatMessages={chatMessages}
          />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-gray-400">No project assigned yet.</p>
          </div>
        )
      case 'my-project':
        return mappedProjectData ? (
          <MyProjectView project={mappedProjectData} timelinePhases={mappedTimeline} />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-gray-400">No project data available.</p>
          </div>
        )
      case 'progress-updates':
        return <ProgressUpdatesView updates={mappedUpdates} />
      case 'payments':
        return (
          <PaymentsView
            paymentData={mappedPaymentData}
            paymentHistoryEntries={[]}
            onConfirmPayment={confirmPayment}
            isLoading={isLoading}
            payError={payError}
          />
        )
      case 'documents':
        return <DocumentsView documents={mappedDocuments} />
      case 'messages':
        return <MessagesView messages={chatMessages} onSendMessage={appendChatMessage} />
      case 'notifications':
        return (
          <NotificationsView
            notifications={mappedNotifications}
            onMarkRead={(id) => markRead(Number(id))}
            onMarkAllRead={markAllRead}
          />
        )
      case 'profile':
        return <ProfileView user={mappedUser} />
      case 'logout':
        return <LogoutView />
      default:
        return null
    }
  }

  const mainOffsetClass =
    sidebarMode === 'drawer'
      ? 'ml-0'
      : isCollapsed || sidebarMode === 'icon'
        ? 'ml-16'
        : 'ml-[260px]'

  return (
    <DashboardProvider value={contextValue}>
      <div className="min-h-screen bg-brand-cream">
        {sidebarMode === 'drawer' && isDrawerOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-brand-dark/50 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close navigation menu"
          />
        )}

        <DashboardSidebar
          activeView={activeView}
          sidebarMode={sidebarMode}
          isDrawerOpen={isDrawerOpen}
          isCollapsed={isCollapsed || sidebarMode === 'icon'}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          onNavigate={handleNavigate}
          onCloseDrawer={() => setIsDrawerOpen(false)}
        />

        <div className={`flex min-h-screen flex-col transition-all duration-300 ${mainOffsetClass}`}>
          <DashboardTopBar
            user={mappedUser}
            showMenuButton={sidebarMode === 'drawer'}
            onOpenMenu={() => setIsDrawerOpen(true)}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {renderView()}
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}
