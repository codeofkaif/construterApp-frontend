import { useState } from 'react'
import type { ProjectImage } from '../../data/mockData'
import ImageLightbox from '../landing/ImageLightbox'
import DashboardPanelModal from './DashboardPanelModal'

type SitePhotosPanelProps = {
  isOpen: boolean
  photos: ProjectImage[]
  onClose: () => void
}

export default function SitePhotosPanel({
  isOpen,
  photos,
  onClose,
}: SitePhotosPanelProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <DashboardPanelModal
        isOpen={isOpen}
        title="Site Photos"
        onClose={onClose}
        maxWidth="2xl"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <button
              key={photo.url}
              type="button"
              onClick={() => openLightbox(index)}
              className="aspect-[4/3] overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </DashboardPanelModal>

      <ImageLightbox
        images={photos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
