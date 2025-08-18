export interface UserProfile {
  id: string
  email: string
  username: string
  displayName?: string | null
  age?: number | null
  gender?: 'male' | 'female' | 'other' | null
  createdAt: string
  updatedAt: string
}

export interface UpdateUserPayload {
  displayName?: string
  age?: number
  gender?: 'male' | 'female' | 'other'
}

