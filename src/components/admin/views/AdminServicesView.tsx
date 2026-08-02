import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  ExternalLink,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import {
  SERVICE_ICON_MAP,
  useServices,
  type Service,
} from '../../../context/ServicesContext'

const ICON_OPTIONS = Object.keys(SERVICE_ICON_MAP)

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---------------------------------------------------------------------------
// Service Form Modal
// ---------------------------------------------------------------------------

type ModalProps = {
  initial: Partial<Service> | null
  onSave: (s: Omit<Service, 'id'>) => void
  onClose: () => void
}

function ServiceModal({ initial, onSave, onClose }: ModalProps) {
  const [iconName, setIconName] = useState(initial?.iconName ?? 'Home')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  const PreviewIcon = SERVICE_ICON_MAP[iconName]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      iconName,
      title: title.trim(),
      description: description.trim(),
      slug: initial?.slug ?? slugify(title.trim()),
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
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/[0.08] bg-brand-darkCard p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            {initial?.id ? 'Edit Service' : 'Add Service'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon picker */}
          <div>
            <label className="admin-label">Icon</label>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-gold/20 bg-brand-gold/10 text-brand-gold">
                <PreviewIcon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="admin-input flex-1"
              >
                {ICON_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="admin-label">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. House Construction"
              className="admin-input mt-2 w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="admin-label">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description…"
              className="admin-input mt-2 w-full resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
            >
              <Save className="h-4 w-4" />
              Save
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Confirm delete dialog
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
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-brand-darkCard p-6 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <Trash2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-white">Delete Service?</h3>
        <p className="mt-2 text-sm text-white/50">
          "{title}" will be removed from the landing page.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Service row card
// ---------------------------------------------------------------------------

function ServiceRow({
  service,
  index,
  total,
  onEdit,
  onDelete,
  onMove,
}: {
  service: Service
  index: number
  total: number
  onEdit: () => void
  onDelete: () => void
  onMove: (dir: -1 | 1) => void
}) {
  const Icon = SERVICE_ICON_MAP[service.iconName]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-brand-darkCard px-5 py-4"
    >
      {/* Icon badge */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-gold/20 bg-brand-gold/10 text-brand-gold">
        {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{service.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-white/40">{service.description}</p>
      </div>

      {/* Reorder */}
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(-1)}
          className="flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
          aria-label="Move up"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          className="flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
          aria-label="Move down"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Edit / Delete */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-brand-gold"
          aria-label="Edit service"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
          aria-label="Delete service"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// AdminServicesView
// ---------------------------------------------------------------------------

export default function AdminServicesView() {
  const { services, setServices } = useServices()
  const [modalTarget, setModalTarget] = useState<Service | 'new' | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const openAdd = () => setModalTarget('new')
  const openEdit = (s: Service) => setModalTarget(s)

  const handleSave = (data: Omit<Service, 'id'>) => {
    if (modalTarget === 'new') {
      setServices([...services, { ...data, id: crypto.randomUUID() }])
    } else if (modalTarget) {
      setServices(
        services.map((s) =>
          s.id === (modalTarget as Service).id ? { ...s, ...data } : s,
        ),
      )
    }
    setModalTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setServices(services.filter((s) => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleMove = (index: number, dir: -1 | 1) => {
    const next = [...services]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setServices(next)
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
          <h2 className="text-2xl font-bold text-white">Services</h2>
          <p className="mt-1 text-sm text-white/40">
            Changes reflect instantly on the landing page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.open('/#services', '_blank')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Preview
          </button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </motion.button>
        </div>
      </div>

      {/* Service list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-white/[0.06] bg-brand-darkCard py-16 text-center"
            >
              <p className="text-sm text-white/30">No services yet. Add one above.</p>
            </motion.div>
          ) : (
            services.map((service, i) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={i}
                total={services.length}
                onEdit={() => openEdit(service)}
                onDelete={() => setDeleteTarget(service)}
                onMove={(dir) => handleMove(i, dir)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalTarget !== null && (
          <ServiceModal
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
