import { AnimatePresence, motion } from 'framer-motion'
import { Home, Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


type NavbarProps = {
  onOpenConsultation: () => void
}

type NavItem =
  | { label: string; type: 'anchor'; href: string; id: string }
  | { label: string; type: 'route'; href: string; id: string }

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
        <Home className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="leading-tight">
        <span className="block text-xs font-bold uppercase tracking-wide text-white">
          Adil Constructions
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-brand-gold">
          Building Dreams
        </span>
      </div>
    </a>
  )
}

type NavLinkProps = {
  item: NavItem
  isActive: boolean
  onNavigate?: () => void
}

function NavLink({ item, isActive, onNavigate }: NavLinkProps) {
  const baseClasses =
    'relative text-sm font-medium transition-colors duration-200'
  const inactiveClasses = 'text-white/75 hover:text-brand-gold'
  const activeClasses = 'text-brand-gold'

  const linkContent = (
    <>
      {item.label}
      {isActive && item.id === 'home' && (
        <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand-gold" />
      )}
    </>
  )

  if (item.type === 'route') {
    return (
      <Link
        to={item.href}
        onClick={onNavigate}
        className={`${baseClasses} ${inactiveClasses}`}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <a
      href={item.href}
      onClick={(event) => {
        event.preventDefault()
        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
        onNavigate?.()
      }}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {linkContent}
    </a>
  )
}

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const isLandingPage = location.pathname === '/'
  const closeDrawer = () => setIsDrawerOpen(false)

  const computedNavItems: NavItem[] = [
    { label: 'Home', type: 'anchor', href: '#home', id: 'home' },
    { label: 'Projects', type: 'anchor', href: '#projects', id: 'projects' },
    { label: 'Services', type: 'anchor', href: '#services', id: 'services' },
    { label: 'About Us', type: 'anchor', href: '#about', id: 'about' },
    user?.role === 'ADMIN'
      ? { label: 'Admin Panel', type: 'route', href: '/admin', id: 'admin' }
      : { label: 'Dashboard', type: 'route', href: '/dashboard', id: 'dashboard' },
    !isAuthenticated
      ? { label: 'Sign In', type: 'route', href: '/login', id: 'login' }
      : {
          label: `Hi, ${user?.name?.split(' ')[0] || 'User'}`,
          type: 'route',
          href: user?.role === 'ADMIN' ? '/admin' : '/dashboard',
          id: 'profile',
        },
    { label: 'Contact', type: 'anchor', href: '#contact', id: 'contact' },
  ]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-brand-dark">
        <div className="mx-auto flex h-[72px] items-center justify-between px-6 lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            {computedNavItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                isActive={isLandingPage && item.id === 'home'}
              />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="interactive-focus touch-target flex items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white active:scale-95 lg:hidden"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenConsultation}
              className="interactive-focus touch-target hidden items-center gap-2 rounded-full border-[1.5px] border-brand-gold bg-transparent px-5 py-2.5 text-sm font-medium text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-dark active:scale-95 lg:inline-flex"
            >
              <Phone className="h-4 w-4" />
              Get Free Consultation
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenConsultation}
              className="interactive-focus touch-target inline-flex items-center gap-2 rounded-full border-[1.5px] border-brand-gold bg-transparent px-4 py-2.5 text-xs font-medium text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-dark active:scale-95 lg:hidden"
            >
              <Phone className="h-4 w-4" />
              Get Free Consultation
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-brand-dark/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[56] flex w-full max-w-xs flex-col bg-brand-darkCard shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex h-[72px] items-center justify-between border-b border-white/[0.08] px-6">
                <span className="text-sm font-semibold uppercase tracking-wide text-white">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 p-4">
                {computedNavItems.map((item) => (
                  <div key={item.id} className="px-2 py-3">
                    <NavLink
                      item={item}
                      isActive={isLandingPage && item.id === 'home'}
                      onNavigate={closeDrawer}
                    />
                  </div>
                ))}
              </nav>

              <div className="border-t border-white/[0.08] p-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    closeDrawer()
                    onOpenConsultation()
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-brand-gold bg-transparent px-5 py-3 text-sm font-medium text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-dark"
                >
                  <Phone className="h-4 w-4" />
                  Get Free Consultation
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
