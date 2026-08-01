import type { ProjectUpdate } from '../../data/mockData'

type ProgressUpdatesViewProps = {
  updates: ProjectUpdate[]
}

export default function ProgressUpdatesView({ updates }: ProgressUpdatesViewProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
        Progress Updates
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Full timeline of site updates and milestones for your project.
      </p>

      <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-xl border border-border-light bg-white shadow-sm">
        {updates.map((update) => (
          <li
            key={update.id}
            className="flex items-start justify-between gap-4 p-5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">
                {update.date}, {update.time}
              </p>
              <p className="mt-1 text-sm font-medium text-brand-dark">
                {update.description}
              </p>
            </div>
            <img
              src={update.thumbnailUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
