import { motion } from 'framer-motion'
import { Award, Shield, Users } from 'lucide-react'
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
  return (
    <section id="about" className="bg-brand-cream px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
            About Us
          </p>
          <h2 className="text-center font-heading text-3xl font-semibold text-brand-dark sm:text-4xl">
            Building Trust in Lucknow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-gray-600">
            Adil Constructions has been transforming dreams into homes across Lucknow
            for over a decade — delivering residential and commercial projects with
            uncompromising quality and transparency.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {highlights.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <div className="h-full rounded-xl border border-border-light bg-white p-6 shadow-sm">
                <div className="icon-badge mb-4 h-11 w-11">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-brand-dark">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center" delay={0.2}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenConsultation}
            className="interactive-focus touch-target inline-flex items-center justify-center rounded-button bg-brand-gold px-8 py-3 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-[0.98]"
          >
            Start Your Project With Us
          </motion.button>
        </ScrollReveal>
      </div>
    </section>
  )
}
