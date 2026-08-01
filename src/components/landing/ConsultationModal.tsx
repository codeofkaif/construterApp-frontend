import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { validateMessage, validatePhone, validateRequired } from '../../utils/validation'
import { leadService } from '../../services/leadService'
import { ApiError } from '../../services/api'

type ConsultationModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type FormErrors = {
  name?: string
  phone?: string
  message?: string
}

export default function ConsultationModal({ isOpen, onClose, onSuccess }: ConsultationModalProps) {
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors]   = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setErrors({})
      setSubmitError(null)
    }
  }, [isOpen])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const nextErrors: FormErrors = {
      name:    validateRequired(name, 'Name')        ?? undefined,
      phone:   validatePhone(phone)                  ?? undefined,
      message: validateMessage(message, 10)          ?? undefined,
    }

    const hasErrors = Object.values(nextErrors).some(Boolean)
    if (hasErrors) {
      setErrors(nextErrors)
      setSubmitError('Please fix the errors below before submitting.')
      return
    }

    setErrors({})
    setSubmitError(null)
    setLoading(true)

    try {
      await leadService.submit({ name: name.trim(), phone: phone.trim(), message: message.trim() })
      setName('')
      setPhone('')
      setMessage('')
      onClose()
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setSubmitError('Too many requests. Please try again in a few minutes.')
      } else if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-brand-dark/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="consultation-modal-title"
              className="w-full max-w-md rounded-card border border-white/10 bg-brand-darkCard p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 id="consultation-modal-title" className="font-heading text-xl font-semibold text-white">
                    Get Free Consultation
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Share your details and we&apos;ll reach out shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="interactive-focus rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitError && (
                <p className="mb-4 text-sm text-red-400" role="alert">{submitError}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="consultation-name" className="mb-1.5 block text-sm font-medium text-white/80">
                    Name
                  </label>
                  <input
                    id="consultation-name"
                    type="text"
                    value={name}
                    onChange={(event) => { setName(event.target.value); if (errors.name) setErrors((e) => ({ ...e, name: undefined })) }}
                    className={`interactive-focus w-full rounded-button border bg-brand-dark px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold/50 ${errors.name ? 'border-red-400' : 'border-white/10'}`}
                    placeholder="Your full name"
                    disabled={loading}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="consultation-phone" className="mb-1.5 block text-sm font-medium text-white/80">
                    Phone Number
                  </label>
                  <input
                    id="consultation-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => { setPhone(event.target.value); if (errors.phone) setErrors((e) => ({ ...e, phone: undefined })) }}
                    className={`interactive-focus w-full rounded-button border bg-brand-dark px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold/50 ${errors.phone ? 'border-red-400' : 'border-white/10'}`}
                    placeholder="+91 xxxxxxxxxx"
                    disabled={loading}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="consultation-message" className="mb-1.5 block text-sm font-medium text-white/80">
                    Message
                  </label>
                  <textarea
                    id="consultation-message"
                    rows={4}
                    value={message}
                    onChange={(event) => { setMessage(event.target.value); if (errors.message) setErrors((e) => ({ ...e, message: undefined })) }}
                    className={`interactive-focus w-full resize-none rounded-button border bg-brand-dark px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold/50 ${errors.message ? 'border-red-400' : 'border-white/10'}`}
                    placeholder="Tell us about your project..."
                    disabled={loading}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="interactive-focus btn-primary w-full py-3 disabled:opacity-60"
                >
                  {loading ? 'Submitting…' : 'Submit'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
