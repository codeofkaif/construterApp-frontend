import {
  Bell,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquarePlus,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type AdminViewId =
  | 'overview'
  | 'clients'
  | 'send-update'
  | 'notifications'
  | 'leads'
  | 'payments'
  | 'settings'
  | 'logout'

export type AdminNavItem = {
  id: AdminViewId
  label: string
  icon: LucideIcon
  isLogout?: boolean
}

export const adminNavItems: AdminNavItem[] = [
  { id: 'overview',       label: 'Overview',      icon: LayoutDashboard },
  { id: 'clients',        label: 'Clients',        icon: Users },
  { id: 'send-update',    label: 'Send Update',    icon: MessageSquarePlus },
  { id: 'notifications',  label: 'Notifications',  icon: Bell },
  { id: 'leads',          label: 'Leads',          icon: Inbox },
  { id: 'payments',       label: 'Payments',       icon: Wallet },
  { id: 'settings',       label: 'Settings',       icon: Settings },
  { id: 'logout',         label: 'Logout',         icon: LogOut, isLogout: true },
]
