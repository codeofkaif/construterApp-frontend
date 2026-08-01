import { motion } from 'framer-motion'
import { Headphones, Phone, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { ChatMessage } from '../../data/mockData'
import DashboardPanelModal from './DashboardPanelModal'

const siteEngineer = {
  name: 'Site Engineer',
  phone: '',
  role: 'Site Engineer',
}

type ContactEngineerModalProps = {
  isOpen: boolean
  initialMessages: ChatMessage[]
  onClose: () => void
}

function formatTime() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default function ContactEngineerModal({
  isOpen,
  initialMessages,
  onClose,
}: ContactEngineerModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        sender: 'client',
        text,
        time: formatTime(),
      },
    ])
    setDraft('')
  }

  return (
    <DashboardPanelModal
      isOpen={isOpen}
      title="Contact Site Engineer"
      onClose={onClose}
      maxWidth="lg"
    >
      <div className="mb-5 flex items-center gap-4 rounded-lg bg-brand-cream p-4">
        <div className="icon-badge h-12 w-12">
          <Headphones className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-brand-dark">{siteEngineer.name}</p>
          <p className="text-sm text-gray-500">{siteEngineer.role}</p>
          <p className="text-sm text-gray-500">{siteEngineer.phone}</p>
        </div>
        <motion.a
          href={`tel:${siteEngineer.phone}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex shrink-0 items-center gap-2 rounded-button bg-brand-gold px-4 py-2.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight"
        >
          <Phone className="h-4 w-4" />
          Call Now
        </motion.a>
      </div>

      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto rounded-lg border border-border-light bg-brand-cream/50 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 ${
                message.sender === 'client'
                  ? 'bg-brand-gold/15 text-brand-dark'
                  : 'bg-white text-brand-dark shadow-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="mt-1 text-[10px] text-gray-400">{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-button border border-border-light px-4 py-2.5 text-sm text-brand-dark outline-none transition-colors focus:border-brand-gold/50"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center rounded-button bg-brand-gold px-4 py-2.5 text-brand-dark transition-colors hover:bg-brand-goldLight"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </form>
    </DashboardPanelModal>
  )
}
