import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'

type ToastProps = {
  message: string
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return

    const timer = window.setTimeout(onClose, 4000)
    return () => window.clearTimeout(timer)
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed left-1/2 top-24 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center gap-3 rounded-card border border-brand-green/30 bg-brand-darkCard px-4 py-3 shadow-lg">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green" />
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
