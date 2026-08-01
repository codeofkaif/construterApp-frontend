import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

type AdminPlaceholderViewProps = {
  icon: LucideIcon
  title: string
  description?: string
}

export default function AdminPlaceholderView({
  icon: Icon,
  title,
  description = 'This section is under development.',
}: AdminPlaceholderViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold/10 text-brand-gold">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-white/40">{description}</p>
    </motion.div>
  )
}
