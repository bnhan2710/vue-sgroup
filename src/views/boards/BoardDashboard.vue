<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ headerTitle }}</h1>
            <p class="text-gray-600 mt-1">{{ headerDescription }}</p>
          </div>
          <Button 
            v-if="activeFilter !== 'closed'"
            @click="showCreateDialog = true" 
            class="inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Board
          </Button>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex-1">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Search boards..."
              class="pl-10"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <Button
            variant="outline"
            :class="{ 'bg-blue-50 border-blue-300 text-blue-700': activeFilter === 'my' }"
            @click="setFilter('my')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Boards
          </Button>
          <Button
            variant="outline"
            :class="{ 'bg-green-50 border-green-300 text-green-700': activeFilter === 'public' }"
            @click="setFilter('public')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Public Boards
          </Button>
          <Button
            variant="outline"
            :class="{ 'bg-gray-50 border-gray-300 text-gray-700': activeFilter === 'closed' }"
            @click="setFilter('closed')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Closed Boards
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="boardStore.loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Loading boards...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="boardStore.error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-medium">Error loading boards</p>
          <p class="text-sm text-gray-600 mt-1">{{ boardStore.error }}</p>
        </div>
        <Button @click="loadBoards" variant="outline">
          Try Again
        </Button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!boardStore.hasBoards" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-1">{{ emptyStateTitle }}</h3>
          <p class="text-gray-600">{{ emptyStateDescription }}</p>
        </div>
        <Button 
          v-if="activeFilter !== 'closed'"
          @click="showCreateDialog = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Board
        </Button>
      </div>

      <!-- Boards Grid -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="board in boardStore.boards"
          :key="board.id"
          @click="goToBoard(board)"
        >
          <BoardCard
            :board="board"
            @edit="handleEditBoard"
            @delete="handleDeleteBoard"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="boardStore.hasBoards && boardStore.totalBoards > 12" class="flex justify-center mt-8">
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </Button>
          <span class="text-sm text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    <!-- Create Board Dialog -->
    <CreateBoardDialog
      v-model:open="showCreateDialog"
      @created="handleBoardCreated"
    />

    <!-- Edit Board Dialog -->
    <EditBoardDialog
      v-if="editingBoard"
      v-model:open="showEditDialog"
      :board="editingBoard"
      @updated="handleBoardUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BoardCard from '@/components/board/BoardCard.vue'
import CreateBoardDialog from '@/components/board/CreateBoardDialog.vue'
import EditBoardDialog from '@/components/board/EditBoardDialog.vue'
import { useBoardStore } from '@/stores/board'
import type { Board } from '@/apis/board.api'

const router = useRouter()
const boardStore = useBoardStore()

// UI State
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingBoard = ref<Board | null>(null)

// Search and Filter
const searchQuery = ref('')
const activeFilter = ref<'my' | 'public' | 'closed'>('my')
const searchTimeout = ref<number>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

const totalPages = computed(() => {
  return Math.ceil(boardStore.totalBoards / itemsPerPage)
})

// Header content based on active filter
const headerTitle = computed(() => {
  switch (activeFilter.value) {
    case 'public':
      return 'Public Boards'
    case 'closed':
      return 'Closed Boards'
    case 'my':
    default:
      return 'My Boards'
  }
})

const headerDescription = computed(() => {
  switch (activeFilter.value) {
    case 'public':
      return 'Browse and access public boards from the community'
    case 'closed':
      return 'View boards that you have closed'
    case 'my':
    default:
      return 'Manage and organize your project boards'
  }
})

// Empty state content based on active filter
const emptyStateTitle = computed(() => {
  switch (activeFilter.value) {
    case 'public':
      return 'No public boards found'
    case 'closed':
      return 'No closed boards'
    case 'my':
    default:
      return 'No boards found'
  }
})

const emptyStateDescription = computed(() => {
  switch (activeFilter.value) {
    case 'public':
      return 'There are no public boards available at the moment.'
    case 'closed':
      return 'You haven\'t closed any boards yet.'
    case 'my':
    default:
      return 'Create your first board to get started organizing your tasks.'
  }
})

// Load boards on mount
onMounted(() => {
  loadBoards()
})

async function loadBoards() {
  const params = {
    page: currentPage.value,
    limit: itemsPerPage,
    ...(searchQuery.value && { search: searchQuery.value })
  }

  try {
    if (searchQuery.value) {
      // If searching, use search API regardless of filter
      await boardStore.searchBoards(searchQuery.value, params)
    } else {
      // Otherwise, use filter-specific APIs
      switch (activeFilter.value) {
        case 'public':
          await boardStore.getPublicBoards(params)
          break
        case 'closed':
          await boardStore.getClosedBoards(params)
          break
        case 'my':
        default:
          await boardStore.fetchBoards(params)
          break
      }
    }
  } catch (error) {
    console.error('Failed to load boards:', error)
  }
}

function handleSearch() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1
    loadBoards()
  }, 300)
}

function setFilter(filter: 'my' | 'public' | 'closed') {
  activeFilter.value = filter
  currentPage.value = 1
  searchQuery.value = ''
  loadBoards()
}

function goToPage(page: number) {
  currentPage.value = page
  loadBoards()
}

function goToBoard(board: Board) {
  router.push(`/boards/${board.id}`)
}

function handleEditBoard(board: Board) {
  editingBoard.value = board
  showEditDialog.value = true
}

async function handleDeleteBoard(board: Board) {
  try {
    await boardStore.deleteBoard(board.id)
    // Reload boards to update the list
    await loadBoards()
  } catch (error) {
    console.error('Failed to delete board:', error)
  }
}

function handleBoardCreated() {
  // Reload boards to show the new board
  loadBoards()
}

function handleBoardUpdated() {
  editingBoard.value = null
  // Reload boards to show updated data
  loadBoards()
}

// Watch for filter changes
watch(activeFilter, () => {
  currentPage.value = 1
  loadBoards()
})
</script>