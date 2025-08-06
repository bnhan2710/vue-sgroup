import { $get, $post, $put, $delete } from './axios.client'

export interface CreateListDto {
  title: string
  boardId: string
}

export interface UpdateListDto {
  title?: string
  boardId?: string
  cardOrderIds?: string[]
}

export interface List {
  id: string
  title: string
  boardId: string
  cardOrderIds: string[]
  createdAt: string
  updatedAt: string
  cards?: any[]
}

export const listApi = {
  // Tạo list mới
  async createList(data: CreateListDto) {
    const response = await $post<{ data: List }>('/lists', data)
    return response.data
  },

  // Lấy tất cả lists
  async getLists(boardId?: string) {
    const params = boardId ? { boardId } : {}
    const response = await $get<{ data: List[] }>('/lists', { params })
    return response.data
  },

  // Lấy list theo ID
  async getListById(id: string) {
    const response = await $get<{ data: List }>(`/lists/${id}`)
    return response.data
  },

  // Cập nhật list
  async updateList(id: string, data: UpdateListDto) {
    const response = await $put<{ message: string }>(`/lists/${id}`, data)
    return response.data
  },

  // Xóa list
  async deleteList(id: string) {
    const response = await $delete<{ message: string }>(`/lists/${id}`)
    return response.data
  }
}