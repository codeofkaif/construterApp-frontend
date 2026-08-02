import { motion } from 'framer-motion'
import {
  ExternalLink,
  Minus,
  Plus,
  Save,
} from 'lucide-react'
import { useState } from 'react'
import {
  SOCIAL_ICON_MAP,
  useSiteContent,
  type AboutContent,
  type ContactContent,
  type FooterContent,
  type QuickLink,
  type SocialLink,
} from '../../../context/SiteContentContext'

const SOCIAL_ICON_OPTIONS = Object.keys(SOCIAL_ICON_MAP)

// ---------------------------------------------------------------------------
// Tab 1: About Us Form
// ---------------------------------------------------------------------------

function AboutUsTab() {
  const { aboutContent, setAboutContent } = useSiteContent()
  const [form, setForm] = useState<AboutContent>({
    ...aboutContent,
    paragraphs: [...aboutContent.paragraphs],
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setAboutContent(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleParagraphChange = (index: number, text: string) => {
    setForm((prev) => {
      const next = [...prev.paragraphs]
      next[index] = text
      return { ...prev, paragraphs: next }
    })
  }

  const addParagraph = () => {
    setForm((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ''],
    }))
  }

  const removeParagraph = (index: number) => {
    setForm((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label">Tagline</label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
            placeholder="e.g. About Us"
            className="admin-input mt-1 w-full"
          />
        </div>
        <div>
          <label className="admin-label">Heading</label>
          <input
            type="text"
            value={form.heading}
            onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
            placeholder="e.g. Building Trust in Lucknow"
            className="admin-input mt-1 w-full"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="admin-label mb-0">Story / Mission Paragraphs</label>
          <button
            type="button"
            onClick={addParagraph}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/30 px-3 py-1 text-xs font-medium text-brand-gold hover:border-brand-gold/60"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Paragraph
          </button>
        </div>

        <div className="space-y-3">
          {form.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                placeholder={`Paragraph ${i + 1}`}
                className="admin-input flex-1 resize-none"
              />
              {form.paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save About Us'}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 2: Contact & Location Form
// ---------------------------------------------------------------------------

function ContactTab() {
  const { contactContent, setContactContent } = useSiteContent()
  const [form, setForm] = useState<ContactContent>({ ...contactContent })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setContactContent(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="admin-label">Office Address</label>
        <textarea
          rows={2}
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          placeholder="Complete office address…"
          className="admin-input mt-1 w-full resize-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label">Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+91 ..."
            className="admin-input mt-1 w-full"
          />
        </div>
        <div>
          <label className="admin-label">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="info@example.com"
            className="admin-input mt-1 w-full"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label">Map Latitude (Lat)</label>
          <input
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => setForm((p) => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
            placeholder="26.8266946"
            className="admin-input mt-1 w-full"
          />
        </div>
        <div>
          <label className="admin-label">Map Longitude (Lng)</label>
          <input
            type="number"
            step="any"
            value={form.lng}
            onChange={(e) => setForm((p) => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
            placeholder="81.00043815"
            className="admin-input mt-1 w-full"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Contact Info'}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 3: Footer Form
// ---------------------------------------------------------------------------

function FooterTab() {
  const { footerContent, setFooterContent } = useSiteContent()
  const [form, setForm] = useState<FooterContent>({
    ...footerContent,
    quickLinks: [...footerContent.quickLinks],
    socialLinks: [...footerContent.socialLinks],
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setFooterContent(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Quick Links handlers
  const handleQuickLinkChange = (index: number, key: keyof QuickLink, val: string) => {
    setForm((prev) => {
      const next = [...prev.quickLinks]
      next[index] = { ...next[index], [key]: val }
      return { ...prev, quickLinks: next }
    })
  }

  const addQuickLink = () => {
    setForm((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { label: '', href: '#' }],
    }))
  }

  const removeQuickLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index),
    }))
  }

  // Social Links handlers
  const handleSocialLinkChange = (index: number, key: keyof SocialLink, val: string) => {
    setForm((prev) => {
      const next = [...prev.socialLinks]
      next[index] = { ...next[index], [key]: val }
      return { ...prev, socialLinks: next }
    })
  }

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { iconName: 'Globe', href: 'https://' }],
    }))
  }

  const removeSocialLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="admin-label">Footer Tagline</label>
        <textarea
          rows={2}
          value={form.tagline}
          onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
          placeholder="Footer description tagline…"
          className="admin-input mt-1 w-full resize-none"
        />
      </div>

      {/* Quick Links */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="admin-label mb-0">Quick Links</label>
          <button
            type="button"
            onClick={addQuickLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/30 px-3 py-1 text-xs font-medium text-brand-gold hover:border-brand-gold/60"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Link
          </button>
        </div>

        <div className="space-y-2">
          {form.quickLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleQuickLinkChange(i, 'label', e.target.value)}
                placeholder="Label"
                className="admin-input w-40 shrink-0"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => handleQuickLinkChange(i, 'href', e.target.value)}
                placeholder="URL or #section"
                className="admin-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeQuickLink(i)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="admin-label mb-0">Social Links</label>
          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/30 px-3 py-1 text-xs font-medium text-brand-gold hover:border-brand-gold/60"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Social Link
          </button>
        </div>

        <div className="space-y-2">
          {form.socialLinks.map((sLink, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={sLink.iconName}
                onChange={(e) => handleSocialLinkChange(i, 'iconName', e.target.value)}
                className="admin-input w-36 shrink-0"
              >
                {SOCIAL_ICON_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={sLink.href}
                onChange={(e) => handleSocialLinkChange(i, 'href', e.target.value)}
                placeholder="https://..."
                className="admin-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeSocialLink(i)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="admin-label">Copyright Text</label>
        <input
          type="text"
          value={form.copyright}
          onChange={(e) => setForm((p) => ({ ...p, copyright: e.target.value }))}
          placeholder="© 2026 Adil ..."
          className="admin-input mt-1 w-full"
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-goldLight"
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Footer'}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AdminSiteContentView Main View
// ---------------------------------------------------------------------------

export default function AdminSiteContentView() {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'footer'>('about')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Content</h2>
          <p className="mt-1 text-sm text-white/40">
            Manage public section texts, contact info, and footer links.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.open('/', '_blank')}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Site
        </button>
      </div>

      {/* Card with Tabs */}
      <div className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 sm:p-8">
        {/* Tabs Bar */}
        <div className="mb-8 flex border-b border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'about'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'contact'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Contact & Location
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('footer')}
            className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'footer'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Footer
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && <AboutUsTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'footer' && <FooterTab />}
      </div>
    </motion.div>
  )
}
