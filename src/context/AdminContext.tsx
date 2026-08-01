import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'

// ---------------------------------------------------------------------------
// Types — used across admin views (mapped from backend responses)
// ---------------------------------------------------------------------------

export type LeadStatus = 'New' | 'Contacted' | 'Closed'

export type Lead = {
  id: string
  name: string
  phone: string
  message: string
  submittedAt: string   // ISO datetime from API createdAt
  status: LeadStatus
}

export type SentNotification = {
  id: string
  recipientId: string
  recipientLabel: string
  message: string
  sentAt: string
  isRead: boolean
}

// ---------------------------------------------------------------------------
// Context value — now thin, only UI helpers (data lives in components/hooks)
// ---------------------------------------------------------------------------

export type AdminContextValue = {
  // Kept for components that still receive clients/leads as props via useAdmin
  // but now populated from real API via useAdminData hook in the respective view
  _placeholder: true
}

const AdminContext = createContext<AdminContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider — now thin (no more mock data)
// ---------------------------------------------------------------------------

export function AdminProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AdminContextValue>(() => ({ _placeholder: true }), [])
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
