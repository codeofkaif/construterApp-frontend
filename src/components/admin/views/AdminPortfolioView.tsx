import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Edit2,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import {
  usePortfolio,
  type PortfolioProject,
  type ProjectImage,
} from '../../../context/PortfolioContext'

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---------------------------------------------------------------------------
// Project Form Modal
// ---------------------------------------------------------------------------

type ModalProps = {
  initial: Partial<PortfolioProject> | null
  onSave: (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => Promise<void>
  onClose: () => void
}

function ProjectModal({ initial, onSave, onClose }: ModalProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [featured, setFeatured] = useState(initial?.featured ?? false)

  // Stats fields
  const [builtUp, setBuiltUp] = useState(
    initial?.stats?.find((s) => s.label === 'Built-up Area')?.value ?? ''
  )
  const [bedrooms, setBedrooms] = useState(
    initial?.stats?.find((s) => s.label === 'Bedrooms')?.value ?? ''
  )
  const [duration, setDuration] = useState(
    initial?.stats?.find((s) => s.label === 'Duration')?.value ?? ''
  )
  const [budget, setBudget] = useState(
    initial?.stats?.find((s) => s.label === 'Budget')?.value ?? ''
  )

  // Photo gallery repeatable rows
  const [images, setImages] = useState<ProjectImage[]>(
    initial?.images?.length ? initial.images : [{ url: '', alt: '' }]
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddPhoto = () => {
    setImages((prev) => [...prev, { url: '', alt: '' }])
  }

  const handleRemovePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageChange = (index: number, url: string) => {
    setImages((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], url }
      return next
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        setImages((prev) => {
          // If first image is empty, replace it, else append
          if (prev.length === 1 && !prev[0].url) {
            return [{ url: result, alt: title || 'Project photo' }]
          }
          return [...prev, { url: result, alt: title || 'Project photo' }]
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Project title is required.')
      return
    }

    setSaving(true)
    setError(null)

    const stats = [
      { value: builtUp.trim() || 'N/A', label: 'Built-up Area' },
      { value: bedrooms.trim() || 'N/A', label: 'Bedrooms' },
      { value: duration.trim() || 'N/A', label: 'Duration' },
      { value: budget.trim() || 'N/A', label: 'Budget' },
    ]

    const validImages = images.filter((img) => img.url.trim() !== '')

    try {
      await onSave({
        title: title.trim(),
        slug: initial?.slug ?? slugify(title.trim()),
        location: location.trim(),
        featured,
        stats,
        images: validImages.length ? validImages : [{ url: '', alt: title }],
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {initial?.id ? 'Edit Project' : 'Add Project'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-button border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Main Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Luxury Villa"
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
                placeholder="e.g. Lucknow, UP"
                className="admin-input mt-1 w-full"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div>
            <label className="admin-label mb-2">Project Stats</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <span className="text-[10px] text-white/40">Built-up Area</span>
                <input
                  type="text"
                  value={builtUp}
                  onChange={(e) => setBuiltUp(e.target.value)}
                  placeholder="e.g. 2500 Sqft"
                  className="admin-input mt-0.5 w-full"
                />
              </div>
              <div>
                <span className="text-[10px] text-white/40">Bedrooms</span>
                <input
                  type="text"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="e.g. 5 BHK"
                  className="admin-input mt-0.5 w-full"
                />
              </div>
              <div>
                <span className="text-[10px] text-white/40">Duration</span>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 10 Months"
                  className="admin-input mt-0.5 w-full"
                />
              </div>
              <div>
                <span className="text-[10px] text-white/40">Budget</span>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹38 Lakh"
                  className="admin-input mt-0.5 w-full"
                />
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/5 p-4">
            <div>
              <p className="text-sm font-semibold text-white">Feature on Homepage</p>
              <p className="text-xs text-white/40">
                Only one project can be featured at a time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                featured ? 'bg-brand-gold' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-brand-dark transition-transform ${
                  featured ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Photo Gallery */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="admin-label mb-0">Photo Gallery</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-lg border border-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-gold hover:border-brand-gold/60"
                >
                  <Upload className="h-3 w-3" />
                  Upload Photo File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-white/70 hover:border-white/20 hover:text-white"
                >
                  <Plus className="h-3 w-3" />
                  Add URL
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={`Photo ${i + 1}`}
                      className="h-12 w-16 rounded-md object-cover border border-white/10 shrink-0 bg-black/20"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/30">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                      placeholder="Paste Image URL (https://...) or upload file above"
                      className="admin-input text-xs py-1.5 w-full"
                    />
                  </div>

                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400"
                      title="Remove Photo"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-button bg-brand-gold px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Project'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Confirm Delete Dialog
// ---------------------------------------------------------------------------

function ConfirmDialog({
  title,
  onConfirm,
  onCancel,
}: {
  title: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-brand-darkCard p-6 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <Trash2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-white">Delete Project?</h3>
        <p className="mt-2 text-sm text-white/50">
          "{title}" will be permanently removed.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AdminPortfolioView
// ---------------------------------------------------------------------------

export default function AdminPortfolioView() {
  const { projects, addProject, updateProject, deleteProject, toggleFeatured } = usePortfolio()
  const [modalTarget, setModalTarget] = useState<PortfolioProject | 'new' | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const handleSave = async (data: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    if (modalTarget === 'new') {
      await addProject(data)
      setToast('Project added and saved to backend!')
    } else if (modalTarget) {
      await updateProject((modalTarget as PortfolioProject).id, data)
      setToast('Project and photos updated successfully!')
    }
    setTimeout(() => setToast(null), 3000)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteProject(deleteTarget.id)
    setDeleteTarget(null)
    setToast('Project deleted successfully!')
    setTimeout(() => setToast(null), 3000)
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
          <h2 className="text-2xl font-bold text-white">Portfolio</h2>
          <p className="mt-1 text-sm text-white/40">
            Manage portfolio projects and toggle which project appears as Featured on the homepage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.open('/#projects', '_blank')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Preview
          </button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalTarget('new')}
            className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const mainImg = project.images[0]?.url || ''
          return (
            <div
              key={project.id}
              className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-brand-darkCard"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full bg-white/5">
                {mainImg ? (
                  <img
                    src={mainImg}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/30">
                    No Image
                  </div>
                )}
                {project.featured && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-gold px-2.5 py-1 text-[11px] font-bold text-brand-dark shadow-md">
                    <Star className="h-3 w-3 fill-brand-dark" />
                    Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="font-bold text-white">{project.title}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                  <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                  <span>{project.location}</span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(project.id)}
                    className={`text-xs font-medium transition-colors ${
                      project.featured
                        ? 'text-brand-gold'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {project.featured ? 'Featured on Home' : 'Set as Featured'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setModalTarget(project)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-brand-gold"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(project)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalTarget !== null && (
          <ProjectModal
            initial={modalTarget === 'new' ? null : modalTarget}
            onSave={handleSave}
            onClose={() => setModalTarget(null)}
          />
        )}
        {deleteTarget && (
          <ConfirmDialog
            title={deleteTarget.title}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
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

