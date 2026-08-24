import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CloudOff,
  CreditCard,
  Database,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAdminData } from '../../../hooks/useAdminData'
import {
  type AdminProjectListItem,
  type AdminProjectUpdateRequest,
  type PaymentInstallment,
  type TimelinePhaseItem,
  type TimelinePhaseStatus,
} from '../../../services/adminService'
import { ApiError } from '../../../services/api'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + 'Cr'
  return '₹' + (n / 100000).toFixed(1) + 'L'
}

function deriveStatus(progress: number, customStatus?: 'On Track' | 'Delayed' | 'Completed'): 'On Track' | 'Delayed' | 'Completed' {
  if (customStatus) return customStatus
  if (progress >= 100) return 'Completed'
  return 'On Track'
}

const DEFAULT_TIMELINE_PHASES: TimelinePhaseItem[] = [
  { name: 'Foundation', status: 'PENDING' },
  { name: 'Plinth', status: 'PENDING' },
  { name: 'Brick Work', status: 'PENDING' },
  { name: 'Roof', status: 'PENDING' },
  { name: 'Plaster', status: 'PENDING' },
  { name: 'Finishing', status: 'PENDING' },
]

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
      className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-button bg-brand-dark border border-brand-gold/30 px-5 py-3 text-sm font-medium text-white shadow-xl flex items-center gap-2"
    >
      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      {message}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Progress bar & Status pill
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

