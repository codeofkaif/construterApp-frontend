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

  const DEFAULT_PROJECT = {
    title: 'Adil Construction Luxury Residence Project',
    location: 'Lucknow, Uttar Pradesh',
    progress: 15,
    lastUpdated: 'Today',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    currentStage: {
      name: 'Architectural Planning & Soil Testing',
      status: 'In Progress',
      startedOn: 'This Week',
      estimatedCompletion: 'Next Month',
    },
    nextMilestone: {
      name: 'Foundation Laying & Column Excavation',
      expectedOn: 'In 2 Weeks',
    },
  }

  const DEFAULT_TIMELINE = [
    { name: '1. Architecture & Site Blueprint', status: 'in-progress' as const, percent: 65, icon: 'layers' as const },
    { name: '2. Foundation & Substructure', status: 'pending' as const, percent: 0, icon: 'square' as const },
    { name: '3. RCC Frame & Brick Masonry', status: 'pending' as const, percent: 0, icon: 'brick-wall' as const },
    { name: '4. Electrical & Plumbing Lines', status: 'pending' as const, percent: 0, icon: 'home' as const },
    { name: '5. Interior Fitting & Handover', status: 'pending' as const, percent: 0, icon: 'sparkles' as const },
  ]

  const DEFAULT_UPDATES = [
    {
      id: 'update-1',
      date: 'Today',
      time: '11:30 AM',
      description: '🏗️ Welcome to Adil Constructions Client Portal! Your project space is active. Architectural blueprints, daily site photos, and structural reports will be logged here.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'update-2',
      date: 'Yesterday',
      time: '04:15 PM',
      description: '📐 Initial site survey completed. Geotechnical soil sampling approved by senior site engineer.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    },
  ]

  const DEFAULT_PHOTOS = [
    { url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80', alt: 'Site Excavation & Survey' },
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Foundation Soil Testing' },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Architectural Render' },
  ]

  const DEFAULT_DOCUMENTS = [
    { id: 'doc-1', name: 'Project_Agreement_Contract.pdf', size: '2.4 MB', fileUrl: '#' },
    { id: 'doc-2', name: 'Architectural_Blueprint_Plan.pdf', size: '5.1 MB', fileUrl: '#' },
    { id: 'doc-3', name: 'Soil_Testing_Engineering_Report.pdf', size: '1.8 MB', fileUrl: '#' },
  ]

  const mappedTimeline = data.timeline.length > 0 ? data.timeline.map((p) => ({
    name: p.name,
    status: phaseStatusMap[p.status] ?? 'pending' as TimelinePhaseStatus,
    percent: p.percent,
    icon: 'layers' as const,
  })) : DEFAULT_TIMELINE

  const mappedUpdates = data.updates.length > 0 ? data.updates.map((u, i) => ({
    id: String(i),
    date: new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date(u.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
    description: u.description ?? u.title,
    thumbnailUrl: u.thumbnailUrl ?? 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
  })) : DEFAULT_UPDATES

  const mappedProjectData = (data.overview && data.project) ? {
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
  } : DEFAULT_PROJECT

  const mappedPaymentData = data.paymentSummary ? {
    paid: data.paymentSummary.paidAmount,
    remaining: data.paymentSummary.remainingAmount,
    nextPayment: { amount: 500000, dueDate: 'In 15 Days' },
  } : { paid: 0, remaining: 3500000, nextPayment: { amount: 500000, dueDate: 'In 15 Days' } }

  const mappedNotifications = data.notifications.map((n) => ({
    id: String(n.id),
    message: n.message,
    timestamp: new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    isRead: n.isRead,
  }))

  const mappedDocuments = data.documents.length > 0 ? data.documents.map((d, i) => ({
    id: String(i),
    name: d.fileName,
    size: '1.5 MB',
    fileUrl: d.fileUrl,
  })) : DEFAULT_DOCUMENTS

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

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardHomeView
            project={mappedProjectData}
            timelinePhases={mappedTimeline}
            updates={mappedUpdates}
            sitePhotos={DEFAULT_PHOTOS}
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
