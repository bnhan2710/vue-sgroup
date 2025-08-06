import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listApi, type List, type CreateListDto, type UpdateListDto } from '@/apis/list.api'
import { toast } from 'vue-sonner'

export const useListStore = defineStore('list', () => {
  const lists = ref<List[]>([])
  const currentList = ref<List | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasLists = computed(() => lists.value.length > 0)
  const getListsByBoard = computed(() => (boardId: string) => 
    lists.value.filter(list => list.boardId === boardId)
  )

  // Actions
  async function fetchLists(boardId?: string) {
    try {
      loading.value = true
      error.value = null
      const response = await listApi.getLists(boardId)
      lists.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot fetch lists')
    } finally {
      loading.value = false
    }
  }

  async function fetchListById(id: string) {
    try {
      loading.value = true
      error.value = null
      const response = await listApi.getListById(id)
      currentList.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot fetch list')
      return null
    } finally {
      loading.value = false
    }
  }

  async function createList(data: CreateListDto) {
    try {
      loading.value = true
      error.value = null
      const response = await listApi.createList(data)
      
      // Add new list to the store
      lists.value.push(response.data)
      
      toast.success('Create list successfully!')
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot create list')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateList(id: string, data: UpdateListDto) {
    try {
      loading.value = true
      error.value = null
      await listApi.updateList(id, data)
      
      // Update list in store
      const index = lists.value.findIndex(list => list.id === id)
      if (index !== -1) {
        lists.value[index] = { ...lists.value[index], ...data }
      }
      
      // Update current list if it's the one being updated
      if (currentList.value?.id === id) {
        currentList.value = { ...currentList.value, ...data }
      }
      
      toast.success('Update list successfully!')
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot update list')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteList(id: string) {
    try {
      loading.value = true
      error.value = null
      await listApi.deleteList(id)
      
      // Remove list from store
      lists.value = lists.value.filter(list => list.id !== id)
      
      // Clear current list if it's the one being deleted
      if (currentList.value?.id === id) {
        currentList.value = null
      }
      
      toast.success('Delete list successfully!')
    } catch (err: any) {
      error.value = err.message || 'Something went wrong'
      toast.error('Cannot delete list')
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update list order within board
  function updateListOrder(boardId: string, fromIndex: number, toIndex: number) {
    const boardLists = lists.value.filter(list => list.boardId === boardId)
    const movedList = boardLists.splice(fromIndex, 1)[0]
    boardLists.splice(toIndex, 0, movedList)
    
    // Update the entire lists array
    const otherLists = lists.value.filter(list => list.boardId !== boardId)
    lists.value = [...otherLists, ...boardLists]
  }

  function clearError() {
    error.value = null
  }

  function setCurrentList(list: List | null) {
    currentList.value = list
  }

  function addList(list: List) {
    lists.value.push(list)
  }

  function removeList(id: string) {
    lists.value = lists.value.filter(list => list.id !== id)
  }

  return {
    // State
    lists,
    currentList,
    loading,
    error,
    
    // Computed
    hasLists,
    getListsByBoard,
    
    // Actions
    fetchLists,
    fetchListById,
    createList,
    updateList,
    deleteList,
    updateListOrder,
    clearError,
    setCurrentList,
    addList,
    removeList
  }
})