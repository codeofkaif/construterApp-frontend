import { ArrowLeft, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext'
import ImageLightbox from '../components/landing/ImageLightbox'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { projects } = usePortfolio()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return <Navigate to="/#projects" replace />
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="min-h-screen bg-brand-cream px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/#projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-gold transition-colors hover:text-brand-goldLight"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Featured Project
        </Link>

        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
          Project Details
        </p>
        <h1 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl md:text-5xl">
          {project.title}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 text-brand-gold" strokeWidth={1.75} />
          {project.location}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 md:grid-cols-4 md:gap-4">
          {project.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border-light bg-white p-3 shadow-sm sm:p-4"
            >
              <p className="text-sm font-bold text-brand-dark sm:text-base">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12">
          <h2 className="mb-5 font-heading text-xl font-semibold text-brand-dark sm:mb-6 sm:text-2xl">
            Photo Gallery
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => openLightbox(index)}
                className="aspect-[4/3] overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt || project.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ImageLightbox
        images={project.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
