import { motion } from 'framer-motion'
import { ArrowLeft, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const serviceDetails: Record<string, { summary: string; highlights: string[] }> = {
  'house-construction': {
    summary:
      'End-to-end residential construction — from site preparation and foundation to final handover with quality checks at every stage.',
    highlights: [
      'Custom floor plans tailored to your plot',
      'Premium materials with transparent costing',
      'Dedicated project manager and site engineer',
    ],
  },
  renovation: {
    summary:
      'Transform your existing home with structural upgrades, modern finishes, and smart space planning without compromising quality.',
    highlights: [
      'Kitchen, bathroom, and full-home renovations',
      'Minimal disruption with phased execution',
      'Before-and-after progress documentation',
    ],
  },
  'interior-design': {
    summary:
      'Cohesive interior design that blends aesthetics with functionality — curated finishes, furniture, and lighting for every room.',
    highlights: [
      '3D visualizations before execution',
      'Material and finish selection support',
      'Turnkey execution with trusted vendors',
    ],
  },
  'architectural-planning': {
    summary:
      'Expert architectural planning for residential and commercial projects — Vastu-compliant layouts, approvals, and detailed drawings.',
    highlights: [
      'Site analysis and feasibility studies',
      'Structural and MEP coordination',
      'Municipal approval assistance',
    ],
  },
  'turnkey-projects': {
    summary:
      'Single-point responsibility from design to delivery — we manage every detail so you can focus on your vision.',
    highlights: [
      'Fixed timelines with milestone tracking',
      'Single contract, complete accountability',
      'Client dashboard for real-time updates',
    ],
  },
  'commercial-buildings': {
    summary:
      'High-quality commercial construction for offices, retail, and mixed-use spaces built to code with efficient project delivery.',
    highlights: [
      'Commercial-grade structural systems',
      'Compliance with local building codes',
      'Scalable designs for future expansion',
    ],
  },
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const formattedTitle = slug
    ? slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Service'

  const detail = slug ? serviceDetails[slug] : null

  return (
    <div className="min-h-screen bg-brand-dark px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/#services"
          className="interactive-focus mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-gold transition-colors hover:text-brand-goldLight"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
          Service Detail
        </p>
        <h1 className="font-heading text-2xl font-semibold text-white sm:text-3xl md:text-5xl">
          {formattedTitle}
        </h1>

        {detail ? (
          <>
            <p className="mt-6 text-base leading-relaxed text-white/70">{detail.summary}</p>
            <ul className="mt-8 space-y-3">
              {detail.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-6 text-base leading-relaxed text-white/70">
            This service is part of our full construction portfolio. Contact us to learn
            more about how we can help with your project.
          </p>
        )}

        <motion.div className="mt-10" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/?consult=1"
            className="interactive-focus inline-flex w-full items-center justify-center gap-2 rounded-button bg-brand-gold px-6 py-3.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight sm:w-auto"
          >
            <Phone className="h-4 w-4" />
            Get Free Consultation
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
