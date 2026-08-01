import { dashboardViewTitles, type DashboardViewId } from '../../data/dashboardNav'

type DashboardPlaceholderViewProps = {
  viewId: DashboardViewId
}

export default function DashboardPlaceholderView({
  viewId,
}: DashboardPlaceholderViewProps) {
  const title = dashboardViewTitles[viewId]

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-gray-500">
        This section will be built in an upcoming part.
      </p>
    </div>
  )
}
