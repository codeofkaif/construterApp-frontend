import { Mail, Phone, User } from 'lucide-react'

type ProfileUser = {
  name: string
  avatar: string
  email: string
  phone: string
}

type ProfileViewProps = {
  user: ProfileUser
}

export default function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
          Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your account details and contact information.
        </p>
      </div>

      <div className="rounded-xl border border-border-light bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Avatar initials fallback — no avatar URL from API */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
            <span className="text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-dark">{user.name}</p>
            <p className="text-sm text-gray-500">Client — Adil Constructions</p>
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <User className="h-4 w-4 text-brand-gold" />
            {user.name}
          </li>
          {user.email && (
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-brand-gold" />
              {user.email}
            </li>
          )}
          {user.phone && (
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-brand-gold" />
              {user.phone}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
