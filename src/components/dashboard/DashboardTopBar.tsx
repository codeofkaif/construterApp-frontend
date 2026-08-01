import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import type { MockUser } from '../../data/mockData'

type DashboardTopBarProps = {
  user: MockUser
  showMenuButton?: boolean
  onOpenMenu?: () => void
}

export default function DashboardTopBar({
  user,
  showMenuButton = false,
  onOpenMenu,
}: DashboardTopBarProps) {
  const { navigate, notifications, markNotificationRead } = useDashboard()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const hasUnread = notifications.some((notification) => !notification.isRead)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }

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

  const handleNotificationsToggle = () => {
    setNotificationsOpen((open) => !open)
    setUserMenuOpen(false)
  }

  const handleUserMenuToggle = () => {
    setUserMenuOpen((open) => !open)
    setNotificationsOpen(false)
  }

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id)
    navigate('notifications')
    setNotificationsOpen(false)
  }

  return (
    <header className="border-b border-border-light bg-brand-cream px-6 py-4 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {showMenuButton && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="interactive-focus touch-target -ml-1 flex shrink-0 items-center justify-center rounded-lg border border-border-light bg-white text-brand-dark transition-colors hover:border-brand-gold/40 hover:bg-brand-cream active:scale-95 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="min-w-0">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h1 className="truncate text-xl font-bold text-brand-dark sm:text-2xl">
              {user.name} 👋
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Here&apos;s the overview of your project.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              onClick={handleNotificationsToggle}
              className="interactive-focus relative flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-white text-brand-dark transition-colors hover:border-brand-gold/40 hover:bg-brand-cream active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={1.75} />
              {hasUnread && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-brand-cream" />
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-card border border-border-light bg-white shadow-md"
                >
                  <div className="border-b border-border-light px-4 py-3">
                    <p className="text-sm font-semibold text-brand-dark">
                      Notifications
                    </p>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`interactive-focus w-full px-4 py-3 text-left transition-colors hover:bg-brand-cream active:bg-brand-cream/80 ${
                            !notification.isRead ? 'bg-brand-gold/5' : ''
                          }`}
                        >
                          <p className="text-sm text-brand-dark">
                            {!notification.isRead && (
                              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-gold" />
                            )}
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {notification.timestamp}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={handleUserMenuToggle}
              className="interactive-focus flex items-center gap-3 rounded-full border border-border-light bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:border-brand-gold/40 hover:bg-brand-cream active:scale-95"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="hidden text-sm font-medium text-brand-dark sm:inline">
                {user.name}
              </span>
              <ChevronDown
                className={`hidden h-4 w-4 text-gray-400 transition-transform sm:block ${
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
                  className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-card border border-border-light bg-white shadow-md"
                >
                  <ul className="py-1">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('profile')
                          setUserMenuOpen(false)
                        }}
                        className="interactive-focus flex w-full items-center gap-3 px-4 py-2.5 text-sm text-brand-dark transition-colors hover:bg-brand-cream active:bg-brand-cream/80"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('profile')
                          setUserMenuOpen(false)
                        }}
                        className="interactive-focus flex w-full items-center gap-3 px-4 py-2.5 text-sm text-brand-dark transition-colors hover:bg-brand-cream active:bg-brand-cream/80"
                      >
                        <Settings className="h-4 w-4 text-gray-400" />
                        Settings
                      </button>
                    </li>
                    <li className="border-t border-border-light">
                      <button
                        type="button"
                        onClick={() => {
                          navigate('logout')
                          setUserMenuOpen(false)
                        }}
                        className="interactive-focus flex w-full items-center gap-3 px-4 py-2.5 text-sm text-brand-dark transition-colors hover:bg-brand-cream active:bg-brand-cream/80"
                      >
                        <LogOut className="h-4 w-4 text-gray-400" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
