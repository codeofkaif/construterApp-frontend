import { apiPost } from './api'

// POST /api/leads → LeadRequest
export type LeadRequest = {
  name: string
  phone: string
  message?: string
}

export const leadService = {
  submit: (req: LeadRequest) =>
    apiPost<{ message: string }>('/api/leads', req),
}
