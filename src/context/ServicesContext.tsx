import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import {
  Building2,
  Home,
  Key,
  PaintRoller,
  Ruler,
  Sofa,
  Hammer,
  Wrench,
  HardHat,
  Layers,
  TreePine,
  Paintbrush,
  type LucideIcon,
} from 'lucide-react'

export type Service = {
  id: string
  iconName: string
  title: string
  description: string
  slug: string
}

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Home,
  PaintRoller,
  Sofa,
  Ruler,
  Key,
  Building2,
  Hammer,
  Wrench,
  HardHat,
  Layers,
  TreePine,
  Paintbrush,
}

const DEFAULT_SERVICES: Service[] = [
  { id: '1', iconName: 'Home',               slug: 'house-construction',    title: 'House Construction',    description: 'Complete construction solutions for your dream home.' },
  { id: '2', iconName: 'PaintRoller',         slug: 'renovation',            title: 'Renovation',            description: 'Transform your existing space into something extraordinary.' },
  { id: '3', iconName: 'Sofa',               slug: 'interior-design',       title: 'Interior Design',       description: 'Beautiful interiors that match your style and personality.' },
  { id: '4', iconName: 'Ruler',              slug: 'architectural-planning', title: 'Architectural Planning',description: 'Modern and functional designs by expert architects.' },
  { id: '5', iconName: 'Key',               slug: 'turnkey-projects',       title: 'Turnkey Projects',      description: 'End-to-end project management with complete peace of mind.' },
  { id: '6', iconName: 'Building2',          slug: 'commercial-buildings',  title: 'Commercial Buildings',  description: 'High-quality construction for commercial spaces and buildings.' },
]

type ServicesContextValue = {
  services: Service[]
  setServices: (s: Service[]) => void
}

const ServicesContext = createContext<ServicesContextValue | null>(null)

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const value = useMemo(() => ({ services, setServices }), [services])
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useServices must be used within ServicesProvider')
  return ctx
}
