import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function AdminLogoutView() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleCancel = () => {
    navigate('/admin', { replace: true })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
        <LogOut className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-bold text-white">Sign out?</h2>
      <p className="mt-2 max-w-xs text-sm text-white/40">
        You will be redirected to the login page.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="interactive-focus rounded-button border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 active:scale-95"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="interactive-focus rounded-button bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 active:scale-95"
        >
          Yes, log out
        </button>
      </div>
    </motion.div>
  )
}
