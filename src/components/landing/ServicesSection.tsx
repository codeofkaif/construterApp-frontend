import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SERVICE_ICON_MAP, useServices } from '../../context/ServicesContext'
import ScrollReveal, { StaggerReveal, staggerItem } from './ScrollReveal'

function ServiceCard({ service }: { service: import('../../context/ServicesContext').Service }) {
  const Icon = SERVICE_ICON_MAP[service.iconName]

  return (
    <motion.div variants={staggerItem} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/services/${service.slug}`}
        className="group block h-full rounded-xl border border-white/[0.08] bg-brand-darkCard p-5 transition-colors duration-200 hover:border-brand-gold active:scale-[0.99] sm:p-6"
      >
        {Icon && <Icon className="mb-4 h-7 w-7 text-brand-gold sm:mb-5 sm:h-8 sm:w-8" strokeWidth={1.5} />}
        <h3 className="mb-2 text-base font-bold text-white sm:text-lg">{service.title}</h3>
        <p className="text-sm leading-relaxed text-white/70">{service.description}</p>
      </Link>
    </motion.div>
  )
}

export default function ServicesSection() {
  const { services } = useServices()

  return (
    <section id="services" className="bg-brand-dark px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <header className="mb-10 text-center sm:mb-14">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
              Our Services
            </p>
            <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              What We Offer
            </h2>
          </header>
        </ScrollReveal>

        <StaggerReveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}
