import { apiClient } from '../config'
import { ENDPOINTS } from '../config'
import type { 
  ApiResponse,
  List,
  CreateListDto,
  UpdateListDto
} from '../types'

/**
 * List service
 */
export const listService = {
  /**
   * Create new list
   */
  async createList(data: CreateListDto): Promise<ApiResponse<List>> {
    const response = await apiClient.post<ApiResponse<List>>(
      ENDPOINTS.LISTS.BASE,
      data
    )
    return response.data
  },

  /**
   * Get lists (optionally filtered by board ID)
   */
  async getLists(boardId?: string): Promise<ApiResponse<List[]>> {
    const params = boardId ? { boardId } : {}
    const response = await apiClient.get<ApiResponse<List[]>>(
      ENDPOINTS.LISTS.BASE,
      { params }
    )
    return response.data
  },

  /**
   * Get list by ID
   */
  async getListById(id: string): Promise<ApiResponse<List>> {
    const response = await apiClient.get<ApiResponse<List>>(
      ENDPOINTS.LISTS.BY_ID(id)
    )
    return response.data
  },

  /**
   * Update list
   */
  async updateList(id: string, data: UpdateListDto): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.LISTS.BY_ID(id),
      data
    )
    return response.data
  },

  /**
   * Delete list
   */
  async deleteList(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      ENDPOINTS.LISTS.BY_ID(id)
    )
    return response.data
  }
}