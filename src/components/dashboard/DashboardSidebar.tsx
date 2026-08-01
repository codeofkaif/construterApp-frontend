import { Headphones, Home, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  dashboardNavItems,
  type DashboardNavItem,
  type DashboardViewId,
} from '../../data/dashboardNav'
import WhatsAppIcon from './WhatsAppIcon'

type DashboardSidebarProps = {
  activeView: DashboardViewId
  sidebarMode: 'drawer' | 'icon' | 'full'
  isDrawerOpen: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  onNavigate: (viewId: DashboardViewId) => void
  onCloseDrawer: () => void
}

function NavItemButton({
  item,
  isActive,
  isCollapsed,
  onNavigate,
}: {
  item: DashboardNavItem
  isActive: boolean
  isCollapsed: boolean
  onNavigate: (viewId: DashboardViewId) => void
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
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-gold" />
      )}

      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />

      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {isCollapsed && (
        <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-button bg-brand-darkCard px-3 py-1.5 text-xs text-white shadow-lg group-hover:block">
          {item.label}
        </span>
      )}
    </button>
  )
}

export default function DashboardSidebar({
  activeView,
  sidebarMode,
  isDrawerOpen,
  isCollapsed,
  onToggleCollapse,
  onNavigate,
  onCloseDrawer,
}: DashboardSidebarProps) {
  const regularItems = dashboardNavItems.filter((item) => !item.isLogout)
  const logoutItem = dashboardNavItems.find((item) => item.isLogout)!

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

      {!showCollapsed || isDrawer ? (
        <div className="mt-6 shrink-0 rounded-xl border border-white/[0.08] bg-brand-darkCard p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
            <Headphones className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-bold text-white">Need Help?</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-400">
            We are here to assist you
          </p>
          <motion.a
            href="https://wa.me/916388913772?text=Hello%20Adil%20Constructions,%20I%20need%20assistance%20regarding%20my%20project."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="interactive-focus touch-target mt-4 inline-flex w-full items-center justify-center gap-2 rounded-button bg-brand-gold px-4 py-2.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95"
          >
            <WhatsAppIcon />
            Chat on WhatsApp
          </motion.a>
        </div>
      ) : (
        <motion.a
          href="https://wa.me/916388913772?text=Hello%20Adil%20Constructions,%20I%20need%20assistance%20regarding%20my%20project."
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title="Chat on WhatsApp"
          className="interactive-focus touch-target mt-6 flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full bg-brand-gold text-brand-dark active:scale-95"
        >
          <WhatsAppIcon />
        </motion.a>
      )}
    </aside>
  )
}
