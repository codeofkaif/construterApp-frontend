import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { PaymentSummaryData } from '../../data/mockData'
import {
  formatIndianRupee,
  formatLakhTotal,
  formatPercent,
} from '../../utils/formatCurrency'
import PaymentModal from './PaymentModal'

type PaymentSummaryCardProps = {
  paymentData: PaymentSummaryData
  onConfirmPayment: (amount: number, method: 'UPI' | 'CARD' | 'CASH') => void
  isLoading?: boolean
}

type ChartSegment = {
  name: string
  value: number
  color: string
}

type ChartTooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: ChartSegment }>
  total: number
}

function ChartTooltip({ active, payload, total }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const segment = payload[0]?.payload
  if (!segment) return null

  return (
    <div className="rounded-lg border border-border-light bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-brand-dark">{segment.name}</p>
      <p className="text-xs text-gray-500">
        {formatIndianRupee(segment.value)} ({formatPercent(segment.value, total)} of
        total)
      </p>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="mx-auto mt-4 flex h-48 w-full max-w-[220px] animate-pulse items-center justify-center">
      <div className="h-40 w-40 rounded-full bg-gray-200" />
    </div>
  )
}

export default function PaymentSummaryCard({
  paymentData,
  onConfirmPayment,
  isLoading = false,
}: PaymentSummaryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { paid, remaining, nextPayment } = paymentData
  const totalBudget = paid + remaining

  const chartData = useMemo<ChartSegment[]>(
    () => [
      { name: 'Paid', value: paid, color: '#2FA84F' },
      { name: 'Remaining', value: remaining, color: '#E8A33D' },
    ],
    [paid, remaining],
  )

  const handlePaymentConfirm = (amount: number, method: 'UPI' | 'CARD' | 'CASH') => {
    onConfirmPayment(amount, method)
  }

  return (
    <>
      <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-brand-dark">Payment Summary</h2>

        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <div className="relative mx-auto mt-4 h-48 w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={78}
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((segment) => (
                    <Cell key={segment.name} fill={segment.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => (
                    <ChartTooltip
                      active={props.active}
                      payload={props.payload}
                      total={totalBudget}
                    />
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-brand-dark">
                {formatLakhTotal(totalBudget)}
              </p>
              <p className="text-xs text-gray-500">Total Budget</p>
            </div>
          </div>
        )}

        <ul className="mt-4 space-y-2">
          {chartData.map((segment) => (
            <li
              key={segment.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-gray-600">{segment.name}</span>
              </div>
              <span className="font-medium text-brand-dark">
                {formatIndianRupee(segment.value)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-3 rounded-lg bg-brand-cream p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Next Payment Due</p>
            <p className="mt-0.5 text-lg font-bold text-brand-dark">
              {formatIndianRupee(nextPayment.amount)}
            </p>
            <p className="mt-0.5 break-words text-[11px] text-gray-500">
              Due on {nextPayment.dueDate}
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="interactive-focus touch-target w-full shrink-0 rounded-button bg-brand-gold px-4 py-3 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95 sm:w-auto sm:py-2.5"
          >
            Pay Now
          </motion.button>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        amount={nextPayment.amount}
        dueDate={nextPayment.dueDate}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePaymentConfirm}
      />
    </>
  )
}
