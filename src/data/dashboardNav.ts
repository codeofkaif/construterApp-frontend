import {
  Bell,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  TrendingUp,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type DashboardViewId =
  | 'dashboard'
  | 'my-project'
  | 'progress-updates'
  | 'payments'
  | 'documents'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'logout'

export type DashboardNavItem = {
  id: DashboardViewId
  label: string
  icon: LucideIcon
  isLogout?: boolean
}

export const dashboardNavItems: DashboardNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my-project', label: 'My Project', icon: Building2 },
  { id: 'progress-updates', label: 'Progress Updates', icon: TrendingUp },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'logout', label: 'Logout', icon: LogOut, isLogout: true },
]

export const dashboardViewTitles: Record<DashboardViewId, string> = {
  dashboard: 'Dashboard',
  'my-project': 'My Project',
  'progress-updates': 'Progress Updates',
  payments: 'Payments',
  documents: 'Documents',
  messages: 'Messages',
  notifications: 'Notifications',
  profile: 'Profile',
  logout: 'Logout',
}
