import { useDashboard } from '../../context/DashboardContext'
import type {
  ChatMessage,
  PaymentHistoryEntry,
  ProjectData,
  ProjectDocument,
  ProjectImage,
  ProjectUpdate,
  TimelinePhase,
} from '../../data/mockData'
import ConstructionTimelineCard from './ConstructionTimelineCard'
import DashboardSkeleton from './DashboardSkeleton'
import DashboardSummaryCards from './DashboardSummaryCards'
import PaymentSummaryCard from './PaymentSummaryCard'
import QuickAccessSection from './QuickAccessSection'
import RecentUpdatesCard from './RecentUpdatesCard'

type DashboardHomeViewProps = {
  project: ProjectData
  timelinePhases: TimelinePhase[]
  updates: ProjectUpdate[]
  sitePhotos: ProjectImage[]
  documents: ProjectDocument[]
  paymentHistoryEntries: PaymentHistoryEntry[]
  chatMessages: ChatMessage[]
}

export default function DashboardHomeView({
  project,
  timelinePhases,
  updates,
  sitePhotos,
  documents,
  paymentHistoryEntries,
  chatMessages,
}: DashboardHomeViewProps) {
  const { navigate, paymentData, confirmPayment, isDashboardLoading } =
    useDashboard()

  if (isDashboardLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardSummaryCards project={project} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ConstructionTimelineCard phases={timelinePhases} />

        <RecentUpdatesCard
          updates={updates}
          onViewAll={() => navigate('progress-updates')}
        />

        <PaymentSummaryCard
          paymentData={paymentData}
          onConfirmPayment={confirmPayment}
        />
      </div>

      <QuickAccessSection
        photos={sitePhotos}
        documents={documents}
        paymentHistoryEntries={paymentHistoryEntries}
        chatMessages={chatMessages}
      />
    </div>
  )
}
