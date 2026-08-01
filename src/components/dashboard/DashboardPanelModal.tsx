import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type DashboardPanelModalProps = {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl'
}

const maxWidthClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

export default function DashboardPanelModal({
  isOpen,
  title,
  onClose,
  children,
  maxWidth = 'lg',
}: DashboardPanelModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-brand-dark/40 backdrop-blur-sm"
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
              aria-labelledby="dashboard-panel-title"
              className={`flex max-h-[85vh] w-full flex-col overflow-hidden rounded-xl border border-border-light bg-white shadow-xl ${maxWidthClasses[maxWidth]}`}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-border-light px-5 py-4">
                <h2
                  id="dashboard-panel-title"
                  className="text-lg font-bold text-brand-dark"
                >
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-brand-cream hover:text-brand-dark"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-5">{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
