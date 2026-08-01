import { AnimatePresence, motion } from 'framer-motion'
import { ImageIcon, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAdminData } from '../../../hooks/useAdminData'
import { adminService } from '../../../services/adminService'
import { ApiError } from '../../../services/api'

// ---------------------------------------------------------------------------
// Shared micro-components
// ---------------------------------------------------------------------------

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-white/60">{children}</label>
}

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
      className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-button border border-brand-gold/30 bg-brand-dark px-5 py-3 text-sm font-medium text-white shadow-xl"
    >
      ✅ {message}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Searchable client dropdown
// ---------------------------------------------------------------------------

function ClientDropdown({
  clients,
  value,
  onChange,
}: {
  clients: { id: number; clientName: string; projectTitle: string }[]
  value: number | null
  onChange: (id: number) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = clients.filter(
    (c) =>
      c.clientName.toLowerCase().includes(query.toLowerCase()) ||
      c.projectTitle.toLowerCase().includes(query.toLowerCase()),
  )

  const selected = clients.find((c) => c.id === value)

  useEffect(() => {
    if (!open) return
    const el = document.querySelector('[data-client-dropdown]') as HTMLElement | null
    const handler = (e: MouseEvent) => {
      if (el && !el.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" data-client-dropdown>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-button border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:border-brand-gold/40 focus:border-brand-gold/50 focus:outline-none"
      >
        {selected ? (
          <span>
            {selected.clientName}{' '}
            <span className="text-white/40">— {selected.projectTitle}</span>
          </span>
        ) : (
          <span className="text-white/30">Select a client…</span>
        )}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="h-4 w-4 shrink-0 text-white/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-card border border-white/[0.08] bg-brand-darkCard shadow-xl"
          >
            <div className="border-b border-white/[0.06] p-2">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search client or project…"
                className="w-full rounded-button bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
            <ul className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-white/30">No matches</li>
              ) : (
                filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => { onChange(c.id); setOpen(false); setQuery('') }}
                      className={`flex w-full flex-col px-4 py-2.5 text-left transition-colors hover:bg-white/5 ${value === c.id ? 'bg-brand-gold/10 text-brand-gold' : 'text-white'}`}
                    >
                      <span className="text-sm font-medium">{c.clientName}</span>
                      <span className="text-xs text-white/40">{c.projectTitle}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Image URL preview
// ---------------------------------------------------------------------------

function ImagePreview({ url }: { url: string }) {
  const [error, setError] = useState(false)
  useEffect(() => setError(false), [url])

  if (!url) return null
  if (error) {
    return (
      <div className="mt-2 flex h-32 items-center justify-center rounded-card border border-white/10 bg-white/5">
        <p className="text-xs text-white/30">Invalid image URL</p>
      </div>
    )
  }
  return (
    <img
      src={url}
      alt="Preview"
      onError={() => setError(true)}
      className="mt-2 h-32 w-full rounded-card object-cover border border-white/10"
    />
  )
}

// ---------------------------------------------------------------------------
// Blank form state
// ---------------------------------------------------------------------------

const BLANK = {
  clientId: null as number | null,
  title: '',
  description: '',
  photoUrl: '',
}

// ---------------------------------------------------------------------------
// View
// ---------------------------------------------------------------------------

export default function AdminSendUpdateView() {
  const { data, isLoading: clientsLoading } = useAdminData()

  const clientOptions = data.projects.map((p) => ({
    id: p.projectId,
    clientName: p.clientName,
    projectTitle: p.title,
  }))

  const [form, setForm] = useState(BLANK)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof BLANK, string>>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof typeof BLANK>(k: K, v: typeof BLANK[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
    setApiError(null)
  }

  const validate = () => {
    const errs: Partial<Record<keyof typeof BLANK, string>> = {}
    if (!form.clientId) errs.clientId = 'Please select a client'
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setApiError(null)
    try {
      await adminService.postUpdate({
        projectId: form.clientId!,
        title: form.title.trim(),
        description: form.description.trim(),
        thumbnailUrl: form.photoUrl.trim() || undefined,
      })
      setToast('Update posted successfully')
      setForm(BLANK)
      setErrors({})
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Failed to post update. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Send Update</h2>
        <p className="mt-0.5 text-sm text-white/40">Post a progress update for a client project</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8"
      >
        <div className="space-y-5">

          {apiError && (
            <div className="rounded-button border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-400">
              {apiError}
            </div>
          )}

          {/* Client picker */}
          <div>
            <Label>Select Client *</Label>
            <ClientDropdown
              clients={clientOptions}
              value={form.clientId}
              onChange={(id) => set('clientId', id)}
            />
            {errors.clientId && <p className="mt-1.5 text-xs text-red-400">{errors.clientId}</p>}
          </div>

          {/* Update title */}
          <div>
            <Label>Update Title *</Label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Brick work on Ground Floor completed"
              className="w-full rounded-button border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the update in detail…"
              className="w-full resize-none rounded-button border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-400">{errors.description}</p>}
          </div>

          {/* Photo URL */}
          <div>
            <Label>
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                Photo URL <span className="text-white/30">(optional)</span>
              </span>
            </Label>
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => set('photoUrl', e.target.value)}
              placeholder="https://example.com/site-photo.jpg"
              className="w-full rounded-button border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
            />
            <ImagePreview url={form.photoUrl} />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || clientsLoading}
              whileTap={{ scale: 0.97 }}
              className="interactive-focus inline-flex items-center gap-2 rounded-button bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-goldLight disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Posting…' : 'Post Update'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
