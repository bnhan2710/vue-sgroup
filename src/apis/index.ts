// Main API exports
export * from './config'
export * from './types'
export * from './utils'

// Client exports
export { apiClient, axiosClient, $get, $post, $put, $delete, $patch } from './client'

// Service instances
export { authService } from './services/auth'
export { boardService } from './services/board'
export { listService } from './services/list'
export { userService } from './services/user'

// Legacy exports (for backward compatibility)
export * from './axios.client'