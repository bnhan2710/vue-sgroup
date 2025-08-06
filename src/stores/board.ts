import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { boardService, type Board, type CreateBoardDto, type UpdateBoardDto, type InviteMemberDto, type BoardResponse } from '@/apis'
import { toast } from 'vue-sonner'

export const useBoardStore = defineStore('board', () => {
  const boards = ref<Board[]>([])
  const currentBoard = ref<Board | null>(null)
  const totalBoards = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasBoards = computed(() => boards.value.length > 0)

  // Actions
  async function fetchBoards(params?: { page?: number; limit?: number; search?: string }) {
    try {
      loading.value = true
      error.value = null
      const response = await boardService.getMyBoards(params)
      boards.value = response.data.boards
      totalBoards.value = response.data.totalBoards
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot fetch boards')
    } finally {
      loading.value = false
    }
  }

  async function fetchBoardById(id: string) {
    try {
      loading.value = true
      error.value = null
      const response = await boardService.getBoardById(id)
      currentBoard.value = response.data.board
      return response.data.board
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot fetch board')
      return null
    } finally {
      loading.value = false
    }
  }

  async function createBoard(data: CreateBoardDto) {
    try {
      loading.value = true
      error.value = null
      const response = await boardService.createBoard(data)
      toast.success('Create board successfully!')
      
      // Refresh boards list
      await fetchBoards()
      
      return response.data.id
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot create board')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBoard(id: string, data: UpdateBoardDto) {
    try {
      loading.value = true
      error.value = null
      await boardService.updateBoard(id, data)
      toast.success('Update board successfully!')

      if (currentBoard.value?.id === id) {
        await fetchBoardById(id)
      }
      
      const index = boards.value.findIndex(board => board.id === id)
      if (index !== -1) {
        boards.value[index] = { ...boards.value[index], ...data }
      }
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot update board')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBoard(id: string) {
    try {
      loading.value = true
      error.value = null
      await boardService.deleteBoard(id)
      toast.success('Xóa Board thành công')
      
      boards.value = boards.value.filter(board => board.id !== id)
      totalBoards.value -= 1
      
      if (currentBoard.value?.id === id) {
        currentBoard.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Có lỗi xảy ra khi xóa board'
      toast.error('Không thể xóa board')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchBoards(search: string, params?: { page?: number; limit?: number }) {
    try {
      loading.value = true
      error.value = null
      const response = await boardService.searchBoards({ search, ...params })
      boards.value = response.data.boards
      totalBoards.value = response.data.totalBoards
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Error when searching boards')
    } finally {
      loading.value = false
    }
  }

  async function getPublicBoards(params?: { page?: number; limit?: number }) {
    try {
      loading.value = true
      error.value = null
      const response = await boardService.getPublicBoards(params)
      boards.value = response.data.boards
      totalBoards.value = response.data.totalBoards
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot fetch public boards')
    } finally {
      loading.value = false
    }
  }

  async function getClosedBoards(params?: { page?: number; limit?: number }) {
    try {
      loading.value = true
      error.value = null
      const response = await boardService.getClosedBoards(params)
      boards.value = response.data.boards
      totalBoards.value = response.data.totalBoards
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot fetch closed boards')
    } finally {
      loading.value = false
    }
  }

  async function inviteMember(boardId: string, email: string, roleName: string) {
    try {
      await boardService.inviteMember(boardId, { email, roleName })
      toast.success('Invite member successfully!')
    } catch (err: any) {
      toast.error('Cannot invite member')
      throw err
    }
  }

  async function removeMember(boardId: string, userId: string) {
    try {
      await boardService.removeMember(boardId, userId)
      toast.success('Delete member successfully!')
    } catch (err: any) {
      toast.error('Cannot delete member')
      throw err
    }
  }

  function clearError() {
    error.value = null
  }

  function setCurrentBoard(board: Board | null) {
    currentBoard.value = board
  }

  return {
    // State
    boards,
    currentBoard,
    totalBoards,
    loading,
    error,
    
    // Computed
    hasBoards,
    
    // Actions
    fetchBoards,
    fetchBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    searchBoards,
    getPublicBoards,
    getClosedBoards,
    inviteMember,
    removeMember,
    clearError,
    setCurrentBoard
  }
})