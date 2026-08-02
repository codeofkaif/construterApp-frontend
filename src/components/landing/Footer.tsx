import { Home, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SOCIAL_ICON_MAP, useSiteContent } from '../../context/SiteContentContext'

function scrollToSection(href: string) {
  if (href.startsWith('#')) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Footer() {
  const { footerContent, contactContent } = useSiteContent()

  return (
    <footer className="border-t border-white/[0.08] bg-brand-dark">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <a
              href="#home"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('#home')
              }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <Home className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-bold uppercase tracking-wide text-white">
                  Adil Constructions
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-brand-gold">
                  Building Dreams
                </span>
              </div>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {footerContent.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerContent.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      if (link.href.startsWith('#')) {
                        event.preventDefault()
                        scrollToSection(link.href)
                      }
                    }}
                    className="text-sm text-white/70 transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-400 transition-colors hover:text-brand-gold"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>{contactContent.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>{contactContent.email}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>{contactContent.address}</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              {footerContent.socialLinks.map(({ iconName, href }, index) => {
                const Icon = SOCIAL_ICON_MAP[iconName] || SOCIAL_ICON_MAP.Globe
                return (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={iconName}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08] px-6 py-5 lg:px-12">
        <p className="text-center text-sm text-white/60">
          {footerContent.copyright}
        </p>
      </div>
    </footer>
  )
}
