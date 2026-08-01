import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CreditCard, Smartphone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatIndianRupee } from '../../utils/formatCurrency'

type PaymentMethod = 'UPI' | 'CARD' | 'CASH'

type PaymentModalProps = {
  isOpen: boolean
  amount: number
  dueDate: string
  onClose: () => void
  onConfirm: (amount: number, method: PaymentMethod) => void
}

export default function PaymentModal({
  isOpen,
  amount,
  dueDate,
  onClose,
  onConfirm,
}: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('UPI')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false)
      setMethod('UPI')
    }
  }, [isOpen])

  const handleConfirm = () => {
    setIsSuccess(true)
    window.setTimeout(() => {
      onConfirm(amount, method)
      onClose()
    }, 1200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-brand-dark/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="payment-modal-title"
              className="w-full max-w-md rounded-xl border border-border-light bg-white p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              {isSuccess ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="h-14 w-14 text-brand-green" />
                  <p className="mt-4 text-lg font-semibold text-brand-dark">
                    Payment Recorded ✓
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {formatIndianRupee(amount)} has been added to your paid balance.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2
                        id="payment-modal-title"
                        className="text-lg font-bold text-brand-dark"
                      >
                        Make Payment
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Complete your next project installment.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-brand-cream hover:text-brand-dark"
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-brand-cream p-4">
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="mt-1 text-xl font-bold text-brand-dark">
                        {formatIndianRupee(amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="mt-1 text-sm font-medium text-brand-dark">
                        {dueDate}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-brand-dark">
                        Payment Method
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setMethod('UPI')}
                          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                            method === 'UPI'
                              ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                              : 'border-border-light text-gray-600 hover:border-brand-gold/40'
                          }`}
                        >
                          <Smartphone className="h-4 w-4" />
                          UPI
                        </button>
                        <button
                          type="button"
                          onClick={() => setMethod('CARD')}
                          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                            method === 'CARD'
                              ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                              : 'border-border-light text-gray-600 hover:border-brand-gold/40'
                          }`}
                        >
                          <CreditCard className="h-4 w-4" />
                          Card
                        </button>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className="btn-primary w-full py-3"
                    >
                      Confirm Payment
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
