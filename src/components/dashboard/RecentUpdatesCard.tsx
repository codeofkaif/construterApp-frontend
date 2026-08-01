import type { ProjectUpdate } from '../../data/mockData'

type RecentUpdatesCardProps = {
  updates: ProjectUpdate[]
  onViewAll: () => void
}

export default function RecentUpdatesCard({
  updates,
  onViewAll,
}: RecentUpdatesCardProps) {
  return (
    <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-brand-dark">Recent Updates</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="interactive-focus touch-target -mr-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-gold transition-colors hover:bg-brand-gold/10 hover:text-brand-goldLight active:scale-95"
        >
          View All
        </button>
      </div>

      <ul className="mt-4 max-h-[280px] divide-y divide-border-light overflow-y-auto">
        {updates.map((update) => (
          <li key={update.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">
                {update.date}, {update.time}
              </p>
              <p className="mt-1 break-words text-sm text-brand-dark">{update.description}</p>
            </div>
            <img
              src={update.thumbnailUrl}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
