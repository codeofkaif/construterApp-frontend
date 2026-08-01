import { useCallback, useEffect, useState } from 'react'
import {
  adminService,
  type AdminOverviewResponse,
  type AdminProjectListItem,
  type BackendLead,
} from '../services/adminService'

export type AdminData = {
  overview: AdminOverviewResponse | null
  projects: AdminProjectListItem[]
  leads: BackendLead[]
}

const EMPTY: AdminData = {
  overview: null,
  projects: [],
  leads: [],
}

export function useAdminData() {
  const [data, setData] = useState<AdminData>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [overview, projects, leadsPage] = await Promise.allSettled([
        adminService.getOverview(),
        adminService.getProjects(),
        adminService.getLeads(),
      ])

      setData({
        overview:  overview.status  === 'fulfilled' ? overview.value              : null,
        projects:  projects.status  === 'fulfilled' ? projects.value              : [],
        leads:     leadsPage.status === 'fulfilled' ? leadsPage.value.content     : [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const refreshLeads = useCallback(async () => {
    try {
      const page = await adminService.getLeads()
      setData((prev) => ({ ...prev, leads: page.content }))
    } catch { /* silent */ }
  }, [])

  const refreshProjects = useCallback(async () => {
    try {
      const projects = await adminService.getProjects()
      setData((prev) => ({ ...prev, projects }))
    } catch { /* silent */ }
  }, [])

  const refreshOverview = useCallback(async () => {
    try {
      const overview = await adminService.getOverview()
      setData((prev) => ({ ...prev, overview }))
    } catch { /* silent */ }
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchAll,
    refreshLeads,
    refreshProjects,
    refreshOverview,
  }
}
