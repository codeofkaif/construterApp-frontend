// ---------------------------------------------------------------------------
// Types — shared across dashboard and admin views
// These types remain here for components that reference them.
// All mock data const exports have been removed — use real API calls instead.
// ---------------------------------------------------------------------------

export type MockUser = {
  name: string
  avatar: string
  email: string
  phone: string
}

export type MockNotification = {
  id: string
  message: string
  timestamp: string
  isRead: boolean
}

export type ProjectData = {
  title: string
  location: string
  progress: number
  lastUpdated: string
  thumbnail: string
  currentStage: {
    name: string
    status: string
    startedOn: string
    estimatedCompletion: string
  }
  nextMilestone: {
    name: string
    expectedOn: string
  }
}

export type TimelinePhaseIcon =
  | 'layers'
  | 'square'
  | 'brick-wall'
  | 'home'
  | 'paint-bucket'
  | 'sparkles'

export type TimelinePhaseStatus = 'completed' | 'in-progress' | 'pending'

export type TimelinePhase = {
  name: string
  status: TimelinePhaseStatus
  percent: number
  icon: TimelinePhaseIcon
}

export type ProjectUpdate = {
  id: string
  date: string
  time: string
  description: string
  thumbnailUrl: string
}

export type PaymentSummaryData = {
  paid: number
  remaining: number
  nextPayment: {
    amount: number
    dueDate: string
  }
}

export type ProjectDocument = {
  id: string
  name: string
  size: string
}

export type PaymentHistoryEntry = {
  id: string
  date: string
  amount: number
  method: string
  status: 'Paid' | 'Pending' | 'Failed'
}

export type ChatMessage = {
  id: string
  sender: 'client' | 'engineer'
  text: string
  time: string
}

export type ProjectImage = {
  url: string
  alt: string
}

export type ProjectStat = {
  value: string
  label: string
}

export type Project = {
  slug: string
  title: string
  location: string
  stats: ProjectStat[]
  images: ProjectImage[]
}

export const projectsBySlug: Record<string, Project> = {
  'modern-luxury-villa': {
    slug: 'modern-luxury-villa',
    title: 'Modern Luxury Villa',
    location: 'Lucknow, Uttar Pradesh',
    stats: [
      { value: '2500 Sqft', label: 'Built-up Area' },
      { value: '5 BHK', label: 'Bedrooms' },
      { value: '10 Months', label: 'Duration' },
      { value: '₹38 Lakh', label: 'Budget' },
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        alt: 'Modern luxury villa exterior',
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern villa living room interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern bedroom interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern kitchen interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80',
        alt: 'Luxury home dining area',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern bathroom interior',
      },
    ],
  },
}

