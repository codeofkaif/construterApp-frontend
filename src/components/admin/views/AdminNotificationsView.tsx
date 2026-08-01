import { AnimatePresence, motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAdminData } from '../../../hooks/useAdminData'
import { adminService } from '../../../services/adminService'
import { ApiError } from '../../../services/api'

// ---------------------------------------------------------------------------
// Shared helpers
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
// Tab: Send New
// ---------------------------------------------------------------------------

function SendNewTab() {
  const { data } = useAdminData()
  const clients = data.projects

  const [recipientId, setRecipientId] = useState('')
  const [message, setMessage]         = useState('')
  const [errors, setErrors]           = useState({ recipientId: '', message: '' })
  const [submitting, setSubmitting]   = useState(false)
  const [toast, setToast]             = useState<string | null>(null)
  const [apiError, setApiError]       = useState<string | null>(null)

  const validate = () => {
    const e = { recipientId: '', message: '' }
    if (!recipientId) e.recipientId = 'Please select a recipient'
    if (!message.trim()) e.message = 'Message cannot be empty'
    return e
  }

  const handleSend = async () => {
    const errs = validate()
    if (errs.recipientId || errs.message) { setErrors(errs); return }
    setSubmitting(true)
    setApiError(null)

    const isAll = recipientId === 'all'

    try {
      await adminService.sendNotification({
        clientId: isAll ? null : Number(recipientId),
        broadcastToAll: isAll,
        message: message.trim(),
      })
      setToast('Notification sent successfully')
      setRecipientId('')
      setMessage('')
      setErrors({ recipientId: '', message: '' })
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Failed to send notification.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8"
    >
      <div className="space-y-5">
        {apiError && (
          <div className="rounded-button border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-400">
            {apiError}
          </div>
        )}

        {/* Recipient */}
        <div>
          <Label>Recipient *</Label>
          <select
            value={recipientId}
            onChange={(e) => { setRecipientId(e.target.value); setErrors((err) => ({ ...err, recipientId: '' })) }}
            className="w-full rounded-button border border-white/10 bg-brand-dark px-4 py-3 text-sm text-white focus:border-brand-gold/50 focus:outline-none"
          >
            <option value="" disabled>Select recipient…</option>
            <option value="all">📢 All Clients (Broadcast)</option>
            <optgroup label="─────────────">
              {clients.map((c) => (
                <option key={c.projectId} value={String(c.projectId)}>
                  {c.clientName} — {c.title}
                </option>
              ))}
            </optgroup>
          </select>
          {errors.recipientId && <p className="mt-1.5 text-xs text-red-400">{errors.recipientId}</p>}
        </div>

        {/* Message */}
        <div>
          <Label>Message *</Label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setErrors((err) => ({ ...err, message: '' })) }}
            placeholder="Write your notification message…"
            className="w-full resize-none rounded-button border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
          />
          {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
        </div>

        {/* CTA */}
        <div className="pt-1">
          <motion.button
            type="button"
            onClick={handleSend}
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
            className="interactive-focus inline-flex items-center gap-2 rounded-button bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-goldLight disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Sending…' : 'Send Notification'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Sent History — no GET endpoint in backend yet
// ---------------------------------------------------------------------------

function SentHistoryTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-card border border-white/[0.08] bg-brand-darkCard"
    >
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-white/30">Notification history will be available in a future update.</p>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

type TabId = 'send-new' | 'history'

const TABS: { id: TabId; label: string }[] = [
  { id: 'send-new', label: 'Send New' },
  { id: 'history',  label: 'Sent History' },
]

export default function AdminNotificationsView() {
  const [activeTab, setActiveTab] = useState<TabId>('send-new')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <p className="mt-0.5 text-sm text-white/40">Send messages to clients or view sent history</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative rounded-button px-5 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-brand-dark' : 'text-white/50 hover:text-white'}`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="notif-tab-pill"
                className="absolute inset-0 rounded-button bg-brand-gold"
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'send-new' ? (
          <SendNewTab key="send-new" />
        ) : (
          <SentHistoryTab key="history" />
        )}
      </AnimatePresence>
    </div>
  )
}
