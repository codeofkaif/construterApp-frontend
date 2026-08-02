import { AnimatePresence, motion } from 'framer-motion'
import {
  Edit2,
  ExternalLink,
  MapPin,
  Minus,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
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
  onSave: (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => void
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const stats = [
      { value: builtUp.trim() || 'N/A', label: 'Built-up Area' },
      { value: bedrooms.trim() || 'N/A', label: 'Bedrooms' },
      { value: duration.trim() || 'N/A', label: 'Duration' },
      { value: budget.trim() || 'N/A', label: 'Budget' },
    ]

    const validImages = images.filter((img) => img.url.trim() !== '')

    onSave({
      title: title.trim(),
      slug: initial?.slug ?? slugify(title.trim()),
      location: location.trim(),
      featured,
      stats,
      images: validImages.length ? validImages : [{ url: '', alt: title }],
    })
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
          {/* Main Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Project Title</label>
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
              <label className="admin-label">Location</label>
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
              <button
                type="button"
                onClick={handleAddPhoto}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/30 px-3 py-1 text-xs font-medium text-brand-gold hover:border-brand-gold/60"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Photo
              </button>
            </div>

            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={img.url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="admin-input flex-1"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400"
                    >
                      <Minus className="h-4 w-4" />
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
              className="rounded-button bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
            >
              Save Project
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
  const { projects, setProjects, toggleFeatured } = usePortfolio()
  const [modalTarget, setModalTarget] = useState<PortfolioProject | 'new' | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null)

  const handleSave = (data: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    if (modalTarget === 'new') {
      const newProj: PortfolioProject = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      }
      if (data.featured) {
        setProjects([
          ...projects.map((p) => ({ ...p, featured: false })),
          newProj,
        ])
      } else {
        setProjects([...projects, newProj])
      }
    } else if (modalTarget) {
      const targetId = (modalTarget as PortfolioProject).id
      setProjects(
        projects.map((p) => {
          if (p.id === targetId) {
            return { ...p, ...data }
          }
          if (data.featured) {
            return { ...p, featured: false }
          }
          return p
        })
      )
    }
    setModalTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setProjects(projects.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
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
      </AnimatePresence>
    </motion.div>
  )
}
