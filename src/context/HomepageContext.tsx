import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  Building2,
  Users,
  Smile,
  Award,
  type LucideIcon,
} from 'lucide-react'
import { adminContent, publicContent } from '../services/contentService'

export type TrustStat = {
  iconName: string
  number: string
  label: string
}

export type HomepageContent = {
  heroBgUrl: string
  heroLine1: string
  heroLine2: string
  heroSubtext: string
  trustStats: TrustStat[]
}

export const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Users,
  Smile,
  Award,
}

const DEFAULT_CONTENT: HomepageContent = {
  heroBgUrl:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=80',
  heroLine1: 'Building Dreams,',
  heroLine2: 'Creating Homes',
  heroSubtext:
    'From foundation to finishing, we deliver quality construction with complete transparency.',
  trustStats: [
    { iconName: 'Building2', number: '120+', label: 'Projects Completed' },
    { iconName: 'Users', number: '10+', label: 'Years Experience' },
    { iconName: 'Smile', number: '50+', label: 'Happy Families' },
    { iconName: 'Award', number: '98%', label: 'Client Satisfaction' },
  ],
}

const HOMEPAGE_KEY = 'homepage'

type HomepageContextValue = {
  content: HomepageContent
  setContent: (c: HomepageContent) => void
}

const HomepageContext = createContext<HomepageContextValue | null>(null)

export function HomepageProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<HomepageContent>(DEFAULT_CONTENT)
  const [backendAvailable, setBackendAvailable] = useState(false)

  useEffect(() => {
    publicContent.getConfig(HOMEPAGE_KEY)
      .then((raw) => {
        if (raw) {
          const data: HomepageContent = JSON.parse(raw)
          setContentState(data)
        }
        setBackendAvailable(true)
      })
      .catch(() => {})
  }, [])

  const setContent = useCallback((c: HomepageContent) => {
    setContentState(c)
    if (backendAvailable) {
      adminContent.saveConfig(HOMEPAGE_KEY, JSON.stringify(c)).catch(console.error)
    }
  }, [backendAvailable])

  const value = useMemo(() => ({ content, setContent }), [content, setContent])

  return (
    <HomepageContext.Provider value={value}>
      {children}
    </HomepageContext.Provider>
  )
}

export function useHomepage(): HomepageContextValue {
  const ctx = useContext(HomepageContext)
  if (!ctx) throw new Error('useHomepage must be used within HomepageProvider')
  return ctx
}
