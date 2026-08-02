import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'

export type ProjectStat = {
  value: string
  label: string
}

export type ProjectImage = {
  url: string
  alt: string
}

export type PortfolioProject = {
  id: string
  slug: string
  title: string
  location: string
  featured: boolean
  createdAt: number
  stats: ProjectStat[]
  images: ProjectImage[]
}

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    id: '1',
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
      {
        url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern villa living room interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern bedroom interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern kitchen interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80',
        alt: 'Luxury home dining area',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern bathroom interior',
      },
    ],
  },
]

type PortfolioContextValue = {
  projects: PortfolioProject[]
  setProjects: (projects: PortfolioProject[]) => void
  toggleFeatured: (id: string) => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<PortfolioProject[]>(DEFAULT_PROJECTS)

  const toggleFeatured = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        featured: p.id === id ? !p.featured : false,
      }))
    )
  }

  const value = useMemo(
    () => ({ projects, setProjects, toggleFeatured }),
    [projects]
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
