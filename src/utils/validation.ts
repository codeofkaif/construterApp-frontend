export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required.`
  return null
}

export function validatePhone(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Phone number is required.'
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) {
    return 'Enter a valid phone number (10 digits).'
  }
  return null
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Enter a valid email address.'
  }
  return null
}

export function validateMessage(value: string, minLength = 10): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Message is required.'
  if (trimmed.length < minLength) {
    return `Message must be at least ${minLength} characters.`
  }
  return null
}
