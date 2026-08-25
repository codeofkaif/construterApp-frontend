import { animate, motion, useInView } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LUCIDE_ICON_MAP, useHomepage } from '../../context/HomepageContext'

type HeroProps = {
  onOpenConsultation: () => void
}

function CountUpNumber({
  value,
  suffix,
  isInView,
}: {
  value: number
  suffix: string
  isInView: boolean
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, value])

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}

// Parses "120+" → { value: 120, suffix: '+' }, "98%" → { value: 98, suffix: '%' }
function parseNumber(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/)
  if (!match) return { value: 0, suffix: '' }
  return { value: parseInt(match[1], 10), suffix: match[2] }
}

export default function Hero({ onOpenConsultation }: HeroProps) {
  const { content } = useHomepage()
  const statsRef = useRef<HTMLDivElement>(null)
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.4 })

  const scrollToFeaturedProject = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <img
        src={content.heroBgUrl}
        alt="Hero background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(11, 13, 18, 0.92), rgba(11, 13, 18, 0.45))',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-6 pt-24 sm:px-8 lg:px-12 lg:pb-44">
        <div className="max-w-[600px]">
          <p className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-brand-gold sm:text-[11px]">
            <span>Quality</span>
            <span className="h-1 w-1 rounded-full bg-brand-gold" />
            <span>Trust</span>
            <span className="h-1 w-1 rounded-full bg-brand-gold" />
            <span>Transparency</span>
          </p>

          <h1 className="font-heading text-[30px] font-semibold leading-[1.1] sm:text-[44px] lg:text-[56px]">
            <span className="block text-white">{content.heroLine1}</span>
            <span className="block text-brand-gold">{content.heroLine2}</span>
          </h1>

          <p className="mt-5 max-w-[480px] text-sm leading-relaxed text-gray-200 sm:text-base">
            {content.heroSubtext}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenConsultation}
              className="interactive-focus touch-target inline-flex w-full items-center justify-center gap-2 rounded-button bg-brand-gold px-6 py-3.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-[0.98] sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              Get Free Consultation
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToFeaturedProject}
              className="interactive-focus touch-target group inline-flex w-full items-center justify-center gap-2 rounded-button border-[1.5px] border-white/40 bg-transparent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/70 active:scale-[0.98] sm:w-auto"
            >
              View Our Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-10 w-full rounded-2xl border border-white/[0.08] bg-brand-dark/80 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-7 lg:absolute lg:bottom-8 lg:left-12 lg:right-12 lg:mt-0 lg:px-8 lg:py-7"
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-4">
            {content.trustStats.map((stat) => {
              const Icon = LUCIDE_ICON_MAP[stat.iconName]
              const { value, suffix } = parseNumber(stat.number)
              return (
                <div
                  key={stat.label}
                  className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left"
                >
                  <div className="icon-badge mb-2.5 h-9 w-9 sm:h-10 sm:w-10">
                    {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />}
                  </div>
                  <p className="text-xl font-bold text-white sm:text-2xl lg:text-4xl">
                    <CountUpNumber
                      value={value}
                      suffix={suffix}
                      isInView={isStatsInView}
                    />
                  </p>
                  <p className="mt-1 break-words text-[11px] text-white/70 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

