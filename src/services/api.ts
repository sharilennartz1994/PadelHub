const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiCall<T = unknown>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      json?.error ?? json?.message ?? `Request failed (${res.status})`
    throw new ApiError(message, res.status)
  }

  return json?.data ?? json
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const authService = {
  login(email: string, password: string) {
    return apiCall<{
      token: string
      user: {
        id: string
        email: string
        name: string
        surname: string | null
        role: 'COACH' | 'PLAYER'
        coach?: { id: string; bio: string; pricePerHour: number; qualifications: string[]; yearsExperience: number }
        player?: { id: string; level: string }
      }
    }>('/auth/login', 'POST', { email, password })
  },

  signupPlayer(data: {
    email: string
    password: string
    name: string
    surname?: string
    phone?: string
    level?: string
  }) {
    return apiCall<{
      token: string
      user: {
        id: string
        email: string
        name: string
        role: 'PLAYER'
        player: { id: string; level: string }
      }
    }>('/auth/signup/player', 'POST', data)
  },

  signupCoach(data: {
    email: string
    password: string
    name: string
    surname?: string
    phone?: string
    qualifications?: string[]
    yearsExperience?: number
    pricePerHour?: number
  }) {
    return apiCall<{
      token: string
      user: {
        id: string
        email: string
        name: string
        role: 'COACH'
        coach: { id: string }
      }
    }>('/auth/signup/coach', 'POST', data)
  },

  getMe(token: string) {
    return apiCall<{
      id: string
      email: string
      name: string
      surname: string | null
      phone: string | null
      role: 'COACH' | 'PLAYER'
      coach?: { id: string; bio: string; pricePerHour: number; qualifications: string[]; yearsExperience: number }
      player?: { id: string; level: string }
    }>('/auth/me', 'GET', undefined, token)
  },
}

// ---------------------------------------------------------------------------
// Coaches
// ---------------------------------------------------------------------------
export const coachService = {
  searchCoaches(filters?: {
    latitude?: number
    longitude?: number
    distance?: number
    minPrice?: number
    maxPrice?: number
  }) {
    const params = new URLSearchParams()
    if (filters?.latitude) params.set('latitude', String(filters.latitude))
    if (filters?.longitude) params.set('longitude', String(filters.longitude))
    if (filters?.distance) params.set('distance', String(filters.distance))
    if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
    const qs = params.toString()
    return apiCall<unknown[]>(`/coaches/search${qs ? `?${qs}` : ''}`)
  },

  getCoachDetail(coachId: string) {
    return apiCall<Record<string, unknown>>(`/coaches/${coachId}`)
  },

  getCoachLocations(coachId: string) {
    return apiCall<unknown[]>(`/coaches/${coachId}/locations`)
  },

  getAvailability(coachId: string) {
    return apiCall<unknown[]>(`/coaches/${coachId}/availability`)
  },

  addAvailability(
    coachId: string,
    data: { dayOfWeek: number; startTime: string; endTime: string },
    token: string,
  ) {
    return apiCall(`/coaches/${coachId}/availability`, 'POST', data, token)
  },

  addLocation(
    coachId: string,
    data: { name: string; address: string; latitude: number; longitude: number },
    token: string,
  ) {
    return apiCall(`/coaches/${coachId}/locations`, 'POST', data, token)
  },

  updateProfile(
    coachId: string,
    data: Record<string, unknown>,
    token: string,
  ) {
    return apiCall(`/coaches/${coachId}`, 'PUT', data, token)
  },
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------
export const bookingService = {
  createBooking(
    data: {
      coachId: string
      playerId: string
      lessonDate: string
      duration: number
      type: 'SINGLE' | 'GROUP'
      price: number
      locationName?: string
      notes?: string
    },
    token: string,
  ) {
    return apiCall<Record<string, unknown>>('/bookings', 'POST', data, token)
  },

  getPlayerBookings(playerId: string, token: string) {
    return apiCall<unknown[]>(`/bookings/player/${playerId}`, 'GET', undefined, token)
  },

  getCoachBookings(coachId: string, token: string, status?: string) {
    const qs = status ? `?status=${status}` : ''
    return apiCall<unknown[]>(`/bookings/coach/${coachId}${qs}`, 'GET', undefined, token)
  },

  getBookingDetail(bookingId: string, token: string) {
    return apiCall<Record<string, unknown>>(`/bookings/${bookingId}`, 'GET', undefined, token)
  },

  updateStatus(bookingId: string, status: string, token: string) {
    return apiCall(`/bookings/${bookingId}/status`, 'PUT', { status }, token)
  },

  cancelBooking(bookingId: string, token: string) {
    return apiCall(`/bookings/${bookingId}`, 'DELETE', undefined, token)
  },

  getCoachReviews(coachId: string, token: string) {
    return apiCall<unknown[]>(`/bookings/reviews/coach/${coachId}`, 'GET', undefined, token)
  },
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export const messageService = {
  getMessages(bookingId: string, token: string) {
    return apiCall<unknown[]>(`/messages/booking/${bookingId}`, 'GET', undefined, token)
  },

  sendMessage(data: { bookingId: string; content: string }, token: string) {
    return apiCall('/messages', 'POST', data, token)
  },
}

// ---------------------------------------------------------------------------
// Locations (geocoding)
// ---------------------------------------------------------------------------
export const locationService = {
  reverseGeocode(lat: number, lon: number) {
    return apiCall(`/locations/reverse?latitude=${lat}&longitude=${lon}`)
  },

  forwardGeocode(query: string) {
    return apiCall(`/locations/geocode?query=${encodeURIComponent(query)}`)
  },

  nearbyCoaches(lat: number, lon: number, radiusKm = 5) {
    return apiCall(
      `/locations/nearby?latitude=${lat}&longitude=${lon}&radiusKm=${radiusKm}`,
    )
  },
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notificationService = {
  getAll(token: string) {
    return apiCall<unknown[]>('/notifications', 'GET', undefined, token)
  },

  getUnreadCount(token: string) {
    return apiCall<{ count: number }>('/notifications/unread/count', 'GET', undefined, token)
  },

  markRead(notificationId: string, token: string) {
    return apiCall(`/notifications/${notificationId}/read`, 'PUT', undefined, token)
  },

  markAllRead(token: string) {
    return apiCall('/notifications/read-all', 'PUT', undefined, token)
  },
}
