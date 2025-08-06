import type { AxiosInstance } from 'axios'
import { setupAuthInterceptors } from './auth'
import { setupErrorInterceptors } from './error'

/**
 * Setup all interceptors for the API client
 */
export const setupInterceptors = (client: AxiosInstance) => {
  setupAuthInterceptors(client)
  setupErrorInterceptors(client)
}

export * from './auth'
export * from './error'