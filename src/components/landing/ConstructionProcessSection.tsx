import { motion } from 'framer-motion'
import {
  Building2,
  ClipboardList,
  Flag,
  Home,
  PaintRoller,
  Shovel,
  type LucideIcon,
} from 'lucide-react'
import ScrollReveal from './ScrollReveal'

type StepStatus = 'completed' | 'current' | 'upcoming'

type ProcessStep = {
  label: string
  icon: LucideIcon
  status: StepStatus
}

const steps: ProcessStep[] = [
  { label: 'Planning', icon: ClipboardList, status: 'completed' },
  { label: 'Foundation', icon: Shovel, status: 'completed' },
  { label: 'Structure', icon: Building2, status: 'completed' },
  { label: 'Roofing', icon: Home, status: 'completed' },
  { label: 'Finishing', icon: PaintRoller, status: 'completed' },
  { label: 'Delivery', icon: Flag, status: 'current' },
]

function StepBadge({ step }: { step: ProcessStep }) {
  const Icon = step.icon
  const isCompleted = step.status === 'completed'
  const isCurrent = step.status === 'current'
  const isUpcoming = step.status === 'upcoming'

  return (
    <div className="flex w-[88px] shrink-0 flex-col items-center sm:w-[100px]">
      <div className="relative flex h-12 w-12 items-center justify-center">
        {isCurrent && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-brand-orange"
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <div
          className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
            isCompleted
              ? 'bg-brand-green text-white'
              : isCurrent
                ? 'bg-brand-orange text-brand-dark'
                : 'border-2 border-white/25 bg-transparent text-white/50'
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>

      <p
        className={`mt-3 text-center text-xs font-medium ${
          isUpcoming ? 'text-white/50' : 'text-white'
        }`}
      >
        {step.label}
      </p>
    </div>
  )
}

function Connector({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`mb-6 h-0.5 min-w-[40px] flex-1 self-center ${
        isActive ? 'bg-brand-green' : 'bg-white/20'
      }`}
    />
  )
}

export default function ConstructionProcessSection() {
  return (
    <section className="bg-brand-dark px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
            <p className="shrink-0 text-xs font-medium uppercase tracking-[0.25em] text-brand-gold lg:w-48">
              Construction Process
            </p>

            <div className="scrollbar-hide -mx-6 overflow-x-auto px-6 lg:mx-0 lg:flex-1 lg:overflow-visible lg:px-0">
              <div className="flex min-w-max items-center pb-2 lg:min-w-0 lg:w-full lg:pb-0">
                {steps.map((step, index) => (
                  <div key={step.label} className="flex items-center">
                    {index > 0 && (
                      <Connector
                        isActive={
                          step.status === 'completed' || step.status === 'current'
                        }
                      />
                    )}
                    <StepBadge step={step} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
