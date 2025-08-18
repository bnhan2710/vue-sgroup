import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/apis'
import type { UserProfile, UpdateUserPayload } from '@/apis/types'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchById(userId: string) {
    try {
      loading.value = true
      error.value = null
      const res = await userService.getById(userId)
      profile.value = res.data
      return profile.value
    } catch (e: any) {
      error.value = e?.message || 'Failed to load profile'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(payload: UpdateUserPayload) {
    if (!profile.value) return null
    try {
      loading.value = true
      error.value = null
      const res = await userService.update(profile.value.id, payload)
      profile.value = res.data
      return profile.value
    } catch (e: any) {
      error.value = e?.message || 'Failed to update profile'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    profile,
    loading,
    error,
    // actions
    fetchById,
    update,
  }
})


