import { useEffect, useState } from 'react'
import AboutSection from '../components/landing/AboutSection'
import ConstructionProcessSection from '../components/landing/ConstructionProcessSection'
import ConsultationModal from '../components/landing/ConsultationModal'
import ContactSection from '../components/landing/ContactSection'
import FeaturedProjectSection from '../components/landing/FeaturedProjectSection'
import Footer from '../components/landing/Footer'
import Hero from '../components/landing/Hero'
import Navbar from '../components/landing/Navbar'
import ServicesSection from '../components/landing/ServicesSection'
import Toast from '../components/landing/Toast'
import WhatsAppIcon from '../components/dashboard/WhatsAppIcon'

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const openConsultation = () => setIsModalOpen(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('consult') === '1') {
      openConsultation()
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`)
    }
  }, [])

  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar onOpenConsultation={openConsultation} />

      <Hero onOpenConsultation={openConsultation} />

      <main>
        <FeaturedProjectSection />
        <ConstructionProcessSection />
        <ServicesSection />
        <AboutSection onOpenConsultation={openConsultation} />
        <ContactSection onOpenConsultation={openConsultation} />
      </main>

      <Footer />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/916388913772?text=Hello%20Adil%20Constructions,%20I%20want%20to%20inquire%20about%20a%20construction%20project."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] active:scale-95"
      >
        <div className="h-7 w-7">
          <WhatsAppIcon />
        </div>
      </a>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setToastVisible(true)}
      />

      <Toast
        message="Thank you! We'll contact you within 24 hours."
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  )
}
