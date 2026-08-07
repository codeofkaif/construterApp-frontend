import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { adminContent, publicContent, type PortfolioItemDto } from '../services/contentService'

export type ProjectStat = {
  value: string
  label: string
}

export type ProjectImage = {
  url: string
  alt: string
}

export type PortfolioProject = {
  id: string          // string for backward compat; backend id stored here as string
  _backendId?: number // actual numeric backend id
  slug: string
  title: string
  location: string
  featured: boolean
  createdAt: number
  stats: ProjectStat[]
  images: ProjectImage[]
}

// Convert backend DTO → frontend type
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

// Convert frontend type → DTO payload
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
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        alt: 'Modern luxury villa exterior',
      },
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
  const [projects, setProjectsState] = useState<PortfolioProject[]>(DEFAULT_PROJECTS)
  const [loading, setLoading] = useState(true)
  const [backendAvailable, setBackendAvailable] = useState(false)

  // Fetch from backend on mount — use public endpoint (no auth needed)
  useEffect(() => {
    publicContent.getPortfolio()
      .then((dtos) => {
        if (dtos && dtos.length > 0) {
          setProjectsState(dtos.map(fromDto))
          setBackendAvailable(true)
        } else if (dtos && dtos.length === 0) {
          // Backend is up but empty — keep defaults visible but flag backend as available
          setBackendAvailable(true)
        }
      })
      .catch(() => {
        // Backend unavailable — silently use defaults
      })
      .finally(() => setLoading(false))
  }, [])

  const setProjects = useCallback((p: PortfolioProject[]) => {
    setProjectsState(p)
  }, [])

  const addProject = useCallback(async (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    if (backendAvailable) {
      const created = await adminContent.createPortfolio(toDto(p, 0))
      setProjectsState((prev) => [...prev.filter(x => !x.id.startsWith('default')), fromDto(created)])
    } else {
      setProjectsState((prev) => [
        ...prev,
        { ...p, id: crypto.randomUUID(), createdAt: Date.now() },
      ])
    }
  }, [backendAvailable])

  const updateProject = useCallback(async (id: string, p: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    const existing = projects.find(x => x.id === id)
    if (backendAvailable && existing?._backendId) {
      const updated = await adminContent.updatePortfolio(existing._backendId, toDto(p, existing._backendId))
      setProjectsState((prev) => prev.map(x => x.id === id ? fromDto(updated) : x))
    } else {
      setProjectsState((prev) => prev.map(x => x.id === id ? { ...x, ...p } : x))
    }
  }, [backendAvailable, projects])

  const deleteProject = useCallback(async (id: string) => {
    const existing = projects.find(x => x.id === id)
    if (backendAvailable && existing?._backendId) {
      await adminContent.deletePortfolio(existing._backendId)
    }
    setProjectsState((prev) => prev.filter(x => x.id !== id))
  }, [backendAvailable, projects])

  const toggleFeatured = useCallback(async (id: string) => {
    const existing = projects.find(x => x.id === id)
    if (backendAvailable && existing?._backendId) {
      const updated = await adminContent.toggleFeatured(existing._backendId)
      setProjectsState((prev) =>
        prev.map(p => p.id === id ? fromDto(updated) : { ...p, featured: false })
      )
    } else {
      setProjectsState((prev) =>
        prev.map(p => ({ ...p, featured: p.id === id ? !p.featured : false }))
      )
    }
  }, [backendAvailable, projects])

  const value = useMemo(
    () => ({ projects, loading, setProjects, addProject, updateProject, deleteProject, toggleFeatured }),
    [projects, loading, setProjects, addProject, updateProject, deleteProject, toggleFeatured]
  )

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
