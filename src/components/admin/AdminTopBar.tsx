import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import type { AdminViewId } from '../../data/adminNav'

type AdminTopBarProps = {
  showMenuButton?: boolean
  onOpenMenu?: () => void
  onNavigate: (viewId: AdminViewId) => void
}

export default function AdminTopBar({
  showMenuButton = false,
  onOpenMenu,
  onNavigate,
}: AdminTopBarProps) {
  const { user } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUserMenuToggle = () => setUserMenuOpen((open) => !open)

  return (
    <header className="border-b border-white/[0.08] bg-brand-dark px-6 py-4 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        {/* Left — title + optional hamburger */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="interactive-focus touch-target -ml-1 flex shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:border-brand-gold/40 hover:bg-white/10 active:scale-95 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>

        {/* Right — avatar + name + dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            onClick={handleUserMenuToggle}
            className="interactive-focus flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:border-brand-gold/40 hover:bg-white/10 active:scale-95"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold text-sm font-semibold">
                {user?.name?.[0] ?? 'A'}
              </span>
            )}
            <span className="hidden text-sm font-medium text-white sm:inline">
              {user?.name}
            </span>
            <ChevronDown
              className={`hidden h-4 w-4 text-white/40 transition-transform sm:block ${
                userMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-card border border-white/[0.08] bg-brand-darkCard shadow-lg"
              >
                {/* User info header */}
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="text-xs font-semibold text-white">{user?.name}</p>
                  <p className="mt-0.5 truncate text-xs text-white/40">{user?.email}</p>
                </div>

                <ul className="py-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('settings')
                        setUserMenuOpen(false)
                      }}
                      className="interactive-focus flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white active:bg-white/10"
                    >
                      <User className="h-4 w-4 text-white/40" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('settings')
                        setUserMenuOpen(false)
                      }}
                      className="interactive-focus flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white active:bg-white/10"
                    >
                      <Settings className="h-4 w-4 text-white/40" />
                      Settings
                    </button>
                  </li>
                  <li className="border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('logout')
                        setUserMenuOpen(false)
                      }}
                      className="interactive-focus flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 active:bg-red-500/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
