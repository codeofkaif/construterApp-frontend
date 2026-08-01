import type { PaymentHistoryEntry } from '../../data/mockData'
import { formatIndianRupee } from '../../utils/formatCurrency'
import DashboardPanelModal from './DashboardPanelModal'

type PaymentHistoryPanelProps = {
  isOpen: boolean
  entries: PaymentHistoryEntry[]
  onClose: () => void
}

function StatusBadge({ status }: { status: PaymentHistoryEntry['status'] }) {
  const styles = {
    Paid: 'bg-brand-green/10 text-brand-green',
    Pending: 'bg-brand-orange/10 text-brand-orange',
    Failed: 'bg-red-100 text-red-600',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}

export default function PaymentHistoryPanel({
  isOpen,
  entries,
  onClose,
}: PaymentHistoryPanelProps) {
  return (
    <DashboardPanelModal
      isOpen={isOpen}
      title="Payment History"
      onClose={onClose}
      maxWidth="2xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-light text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 pr-4 font-medium">Method</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="py-3 pr-4 text-brand-dark">{entry.date}</td>
                <td className="py-3 pr-4 font-medium text-brand-dark">
                  {formatIndianRupee(entry.amount)}
                </td>
                <td className="py-3 pr-4 text-gray-600">{entry.method}</td>
                <td className="py-3">
                  <StatusBadge status={entry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanelModal>
  )
}
