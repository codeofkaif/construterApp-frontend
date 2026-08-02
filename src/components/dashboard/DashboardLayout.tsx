import { useCallback, useEffect, useState } from 'react'
import { DashboardProvider } from '../../context/DashboardContext'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
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

export default function DashboardLayout() {
  const { user } = useAuth()
  const { clients, setClients } = useAppData()

  const {
    data: apiData,
    isLoading: isApiLoading,
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
  const [payError, setPayError] = useState<string | null>(null)

  // Find client matching current user email / stable ID
  const currentClient = clients.find(
    (c) => c.email.toLowerCase() === (user?.email || '').toLowerCase()
  ) || clients[0]

  const handleResize = useCallback(() => {
    const mode = getSidebarMode(window.innerWidth)
    setSidebarMode(mode)
    if (mode === 'drawer' || mode === 'icon') {
      setIsDrawerOpen(false)
      setIsCollapsed(true)
    }
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

  const confirmPayment = useCallback(async (amount: number, method: 'UPI' | 'CARD' | 'CASH') => {
    setPayError(null)
    try {
      await dashboardService.pay({ amount, method })
      await refreshPayments()
    } catch (err) {
      setPayError(err instanceof ApiError ? err.message : 'Payment failed. Please try again.')
    }
  }, [refreshPayments])

  const markRead = useCallback((id: string) => {
    if (currentClient) {
      setClients(
        clients.map((c) =>
          c.id === currentClient.id
            ? {
                ...c,
                notifications: c.notifications.map((n) =>
                  n.id === id ? { ...n, isRead: true } : n
                ),
              }
            : c
        )
      )
    }
    markNotificationRead(Number(id) || 1)
  }, [clients, currentClient, setClients, markNotificationRead])

  const markAllRead = useCallback(() => {
    if (currentClient) {
      setClients(
        clients.map((c) =>
          c.id === currentClient.id
            ? {
                ...c,
                notifications: c.notifications.map((n) => ({ ...n, isRead: true })),
              }
            : c
        )
      )
    }
    markAllNotificationsRead()
  }, [clients, currentClient, setClients, markAllNotificationsRead])

  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'client' | 'engineer'; text: string; time: string }[]>([])
  const appendChatMessage = useCallback((text: string) => {
    setChatMessages((msgs) => [
      ...msgs,
      { id: `${Date.now()}`, sender: 'client', text, time: formatTime() },
    ])
  }, [])

  const mappedUser = user
    ? { name: user.name, avatar: '', email: user.email, phone: '' }
    : { name: '', avatar: '', email: '', phone: '' }

  // Preferred reads from shared AppDataContext single source of truth for logged in client
  const clientProject = currentClient?.project

  const mappedProjectData = clientProject ? {
    title: clientProject.title,
    location: clientProject.location,
    progress: clientProject.overallProgress,
    lastUpdated: 'Live',
    thumbnail: '',
    currentStage: {
      name: clientProject.currentStage,
      status: 'In Progress',
      startedOn: 'Ongoing',
      estimatedCompletion: `${clientProject.durationMonths} Months`,
    },
    nextMilestone: {
      name: 'Next Inspection & Milestone',
      expectedOn: 'Upcoming',
    },
  } : {
    title: apiData.project?.title || 'Client Construction Project',
    location: apiData.project?.location || 'Lucknow, UP',
    progress: apiData.overview?.overallProgress || 0,
    lastUpdated: 'Live',
    thumbnail: '',
    currentStage: { name: 'In Progress', status: 'In Progress', startedOn: '—', estimatedCompletion: 'TBD' },
    nextMilestone: { name: 'Milestone Review', expectedOn: 'Upcoming' },
  }

  const mappedTimeline = (clientProject?.timeline && clientProject.timeline.length > 0)
    ? clientProject.timeline.map((p) => ({
        name: p.name,
        status: phaseStatusMap[p.status] ?? 'pending',
        percent: p.status === 'COMPLETED' ? 100 : p.status === 'IN_PROGRESS' ? 50 : 0,
        icon: 'layers' as const,
      }))
    : apiData.timeline.map((p) => ({
        name: p.name,
        status: phaseStatusMap[p.status] ?? 'pending',
        percent: p.percent,
        icon: 'layers' as const,
      }))

  const mappedUpdates = (clientProject?.updates && clientProject.updates.length > 0)
    ? clientProject.updates.map((u) => ({
        id: u.id,
        date: u.date,
        time: u.time || 'Today',
        description: `${u.title}: ${u.description}`,
        thumbnailUrl: u.thumbnailUrl || '',
      }))
    : apiData.updates.map((u, i) => ({
        id: String(i),
        date: new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date(u.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
        description: u.description ?? u.title,
        thumbnailUrl: u.thumbnailUrl ?? '',
      }))

  const totalPaid = clientProject?.payments
    ? clientProject.payments.filter((p) => p.isPaid).reduce((s, p) => s + p.amount, 0)
    : apiData.paymentSummary?.paidAmount || 0

  const totalRemaining = clientProject?.payments
    ? clientProject.totalBudget ? clientProject.totalBudget - totalPaid : 0
    : apiData.paymentSummary?.remainingAmount || 0

  const mappedPaymentData = {
    paid: totalPaid,
    remaining: totalRemaining,
    nextPayment: { amount: 0, dueDate: 'No Pending Dues' },
  }

  const mappedNotifications = (currentClient?.notifications && currentClient.notifications.length > 0)
    ? currentClient.notifications.map((n) => ({
        id: n.id,
        message: n.message,
        timestamp: n.timestamp,
        isRead: n.isRead,
      }))
    : apiData.notifications.map((n) => ({
        id: String(n.id),
        message: n.message,
        timestamp: new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        isRead: n.isRead,
      }))

  const mappedDocuments = apiData.documents.map((d, i) => ({
    id: String(i),
    name: d.fileName,
    size: '',
    fileUrl: d.fileUrl,
  }))

  const contextValue = {
    activeView,
    navigate: handleNavigate,
    paymentData: mappedPaymentData,
    confirmPayment: () => {},
    notifications: mappedNotifications,
    markNotificationRead: (id: string) => markRead(id),
    markAllNotificationsRead: markAllRead,
    chatMessages,
    appendChatMessage,
    isDashboardLoading: isApiLoading && !currentClient,
  }

  const renderView = () => {
    if (isApiLoading && !currentClient) return <DashboardSkeleton />

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardHomeView
            project={mappedProjectData}
            timelinePhases={mappedTimeline}
            updates={mappedUpdates}
            sitePhotos={[]}
            documents={mappedDocuments}
            paymentHistoryEntries={[]}
            chatMessages={chatMessages}
          />
        )
      case 'my-project':
        return <MyProjectView project={mappedProjectData} timelinePhases={mappedTimeline} />
      case 'progress-updates':
        return <ProgressUpdatesView updates={mappedUpdates} />
      case 'payments':
        return (
          <PaymentsView
            paymentData={mappedPaymentData}
            paymentHistoryEntries={[]}
            onConfirmPayment={confirmPayment}
            isLoading={isApiLoading && !currentClient}
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
            onMarkRead={(id) => markRead(id)}
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
