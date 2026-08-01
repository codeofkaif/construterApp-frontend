import { useCallback, useEffect, useState } from 'react'
import type { AdminViewId } from '../../data/adminNav'
import { AdminProvider } from '../../context/AdminContext'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'
import AdminOverviewView from './views/AdminOverviewView'
import AdminClientsView from './views/AdminClientsView'
import AdminSendUpdateView from './views/AdminSendUpdateView'
import AdminNotificationsView from './views/AdminNotificationsView'
import AdminLeadsView from './views/AdminLeadsView'
import AdminLogoutView from './views/AdminLogoutView'
import AdminPlaceholderView from './views/AdminPlaceholderView'
import { Settings, Wallet } from 'lucide-react'

// ---------------------------------------------------------------------------
// Responsive sidebar mode helper
// ---------------------------------------------------------------------------

function getSidebarMode(width: number): 'drawer' | 'icon' | 'full' {
  if (width < 640) return 'drawer'
  if (width < 1024) return 'icon'
  return 'full'
}

// ---------------------------------------------------------------------------
// AdminLayout — wraps everything in AdminProvider for shared state
// ---------------------------------------------------------------------------

export default function AdminLayout() {
  const [activeView, setActiveView] = useState<AdminViewId>('overview')
  const [sidebarMode, setSidebarMode] = useState<'drawer' | 'icon' | 'full'>(() =>
    getSidebarMode(typeof window !== 'undefined' ? window.innerWidth : 1024),
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // --- resize ---
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

  // --- navigation ---
  const handleNavigate = useCallback(
    (viewId: AdminViewId) => {
      setActiveView(viewId)
      if (sidebarMode === 'drawer') setIsDrawerOpen(false)
    },
    [sidebarMode],
  )

  // --- render current view ---
  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <AdminOverviewView />
      case 'clients':
        return <AdminClientsView />
      case 'send-update':
        return <AdminSendUpdateView />
      case 'notifications':
        return <AdminNotificationsView />
      case 'leads':
        return <AdminLeadsView />
      case 'payments':
        return (
          <AdminPlaceholderView
            icon={Wallet}
            title="Payments"
            description="Overview of all client payments and dues."
          />
        )
      case 'settings':
        return (
          <AdminPlaceholderView
            icon={Settings}
            title="Settings"
            description="Configure admin preferences and system settings."
          />
        )
      case 'logout':
        return <AdminLogoutView />
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
    <AdminProvider>
      <div className="min-h-screen bg-brand-dark">
        {/* Drawer backdrop */}
        {sidebarMode === 'drawer' && isDrawerOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-brand-dark/70 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close navigation menu"
          />
        )}

        <AdminSidebar
          activeView={activeView}
          sidebarMode={sidebarMode}
          isDrawerOpen={isDrawerOpen}
          isCollapsed={isCollapsed || sidebarMode === 'icon'}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          onNavigate={handleNavigate}
          onCloseDrawer={() => setIsDrawerOpen(false)}
        />

        <div
          className={`flex min-h-screen flex-col transition-all duration-300 ${mainOffsetClass}`}
        >
          <AdminTopBar
            showMenuButton={sidebarMode === 'drawer'}
            onOpenMenu={() => setIsDrawerOpen(true)}
            onNavigate={handleNavigate}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {renderView()}
          </main>
        </div>
      </div>
    </AdminProvider>
  )
}
