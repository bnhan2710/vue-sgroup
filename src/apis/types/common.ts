/**
 * Common API response structure
 */
export interface ApiResponse<T = any> {
  status: string
  message: string
  data: T
}

/**
 * Error response structure
 */
export interface ApiError {
  status: string
  message: string
  errors?: Record<string, string[]>
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Search parameters
 */
export interface SearchParams extends PaginationParams {
  search?: string
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
}