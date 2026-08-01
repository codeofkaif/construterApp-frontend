import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { BrickWall, Calendar } from 'lucide-react'
import { useEffect } from 'react'
import type { ProjectData } from '../../data/mockData'

type DashboardSummaryCardsProps = {
  project: ProjectData
}

function AnimatedProgressNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: 'easeOut',
    })
    return () => controls.stop()
  }, [motionValue, value])

  return <motion.span>{rounded}</motion.span>
}

export default function DashboardSummaryCards({
  project,
}: DashboardSummaryCardsProps) {
  const { progress, lastUpdated, thumbnail, currentStage, nextMilestone } =
    project

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-gray-500">Project Progress</p>
          <img
            src={thumbnail}
            alt="Project thumbnail"
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
          />
        </div>

        <p className="mt-3 text-4xl font-bold text-brand-dark">
          <AnimatedProgressNumber value={progress} />%
        </p>
        <p className="mt-1 text-sm text-gray-500">Overall Completion</p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-goldLight"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>

        <p className="mt-4 text-xs text-gray-400">Last updated: {lastUpdated}</p>
      </div>

      <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-sm text-gray-500">Current Stage</p>
          <div className="icon-badge h-9 w-9">
            <BrickWall className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-xl font-bold text-brand-dark">
            {currentStage.name}
          </p>
          <span className="rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-xs font-medium text-brand-orange">
            {currentStage.status}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Started on {currentStage.startedOn}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Est. completion: {currentStage.estimatedCompletion}
        </p>
      </div>

      <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-sm text-gray-500">Next Milestone</p>
          <div className="icon-badge h-9 w-9">
            <Calendar className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>

        <p className="mt-3 text-xl font-bold text-brand-dark">
          {nextMilestone.name}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Expected on {nextMilestone.expectedOn}
        </p>
      </div>
    </div>
  )
}
