import { Download, FileText } from 'lucide-react'

export type AppDocument = {
  id: string
  name: string
  size: string
  fileUrl?: string
}

type DocumentsViewProps = {
  documents: AppDocument[]
}

function downloadFile(url: string, name: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default function DocumentsView({ documents }: DocumentsViewProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
          Documents
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Project agreements, plans, and payment receipts.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border border-border-light bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-400">No documents uploaded yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border-light overflow-hidden rounded-xl border border-border-light bg-white shadow-sm">
          {documents.map((document) => (
            <li
              key={document.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="icon-badge h-10 w-10 shrink-0">
                  <FileText className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-dark">
                    {document.name}
                  </p>
                  {document.size && (
                    <p className="text-xs text-gray-500">{document.size}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label={`Download ${document.name}`}
                disabled={!document.fileUrl}
                onClick={() => document.fileUrl && downloadFile(document.fileUrl, document.name)}
                className="interactive-focus flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-light text-brand-gold transition-colors hover:border-brand-gold/40 hover:bg-brand-gold/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
