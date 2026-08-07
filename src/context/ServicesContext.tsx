import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  Building2, Home, Key, PaintRoller, Ruler, Sofa,
  Hammer, Wrench, HardHat, Layers, TreePine, Paintbrush,
  type LucideIcon,
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
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
  Home, PaintRoller, Sofa, Ruler, Key, Building2,
  Hammer, Wrench, HardHat, Layers, TreePine, Paintbrush,
}

const DEFAULT_SERVICES: Service[] = [
  { id: '1', iconName: 'Home',        slug: 'house-construction',     title: 'House Construction',     description: 'Complete construction solutions for your dream home.' },
  { id: '2', iconName: 'PaintRoller', slug: 'renovation',             title: 'Renovation',             description: 'Transform your existing space into something extraordinary.' },
  { id: '3', iconName: 'Sofa',        slug: 'interior-design',        title: 'Interior Design',        description: 'Beautiful interiors that match your style and personality.' },
  { id: '4', iconName: 'Ruler',       slug: 'architectural-planning', title: 'Architectural Planning', description: 'Modern and functional designs by expert architects.' },
  { id: '5', iconName: 'Key',         slug: 'turnkey-projects',       title: 'Turnkey Projects',       description: 'End-to-end project management with complete peace of mind.' },
  { id: '6', iconName: 'Building2',   slug: 'commercial-buildings',   title: 'Commercial Buildings',   description: 'High-quality construction for commercial spaces and buildings.' },
]

function fromDto(dto: SiteServiceDto): Service {
  return { id: String(dto.id), _backendId: dto.id, iconName: dto.iconName, title: dto.title, description: dto.description, slug: dto.slug }
}

function toDto(s: Omit<Service, 'id' | '_backendId'>, sortOrder = 0): Omit<SiteServiceDto, 'id'> {
  return { iconName: s.iconName, title: s.title, description: s.description, slug: s.slug, sortOrder }
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
  const [services, setServicesLS] = useLocalStorage<Service[]>('site-services', DEFAULT_SERVICES)
  const [loading, setLoading] = useLocalStorage<boolean>('services-loading', true)

  useEffect(() => {
    publicContent.getServices()
      .then((dtos) => {
        if (dtos && dtos.length > 0) setServicesLS(dtos.map(fromDto))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setServices = useCallback((s: Service[]) => setServicesLS(s), [setServicesLS])

  const addService = useCallback(async (s: Omit<Service, 'id' | '_backendId'>) => {
    const tempId = crypto.randomUUID()
    setServicesLS([...services, { ...s, id: tempId }])
    try {
      const created = await adminContent.createService(toDto(s, services.length))
      setServicesLS((prev: Service[]) => prev.map(x => x.id === tempId ? fromDto(created) : x))
    } catch {}
  }, [services, setServicesLS])

  const updateService = useCallback(async (id: string, s: Omit<Service, 'id' | '_backendId'>) => {
    const existing = services.find(x => x.id === id)
    setServicesLS(services.map(x => x.id === id ? { ...x, ...s } : x))
    if (existing?._backendId) {
      adminContent.updateService(existing._backendId, toDto(s, 0)).catch(() => {})
    }
  }, [services, setServicesLS])

  const deleteService = useCallback(async (id: string) => {
    const existing = services.find(x => x.id === id)
    setServicesLS(services.filter(x => x.id !== id))
    if (existing?._backendId) {
      adminContent.deleteService(existing._backendId).catch(() => {})
    }
  }, [services, setServicesLS])

  const reorderServices = useCallback(async (reordered: Service[]) => {
    setServicesLS(reordered)
    const order = reordered.filter(s => s._backendId).map((s, i) => ({ id: s._backendId!, sortOrder: i }))
    if (order.length > 0) adminContent.reorderServices(order).catch(() => {})
  }, [setServicesLS])

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
