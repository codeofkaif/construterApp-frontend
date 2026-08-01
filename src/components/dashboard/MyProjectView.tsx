import { MapPin } from 'lucide-react'
import type { ProjectData } from '../../data/mockData'
import ConstructionTimelineCard from './ConstructionTimelineCard'
import type { TimelinePhase } from '../../data/mockData'

type MyProjectViewProps = {
  project: ProjectData
  timelinePhases: TimelinePhase[]
}

export default function MyProjectView({
  project,
  timelinePhases,
}: MyProjectViewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
          My Project
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete overview of your active construction project.
        </p>
      </div>

      <div className="rounded-xl border border-border-light bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
          Active Project
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-brand-dark">
          {project.title}
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4 text-brand-gold" />
          {project.location}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-lg bg-brand-gold/10 px-3 py-1.5 text-sm font-medium text-brand-gold">
            {project.progress}% Complete
          </span>
          <span className="rounded-lg bg-brand-orange/10 px-3 py-1.5 text-sm font-medium text-brand-orange">
            {project.currentStage.status}
          </span>
        </div>
      </div>

      <ConstructionTimelineCard phases={timelinePhases} />
    </div>
  )
}
