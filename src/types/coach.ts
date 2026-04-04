import type { User } from './user'

export interface Coach extends User {
  role: 'coach'
  bio: string
  qualifications: string[]
  yearsExperience: number
  hourlyRate: number
  groupRate?: number
  rating: number
  reviewCount: number
  isVerified: boolean
  locations: CoachLocation[]
  availability: Availability[]
  lessonDurations: number[]
  groupLessonsEnabled: boolean
  groupSurcharge?: number
}

export interface CoachLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

export interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface CoachSearchFilters {
  query?: string
  location?: string
  maxDistance?: number
  minPrice?: number
  maxPrice?: number
  date?: string
  level?: string
  sortBy?: 'distance' | 'price' | 'rating'
}

export interface Review {
  id: string
  playerId: string
  playerName: string
  playerAvatar?: string
  coachId: string
  rating: number
  comment: string
  createdAt: string
}
