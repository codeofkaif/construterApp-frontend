import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  ExternalLink,
  Minus,
  Plus,
  RefreshCw,
  Save,
  Upload,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import {
  LUCIDE_ICON_MAP,
  useHomepage,
  type HomepageContent,
  type TrustStat,
} from '../../../context/HomepageContext'

const ICON_OPTIONS = Object.keys(LUCIDE_ICON_MAP)

function StatRow({
  stat,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  stat: TrustStat
  index: number
  onChange: (index: number, updated: TrustStat) => void
  onRemove: (index: number) => void
  canRemove: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={stat.iconName}
        onChange={(e) => onChange(index, { ...stat, iconName: e.target.value })}
        className="admin-input w-36 shrink-0"
      >
        {ICON_OPTIONS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="e.g. 120+"
        value={stat.number}
        onChange={(e) => onChange(index, { ...stat, number: e.target.value })}
        className="admin-input w-28 shrink-0"
      />

      <input
        type="text"
        placeholder="Label"
        value={stat.label}
        onChange={(e) => onChange(index, { ...stat, label: e.target.value })}
        className="admin-input flex-1"
      />

      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:border-red-500/40 hover:text-red-400"
          aria-label="Remove stat row"
        >
          <Minus className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default function AdminHomepageView() {
  const { content, setContent } = useHomepage()
  const [form, setForm] = useState<HomepageContent>({ ...content, trustStats: [...content.trustStats] })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        setForm((p) => ({ ...p, heroBgUrl: result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await setContent(form)
      setToast('Homepage content & image saved successfully!')
      setTimeout(() => setToast(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save homepage content.')
    } finally {
      setSaving(false)
    }
  }

  const updateStat = (index: number, updated: TrustStat) => {
    setForm((prev) => {
      const stats = [...prev.trustStats]
      stats[index] = updated
      return { ...prev, trustStats: stats }
    })
  }

  const removeStat = (index: number) => {
    setForm((prev) => ({
      ...prev,
      trustStats: prev.trustStats.filter((_, i) => i !== index),
    }))
  }

  const addStat = () => {
    if (form.trustStats.length >= 4) return
    setForm((prev) => ({
      ...prev,
      trustStats: [
        ...prev.trustStats,
        { iconName: 'Building2', number: '0+', label: 'New Stat' },
      ],
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Homepage</h2>
          <p className="mt-1 text-sm text-white/40">
            Edit hero content & background image — changes reflect on the landing page instantly after saving.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.open('/', '_blank')}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Landing Page
        </button>
      </div>

      {/* Card */}
      <div className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8">
        <div className="space-y-6">
          {error && (
            <div className="rounded-button border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Hero BG */}
          <div>
            <div className="flex items-center justify-between">
              <label className="admin-label mb-0">Hero Background Image</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/30 px-3 py-1 text-xs font-medium text-brand-gold hover:border-brand-gold/60 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Image File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={form.heroBgUrl}
                onChange={(e) => setForm((p) => ({ ...p, heroBgUrl: e.target.value }))}
                placeholder="Paste Image URL (https://...) or upload file from device"
                className="admin-input flex-1"
              />
              {form.heroBgUrl && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, heroBgUrl: '' }))}
                  className="rounded-lg border border-white/10 p-2 text-white/40 hover:text-red-400"
                  title="Clear Image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {form.heroBgUrl && (
              <div className="mt-3 relative h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <img
                  src={form.heroBgUrl}
                  alt="Hero preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm">
                  Live Hero Preview
                </div>
              </div>
            )}
          </div>

          {/* Hero Heading */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Heading Line 1</label>
              <input
                type="text"
                value={form.heroLine1}
                onChange={(e) => setForm((p) => ({ ...p, heroLine1: e.target.value }))}
                placeholder="Building Dreams,"
                className="admin-input mt-2 w-full"
              />
            </div>
            <div>
              <label className="admin-label">Heading Line 2</label>
              <input
                type="text"
                value={form.heroLine2}
                onChange={(e) => setForm((p) => ({ ...p, heroLine2: e.target.value }))}
                placeholder="Creating Homes"
                className="admin-input mt-2 w-full"
              />
            </div>
          </div>

          {/* Subtext */}
          <div>
            <label className="admin-label">Hero Subtext</label>
            <textarea
              value={form.heroSubtext}
              onChange={(e) => setForm((p) => ({ ...p, heroSubtext: e.target.value }))}
              rows={3}
              className="admin-input mt-2 w-full resize-none"
            />
          </div>

          {/* Trust Stats */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="admin-label mb-0">Trust Stats</label>
              <button
                type="button"
                onClick={addStat}
                disabled={form.trustStats.length >= 4}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/30 px-3 py-1.5 text-xs font-medium text-brand-gold transition-colors hover:border-brand-gold/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Row
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-[144px_112px_1fr_36px] gap-3 px-1">
                <span className="text-[10px] uppercase tracking-wide text-white/30">Icon</span>
                <span className="text-[10px] uppercase tracking-wide text-white/30">Number</span>
                <span className="text-[10px] uppercase tracking-wide text-white/30">Label</span>
                <span />
              </div>
              {form.trustStats.map((stat, i) => (
                <StatRow
                  key={i}
                  stat={stat}
                  index={i}
                  onChange={updateStat}
                  onRemove={removeStat}
                  canRemove={form.trustStats.length > 1}
                />
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-white/[0.06] pt-6">
            <motion.button
              type="button"
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-goldLight disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-button bg-brand-dark border border-brand-gold/30 px-5 py-3 text-sm font-medium text-white shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

