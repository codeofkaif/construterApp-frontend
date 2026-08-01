import { AnimatePresence, motion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { ProjectImage } from '../../data/mockData'

type ImageLightboxProps = {
  images: ProjectImage[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export default function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex)
  }, [initialIndex, isOpen])

  const goNext = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [goNext, goPrev, isOpen, onClose])

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-dark/95 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:right-16"
            aria-label="Next photo"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <motion.div
            key={currentIndex}
            className="flex max-h-[85vh] w-full max-w-5xl flex-col items-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
            <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <Camera className="h-4 w-4" />
              {currentImage.alt} — {currentIndex + 1} / {images.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
