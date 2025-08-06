export * from './client'

/**
 * API Configuration constants
 */
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh_token',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  BOARDS: {
    BASE: '/boards',
    SEARCH: '/boards/search',
    PUBLIC: '/boards/public',
    CLOSED: '/boards/closed',
    BY_ID: (id: string) => `/boards/${id}`,
    INVITE: (id: string) => `/boards/${id}/add`,
    REMOVE_MEMBER: (boardId: string, userId: string) => `/boards/${boardId}/member/${userId}`,
  },
  LISTS: {
    BASE: '/lists',
    BY_ID: (id: string) => `/lists/${id}`,
  },
} as const