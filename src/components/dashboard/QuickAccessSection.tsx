import { motion } from 'framer-motion'
import {
  FolderOpen,
  Headphones,
  Image,
  Receipt,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import type {
  ChatMessage,
  PaymentHistoryEntry,
  ProjectDocument,
  ProjectImage,
} from '../../data/mockData'
import ContactEngineerModal from './ContactEngineerModal'
import DocumentsPanel from './DocumentsPanel'
import PaymentHistoryPanel from './PaymentHistoryPanel'
import SitePhotosPanel from './SitePhotosPanel'

type QuickAccessAction = 'photos' | 'documents' | 'payment-history' | 'engineer'

type QuickAccessItem = {
  id: QuickAccessAction
  label: string
  icon: LucideIcon
}

const quickAccessItems: QuickAccessItem[] = [
  { id: 'photos', label: 'View Photos', icon: Image },
  { id: 'documents', label: 'View Documents', icon: FolderOpen },
  { id: 'payment-history', label: 'Payment History', icon: Receipt },
  { id: 'engineer', label: 'Contact Site Engineer', icon: Headphones },
]

type QuickAccessSectionProps = {
  photos: ProjectImage[]
  documents: ProjectDocument[]
  paymentHistoryEntries: PaymentHistoryEntry[]
  chatMessages: ChatMessage[]
}

export default function QuickAccessSection({
  photos,
  documents,
  paymentHistoryEntries,
  chatMessages,
}: QuickAccessSectionProps) {
  const [activePanel, setActivePanel] = useState<QuickAccessAction | null>(null)

  const closePanel = () => setActivePanel(null)

  return (
    <>
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Quick Access
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {quickAccessItems.map((item) => {
            const Icon = item.icon

            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => setActivePanel(item.id)}
                className="interactive-focus group flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-border-light bg-white p-4 text-center transition-colors hover:border-brand-gold active:scale-[0.98] sm:min-h-[132px]"
              >
                <div className="icon-badge mb-3 h-11 w-11">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="break-words text-sm font-medium leading-snug text-brand-dark">
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <SitePhotosPanel
        isOpen={activePanel === 'photos'}
        photos={photos}
        onClose={closePanel}
      />

      <DocumentsPanel
        isOpen={activePanel === 'documents'}
        documents={documents}
        onClose={closePanel}
      />

      <PaymentHistoryPanel
        isOpen={activePanel === 'payment-history'}
        entries={paymentHistoryEntries}
        onClose={closePanel}
      />

      <ContactEngineerModal
        isOpen={activePanel === 'engineer'}
        initialMessages={chatMessages}
        onClose={closePanel}
      />
    </>
  )
}
