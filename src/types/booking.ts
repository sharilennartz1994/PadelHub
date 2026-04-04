export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type LessonType = 'single' | 'group'

export interface Booking {
  id: string
  code: string
  coachId: string
  coachName: string
  coachAvatar?: string
  playerId: string
  playerName: string
  playerAvatar?: string
  date: string
  startTime: string
  endTime: string
  duration: number
  type: LessonType
  location: string
  courtName?: string
  status: BookingStatus
  price: number
  participants?: Participant[]
  createdAt: string
}

export interface Participant {
  id: string
  name: string
  avatar?: string
}

export interface BookingFormData {
  coachId: string
  date: string
  time: string
  duration: number
  type: LessonType
  participants: string[]
}

export interface TimeSlot {
  time: string
  available: boolean
}
