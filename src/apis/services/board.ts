import { apiClient } from '../config'
import { ENDPOINTS } from '../config'
import type { 
  ApiResponse,
  PaginationParams,
  SearchParams,
  Board,
  BoardDetail,
  BoardResponse,
  CreateBoardDto,
  UpdateBoardDto,
  InviteMemberDto
} from '../types'

/**
 * Board service
 */
export const boardService = {
  /**
   * Create new board
   */
  async createBoard(data: CreateBoardDto): Promise<ApiResponse<Board>> {
    const response = await apiClient.post<ApiResponse<Board>>(
      ENDPOINTS.BOARDS.BASE,
      data
    )
    return response.data
  },

  /**
   * Get user's boards
   */
  async getMyBoards(params?: PaginationParams): Promise<ApiResponse<BoardResponse>> {
    const response = await apiClient.get<ApiResponse<BoardResponse>>(
      ENDPOINTS.BOARDS.BASE,
      { params }
    )
    return response.data
  },

  /**
   * Get board by ID
   */
  async getBoardById(id: string): Promise<ApiResponse<{ board: BoardDetail }>> {
    const response = await apiClient.get<ApiResponse<{ board: BoardDetail }>>(
      ENDPOINTS.BOARDS.BY_ID(id)
    )
    return response.data
  },

  /**
   * Update board
   */
  async updateBoard(id: string, data: UpdateBoardDto): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.BOARDS.BY_ID(id),
      data
    )
    return response.data
  },

  /**
   * Delete board
   */
  async deleteBoard(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      ENDPOINTS.BOARDS.BY_ID(id)
    )
    return response.data
  },

  /**
   * Search boards
   */
  async searchBoards(params: SearchParams): Promise<ApiResponse<BoardResponse>> {
    const response = await apiClient.get<ApiResponse<BoardResponse>>(
      ENDPOINTS.BOARDS.SEARCH,
      { params }
    )
    return response.data
  },

  /**
   * Get public boards
   */
  async getPublicBoards(params?: PaginationParams): Promise<ApiResponse<BoardResponse>> {
    const response = await apiClient.get<ApiResponse<BoardResponse>>(
      ENDPOINTS.BOARDS.PUBLIC,
      { params }
    )
    return response.data
  },

  /**
   * Get closed boards
   */
  async getClosedBoards(params?: PaginationParams): Promise<ApiResponse<BoardResponse>> {
    const response = await apiClient.get<ApiResponse<BoardResponse>>(
      ENDPOINTS.BOARDS.CLOSED,
      { params }
    )
    return response.data
  },

  /**
   * Invite member to board
   */
  async inviteMember(boardId: string, data: InviteMemberDto): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.BOARDS.INVITE(boardId),
      data
    )
    return response.data
  },

  /**
   * Remove member from board
   */
  async removeMember(boardId: string, userId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      ENDPOINTS.BOARDS.REMOVE_MEMBER(boardId, userId)
    )
    return response.data
  }
}