import { apiClient } from '../config'
import { ENDPOINTS } from '../config'
import type { 
  ApiResponse,
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ChangePasswordData,
  User
} from '../types'

/**
 * Authentication service
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.LOGIN, 
      credentials
    )
    return response.data
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(
      ENDPOINTS.AUTH.REGISTER, 
      data
    )
    return response.data
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      ENDPOINTS.AUTH.LOGOUT
    )
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await apiClient.get<ApiResponse<{ accessToken: string }>>(
      ENDPOINTS.AUTH.REFRESH
    )
    return response.data
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      ENDPOINTS.AUTH.CHANGE_PASSWORD, 
      data
    )
    return response.data
  }
}