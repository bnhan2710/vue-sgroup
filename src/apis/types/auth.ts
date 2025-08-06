/**
 * Authentication related types
 */

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  user: User
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}