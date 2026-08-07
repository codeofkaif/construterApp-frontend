import { apiFetch, apiGet } from './api'

// ---------------------------------------------------------------------------
// Types — mirror backend DTOs
// ---------------------------------------------------------------------------

export type PortfolioItemDto = {
  id: number
  title: string
  slug: string
  location: string
  featured: boolean
  statsJson: string   // JSON string
  imagesJson: string  // JSON string
  sortOrder: number
  createdAt?: string
}

export type SiteServiceDto = {
  id: number
  iconName: string
  title: string
  description: string
  slug: string
  sortOrder: number
}

// ---------------------------------------------------------------------------
// Public API — no auth required, used by landing page & contexts on mount
// ---------------------------------------------------------------------------

export const publicContent = {
  getPortfolio: () => apiGet<PortfolioItemDto[]>('/api/public/portfolio'),
  getServices:  () => apiGet<SiteServiceDto[]>('/api/public/services'),
  getConfig:    (key: string) =>
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/public/config/${key}`)
      .then((r) => (r.ok ? r.text() : null))
      .catch(() => null),
}

// ---------------------------------------------------------------------------
// Admin API — ADMIN JWT required
// ---------------------------------------------------------------------------

export const adminContent = {
  // Portfolio
  listPortfolio: () => apiGet<PortfolioItemDto[]>('/api/admin/content/portfolio'),
  createPortfolio: (dto: Omit<PortfolioItemDto, 'id' | 'createdAt'>) =>
    apiFetch<PortfolioItemDto>('/api/admin/content/portfolio', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  updatePortfolio: (id: number, dto: Omit<PortfolioItemDto, 'id' | 'createdAt'>) =>
    apiFetch<PortfolioItemDto>(`/api/admin/content/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    }),
  deletePortfolio: (id: number) =>
    apiFetch<void>(`/api/admin/content/portfolio/${id}`, { method: 'DELETE' }),
  toggleFeatured: (id: number) =>
    apiFetch<PortfolioItemDto>(`/api/admin/content/portfolio/${id}/featured`, {
      method: 'PATCH',
    }),

  // Services
  listServices: () => apiGet<SiteServiceDto[]>('/api/admin/content/services'),
  createService: (dto: Omit<SiteServiceDto, 'id'>) =>
    apiFetch<SiteServiceDto>('/api/admin/content/services', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  updateService: (id: number, dto: Omit<SiteServiceDto, 'id'>) =>
    apiFetch<SiteServiceDto>(`/api/admin/content/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    }),
  deleteService: (id: number) =>
    apiFetch<void>(`/api/admin/content/services/${id}`, { method: 'DELETE' }),
  reorderServices: (order: { id: number; sortOrder: number }[]) =>
    apiFetch<void>('/api/admin/content/services/reorder', {
      method: 'PUT',
      body: JSON.stringify(order),
    }),

  // Config blobs
  getConfig: (key: string) => apiGet<string>(`/api/admin/content/config/${key}`),
  saveConfig: (key: string, value: string) =>
    apiFetch<void>(`/api/admin/content/config/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    }),
}
