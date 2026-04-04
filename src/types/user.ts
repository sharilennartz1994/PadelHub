export type UserRole = 'player' | 'coach'

export type PlayerLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
}

export interface Player extends User {
  role: 'player'
  level: PlayerLevel
  preferredLocation?: string
  notificationsEnabled: boolean
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignupData extends AuthCredentials {
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
}
