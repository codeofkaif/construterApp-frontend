import { apiPost } from './api'

// ---------------------------------------------------------------------------
// Types — match AuthResponse Java record:
//   AuthResponse(String token, Long userId, String name, String email, String role)
// ---------------------------------------------------------------------------

export type LoginResponse = {
  token: string
  userId: number
  name: string
  email: string
  role: 'ADMIN' | 'CLIENT'
}

export type StoredUser = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CLIENT'
}

// ---------------------------------------------------------------------------
// Auth API calls
// ---------------------------------------------------------------------------

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/api/auth/login', { email, password })
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
  phone?: string,
): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/api/auth/register', { name, email, password, phone })
}


// ---------------------------------------------------------------------------
// Token storage helpers
// ---------------------------------------------------------------------------

export function saveSession(res: LoginResponse): StoredUser {
  const user: StoredUser = {
    id: String(res.userId),
    name: res.name,
    email: res.email,
    role: res.role,
  }
  localStorage.setItem('token', res.token)
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export function clearSession(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function loadSession(): StoredUser | null {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('token')
}
