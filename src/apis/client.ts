import { apiClient } from './config'
import { setupInterceptors } from './interceptors'

// Setup interceptors
setupInterceptors(apiClient)

export { apiClient }

// Legacy exports for backward compatibility
export const axiosClient = apiClient

// Export HTTP methods as functions (legacy support)
export const $get = apiClient.get.bind(apiClient)
export const $post = apiClient.post.bind(apiClient)
export const $put = apiClient.put.bind(apiClient)
export const $delete = apiClient.delete.bind(apiClient)
export const $patch = apiClient.patch.bind(apiClient)