import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { adminContent, publicContent } from '../services/contentService'

export type AboutContent = {
  tagline: string
  heading: string
  paragraphs: string[]
}

export type ContactContent = {
  address: string
  phone: string
  email: string
  lat: number
  lng: number
}

export type QuickLink = { label: string; href: string }
export type SocialLink = { iconName: string; href: string }

import {
  Globe, Share2, MessageCircle, Send, Mail, Phone, type LucideIcon,
} from 'lucide-react'

export const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  Globe, Share2, MessageCircle, Send, Mail, Phone,
}

export type FooterContent = {
  tagline: string
  quickLinks: QuickLink[]
  socialLinks: SocialLink[]
  copyright: string
}

type FullSiteContent = { about: AboutContent; contact: ContactContent; footer: FooterContent }

const DEFAULTS: FullSiteContent = {
  about: {
    tagline: 'About Us',
    heading: 'Building Trust in Lucknow',
    paragraphs: [
      'Adil Constructions has been transforming dreams into homes across Lucknow for over a decade — delivering residential and commercial projects with uncompromising quality and transparency.',
      'Our team of dedicated engineers, architects, and craftsmen work in synergy to ensure every project is delivered on time, within budget, and to the highest standards of safety and aesthetic excellence.',
    ],
  },
  contact: {
    address: '42 Gomti Nagar Extension, Lucknow, UP 226010',
    phone: '+91 6388913772',
    email: 'kkaif2687@gmail.com',
    lat: 26.8266946,
    lng: 81.00043815,
  },
  footer: {
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
  },
}

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
  // localStorage as primary — always persists across refresh
  const [stored, setStored] = useLocalStorage<FullSiteContent>('site-content', DEFAULTS)

  const aboutContent = stored.about
  const contactContent = stored.contact
  const footerContent = stored.footer

  // On mount: try to load a newer version from backend
  useEffect(() => {
    publicContent.getConfig('site-content')
      .then((raw) => {
        if (!raw) return
        const data: FullSiteContent = JSON.parse(raw)
        if (data?.about && data?.contact && data?.footer) {
          setStored(data)
        }
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveToBackend = useCallback((data: FullSiteContent) => {
    adminContent.saveConfig('site-content', JSON.stringify(data)).catch(() => {})
  }, [])

  const setAboutContent = useCallback((c: AboutContent) => {
    const next = { ...stored, about: c }
    setStored(next)
    saveToBackend(next)
  }, [stored, setStored, saveToBackend])

  const setContactContent = useCallback((c: ContactContent) => {
    const next = { ...stored, contact: c }
    setStored(next)
    saveToBackend(next)
  }, [stored, setStored, saveToBackend])

  const setFooterContent = useCallback((c: FooterContent) => {
    const next = { ...stored, footer: c }
    setStored(next)
    saveToBackend(next)
  }, [stored, setStored, saveToBackend])

  const value = useMemo(
    () => ({ aboutContent, setAboutContent, contactContent, setContactContent, footerContent, setFooterContent }),
    [aboutContent, setAboutContent, contactContent, setContactContent, footerContent, setFooterContent]
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider')
  return ctx
}
