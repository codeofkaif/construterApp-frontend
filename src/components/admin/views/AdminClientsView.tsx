import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAdminData } from '../../../hooks/useAdminData'
import { adminService, type AdminProjectListItem } from '../../../services/adminService'
import { ApiError } from '../../../services/api'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number) {
  return '₹' + (n / 100000).toFixed(1) + 'L'
}

function deriveStatus(progress: number): 'On Track' | 'Delayed' {
  return progress >= 100 ? 'On Track' : 'On Track'   // No est-completion from list API; show 'On Track' by default
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-button bg-brand-dark border border-brand-gold/30 px-5 py-3 text-sm font-medium text-white shadow-xl"
    >
      ✅ {message}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-brand-gold transition-all" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums text-white/60">{value}%</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Status pill
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: 'On Track' | 'Delayed' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      status === 'On Track' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'
    }`}>
      {status}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Edit Drawer — inline progress + budget edit
// ---------------------------------------------------------------------------

type EditForm = {
  overallProgress: number
  totalBudget: number
}

function EditDrawer({
  client,
  onClose,
  onSaved,
}: {
  client: AdminProjectListItem
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<EditForm>({
    overallProgress: client.overallProgress,
    totalBudget: client.totalBudget,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await adminService.updateProject(client.projectId, {
        overallProgress: form.overallProgress,
        totalBudget: form.totalBudget,
        currentStage: client.currentStage,
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-[420px] flex-col border-l border-white/[0.08] bg-brand-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-white/[0.08] px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-gold">Edit Project</p>
            <h2 className="mt-0.5 text-lg font-bold text-white">{client.clientName}</h2>
            <p className="text-sm text-white/40">{client.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {error && (
            <div className="rounded-button border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Progress */}
          <section>
            <p className="mb-1.5 text-xs font-medium text-white/50">Overall Progress</p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={form.overallProgress}
                onChange={(e) => setForm((f) => ({ ...f, overallProgress: Number(e.target.value) }))}
                className="h-2 flex-1 cursor-pointer accent-brand-gold"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={form.overallProgress}
                onChange={(e) => setForm((f) => ({ ...f, overallProgress: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                className="w-16 rounded-button border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm text-white focus:border-brand-gold/50 focus:outline-none"
              />
              <span className="text-sm text-white/40">%</span>
            </div>
          </section>

          {/* Total Budget */}
          <section>
            <p className="mb-1.5 text-xs font-medium text-white/50">Total Budget (₹)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">₹</span>
              <input
                type="number"
                min={0}
                step={10000}
                value={form.totalBudget}
                onChange={(e) => setForm((f) => ({ ...f, totalBudget: Number(e.target.value) }))}
                className="w-full rounded-button border border-white/10 bg-white/5 py-2.5 pl-7 pr-3 text-sm text-white focus:border-brand-gold/50 focus:outline-none"
              />
            </div>
          </section>

          <div className="h-4" />
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.08] px-6 py-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="interactive-focus w-full rounded-button bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export default function AdminClientsView({
  onNavigateToAddClient,
}: {
  onNavigateToAddClient?: () => void
}) {
  const { data, isLoading, refetch } = useAdminData()
  const clients = data.projects

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = clients.filter((c) =>
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()),
  )

  const selectedClient = clients.find((c) => c.projectId === selectedId) ?? null

  const handleSaved = async () => {
    await refetch()
    setToast('Project updated successfully')
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Clients</h2>
          <p className="mt-0.5 text-sm text-white/40">
            {isLoading ? 'Loading…' : `${clients.length} registered · click a row to edit`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="h-10 w-56 rounded-button border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/20 sm:w-64"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {onNavigateToAddClient && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNavigateToAddClient}
              className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
            >
              <Plus className="h-4 w-4" />
              New Client
            </motion.button>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-white/5" />
          ))}
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  {['Client Name', 'Project Title', 'Location', 'Progress', 'Current Stage', 'Total Budget', 'Paid', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-sm text-gray-400">
                      {search ? `No clients match "${search}"` : 'No clients found.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((client, i) => {
                    const status = deriveStatus(client.overallProgress)
                    return (
                      <motion.tr
                        key={client.projectId}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        onClick={() => setSelectedId(client.projectId)}
                        className={`cursor-pointer border-b border-gray-50 transition-colors hover:bg-brand-gold/5 active:bg-brand-gold/10 ${i % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'}`}
                      >
                        <td className="px-4 py-3.5 font-medium text-gray-900">{client.clientName}</td>
                        <td className="px-4 py-3.5 text-gray-600">{client.title}</td>
                        <td className="px-4 py-3.5 text-gray-500">{client.location}</td>
                        <td className="px-4 py-3.5"><ProgressBar value={client.overallProgress} /></td>
                        <td className="px-4 py-3.5 text-gray-600">{client.currentStage}</td>
                        <td className="px-4 py-3.5 font-medium text-gray-900">{fmt(client.totalBudget)}</td>
                        <td className="px-4 py-3.5 text-emerald-600 font-medium">{fmt(client.paidAmount)}</td>
                        <td className="px-4 py-3.5"><StatusPill status={status} /></td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over drawer */}
      <AnimatePresence>
        {selectedClient && (
          <EditDrawer
            key={selectedClient.projectId}
            client={selectedClient}
            onClose={() => setSelectedId(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
