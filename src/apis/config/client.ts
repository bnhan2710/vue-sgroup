import axios, { type AxiosInstance } from 'axios'

/**
 * Create axios instance with default configuration
 */
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return client
}

/**
 * Main API client instance
 */
export const apiClient = createApiClient()