function StatusPill({ status }: { status: 'On Track' | 'Delayed' | 'Completed' }) {
  const styles = {
    'On Track': 'bg-emerald-500/15 text-emerald-400',
    'Delayed': 'bg-orange-500/15 text-orange-400',
    'Completed': 'bg-blue-500/15 text-blue-400',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || styles['On Track']}`}>
      {status}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Full Client & Project Edit Drawer (Multi-tab)
// ---------------------------------------------------------------------------

type DrawerTab = 'account' | 'specs' | 'timeline' | 'payments'

function EditDrawer({
  client,
  onClose,
  onSave,
  onDelete,
}: {
  client: AdminProjectListItem
  onClose: () => void
  onSave: (req: AdminProjectUpdateRequest) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('specs')

  // Account
  const [clientName, setClientName] = useState(client.clientName || '')
  const [email, setEmail] = useState(client.email || '')
  const [phone, setPhone] = useState(client.phone || '')

  // Specs
  const [title, setTitle] = useState(client.title || '')
  const [location, setLocation] = useState(client.location || '')
  const [builtUpArea, setBuiltUpArea] = useState(client.builtUpArea || '')
  const [bedrooms, setBedrooms] = useState(client.bedrooms || '')
  const [durationMonths, setDurationMonths] = useState<number | ''>(client.durationMonths ?? 10)
  const [status, setStatus] = useState<'On Track' | 'Delayed' | 'Completed'>(client.status || 'On Track')

  // Timeline
  const [overallProgress, setOverallProgress] = useState(client.overallProgress ?? 0)
  const [currentStage, setCurrentStage] = useState(client.currentStage || 'Planning & Approval')
  const [stageStartDate, setStageStartDate] = useState(client.stageStartDate || '')
  const [stageEstCompletion, setStageEstCompletion] = useState(client.stageEstCompletion || '')
  const [nextMilestoneName, setNextMilestoneName] = useState(client.nextMilestoneName || '')
  const [nextMilestoneDate, setNextMilestoneDate] = useState(client.nextMilestoneDate || '')
  const [timeline, setTimeline] = useState<TimelinePhaseItem[]>(
    client.timeline && client.timeline.length > 0 ? client.timeline : DEFAULT_TIMELINE_PHASES
  )

  // Payments
  const [totalBudget, setTotalBudget] = useState<number | ''>(client.totalBudget ?? 3500000)
  const [paidAmount, setPaidAmount] = useState<number | ''>(client.paidAmount ?? 0)
  const [payments, setPayments] = useState<PaymentInstallment[]>(
    client.payments && client.payments.length > 0
      ? client.payments
      : [
          { id: '1', amount: 500000, dueDate: '2026-03-01', isPaid: true },
          { id: '2', amount: 1000000, dueDate: '2026-06-01', isPaid: false },
        ]
  )

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleAddPayment = () => {
    setPayments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), amount: '', dueDate: '', isPaid: false },
    ])
  }

  const handleRemovePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id))
  }

  const handlePaymentChange = (id: string, field: keyof PaymentInstallment, val: any) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    )
  }

  const handlePhaseStatusChange = (index: number, newStatus: TimelinePhaseStatus) => {
    const next = [...timeline]
    next[index] = { ...next[index], status: newStatus }
    setTimeline(next)

    // Automatically recalculate overall progress based on completed phases
    const completedCount = next.filter((p) => p.status === 'COMPLETED').length
    const inProgressCount = next.filter((p) => p.status === 'IN_PROGRESS').length
    const estimatedProgress = Math.round(((completedCount + inProgressCount * 0.5) / next.length) * 100)
    setOverallProgress(estimatedProgress)
  }

  const totalScheduled = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const numericBudget = Number(totalBudget) || 0
  const budgetMismatch = totalScheduled > 0 && totalScheduled !== numericBudget

  const handleSave = async () => {
    if (!clientName.trim() || !title.trim()) {
      setError('Client Name and Project Title are required.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave({
        clientName: clientName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        title: title.trim(),
        location: location.trim(),
        builtUpArea: builtUpArea.trim() || undefined,
        bedrooms: bedrooms.trim() || undefined,
        durationMonths: typeof durationMonths === 'number' ? durationMonths : 10,
        overallProgress: Number(overallProgress) || 0,
        currentStage: currentStage.trim() || 'Planning & Approval',
        stageStartDate: stageStartDate || undefined,
        stageEstCompletion: stageEstCompletion || undefined,
        nextMilestoneName: nextMilestoneName.trim() || undefined,
        nextMilestoneDate: nextMilestoneDate || undefined,
        totalBudget: numericBudget,
        paidAmount: Number(paidAmount) || 0,
        status,
        timeline,
        payments,
      })
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(client.projectId)
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete client.')
      setDeleting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-[620px] flex-col border-l border-white/[0.08] bg-brand-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-white/[0.08] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold font-bold text-lg">
              {client.clientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{client.clientName}</h2>
                <StatusPill status={status} />
              </div>
              <p className="text-xs text-white/40">{client.title} · {client.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
              title="Delete Project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/[0.08] px-6 bg-white/[0.02]">
          {[
            { id: 'specs', label: 'Project Specs', icon: Building2 },
            { id: 'timeline', label: 'Timeline & Progress', icon: Layers },
            { id: 'payments', label: 'Budget & Dues', icon: CreditCard },
            { id: 'account', label: 'Client Profile', icon: User },
          ].map((t) => {
            const Icon = t.icon
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as DrawerTab)}
                className={`relative flex items-center gap-1.5 px-3.5 py-3 text-xs font-semibold transition-colors ${
                  active ? 'text-brand-gold' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
                {active && (
                  <motion.div
                    layoutId="edit-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-button border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* TAB 1: PROJECT SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div>
                <label className="admin-label">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Villa Project"
                  className="admin-input mt-1 w-full"
                />
              </div>

              <div>
                <label className="admin-label">Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Gomti Nagar, Lucknow"
                  className="admin-input mt-1 w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Built-up Area</label>
                  <input
                    type="text"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value)}
                    placeholder="e.g. 2500 Sqft"
                    className="admin-input mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="admin-label">Bedrooms / Units</label>
                  <input
                    type="text"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="e.g. 5 BHK"
                    className="admin-input mt-1 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Duration (months)</label>
                  <input
                    type="number"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value ? Number(e.target.value) : '')}
                    placeholder="10"
                    className="admin-input mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="admin-label">Project Health / Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="admin-input mt-1 w-full"
                  >
                    <option value="On Track">🟢 On Track</option>
                    <option value="Delayed">🟠 Delayed</option>
                    <option value="Completed">🔵 Completed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE & PROGRESS */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Progress Slider */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Overall Progress</span>
                  <span className="text-sm font-bold text-white">{overallProgress}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={overallProgress}
                    onChange={(e) => setOverallProgress(Number(e.target.value))}
                    className="h-2 flex-1 cursor-pointer accent-brand-gold"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={overallProgress}
                    onChange={(e) => setOverallProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-16 rounded-button border border-white/10 bg-white/5 px-2 py-1 text-center text-sm text-white focus:border-brand-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Current Stage */}
              <div>
                <label className="admin-label">Current Construction Stage</label>
                <input
                  type="text"
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value)}
                  placeholder="e.g. Brick Work"
                  className="admin-input mt-1 w-full"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                    Stage Start Date
                  </label>
                  <input
                    type="date"
                    value={stageStartDate}
                    onChange={(e) => setStageStartDate(e.target.value)}
                    className="admin-input mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="admin-label flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-gold" />
                    Est. Completion Date
                  </label>
                  <input
                    type="date"
                    value={stageEstCompletion}
                    onChange={(e) => setStageEstCompletion(e.target.value)}
                    className="admin-input mt-1 w-full"
                  />
                </div>
              </div>

              {/* Milestone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Next Milestone Name</label>
                  <input
                    type="text"
                    value={nextMilestoneName}
                    onChange={(e) => setNextMilestoneName(e.target.value)}
                    placeholder="e.g. Roof Slab Casting"
                    className="admin-input mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="admin-label">Milestone Target Date</label>
                  <input
                    type="date"
                    value={nextMilestoneDate}
                    onChange={(e) => setNextMilestoneDate(e.target.value)}
                    className="admin-input mt-1 w-full"
                  />
                </div>
              </div>

              {/* Timeline Phases */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
                  Timeline Phases ({timeline.filter(p => p.status === 'COMPLETED').length}/{timeline.length} completed)
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {timeline.map((phase, i) => (
                    <div key={phase.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5">
                      <span className="text-xs font-medium text-white">{phase.name}</span>
                      <select
                        value={phase.status}
                        onChange={(e) => handlePhaseStatusChange(i, e.target.value as TimelinePhaseStatus)}
                        className="admin-input text-xs py-1 px-1.5 rounded"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUDGET & PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Total Budget (₹)</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value ? Number(e.target.value) : '')}
                      className="admin-input pl-7 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Paid / Received Amount (₹)</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value ? Number(e.target.value) : '')}
                      className="admin-input pl-7 w-full text-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Installments Schedule */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Payment Schedule</span>
                    <p className="text-xs text-white/40">Manage installment milestones</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="inline-flex items-center gap-1 rounded-lg border border-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-gold hover:border-brand-gold/60"
                  >
                    <Plus className="h-3 w-3" />
                    Add Installment
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white/40">₹</span>
                        <input
                          type="number"
                          value={p.amount}
                          onChange={(e) => handlePaymentChange(p.id, 'amount', e.target.value ? Number(e.target.value) : '')}
                          placeholder="Amount"
                          className="admin-input text-xs py-1 pl-5 w-full"
                        />
                      </div>
                      <input
                        type="date"
                        value={p.dueDate}
                        onChange={(e) => handlePaymentChange(p.id, 'dueDate', e.target.value)}
                        className="admin-input text-xs py-1 w-32"
                      />
                      <label className="flex items-center gap-1 text-[11px] text-white/60 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!p.isPaid}
                          onChange={(e) => handlePaymentChange(p.id, 'isPaid', e.target.checked)}
                          className="accent-brand-gold rounded"
                        />
                        Paid
                      </label>
                      {payments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePayment(p.id)}
                          className="rounded p-1 text-white/30 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                  <span className="text-white/50">Total Scheduled:</span>
                  <span className="font-bold text-white">₹{totalScheduled.toLocaleString()}</span>
                </div>

                {budgetMismatch && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>Scheduled sum (₹{totalScheduled.toLocaleString()}) does not match Total Budget (₹{numericBudget.toLocaleString()}).</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div>
                <label className="admin-label">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Full Name"
                  className="admin-input mt-1 w-full"
                />
              </div>

              <div>
                <label className="admin-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="admin-input mt-1 w-full"
                />
              </div>

              <div>
                <label className="admin-label">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="admin-input mt-1 w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.08] px-6 py-4 flex items-center justify-between gap-3 bg-brand-darkCard">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-white/60 hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="interactive-focus rounded-button bg-brand-gold px-6 py-2.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95 disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Saving Changes…
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            >
              <div className="w-full max-w-sm rounded-card border border-red-500/30 bg-brand-darkCard p-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <Trash2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">Delete Client Project?</h3>
                <p className="text-xs text-white/50">
                  Are you sure you want to delete <span className="font-semibold text-white">"{client.clientName}"</span> and all project records? This action cannot be undone.
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 rounded-lg border border-white/10 py-2 text-xs font-medium text-white/70 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  const { data, isLoading, isOffline, refetch, updateProject, deleteProject } = useAdminData()
  const clients = data.projects

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = clients.filter((c) =>
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase()),
  )

  const selectedClient = clients.find((c) => c.projectId === selectedId) ?? null

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
    setToast('Client data refreshed')
  }

  const handleSaveDrawer = async (req: AdminProjectUpdateRequest) => {
    if (!selectedClient) return
    await updateProject(selectedClient.projectId, req)
    setToast('Client & project updated successfully')
  }

  const handleDeleteDrawer = async (id: number) => {
    await deleteProject(id)
    setSelectedId(null)
    setToast('Client project deleted')
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Clients</h2>
            {isOffline ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                <CloudOff className="h-3 w-3" />
                Local Mode
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <Database className="h-3 w-3" />
                Live Database
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-white/40">
            {isLoading ? 'Loading…' : `${clients.length} registered · click any row to edit all features`}
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
              placeholder="Search by name, title, location…"
              className="h-10 w-56 rounded-button border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/20 sm:w-64"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex h-10 w-10 items-center justify-center rounded-button border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-brand-gold' : ''}`} />
          </button>

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
                    <td colSpan={8} className="py-14 text-center">
                      <div className="mx-auto max-w-sm text-center">
                        <p className="text-sm font-medium text-gray-700">
                          {search ? `No clients match "${search}"` : 'No clients found.'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {search ? 'Try clearing your search term.' : 'Get started by creating your first client account.'}
                        </p>
                        {onNavigateToAddClient && !search && (
                          <button
                            type="button"
                            onClick={onNavigateToAddClient}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-dark px-4 py-2 text-xs font-semibold text-brand-gold hover:bg-black"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Client
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((client, i) => {
                    const status = deriveStatus(client.overallProgress, client.status)
                    return (
                      <motion.tr
                        key={client.projectId}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        onClick={() => setSelectedId(client.projectId)}
                        className={`cursor-pointer border-b border-gray-50 transition-colors hover:bg-brand-gold/5 active:bg-brand-gold/10 ${i % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'}`}
                      >
                        <td className="px-4 py-3.5 font-medium text-gray-900">
                          <div>
                            <p>{client.clientName}</p>
                            {client.phone && <p className="text-[11px] text-gray-400 font-normal">{client.phone}</p>}
                          </div>
                        </td>
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

      {/* Slide-over full-featured drawer */}
      <AnimatePresence>
        {selectedClient && (
          <EditDrawer
            key={selectedClient.projectId}
            client={selectedClient}
            onClose={() => setSelectedId(null)}
            onSave={handleSaveDrawer}
            onDelete={handleDeleteDrawer}
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


