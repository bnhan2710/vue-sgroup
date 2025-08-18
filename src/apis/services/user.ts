import { apiClient } from '../config'
import { ENDPOINTS } from '../config'
import type { ApiResponse } from '../types/common'
import type { UpdateUserPayload, UserProfile } from '../types/user'

export const userService = {
  async getById(id: string): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(ENDPOINTS.USERS.BY_ID(id))
    return response.data
  },

  async update(id: string, payload: UpdateUserPayload): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.put<ApiResponse<UserProfile>>(ENDPOINTS.USERS.BY_ID(id), payload)
    return response.data
  },
}


