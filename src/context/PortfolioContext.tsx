import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
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
    title: p.title,
    slug: p.slug,
    location: p.location,
    featured: p.featured,
    statsJson: JSON.stringify(p.stats),
    imagesJson: JSON.stringify(p.images),
    sortOrder,
  }
}

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    id: 'default-1',
    slug: 'modern-luxury-villa',
    title: 'Modern Luxury Villa',
    location: 'Lucknow, Uttar Pradesh',
    featured: true,
    createdAt: Date.now(),
    stats: [
      { value: '2500 Sqft', label: 'Built-up Area' },
      { value: '5 BHK', label: 'Bedrooms' },
      { value: '10 Months', label: 'Duration' },
      { value: '₹38 Lakh', label: 'Budget' },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', alt: 'Modern luxury villa exterior' },
    ],
  },
]

type PortfolioContextValue = {
  projects: PortfolioProject[]
  loading: boolean
  setProjects: (projects: PortfolioProject[]) => void
  addProject: (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => Promise<void>
  updateProject: (id: string, p: Omit<PortfolioProject, 'id' | 'createdAt'>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  toggleFeatured: (id: string) => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjectsLS] = useLocalStorage<PortfolioProject[]>('portfolio-projects', DEFAULT_PROJECTS)
  const [loading, setLoading] = useLocalStorage<boolean>('portfolio-loading', true)

  // On mount: load from backend (backend is source of truth if available)
  useEffect(() => {
    publicContent.getPortfolio()
      .then((dtos) => {
        if (dtos && dtos.length > 0) {
          setProjectsLS(dtos.map(fromDto))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setProjects = useCallback((p: PortfolioProject[]) => setProjectsLS(p), [setProjectsLS])

  const addProject = useCallback(async (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    // Optimistically add to localStorage immediately
    const tempId = crypto.randomUUID()
    const newProj: PortfolioProject = { ...p, id: tempId, createdAt: Date.now() }
    const updated = p.featured
      ? [...projects.map(x => ({ ...x, featured: false })), newProj]
      : [...projects, newProj]
    setProjectsLS(updated)

    // Sync to backend
    try {
      const created = await adminContent.createPortfolio(toDto(p, 0))
      // Replace temp entry with backend entry
      setProjectsLS((prev: PortfolioProject[]) =>
        prev.map(x => x.id === tempId ? fromDto(created) : x)
      )
    } catch {}
  }, [projects, setProjectsLS])

  const updateProject = useCallback(async (id: string, p: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    const existing = projects.find(x => x.id === id)
    const updated = projects.map(x => {
      if (x.id === id) return { ...x, ...p }
      if (p.featured) return { ...x, featured: false }
      return x
    })
    setProjectsLS(updated)

    // Sync to backend
    if (existing?._backendId) {
      adminContent.updatePortfolio(existing._backendId, toDto(p, 0)).catch(() => {})
    }
  }, [projects, setProjectsLS])

  const deleteProject = useCallback(async (id: string) => {
    const existing = projects.find(x => x.id === id)
    setProjectsLS(projects.filter(x => x.id !== id))
    if (existing?._backendId) {
      adminContent.deletePortfolio(existing._backendId).catch(() => {})
    }
  }, [projects, setProjectsLS])

  const toggleFeatured = useCallback(async (id: string) => {
    const existing = projects.find(x => x.id === id)
    setProjectsLS(projects.map(p => ({ ...p, featured: p.id === id ? !p.featured : false })))
    if (existing?._backendId) {
      adminContent.toggleFeatured(existing._backendId).catch(() => {})
    }
  }, [projects, setProjectsLS])

  const value = useMemo(
    () => ({ projects, loading, setProjects, addProject, updateProject, deleteProject, toggleFeatured }),
    [projects, loading, setProjects, addProject, updateProject, deleteProject, toggleFeatured]
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
