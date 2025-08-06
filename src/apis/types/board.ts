import type { PaginatedResponse } from './common'

/**
 * Board related types
 */

export interface Board {
  id: string
  title: string
  description?: string
  type: 'public' | 'private'
  cover?: string
  isClosed: boolean
  listOrderIds: string[]
  createdAt: string
  updatedAt: string
  workspaceId: string
}

export interface CreateBoardDto {
  title: string
  description?: string
  type: 'public' | 'private'
  cover?: string
  workspaceId: string
}

export interface UpdateBoardDto {
  title?: string
  description?: string
  type?: 'public' | 'private'
  cover?: string
  listOrderIds?: string[]
}

export interface InviteMemberDto {
  email: string
  roleName?: string
}

export interface BoardDetail extends Board {
  lists?: any[]
  members?: any[]
}

export interface BoardResponse {
  boards: Board[]
  totalBoards: number
}