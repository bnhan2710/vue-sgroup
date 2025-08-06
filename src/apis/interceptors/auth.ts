import type { AxiosInstance } from 'axios'

/**
 * Setup authentication interceptors
 */
export const setupAuthInterceptors = (client: AxiosInstance) => {
  // Request interceptor - Add auth token
  client.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  })
}