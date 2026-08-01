import { createContext, useContext, type ReactNode } from 'react'
import type {
  ChatMessage,
  MockNotification,
  PaymentSummaryData,
} from '../data/mockData'
import type { DashboardViewId } from '../data/dashboardNav'

export type DashboardContextValue = {
  activeView: DashboardViewId
  navigate: (viewId: DashboardViewId) => void
  paymentData: PaymentSummaryData
  confirmPayment: () => void
  notifications: MockNotification[]
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  chatMessages: ChatMessage[]
  appendChatMessage: (text: string) => void
  isDashboardLoading: boolean
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({
  value,
  children,
}: {
  value: DashboardContextValue
  children: ReactNode
}) {
  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}
