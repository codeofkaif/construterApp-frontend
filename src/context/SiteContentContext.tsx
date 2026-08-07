import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  Globe,
  Share2,
  MessageCircle,
  Send,
  Mail,
  Phone,
  type LucideIcon,
} from 'lucide-react'
import { adminContent, publicContent } from '../services/contentService'

export type AboutContent = {
  tagline: string
  heading: string
  paragraphs: string[]
}

const DEFAULT_ABOUT: AboutContent = {
  tagline: 'About Us',
  heading: 'Building Trust in Lucknow',
  paragraphs: [
    'Adil Constructions has been transforming dreams into homes across Lucknow for over a decade — delivering residential and commercial projects with uncompromising quality and transparency.',
    'Our team of dedicated engineers, architects, and craftsmen work in synergy to ensure every project is delivered on time, within budget, and to the highest standards of safety and aesthetic excellence.',
  ],
}

export type ContactContent = {
  address: string
  phone: string
  email: string
  lat: number
  lng: number
}

const DEFAULT_CONTACT: ContactContent = {
  address: '42 Gomti Nagar Extension, Lucknow, UP 226010',
  phone: '+91 6388913772',
  email: 'kkaif2687@gmail.com',
  lat: 26.8266946,
  lng: 81.00043815,
}

export type QuickLink = {
  label: string
  href: string
}

export type SocialLink = {
  iconName: string
  href: string
}

export const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Share2,
  MessageCircle,
  Send,
  Mail,
  Phone,
}

export type FooterContent = {
  tagline: string
  quickLinks: QuickLink[]
  socialLinks: SocialLink[]
  copyright: string
}

const DEFAULT_FOOTER: FooterContent = {
  tagline: 'Premium residential and commercial construction in Lucknow — built with quality, trust, and transparency.',
  quickLinks: [
    { label: 'Home', href: '#home' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  socialLinks: [
    { iconName: 'Globe', href: 'https://adilconstructions.com' },
    { iconName: 'MessageCircle', href: 'https://wa.me/916388913772' },
    { iconName: 'Share2', href: 'https://facebook.com' },
  ],
  copyright: '© 2026 Adil Constructions. All rights reserved.',
}

const SITE_CONTENT_KEY = 'site-content'

type SiteContentContextValue = {
  aboutContent: AboutContent
  setAboutContent: (c: AboutContent) => void
  contactContent: ContactContent
  setContactContent: (c: ContactContent) => void
  footerContent: FooterContent
  setFooterContent: (c: FooterContent) => void
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

type FullSiteContent = {
  about: AboutContent
  contact: ContactContent
  footer: FooterContent
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutState] = useState<AboutContent>(DEFAULT_ABOUT)
  const [contactContent, setContactState] = useState<ContactContent>(DEFAULT_CONTACT)
  const [footerContent, setFooterState] = useState<FooterContent>(DEFAULT_FOOTER)
  const [backendAvailable, setBackendAvailable] = useState(false)

  // Load from backend on mount
  useEffect(() => {
    publicContent.getConfig(SITE_CONTENT_KEY)
      .then((raw) => {
        if (raw) {
          const data: FullSiteContent = JSON.parse(raw)
          if (data.about) setAboutState(data.about)
          if (data.contact) setContactState(data.contact)
          if (data.footer) setFooterState(data.footer)
          setBackendAvailable(true)
        } else {
          // Key doesn't exist yet in backend — backend is reachable
          setBackendAvailable(true)
        }
      })
      .catch(() => {})
  }, [])

  const persist = useCallback((about: AboutContent, contact: ContactContent, footer: FooterContent) => {
    if (!backendAvailable) return
    const payload: FullSiteContent = { about, contact, footer }
    adminContent.saveConfig(SITE_CONTENT_KEY, JSON.stringify(payload)).catch(console.error)
  }, [backendAvailable])

  const setAboutContent = useCallback((c: AboutContent) => {
    setAboutState(c)
    persist(c, contactContent, footerContent)
  }, [persist, contactContent, footerContent])

  const setContactContent = useCallback((c: ContactContent) => {
    setContactState(c)
    persist(aboutContent, c, footerContent)
  }, [persist, aboutContent, footerContent])

  const setFooterContent = useCallback((c: FooterContent) => {
    setFooterState(c)
    persist(aboutContent, contactContent, c)
  }, [persist, aboutContent, contactContent])

  const value = useMemo(
    () => ({
      aboutContent,
      setAboutContent,
      contactContent,
      setContactContent,
      footerContent,
      setFooterContent,
    }),
    [aboutContent, setAboutContent, contactContent, setContactContent, footerContent, setFooterContent]
  )

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider')
  return ctx
}
