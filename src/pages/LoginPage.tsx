import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginApi, registerApi, saveSession } from '../services/authService'
import { ApiError } from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone]       = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Email and password are required.')
        return
      }

      setLoading(true)
      try {
        const res  = await loginApi(email.trim(), password)
        const user = saveSession(res)
        login({ id: user.id, name: user.name, email: user.email, role: user.role })
        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 401 ? 'Invalid email or password.' : err.message)
        } else {
          setError('Network error. Please check backend connection.')
        }
      } finally {
        setLoading(false)
      }
    } else {
      // Register Mode
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Name, email, and password are required.')
        return
      }

      if (password.length < 8 || !/\d/.test(password)) {
        setError('Password must be at least 8 characters and contain at least one number.')
        return
      }

      setLoading(true)
      try {
        const res  = await registerApi(name.trim(), email.trim(), password, phone.trim() || undefined)
        const user = saveSession(res)
        login({ id: user.id, name: user.name, email: user.email, role: user.role })
        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || 'Registration failed. Email might already exist.')
        } else {
          setError('Network error. Please check backend connection.')
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
    window.location.href = `${baseUrl}/oauth2/authorization/google`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4 py-12">
      <div className="w-full max-w-md rounded-card border border-white/[0.08] bg-brand-darkCard p-8 shadow-2xl">
        {/* Logo & Header */}
        <Link to="/" className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
          <span className="text-2xl">🏗️</span>
        </Link>
        <h1 className="text-center font-heading text-2xl font-bold text-white">Adil Constructions</h1>
        <p className="mt-1 text-center text-sm text-white/50">
          {mode === 'login' ? 'Sign in to access your dashboard' : 'Create an account to track your projects'}
        </p>

        {/* Tab Switcher */}
        <div className="mt-6 flex rounded-lg border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null) }}
            className={`flex-1 rounded-md py-2 text-center text-xs font-semibold transition-all ${
              mode === 'login'
                ? 'bg-brand-gold text-brand-dark shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null) }}
            className={`flex-1 rounded-md py-2 text-center text-xs font-semibold transition-all ${
              mode === 'register'
                ? 'bg-brand-gold text-brand-dark shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Google OAuth2 Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="interactive-focus flex w-full items-center justify-center gap-3 rounded-button border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15 active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-brand-darkCard px-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
            Or with email
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-button border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === 'register' && (
            <div>
              <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-white/70">
                Full Name *
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null) }}
                placeholder="John Doe"
                disabled={loading}
                className="interactive-focus w-full rounded-button border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-brand-gold/50 focus:outline-none disabled:opacity-60"
              />
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-white/70">
              Email Address *
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              className="interactive-focus w-full rounded-button border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-brand-gold/50 focus:outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-white/70">
              Password *
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null) }}
              placeholder={mode === 'register' ? 'At least 8 chars & 1 number' : '••••••••'}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              disabled={loading}
              className="interactive-focus w-full rounded-button border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-brand-gold/50 focus:outline-none disabled:opacity-60"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="reg-phone" className="mb-1.5 block text-sm font-medium text-white/70">
                Phone Number (Optional)
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(null) }}
                placeholder="+91 98765 43210"
                disabled={loading}
                className="interactive-focus w-full rounded-button border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-brand-gold/50 focus:outline-none disabled:opacity-60"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="interactive-focus mt-3 w-full rounded-button bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95 disabled:opacity-60"
          >
            {loading
              ? mode === 'login' ? 'Signing in…' : 'Registering…'
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-white/40">
          <Link to="/" className="hover:text-brand-gold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
