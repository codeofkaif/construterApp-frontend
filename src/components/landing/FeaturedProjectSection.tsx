import { motion } from 'framer-motion'
import { ArrowRight, Camera, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePortfolio } from '../../context/PortfolioContext'
import ImageLightbox from './ImageLightbox'
import ScrollReveal from './ScrollReveal'

export default function FeaturedProjectSection() {
  const { projects } = usePortfolio()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const featuredProject =
    projects.find((p) => p.featured) ||
    [...projects].sort((a, b) => b.createdAt - a.createdAt)[0]

  if (!featuredProject) return null

  const { title, location, stats, images, slug } = featuredProject
  const [heroImage, ...gridImages] = images.length > 0 ? images : [{ url: '', alt: '' }]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <section id="projects" className="bg-brand-cream px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
          {/* Left: Details */}
          <ScrollReveal className="min-w-0 lg:w-[40%]">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
              Featured Project
            </p>

            <h2 className="break-words font-heading text-2xl font-semibold text-brand-dark sm:text-3xl lg:text-4xl">
              {title}
            </h2>

            <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" strokeWidth={1.75} />
              <span className="break-words">{location}</span>
            </div>

            {/* Stats grid — 2 cols on all mobile, auto on bigger */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-lg border border-border-light bg-white p-3 shadow-sm"
                >
                  <p className="break-words text-sm font-bold text-brand-dark">{stat.value}</p>
                  <p className="mt-0.5 break-words text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <motion.div
              className="mt-6 sm:mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/projects/${slug}`}
                className="interactive-focus touch-target inline-flex w-full items-center justify-center gap-2 rounded-button bg-brand-gold px-6 py-3.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-[0.98] sm:w-auto"
              >
                View Project Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </ScrollReveal>

          {/* Right: Photos */}
          <ScrollReveal className="min-w-0 lg:w-[60%]" delay={0.12}>
            <div className="flex flex-col gap-3 sm:h-[360px] sm:flex-row lg:h-[420px]">
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="interactive-focus touch-target aspect-video w-full overflow-hidden rounded-xl sm:aspect-auto sm:h-full sm:w-[55%]"
              >
                {heroImage.url ? (
                  <img
                    src={heroImage.url}
                    alt={heroImage.alt || title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : null}
              </button>

              {gridImages.length > 0 && (
                <div className="grid aspect-square w-full grid-cols-2 grid-rows-2 gap-3 sm:aspect-auto sm:h-full sm:w-[45%]">
                  {gridImages.slice(0, 4).map((image, index) => {
                    const imageIndex = index + 1
                    const isMorePhotos = index === 3

                    return (
                      <button
                        key={image.url || index}
                        type="button"
                        onClick={() => openLightbox(imageIndex)}
                        className="interactive-focus touch-target relative min-h-[44px] overflow-hidden rounded-xl"
                      >
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={image.alt || title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : null}
                        {isMorePhotos && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-brand-dark/55 text-white">
                            <Camera className="h-5 w-5" />
                            <span className="text-xs font-medium">More Photos</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
