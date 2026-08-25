import { motion } from 'framer-motion'
import { Award, Shield, Users } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import ScrollReveal from './ScrollReveal'

type AboutSectionProps = {
  onOpenConsultation: () => void
}

const highlights = [
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    description:
      'Every project is built to premium standards with rigorous quality checks at each stage.',
  },
  {
    icon: Shield,
    title: 'Complete Transparency',
    description:
      'Real-time progress updates, clear billing, and open communication throughout your build.',
  },
  {
    icon: Users,
    title: 'Client-First Approach',
    description:
      'Dedicated project managers and site engineers keep you informed every step of the way.',
  },
]

export default function AboutSection({ onOpenConsultation }: AboutSectionProps) {
  const { aboutContent } = useSiteContent()

  return (
    <section id="about" className="bg-brand-cream px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
            {aboutContent.tagline}
          </p>
          <h2 className="text-center font-heading text-2xl font-semibold text-brand-dark sm:text-3xl lg:text-4xl">
            {aboutContent.heading}
          </h2>
          <div className="mx-auto mt-4 max-w-2xl space-y-3 text-center text-sm leading-relaxed text-gray-600 sm:text-base">
            {aboutContent.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {highlights.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <div className="h-full rounded-xl border border-border-light bg-white p-5 shadow-sm sm:p-6">
                <div className="icon-badge mb-4 h-10 w-10 sm:h-11 sm:w-11">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-brand-dark sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center sm:mt-12" delay={0.2}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenConsultation}
            className="interactive-focus touch-target inline-flex w-full items-center justify-center rounded-button bg-brand-gold px-8 py-3.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-[0.98] sm:w-auto"
          >
            Start Your Project With Us
          </motion.button>
        </ScrollReveal>
      </div>
    </section>
  )
}
