import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // Include cookies in all requests
})

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

axiosClient.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json'

    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})

axiosClient.interceptors.response.use(
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
                  return axiosClient(originalRequest)
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
                return axiosClient(originalRequest)
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

async function $post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        const response = await axiosClient.post<T, R>(url, data, config)
        return response
    } catch (error) {
        return Promise.reject(error)
    }
}

function $get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.get<T, R>(url, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

function $put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.put<T, R>(url, data, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

function $patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.patch<T, R>(url, data, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

function $delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.delete<T, R>(url, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

export { $delete, $get, $patch, $post, $put }