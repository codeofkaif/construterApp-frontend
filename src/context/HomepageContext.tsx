import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import { Building2, Users, Smile, Award, type LucideIcon } from 'lucide-react'
import { adminContent, publicContent } from '../services/contentService'

export type TrustStat = { iconName: string; number: string; label: string }
export type HomepageContent = {
  heroBgUrl: string
  heroLine1: string
  heroLine2: string
  heroSubtext: string
  trustStats: TrustStat[]
}

export const LUCIDE_ICON_MAP: Record<string, LucideIcon> = { Building2, Users, Smile, Award }

const DEFAULTS: HomepageContent = {
  heroBgUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=80',
  heroLine1: 'Building Dreams,',
  heroLine2: 'Creating Homes',
  heroSubtext: 'From foundation to finishing, we deliver quality construction with complete transparency.',
  trustStats: [
    { iconName: 'Building2', number: '120+', label: 'Projects Completed' },
    { iconName: 'Users', number: '10+', label: 'Years Experience' },
    { iconName: 'Smile', number: '50+', label: 'Happy Families' },
    { iconName: 'Award', number: '98%', label: 'Client Satisfaction' },
  ],
}

const LS_KEY = 'homepage-content'

function readCache(): HomepageContent {
  try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : DEFAULTS } catch { return DEFAULTS }
}

function writeCache(d: HomepageContent) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(d)) } catch {}
}

type HomepageContextValue = {
  content: HomepageContent
  setContent: (c: HomepageContent) => Promise<void>
  refetch: () => Promise<void>
}
const HomepageContext = createContext<HomepageContextValue | null>(null)

export function HomepageProvider({ children }: { children: ReactNode }) {
  const [content, setContent_] = useState<HomepageContent>(readCache)

  const refetch = useCallback(async () => {
    try {
      const remote = await publicContent.getConfig<HomepageContent>('homepage')
      if (remote && typeof remote === 'object' && remote.heroLine1) {
        setContent_(remote)
        writeCache(remote)
      }
    } catch {
      // keep cache
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const setContent = useCallback(async (c: HomepageContent) => {
    setContent_(c)
    writeCache(c)
    try {
      await adminContent.saveConfig('homepage', c)
    } catch (err) {
      console.warn('Backend saveConfig failed, cached locally:', err)
    }
  }, [])

  const value = useMemo(() => ({ content, setContent, refetch }), [content, setContent, refetch])
  return <HomepageContext.Provider value={value}>{children}</HomepageContext.Provider>
}

export function useHomepage(): HomepageContextValue {
  const ctx = useContext(HomepageContext)
  if (!ctx) throw new Error('useHomepage must be used within HomepageProvider')
  return ctx
}

