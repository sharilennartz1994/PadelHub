import { create } from 'zustand'
import { authService, ApiError } from '../services/api'

export interface AuthUser {
  id: string
  email: string
  name: string
  surname: string | null
  phone?: string | null
  role: 'COACH' | 'PLAYER'
  coachId?: string
  playerId?: string
  emailVerified?: boolean
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  signupPlayer: (data: {
    email: string
    password: string
    name: string
    surname?: string
    phone?: string
    level?: string
  }) => Promise<void>
  signupCoach: (data: {
    email: string
    password: string
    name: string
    surname?: string
    phone?: string
    qualifications?: string[]
    yearsExperience?: number
    pricePerHour?: number
  }) => Promise<void>
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
  clearError: () => void
  getToken: () => string | null
  loadFromStorage: () => Promise<void>
}

function parseUser(raw: Record<string, unknown>): AuthUser {
  return {
    id: raw.id as string,
    email: raw.email as string,
    name: raw.name as string,
    surname: (raw.surname as string) ?? null,
    phone: (raw.phone as string) ?? null,
    role: raw.role as 'COACH' | 'PLAYER',
    coachId: (raw.coach as Record<string, unknown>)?.id as string | undefined,
    playerId: (raw.player as Record<string, unknown>)?.id as string | undefined,
    emailVerified: raw.emailVerified === true,
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.login(email, password)
      const user = parseUser(data.user as unknown as Record<string, unknown>)
      localStorage.setItem('ph_token', data.token)
      set({ token: data.token, user, isLoggedIn: true, isLoading: false })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login failed'
      set({ isLoading: false, error: msg })
      throw err
    }
  },

  signupPlayer: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.signupPlayer(payload)
      const user = parseUser(data.user as unknown as Record<string, unknown>)
      localStorage.setItem('ph_token', data.token)
      set({ token: data.token, user, isLoggedIn: true, isLoading: false })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Signup failed'
      set({ isLoading: false, error: msg })
      throw err
    }
  },

  signupCoach: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.signupCoach(payload)
      const user = parseUser(data.user as unknown as Record<string, unknown>)
      localStorage.setItem('ph_token', data.token)
      set({ token: data.token, user, isLoggedIn: true, isLoading: false })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Signup failed'
      set({ isLoading: false, error: msg })
      throw err
    }
  },

  setAuth: (user, token) => {
    localStorage.setItem('ph_token', token)
    set({ token, user, isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem('ph_token')
    set({ token: null, user: null, isLoggedIn: false, error: null })
  },

  clearError: () => set({ error: null }),

  getToken: () => {
    return get().token ?? localStorage.getItem('ph_token')
  },

  loadFromStorage: async () => {
    const token = localStorage.getItem('ph_token')
    if (!token) return
    set({ isLoading: true })
    try {
      const raw = await authService.getMe(token)
      const user = parseUser(raw as unknown as Record<string, unknown>)
      set({ token, user, isLoggedIn: true, isLoading: false })
    } catch {
      localStorage.removeItem('ph_token')
      set({ token: null, user: null, isLoggedIn: false, isLoading: false })
    }
  },
}))
