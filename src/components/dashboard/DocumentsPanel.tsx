import { Download, FileText } from 'lucide-react'
import type { ProjectDocument } from '../../data/mockData'
import DashboardPanelModal from './DashboardPanelModal'

type DocumentsPanelProps = {
  isOpen: boolean
  documents: ProjectDocument[]
  onClose: () => void
}

export default function DocumentsPanel({
  isOpen,
  documents,
  onClose,
}: DocumentsPanelProps) {
  return (
    <DashboardPanelModal isOpen={isOpen} title="Project Documents" onClose={onClose}>
      <ul className="divide-y divide-border-light">
        {documents.map((document) => (
          <li
            key={document.id}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="icon-badge h-10 w-10 shrink-0">
                <FileText className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-brand-dark">
                  {document.name}
                </p>
                <p className="text-xs text-gray-500">{document.size}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Download ${document.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-light text-brand-gold transition-colors hover:border-brand-gold/40 hover:bg-brand-gold/5"
            >
              <Download className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </DashboardPanelModal>
  )
}
