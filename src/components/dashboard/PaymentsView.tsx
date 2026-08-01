import type { PaymentSummaryData } from '../../data/mockData'
import PaymentSummaryCard from './PaymentSummaryCard'

type PaymentsViewProps = {
  paymentData: PaymentSummaryData
  paymentHistoryEntries: never[]     // No payment history API — always empty
  onConfirmPayment: (amount: number, method: 'UPI' | 'CARD' | 'CASH') => void
  isLoading?: boolean
  payError?: string | null
}

export default function PaymentsView({
  paymentData,
  onConfirmPayment,
  isLoading,
  payError,
}: PaymentsViewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
          Payments
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Track your budget and payment status.
        </p>
      </div>

      {payError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {payError}
        </div>
      )}

      <div className="max-w-md">
        <PaymentSummaryCard
          paymentData={paymentData}
          onConfirmPayment={onConfirmPayment}
          isLoading={isLoading}
        />
      </div>

      {/* Payment history not available from backend yet */}
      <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-brand-dark">Transaction History</h2>
        <p className="text-sm text-gray-400">
          Detailed payment history will be available in a future update.
        </p>
      </div>
    </div>
  )
}
