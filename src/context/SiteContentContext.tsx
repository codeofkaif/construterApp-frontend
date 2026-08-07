import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import {
  Globe, Share2, MessageCircle, Send, Mail, Phone, type LucideIcon,
} from 'lucide-react'
import { adminContent, publicContent } from '../services/contentService'

export type AboutContent = { tagline: string; heading: string; paragraphs: string[] }
export type ContactContent = { address: string; phone: string; email: string; lat: number; lng: number }
export type QuickLink = { label: string; href: string }
export type SocialLink = { iconName: string; href: string }

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

const LS_KEY = 'site-content'

function readCache(): FullSiteContent {
  try {
    const s = localStorage.getItem(LS_KEY)
    return s ? JSON.parse(s) : DEFAULTS
  } catch { return DEFAULTS }
}

function writeCache(data: FullSiteContent) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)) } catch {}
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
  const [data, setData] = useState<FullSiteContent>(readCache)

  // On mount: fetch from backend — backend overrides localStorage cache
  useEffect(() => {
    publicContent.getConfig<FullSiteContent>(LS_KEY)
      .then((remote) => {
        if (remote?.about && remote?.contact && remote?.footer) {
          setData(remote)
          writeCache(remote)
        }
      })
      .catch(() => {})
  }, [])

  const save = useCallback((next: FullSiteContent) => {
    setData(next)
    writeCache(next)                                        // localStorage: instant, single-device cache
    adminContent.saveConfig(LS_KEY, next).catch(() => {})  // backend: cross-device source of truth
  }, [])

  const setAboutContent   = useCallback((c: AboutContent)   => save({ ...data, about: c }),   [data, save])
  const setContactContent = useCallback((c: ContactContent) => save({ ...data, contact: c }), [data, save])
  const setFooterContent  = useCallback((c: FooterContent)  => save({ ...data, footer: c }),  [data, save])

  const value = useMemo(() => ({
    aboutContent: data.about,
    setAboutContent,
    contactContent: data.contact,
    setContactContent,
    footerContent: data.footer,
    setFooterContent,
  }), [data, setAboutContent, setContactContent, setFooterContent])

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider')
  return ctx
}
