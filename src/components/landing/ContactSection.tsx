import { motion } from 'framer-motion'
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import ScrollReveal from './ScrollReveal'

type ContactSectionProps = {
  onOpenConsultation: () => void
}

export default function ContactSection({ onOpenConsultation }: ContactSectionProps) {
  const { contactContent } = useSiteContent()

  const contactDetails = [
    {
      icon: Phone,
      label: 'Phone',
      value: contactContent.phone,
      href: `tel:${contactContent.phone}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactContent.email,
      href: `mailto:${contactContent.email}`,
    },
    {
      icon: MapPin,
      label: 'Office Location',
      value: contactContent.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(contactContent.address)}`,
    },
  ]

  const googleMapsUrl = `https://maps.google.com/maps?q=${contactContent.lat},${contactContent.lng}&z=15&output=embed`

  return (
    <section id="contact" className="bg-brand-dark px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
            Contact & Location
          </p>
          <h2 className="text-center font-heading text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            Let&apos;s Build Together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/70 sm:text-base">
            Visit our office or reach out for a free consultation — our expert site engineers respond within 24 hours.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Contact Info */}
          <ScrollReveal className="space-y-5">
            <div className="space-y-3 sm:space-y-4">
              {contactDetails.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.icon === MapPin ? '_blank' : undefined}
                  rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                  className="interactive-focus flex items-center gap-4 rounded-xl border border-white/[0.08] bg-brand-darkCard p-4 transition-all hover:border-brand-gold/40 active:scale-[0.99] sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold sm:h-11 sm:w-11">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">
                      {item.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-white/80">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenConsultation}
                className="interactive-focus touch-target inline-flex w-full items-center justify-center rounded-button bg-brand-gold px-8 py-3.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-[0.98]"
              >
                Get Free Consultation
              </motion.button>
            </div>
          </ScrollReveal>

          {/* Right: Map */}
          <ScrollReveal delay={0.12}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-brand-darkCard shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-5 sm:py-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-gold" />
                  <span className="truncate max-w-[180px] sm:max-w-none">
                    Lat: {contactContent.lat}, Lng: {contactContent.lng}
                  </span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${contactContent.lat},${contactContent.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold hover:text-brand-goldLight"
                >
                  Open Map
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="relative h-[260px] w-full bg-brand-dark sm:h-[320px]">
                <iframe
                  title="Office Location Map"
                  src={googleMapsUrl}
                  className="h-full w-full border-0 grayscale transition-all duration-500 hover:grayscale-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
