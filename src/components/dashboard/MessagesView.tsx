import { motion } from 'framer-motion'
import { Headphones, Phone, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { ChatMessage } from '../../data/mockData'
import { validateMessage } from '../../utils/validation'

// Site engineer contact — no API endpoint for this yet
const siteEngineer = { name: 'Site Engineer', phone: '', role: 'Site Engineer' }

type MessagesViewProps = {
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
}

export default function MessagesView({ messages, onSendMessage }: MessagesViewProps) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validationError = validateMessage(draft, 3)
    if (validationError) {
      setError(validationError)
      setSuccess(null)
      return
    }

    onSendMessage(draft.trim())
    setDraft('')
    setError(null)
    setSuccess('Message sent successfully.')
    window.setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
          Messages
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Chat directly with your assigned site engineer.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border-light bg-white p-5 shadow-sm">
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
          className="interactive-focus inline-flex shrink-0 items-center gap-2 rounded-button bg-brand-gold px-4 py-2.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95"
        >
          <Phone className="h-4 w-4" />
          Call Now
        </motion.a>
      </div>

      <div className="flex min-h-[420px] flex-col rounded-xl border border-border-light bg-white shadow-sm">
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  message.sender === 'client'
                    ? 'bg-brand-gold/15 text-brand-dark'
                    : 'bg-brand-cream text-brand-dark'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="mt-1 text-[10px] text-gray-400">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-border-light p-4"
        >
          {error && (
            <p className="mb-2 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-2 text-sm text-brand-green" role="status">
              {success}
            </p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                if (error) setError(null)
              }}
              placeholder="Type your message..."
              className="interactive-focus flex-1 rounded-button border border-border-light px-4 py-2.5 text-sm text-brand-dark outline-none transition-colors focus:border-brand-gold/50"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="interactive-focus inline-flex items-center justify-center rounded-button bg-brand-gold px-4 py-2.5 text-brand-dark transition-colors hover:bg-brand-goldLight active:scale-95"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}
