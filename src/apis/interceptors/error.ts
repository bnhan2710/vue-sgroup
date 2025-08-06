import type { AxiosInstance, AxiosError } from 'axios'

// Queue for failed requests during token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  
  failedQueue = []
}

/**
 * Setup error handling interceptors
 */
export const setupErrorInterceptors = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any
      const resp = error.response as any
      const respErrorCode = resp?.status ?? 500
      
      if (respErrorCode === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If token is being refreshed, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return client(originalRequest)
          }).catch(err => {
            return Promise.reject(err)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Dynamic import to avoid circular dependency
          const { useAuthStore } = await import('@/stores/auth')
          const authStore = useAuthStore()
          
          const newToken = await authStore.refreshAccessToken()
          
          // Update authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          
          // Process queued requests
          processQueue(null, newToken)
          
          // Retry the original request
          return client(originalRequest)
        } catch (refreshError) {
          // Process queued requests with error
          processQueue(refreshError, null)
          
          // Clear auth and redirect
          const { useAuthStore } = await import('@/stores/auth')
          const authStore = useAuthStore()
          await authStore.logout()
          
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }
      
      const respErrorMessage = resp?.data?.error ?? resp?.data?.message ?? 'UNKNOWN_ERROR'
      throw new Error(respErrorMessage)
    }
  )
}