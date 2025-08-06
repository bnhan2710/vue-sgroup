import { useLocalStorage } from '@vueuse/core'
import { $delete, $get, $post } from '@/apis'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('accessToken', null)
  const refreshToken = useLocalStorage('refreshToken', null)
  const isAuthenticated = computed(() => Boolean(token.value))
  const user = ref(null)
  const isRefreshing = ref(false)

  async function login(payload: { email: string; password: string }) {
    try {
      const response = await $post('auth/login', payload)
      const { accessToken, refreshToken: newRefreshToken, ...userData } = response.data.data
      
      // Store tokens
      token.value = accessToken
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken
      }
      user.value = userData

      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function refreshAccessToken() {
    if (isRefreshing.value) {
      // If already refreshing, wait for it to complete
      return new Promise((resolve, reject) => {
        const checkRefresh = setInterval(() => {
          if (!isRefreshing.value) {
            clearInterval(checkRefresh)
            if (token.value) {
              resolve(token.value)
            } else {
              reject(new Error('Refresh failed'))
            }
          }
        }, 100)
      })
    }

    try {
      isRefreshing.value = true
      
      // Call refresh endpoint - backend expects refresh token in cookie
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies in request
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      const { accessToken: newAccessToken } = data.data

      // Update access token (refresh token is managed by backend via cookies)
      token.value = newAccessToken

      return newAccessToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Clear tokens and redirect to login
      await logout()
      throw error
    } finally {
      isRefreshing.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await $delete('auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API call result
      token.value = null
      refreshToken.value = null
      user.value = null
      
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
  }

  function clearAuth() {
    token.value = null
    refreshToken.value = null
    user.value = null
  }

  return { 
    // State
    token,
    refreshToken,
    user,
    isAuthenticated,
    isRefreshing,
    
    // Actions
    login, 
    logout, 
    refreshAccessToken,
    clearAuth
  }
})
