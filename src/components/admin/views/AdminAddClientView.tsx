import { motion } from 'framer-motion'
import { AlertTriangle, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useAdminData } from '../../../hooks/useAdminData'

type TimelinePhaseItem = {
  name: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

type PaymentItem = {
  id: string
  amount: number | ''
  dueDate: string
}

const DEFAULT_TIMELINE_PHASES: TimelinePhaseItem[] = [
  { name: 'Foundation', status: 'PENDING' },
  { name: 'Plinth', status: 'PENDING' },
  { name: 'Brick Work', status: 'PENDING' },
  { name: 'Roof', status: 'PENDING' },
  { name: 'Plaster', status: 'PENDING' },
  { name: 'Finishing', status: 'PENDING' },
]

export default function AdminAddClientView({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: (newClientId: number) => void }) {
  const { addProject } = useAdminData()

  // Section A — Client Account
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Section B — Project Details
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [builtUpArea, setBuiltUpArea] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [durationMonths, setDurationMonths] = useState<number | ''>(10)
  const [totalBudget, setTotalBudget] = useState<number | ''>(3500000)
  const [currentStage, setCurrentStage] = useState('Planning & Approval')
  const [overallProgress, setOverallProgress] = useState(0)

  // Section C — Timeline Phases
  const [timeline, setTimeline] = useState<TimelinePhaseItem[]>(DEFAULT_TIMELINE_PHASES)

  // Section D — Payment Schedule
  const [payments, setPayments] = useState<PaymentItem[]>([
    { id: '1', amount: 500000, dueDate: '2026-03-01' },
    { id: '2', amount: 1000000, dueDate: '2026-06-01' },
  ])

  const [loading, setLoading] = useState(false)

  const handleAddPayment = () => {
    setPayments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), amount: '', dueDate: '' },
    ])
  }

  const handleRemovePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id))
  }

  const handlePaymentChange = (id: string, field: keyof PaymentItem, value: any) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const totalScheduled = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const targetBudget = Number(totalBudget) || 0
  const budgetMismatch = totalScheduled !== targetBudget

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !title.trim()) return

    setLoading(true)

    try {
      const created = await addProject({
        clientName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        title: title.trim(),
        location: location.trim(),
        builtUpArea: builtUpArea.trim(),
        bedrooms: bedrooms.trim(),
        durationMonths: typeof durationMonths === 'number' ? durationMonths : 10,
        totalBudget: targetBudget,
        currentStage: currentStage.trim() || 'Planning & Approval',
        overallProgress: Number(overallProgress) || 0,
        paidAmount: 0,
      })

      setLoading(false)
      onSuccess(created.projectId)
    } catch {
      setLoading(false)
      onSuccess(Date.now())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-4xl space-y-8 pb-12"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Add New Client</h2>
          <p className="mt-0.5 text-sm text-white/40">
            Create client account, project specs, timeline phases, and payment schedule.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section A — Client Account */}
        <div className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-brand-gold border-b border-white/[0.06] pb-3">
            Section A — Client Account
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="admin-label">Client Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="admin-input mt-1 w-full"
              />
            </div>
            <div>
              <label className="admin-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="admin-input mt-1 w-full"
              />
            </div>
            <div>
              <label className="admin-label">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 ..."
                className="admin-input mt-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* Section B — Project Details */}
        <div className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-brand-gold border-b border-white/[0.06] pb-3">
            Section B — Project Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Project Title</label>
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
              <label className="admin-label">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gomti Nagar, Lucknow"
                className="admin-input mt-1 w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="admin-label">Built-up Area</label>
              <input
                type="text"
                value={builtUpArea}
                onChange={(e) => setBuiltUpArea(e.target.value)}
                placeholder="e.g. 2400 Sqft"
                className="admin-input mt-1 w-full"
              />
            </div>
            <div>
              <label className="admin-label">Bedrooms</label>
              <input
                type="text"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="e.g. 4 BHK"
                className="admin-input mt-1 w-full"
              />
            </div>
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
              <label className="admin-label">Total Budget (₹)</label>
              <input
                type="number"
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value ? Number(e.target.value) : '')}
                placeholder="3500000"
                className="admin-input mt-1 w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Current Stage</label>
              <input
                type="text"
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
                placeholder="e.g. Planning & Approval"
                className="admin-input mt-1 w-full"
              />
            </div>
            <div>
              <label className="admin-label">Overall Progress (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={overallProgress}
                onChange={(e) => setOverallProgress(Number(e.target.value))}
                className="admin-input mt-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* Section C — Timeline Phases */}
        <div className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-brand-gold border-b border-white/[0.06] pb-3">
            Section C — Timeline Phases
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {timeline.map((phase, i) => (
              <div key={phase.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="text-sm font-medium text-white">{phase.name}</span>
                <select
                  value={phase.status}
                  onChange={(e) => {
                    const next = [...timeline]
                    next[i].status = e.target.value as any
                    setTimeline(next)
                  }}
                  className="admin-input text-xs py-1 px-2"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Section D — Payment Schedule */}
        <div className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="text-lg font-bold text-brand-gold">
              Section D — Payment Schedule
            </h3>
            <button
              type="button"
              onClick={handleAddPayment}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/30 px-3 py-1.5 text-xs font-medium text-brand-gold hover:border-brand-gold/60"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Installment
            </button>
          </div>

          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">₹</span>
                  <input
                    type="number"
                    value={p.amount}
                    onChange={(e) => handlePaymentChange(p.id, 'amount', e.target.value ? Number(e.target.value) : '')}
                    placeholder="Amount"
                    className="admin-input pl-7 w-full"
                  />
                </div>
                <input
                  type="date"
                  value={p.dueDate}
                  onChange={(e) => handlePaymentChange(p.id, 'dueDate', e.target.value)}
                  className="admin-input flex-1"
                />
                {payments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePayment(p.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Running total & Warning banner */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total Scheduled:</span>
              <span className="font-bold text-white">₹{totalScheduled.toLocaleString()}</span>
            </div>

            {budgetMismatch && (
              <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Total scheduled (₹{totalScheduled.toLocaleString()}) does not match Total Budget (₹{targetBudget.toLocaleString()}).
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-6 py-3 text-sm text-white/60 hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-button bg-brand-gold px-8 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight disabled:opacity-50"
          >
            {loading ? 'Creating Client…' : 'Create Client'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
