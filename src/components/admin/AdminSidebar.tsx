import { Home, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { adminNavItems, type AdminNavItem, type AdminViewId } from '../../data/adminNav'

// ---------------------------------------------------------------------------
// Nav item button — same active-state style as client sidebar
// ---------------------------------------------------------------------------

function NavItemButton({
  item,
  isActive,
  isCollapsed,
  onNavigate,
}: {
  item: AdminNavItem
  isActive: boolean
  isCollapsed: boolean
  onNavigate: (viewId: AdminViewId) => void
}) {
  const Icon = item.icon

  return (
    <button
      type="button"
      title={isCollapsed ? item.label : undefined}
      onClick={() => onNavigate(item.id)}
      className={`interactive-focus group relative flex w-full min-h-[44px] items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors active:scale-[0.98] ${
        isActive
          ? 'bg-brand-gold/15 text-brand-gold'
          : item.isLogout
            ? 'text-white/50 hover:bg-white/5 hover:text-white/70'
            : 'text-white/70 hover:bg-white/5 hover:text-white'
      } ${isCollapsed ? 'justify-center px-0' : ''}`}
    >
      {/* Left accent bar — identical to client sidebar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-gold" />
      )}

      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />

      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {/* Tooltip when collapsed */}
      {isCollapsed && (
        <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-button bg-brand-darkCard px-3 py-1.5 text-xs text-white shadow-lg group-hover:block">
          {item.label}
        </span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// AdminSidebar
// ---------------------------------------------------------------------------

type AdminSidebarProps = {
  activeView: AdminViewId
  sidebarMode: 'drawer' | 'icon' | 'full'
  isDrawerOpen: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  onNavigate: (viewId: AdminViewId) => void
  onCloseDrawer: () => void
}

export default function AdminSidebar({
  activeView,
  sidebarMode,
  isDrawerOpen,
  isCollapsed,
  onToggleCollapse,
  onNavigate,
  onCloseDrawer,
}: AdminSidebarProps) {
  const regularItems = adminNavItems.filter((item) => !item.isLogout)
  const logoutItem = adminNavItems.find((item) => item.isLogout)!

  const isDrawer = sidebarMode === 'drawer'
  const showCollapsed = isCollapsed || sidebarMode === 'icon'

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.08] bg-brand-dark transition-all duration-300 ${
        isDrawer
          ? `w-[260px] p-6 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`
          : showCollapsed
            ? 'w-16 px-3 py-6'
            : 'w-[260px] p-6'
      }`}
    >
      {/* Logo / brand row */}
      <div className="mb-8 flex items-center justify-between gap-2">
        <div
          className={`flex min-w-0 items-center gap-3 overflow-hidden ${showCollapsed && !isDrawer ? 'justify-center' : ''}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
            <Home className="h-5 w-5" strokeWidth={1.75} />
          </div>
          {(!showCollapsed || isDrawer) && (
            <span className="truncate text-xs font-bold uppercase tracking-wide text-white">
              Adil Constructions
            </span>
          )}
        </div>

        {isDrawer ? (
          <button
            type="button"
            onClick={onCloseDrawer}
            className="interactive-focus touch-target rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : sidebarMode === 'full' ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="interactive-focus touch-target rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        ) : null}
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {regularItems.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            isCollapsed={showCollapsed && !isDrawer}
            onNavigate={onNavigate}
          />
        ))}

        <div className="my-3 border-t border-white/[0.08]" />

        <NavItemButton
          item={logoutItem}
          isActive={activeView === logoutItem.id}
          isCollapsed={showCollapsed && !isDrawer}
          onNavigate={onNavigate}
        />
      </nav>

      {/* Admin badge at bottom */}
      {(!showCollapsed || isDrawer) && (
        <motion.div
          initial={false}
          className="mt-6 shrink-0 rounded-xl border border-brand-gold/20 bg-brand-gold/10 p-4"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-brand-gold">
            Admin Panel
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            Full access enabled
          </p>
        </motion.div>
      )}
    </aside>
  )
}
