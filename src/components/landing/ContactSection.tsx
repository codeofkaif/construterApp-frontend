import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

type ContactSectionProps = {
  onOpenConsultation: () => void
}

const contactDetails = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 6388913772',
    href: 'tel:+916388913772',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'kkaif2687@gmail.com',
    href: 'mailto:kkaif2687@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Office Location',
    value: '42 Gomti Nagar Extension, Lucknow, UP 226010',
    href: 'https://maps.google.com/?q=Gomti+Nagar+Extension+Lucknow',
  },
]

export default function ContactSection({ onOpenConsultation }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-brand-dark px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
            Contact & Location
          </p>
          <h2 className="text-center font-heading text-3xl font-semibold text-white sm:text-4xl">
            Let&apos;s Build Together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-white/70">
            Visit our office or reach out for a free consultation — our expert site engineers respond within 24 hours.
          </p>
        </ScrollReveal>

        {/* Contact Info Cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {contactDetails.map((item, index) => (
            <ScrollReveal key={item.label} delay={index * 0.08}>
              <a
                href={item.href}
                target={item.icon === MapPin ? '_blank' : undefined}
                rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                className="interactive-focus flex h-full flex-col items-center rounded-xl border border-white/[0.08] bg-brand-darkCard p-6 text-center transition-all hover:border-brand-gold/40 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="icon-badge mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">
                  {item.label}
                </p>
                <p className="mt-2 break-words text-sm font-medium text-white/80">{item.value}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Button */}
        <ScrollReveal className="mt-10 text-center" delay={0.18}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenConsultation}
            className="interactive-focus touch-target inline-flex items-center justify-center rounded-button bg-brand-gold px-8 py-3.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-[0.98]"
          >
            Get Free Consultation
          </motion.button>
        </ScrollReveal>

        {/* Interactive Google Maps Embed Section
        <ScrollReveal className="mt-10" delay={0.12}>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-brand-darkCard shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <MapPin className="h-4 w-4 text-brand-gold" />
                <span>Office Location — Gomti Nagar Extension, Lucknow</span>
              </div>
              <a
                href="https://maps.google.com/?q=Gomti+Nagar+Extension+Lucknow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold transition-colors hover:text-brand-goldLight"
              >
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="relative h-[340px] w-full bg-brand-dark">
              <iframe
                title="Adil Constructions Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14241.670355444319!2d81.00043815!3d26.8266946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be3a7b6cf9dbd%3A0xd680ec326e5d2639!2sGomti%20Nagar%20Extn%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="h-full w-full border-0 grayscale transition-all duration-500 hover:grayscale-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </ScrollReveal> */}

        
      </div>
    </section>
  )
}
