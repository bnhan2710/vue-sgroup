import { useLocalStorage } from '@vueuse/core'
import { $delete, $get, $post } from '@/apis'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('accessToken', null)
  const isAuthenticated = computed(() => Boolean(token.value))
  const user = ref(null)

  async function login(payload: { email: string; password: string }) {
    const response = await $post('auth/login', payload)
    const { accessToken ,...user } = response.data.data
    token.value = accessToken
    user.value = user

    return response.data
  }

  async function logout() {
      const response = await $delete('auth/logout')
      token.value = null
      user.value = null

      return response.data
  }

  return { login, logout, isAuthenticated }
})
