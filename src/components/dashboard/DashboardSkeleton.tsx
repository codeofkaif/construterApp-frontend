export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-border-light bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="mt-4 h-10 w-20 rounded bg-gray-200" />
            <div className="mt-3 h-2 w-full rounded-full bg-gray-200" />
            <div className="mt-4 h-3 w-36 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-border-light bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="mx-auto mt-6 h-40 w-40 rounded-full bg-gray-200" />
            <div className="mt-6 space-y-3">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
