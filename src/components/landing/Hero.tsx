import { animate, motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Building2,
  Phone,
  Smile,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type HeroProps = {
  onOpenConsultation: () => void
}

const stats = [
  {
    icon: Building2,
    value: 120,
    suffix: '+',
    label: 'Projects Completed',
  },
  {
    icon: Users,
    value: 10,
    suffix: '+',
    label: 'Years Experience',
  },
  {
    icon: Smile,
    value: 50,
    suffix: '+',
    label: 'Happy Families',
  },
  {
    icon: Award,
    value: 98,
    suffix: '%',
    label: 'Client Satisfaction',
  },
] as const

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

export default function Hero({ onOpenConsultation }: HeroProps) {
  const statsRef = useRef<HTMLDivElement>(null)
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.4 })

  const scrollToFeaturedProject = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] flex-col overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=80"
        alt="Modern luxury villa at night with exterior lighting"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(11, 13, 18, 0.9), rgba(11, 13, 18, 0.4))',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-6 pt-28 sm:px-8 lg:px-12 lg:pb-40">
        <div className="max-w-[600px]">
          <p className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-brand-gold">
            <span>Quality</span>
            <span className="h-1 w-1 rounded-full bg-brand-gold" />
            <span>Trust</span>
            <span className="h-1 w-1 rounded-full bg-brand-gold" />
            <span>Transparency</span>
          </p>

          <h1 className="font-heading text-[36px] font-semibold leading-[1.1] sm:text-[48px] lg:text-[56px]">
            <span className="block text-white">Building Dreams,</span>
            <span className="block text-brand-gold">Creating Homes</span>
          </h1>

          <p className="mt-6 max-w-[480px] text-base leading-relaxed text-gray-200">
            From foundation to finishing, we deliver quality construction with
            complete transparency.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenConsultation}
              className="interactive-focus touch-target inline-flex w-full items-center justify-center gap-2 rounded-button bg-brand-gold px-6 py-3 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-[0.98] sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              Get Free Consultation
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToFeaturedProject}
              className="interactive-focus touch-target group inline-flex w-full items-center justify-center gap-2 rounded-button border-[1.5px] border-white/40 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/70 active:scale-[0.98] sm:w-auto"
            >
              View Our Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-10 w-full rounded-2xl border border-white/[0.08] bg-brand-dark/75 px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-8 lg:absolute lg:bottom-8 lg:left-12 lg:right-12 lg:mt-0 lg:px-8"
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left"
              >
                <div className="icon-badge mb-3 h-10 w-10">
                  <stat.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  <CountUpNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    isInView={isStatsInView}
                  />
                </p>
                <p className="mt-1 break-words text-xs text-white/70 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
