type Notification = {
  id: string
  message: string
  timestamp: string
  isRead: boolean
}

type NotificationsViewProps = {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

export default function NotificationsView({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationsViewProps) {
  const hasUnread = notifications.some((n) => !n.isRead)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Stay updated on your project milestones and payments.
          </p>
        </div>
        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="interactive-focus text-sm font-medium text-brand-gold transition-colors hover:text-brand-goldLight active:scale-95"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-border-light bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-400">No notifications yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border-light overflow-hidden rounded-xl border border-border-light bg-white shadow-sm">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className={`interactive-focus w-full px-5 py-4 text-left transition-colors hover:bg-brand-cream active:bg-brand-cream/80 ${!notification.isRead ? 'bg-brand-gold/5' : ''}`}
              >
                <p className="text-sm text-brand-dark">
                  {!notification.isRead && (
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  )}
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">{notification.timestamp}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
