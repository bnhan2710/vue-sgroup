/**
 * List related types
 */

export interface List {
  id: string
  title: string
  boardId: string
  cardOrderIds: string[]
  createdAt: string
  updatedAt: string
  cards?: any[]
}

export interface CreateListDto {
  title: string
  boardId: string
}

export interface UpdateListDto {
  title?: string
  boardId?: string
  cardOrderIds?: string[]
}