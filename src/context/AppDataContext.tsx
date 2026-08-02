// Single source of truth — all Admin writes and Client reads for updates/notifications/payments MUST go through this context. Do not add local duplicate state elsewhere.

/**
 * AppDataContext — Centralized React Context for all shared mock app state.
 *
 * NOTE ON REAL-TIME SYNC / PRODUCTION DEPLOYMENT:
 * This Context-only sync works within one browser session (mock data, no backend).
 * Once wired to the real backend, true cross-device sync needs either the client
 * dashboard polling the API every 20-30s, or WebSocket/Server-Sent-Events for instant
 * push — flag as a future enhancement, not required for MVP.
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'

import {
  useHomepage,
  type HomepageContent,
} from './HomepageContext'
import {
  useServices,
  type Service,
} from './ServicesContext'
import {
  usePortfolio,
  type PortfolioProject,
} from './PortfolioContext'
import {
  useSiteContent,
  type AboutContent,
  type ContactContent,
  type FooterContent,
} from './SiteContentContext'

export type ClientNotification = {
  id: string
  message: string
  timestamp: string
  isRead: boolean
}

export type ClientAppData = {
  id: string              // Stable, unique client ID
  clientName: string
  email: string
  phone: string
  notifications: ClientNotification[]
  project: {
    title: string
    location: string
    builtUpArea: string
    bedrooms: string
    durationMonths: number
    totalBudget: number
    currentStage: string
    overallProgress: number
    timeline: { name: string; status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' }[]
    payments: { id: string; amount: number; dueDate: string; isPaid?: boolean }[]
    updates: { id: string; title: string; description: string; date: string; time?: string; thumbnailUrl?: string }[]
  }
}

const DEFAULT_CLIENTS: ClientAppData[] = [
  {
    id: '1',
    clientName: 'Adil Khan',
    email: 'adil@example.com',
    phone: '+91 9876543210',
    notifications: [
      { id: 'n1', message: 'Welcome to your project portal!', timestamp: 'Today', isRead: false },
    ],
    project: {
      title: 'Modern Luxury Villa',
      location: 'Lucknow, Uttar Pradesh',
      builtUpArea: '2500 Sqft',
      bedrooms: '5 BHK',
      durationMonths: 10,
      totalBudget: 3800000,
      currentStage: 'Brick Work',
      overallProgress: 45,
      timeline: [
        { name: 'Foundation', status: 'COMPLETED' },
        { name: 'Plinth', status: 'COMPLETED' },
        { name: 'Brick Work', status: 'IN_PROGRESS' },
        { name: 'Roof', status: 'PENDING' },
        { name: 'Plaster', status: 'PENDING' },
        { name: 'Finishing', status: 'PENDING' },
      ],
      payments: [
        { id: 'p1', amount: 500000, dueDate: '2026-01-15', isPaid: true },
        { id: 'p2', amount: 1000000, dueDate: '2026-03-01', isPaid: false },
      ],
      updates: [
        {
          id: 'u1',
          title: 'Plinth Beam Casting Complete',
          description: 'Foundation and plinth beam casting completed successfully with high-grade RCC concrete.',
          date: '28 Jan 2026',
          time: '11:30 AM',
        },
      ],
    },
  },
]

type AppDataContextValue = {
  homepageContent: HomepageContent
  setHomepageContent: (c: HomepageContent) => void
  services: Service[]
  setServices: (s: Service[]) => void
  portfolioProjects: PortfolioProject[]
  setPortfolioProjects: (p: PortfolioProject[]) => void
  aboutContent: AboutContent
  setAboutContent: (c: AboutContent) => void
  contactContent: ContactContent
  setContactContent: (c: ContactContent) => void
  footerContent: FooterContent
  setFooterContent: (c: FooterContent) => void
  clients: ClientAppData[]
  setClients: (c: ClientAppData[]) => void
  postUpdateForClient: (clientId: string, update: { title: string; description: string; thumbnailUrl?: string }) => void
  sendNotificationForClient: (clientId: string | 'all', message: string) => void
  lastUpdatedTime: number
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { content: homepageContent, setContent: setHomepageContentRaw } = useHomepage()
  const { services, setServices: setServicesRaw } = useServices()
  const { projects: portfolioProjects, setProjects: setPortfolioProjectsRaw } = usePortfolio()
  const {
    aboutContent,
    setAboutContent: setAboutContentRaw,
    contactContent,
    setContactContent: setContactContentRaw,
    footerContent,
    setFooterContent: setFooterContentRaw,
  } = useSiteContent()

  const [clients, setClientsRaw] = useState<ClientAppData[]>(DEFAULT_CLIENTS)
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>(Date.now())

  const touchTimestamp = () => setLastUpdatedTime(Date.now())

  const setHomepageContent = (c: HomepageContent) => {
    setHomepageContentRaw(c)
    touchTimestamp()
  }

  const setServices = (s: Service[]) => {
    setServicesRaw(s)
    touchTimestamp()
  }

  const setPortfolioProjects = (p: PortfolioProject[]) => {
    setPortfolioProjectsRaw(p)
    touchTimestamp()
  }

  const setAboutContent = (c: AboutContent) => {
    setAboutContentRaw(c)
    touchTimestamp()
  }

  const setContactContent = (c: ContactContent) => {
    setContactContentRaw(c)
    touchTimestamp()
  }

  const setFooterContent = (c: FooterContent) => {
    setFooterContentRaw(c)
    touchTimestamp()
  }

  const setClients = (c: ClientAppData[]) => {
    setClientsRaw(c)
    touchTimestamp()
  }

  const postUpdateForClient = (
    clientId: string,
    update: { title: string; description: string; thumbnailUrl?: string }
  ) => {
    const now = new Date()
    const newUpdate = {
      id: crypto.randomUUID(),
      title: update.title,
      description: update.description,
      thumbnailUrl: update.thumbnailUrl,
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
    }

    const newNotification: ClientNotification = {
      id: crypto.randomUUID(),
      message: `New update on your project: ${update.title}`,
      timestamp: 'Just now',
      isRead: false,
    }

    setClientsRaw((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            notifications: [newNotification, ...c.notifications],
            project: {
              ...c.project,
              updates: [newUpdate, ...c.project.updates],
            },
          }
        }
        return c
      })
    )
    touchTimestamp()
  }

  const sendNotificationForClient = (clientId: string | 'all', message: string) => {
    const newNotification: ClientNotification = {
      id: crypto.randomUUID(),
      message,
      timestamp: 'Just now',
      isRead: false,
    }

    setClientsRaw((prev) =>
      prev.map((c) => {
        if (clientId === 'all' || c.id === clientId) {
          return {
            ...c,
            notifications: [newNotification, ...c.notifications],
          }
        }
        return c
      })
    )
    touchTimestamp()
  }

  const value = useMemo(
    () => ({
      homepageContent,
      setHomepageContent,
      services,
      setServices,
      portfolioProjects,
      setPortfolioProjects,
      aboutContent,
      setAboutContent,
      contactContent,
      setContactContent,
      footerContent,
      setFooterContent,
      clients,
      setClients,
      postUpdateForClient,
      sendNotificationForClient,
      lastUpdatedTime,
    }),
    [
      homepageContent,
      services,
      portfolioProjects,
      aboutContent,
      contactContent,
      footerContent,
      clients,
      lastUpdatedTime,
    ]
  )

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
