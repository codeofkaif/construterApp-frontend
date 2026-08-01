import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import type { TimelinePhase } from '../../data/mockData'
import { timelinePhaseIcons } from '../../utils/timelineIcons'

type ConstructionTimelineCardProps = {
  phases: TimelinePhase[]
}

function PhaseProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex w-full min-w-0 items-center gap-2 sm:w-28">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="h-full rounded-full bg-brand-gold"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs text-gray-500">
        {percent}%
      </span>
    </div>
  )
}

function PhaseStatus({ phase }: { phase: TimelinePhase }) {
  if (phase.status === 'completed') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">Completed</span>
        <CheckCircle2 className="h-4 w-4 text-brand-green" strokeWidth={2} />
      </div>
    )
  }

  return <PhaseProgressBar percent={phase.percent} />
}

export default function ConstructionTimelineCard({
  phases,
}: ConstructionTimelineCardProps) {
  return (
    <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-brand-dark">Construction Timeline</h2>

      <ul className="mt-5 space-y-4">
        {phases.map((phase) => {
          const Icon = timelinePhaseIcons[phase.icon]

          return (
            <li key={phase.name} className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>

              <p className="min-w-0 flex-1 truncate text-sm font-medium text-brand-dark sm:whitespace-normal">
                {phase.name}
              </p>

              <PhaseStatus phase={phase} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
