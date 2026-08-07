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
import { adminContent, publicContent, type SiteServiceDto } from '../services/contentService'

export type Service = {
  id: string
  _backendId?: number
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
  { id: '1', iconName: 'Home',        slug: 'house-construction',    title: 'House Construction',    description: 'Complete construction solutions for your dream home.' },
  { id: '2', iconName: 'PaintRoller', slug: 'renovation',            title: 'Renovation',            description: 'Transform your existing space into something extraordinary.' },
  { id: '3', iconName: 'Sofa',        slug: 'interior-design',       title: 'Interior Design',       description: 'Beautiful interiors that match your style and personality.' },
  { id: '4', iconName: 'Ruler',       slug: 'architectural-planning', title: 'Architectural Planning',description: 'Modern and functional designs by expert architects.' },
  { id: '5', iconName: 'Key',         slug: 'turnkey-projects',       title: 'Turnkey Projects',      description: 'End-to-end project management with complete peace of mind.' },
  { id: '6', iconName: 'Building2',   slug: 'commercial-buildings',  title: 'Commercial Buildings',  description: 'High-quality construction for commercial spaces and buildings.' },
]

function fromDto(dto: SiteServiceDto): Service {
  return {
    id: String(dto.id),
    _backendId: dto.id,
    iconName: dto.iconName,
    title: dto.title,
    description: dto.description,
    slug: dto.slug,
  }
}

function toDto(s: Omit<Service, 'id' | '_backendId'>, sortOrder = 0): Omit<SiteServiceDto, 'id'> {
  return {
    iconName: s.iconName,
    title: s.title,
    description: s.description,
    slug: s.slug,
    sortOrder,
  }
}

type ServicesContextValue = {
  services: Service[]
  loading: boolean
  setServices: (s: Service[]) => void
  addService: (s: Omit<Service, 'id' | '_backendId'>) => Promise<void>
  updateService: (id: string, s: Omit<Service, 'id' | '_backendId'>) => Promise<void>
  deleteService: (id: string) => Promise<void>
  reorderServices: (reordered: Service[]) => Promise<void>
}

const ServicesContext = createContext<ServicesContextValue | null>(null)

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServicesState] = useState<Service[]>(DEFAULT_SERVICES)
  const [loading, setLoading] = useState(true)
  const [backendAvailable, setBackendAvailable] = useState(false)

  useEffect(() => {
    publicContent.getServices()
      .then((dtos) => {
        if (dtos && dtos.length > 0) {
          setServicesState(dtos.map(fromDto))
          setBackendAvailable(true)
        } else if (dtos && dtos.length === 0) {
          setBackendAvailable(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const setServices = useCallback((s: Service[]) => setServicesState(s), [])

  const addService = useCallback(async (s: Omit<Service, 'id' | '_backendId'>) => {
    if (backendAvailable) {
      const created = await adminContent.createService(toDto(s, services.length))
      setServicesState((prev) => [...prev, fromDto(created)])
    } else {
      setServicesState((prev) => [...prev, { ...s, id: crypto.randomUUID() }])
    }
  }, [backendAvailable, services.length])

  const updateService = useCallback(async (id: string, s: Omit<Service, 'id' | '_backendId'>) => {
    const existing = services.find(x => x.id === id)
    if (backendAvailable && existing?._backendId) {
      const updated = await adminContent.updateService(existing._backendId, toDto(s, 0))
      setServicesState((prev) => prev.map(x => x.id === id ? fromDto(updated) : x))
    } else {
      setServicesState((prev) => prev.map(x => x.id === id ? { ...x, ...s } : x))
    }
  }, [backendAvailable, services])

  const deleteService = useCallback(async (id: string) => {
    const existing = services.find(x => x.id === id)
    if (backendAvailable && existing?._backendId) {
      await adminContent.deleteService(existing._backendId)
    }
    setServicesState((prev) => prev.filter(x => x.id !== id))
  }, [backendAvailable, services])

  const reorderServices = useCallback(async (reordered: Service[]) => {
    setServicesState(reordered)
    if (backendAvailable) {
      const order = reordered
        .filter(s => s._backendId)
        .map((s, i) => ({ id: s._backendId!, sortOrder: i }))
      await adminContent.reorderServices(order)
    }
  }, [backendAvailable])

  const value = useMemo(
    () => ({ services, loading, setServices, addService, updateService, deleteService, reorderServices }),
    [services, loading, setServices, addService, updateService, deleteService, reorderServices]
  )

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useServices must be used within ServicesProvider')
  return ctx
}
