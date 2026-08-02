import {
  Bell,
  Globe,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquarePlus,
  Settings,
  Layers,
  FolderKanban,
  FileText,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type AdminViewId =
  | 'homepage'
  | 'services'
  | 'portfolio'
  | 'site-content'
  | 'add-client'
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
  { id: 'homepage',       label: 'Homepage',       icon: Globe },
  { id: 'services',       label: 'Services',       icon: Layers },
  { id: 'portfolio',      label: 'Portfolio',      icon: FolderKanban },
  { id: 'site-content',   label: 'Site Content',   icon: FileText },
  { id: 'add-client',     label: 'Add Client',     icon: UserPlus },
  { id: 'overview',       label: 'Overview',      icon: LayoutDashboard },
  { id: 'clients',        label: 'Clients',        icon: Users },
  { id: 'send-update',    label: 'Send Update',    icon: MessageSquarePlus },
  { id: 'notifications',  label: 'Notifications',  icon: Bell },
  { id: 'leads',          label: 'Leads',          icon: Inbox },
  { id: 'payments',       label: 'Payments',       icon: Wallet },
  { id: 'settings',       label: 'Settings',       icon: Settings },
  { id: 'logout',         label: 'Logout',         icon: LogOut, isLogout: true },
]
