import { LogOut } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LogoutView() {
  const { logout } = useAuth()

  // Perform logout on component mount
  useEffect(() => {
    logout()
  }, [logout])

  return (
    <div className="mx-auto max-w-md space-y-6 pt-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
        <LogOut className="h-7 w-7" />
      </div>
      <div>
        <h1 className="font-heading text-3xl font-semibold text-brand-dark">
          Logged Out
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          You have been signed out of your account. See you again soon.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Link
          to="/"
          className="interactive-focus inline-flex rounded-button border border-border-light bg-white px-5 py-2.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-cream active:scale-95"
        >
          Return to Home
        </Link>
        <Link
          to="/login"
          className="interactive-focus inline-flex rounded-button bg-brand-gold px-5 py-2.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95"
        >
          Sign In Again
        </Link>
      </div>
    </div>
  )
}
