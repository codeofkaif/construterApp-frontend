// ---------------------------------------------------------------------------
// Centralized API fetch wrapper
// All API calls go through this — JWT is attached automatically.
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // Token expired or invalid — clear storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new ApiError(401, 'Session expired. Please log in again.')
  }

  if (res.status === 403) {
    throw new ApiError(403, 'You do not have permission to perform this action.')
  }

  if (res.status === 404) {
    throw new ApiError(404, 'Resource not found.')
  }

  if (res.status === 429) {
    throw new ApiError(429, 'Too many requests. Please try again later.')
  }

  if (res.status >= 500) {
    throw new ApiError(res.status, 'Server error. Please try again later.')
  }

  if (res.status === 204 || res.status === 201) {
    // No content / Created with no body
    return undefined as T
  }

  const text = await res.text()
  if (!text) return undefined as T

  try {
    return JSON.parse(text) as T
  } catch {
    throw new ApiError(res.status, 'Invalid response from server.')
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    // Try to extract backend error message
    const text = await res.text().catch(() => '')
    let message = `Request failed with status ${res.status}`
    try {
      const json = JSON.parse(text)
      message = json.message ?? json.error ?? message
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, message)
  }

  return handleResponse<T>(res)
}

// Shorthand helpers
export const apiGet  = <T>(path: string) => apiFetch<T>(path)
export const apiPost = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) })
export const apiPatch = <T>(path: string, body?: unknown) =>
  apiFetch<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined })
