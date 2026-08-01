import { motion } from 'framer-motion'
import {
  Building2,
  Home,
  Key,
  PaintRoller,
  Ruler,
  Sofa,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ScrollReveal, { StaggerReveal, staggerItem } from './ScrollReveal'

type Service = {
  slug: string
  icon: LucideIcon
  title: string
  description: string
}

const services: Service[] = [
  {
    slug: 'house-construction',
    icon: Home,
    title: 'House Construction',
    description: 'Complete construction solutions for your dream home.',
  },
  {
    slug: 'renovation',
    icon: PaintRoller,
    title: 'Renovation',
    description: 'Transform your existing space into something extraordinary.',
  },
  {
    slug: 'interior-design',
    icon: Sofa,
    title: 'Interior Design',
    description: 'Beautiful interiors that match your style and personality.',
  },
  {
    slug: 'architectural-planning',
    icon: Ruler,
    title: 'Architectural Planning',
    description: 'Modern and functional designs by expert architects.',
  },
  {
    slug: 'turnkey-projects',
    icon: Key,
    title: 'Turnkey Projects',
    description: 'End-to-end project management with complete peace of mind.',
  },
  {
    slug: 'commercial-buildings',
    icon: Building2,
    title: 'Commercial Buildings',
    description: 'High-quality construction for commercial spaces and buildings.',
  },
]

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon

  return (
    <motion.div variants={staggerItem} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/services/${service.slug}`}
        className="group block h-full rounded-xl border border-white/[0.08] bg-brand-darkCard p-6 transition-colors duration-200 hover:border-brand-gold active:scale-[0.99]"
      >
        <Icon className="mb-5 h-8 w-8 text-brand-gold" strokeWidth={1.5} />
        <h3 className="mb-2 text-lg font-bold text-white">{service.title}</h3>
        <p className="text-sm leading-relaxed text-white/70">{service.description}</p>
      </Link>
    </motion.div>
  )
}

export default function ServicesSection() {
  return (
    <section id="services" className="bg-brand-dark px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <header className="mb-14 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
              Our Services
            </p>
            <h2 className="font-heading text-4xl font-semibold text-white md:text-5xl">
              What We Offer
            </h2>
          </header>
        </ScrollReveal>

        <StaggerReveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}
