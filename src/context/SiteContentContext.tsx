import {
  createContext,
  useContext,
  useState,
  useMemo,
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

// 1. About Content Type & Default
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

// 2. Contact Content Type & Default
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

// 3. Footer Content Type & Default
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

// Site Content Context
type SiteContentContextValue = {
  aboutContent: AboutContent
  setAboutContent: (c: AboutContent) => void
  contactContent: ContactContent
  setContactContent: (c: ContactContent) => void
  footerContent: FooterContent
  setFooterContent: (c: FooterContent) => void
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT)
  const [contactContent, setContactContent] = useState<ContactContent>(DEFAULT_CONTACT)
  const [footerContent, setFooterContent] = useState<FooterContent>(DEFAULT_FOOTER)

  const value = useMemo(
    () => ({
      aboutContent,
      setAboutContent,
      contactContent,
      setContactContent,
      footerContent,
      setFooterContent,
    }),
    [aboutContent, contactContent, footerContent]
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
