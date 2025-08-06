import { $get, $post, $put, $delete } from './axios.client'

export interface CreateBoardDto {
  title: string
  description?: string
  workspaceId: string
  cover?: string
  type: string
}

export interface UpdateBoardDto {
  title?: string
  description?: string
  listOrderIds?: string[]
  type?: string
  cover?: string
}

export interface Board {
  id: string
  title: string
  description?: string
  cover?: string
  workspaceId: string
  type: string
  listOrderIds?: string[]
  createdAt: string
  updatedAt: string
  lists?: any[]
}

export interface BoardResponse {
  boards: Board[]
  totalBoards: number
}

export interface InviteMemberDto {
  email: string
  roleName: string
}

export const boardApi = {
  // Tạo board mới
  async createBoard(data: CreateBoardDto) {
    const response = await $post<{ data: { boardId: string } }>('/boards', data)
    return response.data
  },

  // Lấy boards của user
  async getMyBoards(params?: { page?: number; limit?: number; search?: string }) {
    const response = await $get<{ data: BoardResponse }>('/boards', { params })
    return response.data
  },

  // Lấy board theo ID
  async getBoardById(id: string) {
    const response = await $get<{ data: { board: Board } }>(`/boards/${id}`)
    return response.data
  },

  // Cập nhật board
  async updateBoard(id: string, data: UpdateBoardDto) {
    const response = await $put<{ message: string }>(`/boards/${id}`, data)
    return response.data
  },

  // Xóa board
  async deleteBoard(id: string) {
    const response = await $delete<{ message: string }>(`/boards/${id}`)
    return response.data
  },

  // Tìm kiếm boards
  async searchBoards(params: { page?: number; limit?: number; search: string }) {
    const response = await $get<{ data: BoardResponse }>('/boards/search', { params })
    return response.data
  },

  // Lấy public boards
  async getPublicBoards(params?: { page?: number; limit?: number }) {
    const response = await $get<{ data: BoardResponse }>('/boards/public', { params })
    return response.data
  },

  // Lấy closed boards
  async getClosedBoards(params?: { page?: number; limit?: number }) {
    const response = await $get<{ data: BoardResponse }>('/boards/closed', { params })
    return response.data
  },

  // Mời thành viên
  async inviteMember(boardId: string, data: InviteMemberDto) {
    const response = await $post<{ message: string }>(`/boards/${boardId}/add`, data)
    return response.data
  },

  // Xóa thành viên
  async removeMember(boardId: string, userId: string) {
    const response = await $delete<{ message: string }>(`/boards/${boardId}/member/${userId}`)
    return response.data
  },

  // Đóng board
  async closeBoard(boardId: string) {
    const response = await $put<{ message: string }>(`/boards/${boardId}/close`)
    return response.data
  },

  // Mở lại board
  async reopenBoard(boardId: string) {
    const response = await $put<{ message: string }>(`/boards/${boardId}/reopen`)
    return response.data
  }
}