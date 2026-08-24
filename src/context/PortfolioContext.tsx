import {
  createContext, useContext, useMemo, useEffect, useCallback, useState, type ReactNode,
} from 'react'
import {
  Building2, Home, Key, PaintRoller, Ruler, Sofa,
  Hammer, Wrench, HardHat, Layers, TreePine, Paintbrush, type LucideIcon,
} from 'lucide-react'
import { adminContent, publicContent, type PortfolioItemDto } from '../services/contentService'

export type ProjectStat = { value: string; label: string }
export type ProjectImage = { url: string; alt: string }
export type PortfolioProject = {
  id: string
  _backendId?: number
  slug: string
  title: string
  location: string
  featured: boolean
  createdAt: number
  stats: ProjectStat[]
  images: ProjectImage[]
}

function fromDto(dto: PortfolioItemDto): PortfolioProject {
  return {
    id: String(dto.id),
    _backendId: dto.id,
    slug: dto.slug,
    title: dto.title,
    location: dto.location,
    featured: dto.featured,
    createdAt: dto.createdAt ? new Date(dto.createdAt).getTime() : Date.now(),
    stats: dto.statsJson ? JSON.parse(dto.statsJson) : [],
    images: dto.imagesJson ? JSON.parse(dto.imagesJson) : [],
  }
}

function toDto(p: Omit<PortfolioProject, 'id' | 'createdAt'>, sortOrder = 0): Omit<PortfolioItemDto, 'id' | 'createdAt'> {
  return {
    title: p.title, slug: p.slug, location: p.location, featured: p.featured,
    statsJson: JSON.stringify(p.stats), imagesJson: JSON.stringify(p.images), sortOrder,
  }
}

const DEFAULT_PROJECTS: PortfolioProject[] = [{
  id: 'default-1', slug: 'modern-luxury-villa', title: 'Modern Luxury Villa',
  location: 'Lucknow, Uttar Pradesh', featured: true, createdAt: Date.now(),
  stats: [
    { value: '2500 Sqft', label: 'Built-up Area' }, { value: '5 BHK', label: 'Bedrooms' },
    { value: '10 Months', label: 'Duration' }, { value: '₹38 Lakh', label: 'Budget' },
  ],
  images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', alt: 'Modern luxury villa exterior' }],
}]

const LS_KEY = 'portfolio-projects'

function readCache(): PortfolioProject[] {
  try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : DEFAULT_PROJECTS } catch { return DEFAULT_PROJECTS }
}
function writeCache(d: PortfolioProject[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(d)) } catch {}
}

type PortfolioContextValue = {
  projects: PortfolioProject[]
  loading: boolean
  setProjects: (projects: PortfolioProject[]) => void
  addProject: (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => Promise<void>
  updateProject: (id: string, p: Omit<PortfolioProject, 'id' | 'createdAt'>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  toggleFeatured: (id: string) => Promise<void>
  refetch: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects_] = useState<PortfolioProject[]>(readCache)
  const [loading, setLoading] = useState(true)

  const set = useCallback((p: PortfolioProject[]) => {
    setProjects_(p); writeCache(p)
  }, [])

  const refetch = useCallback(async () => {
    try {
      const dtos = await publicContent.getPortfolio()
      if (Array.isArray(dtos) && dtos.length > 0) {
        set(dtos.map(fromDto))
      }
    } catch {
      // keep cache
    } finally {
      setLoading(false)
    }
  }, [set])

  // On mount: backend is source of truth — overrides localStorage cache
  useEffect(() => {
    refetch()
  }, [refetch])

  const setProjects = useCallback((p: PortfolioProject[]) => set(p), [set])

  const addProject = useCallback(async (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    const tempId = crypto.randomUUID()
    const newProj: PortfolioProject = { ...p, id: tempId, createdAt: Date.now() }
    const optimistic = p.featured
      ? [...projects.map(x => ({ ...x, featured: false })), newProj]
      : [...projects, newProj]
    set(optimistic)

    try {
      const created = await adminContent.createPortfolio(toDto(p, 0))
      if (created && created.id) {
        const final = fromDto(created)
        set(optimistic.map(x => x.id === tempId ? final : x))
      }
    } catch {
      // Keep optimistic
    }
  }, [projects, set])

  const updateProject = useCallback(async (id: string, p: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    const existing = projects.find(x => x.id === id)
    const updated = projects.map(x => {
      if (x.id === id) return { ...x, ...p }
      return p.featured ? { ...x, featured: false } : x
    })
    set(updated)

    try {
      if (existing?._backendId) {
        const res = await adminContent.updatePortfolio(existing._backendId, toDto(p, 0))
        if (res && res.id) {
          const final = fromDto(res)
          set(updated.map(x => x.id === id ? final : x))
        }
      } else {
        // If not yet saved on backend, create it
        const created = await adminContent.createPortfolio(toDto(p, 0))
        if (created && created.id) {
          const final = fromDto(created)
          set(updated.map(x => x.id === id ? final : x))
        }
      }
    } catch {
      // Keep optimistic local update
    }
  }, [projects, set])

  const deleteProject = useCallback(async (id: string) => {
    const existing = projects.find(x => x.id === id)
    set(projects.filter(x => x.id !== id))
    if (existing?._backendId) {
      try {
        await adminContent.deletePortfolio(existing._backendId)
      } catch {}
    }
  }, [projects, set])

  const toggleFeatured = useCallback(async (id: string) => {
    const existing = projects.find(x => x.id === id)
    set(projects.map(p => ({ ...p, featured: p.id === id ? !p.featured : false })))
    if (existing?._backendId) {
      try {
        await adminContent.toggleFeatured(existing._backendId)
      } catch {}
    }
  }, [projects, set])

  const value = useMemo(
    () => ({ projects, loading, setProjects, addProject, updateProject, deleteProject, toggleFeatured, refetch }),
    [projects, loading, setProjects, addProject, updateProject, deleteProject, toggleFeatured, refetch]
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}

export const SERVICE_ICON_MAP_UNUSED: Record<string, LucideIcon> = {
  Building2, Home, Key, PaintRoller, Ruler, Sofa, Hammer, Wrench, HardHat, Layers, TreePine, Paintbrush,
}

