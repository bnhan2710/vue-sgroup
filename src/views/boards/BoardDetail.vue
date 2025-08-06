<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" size="sm" @click="$router.back()" class="hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Boards
            </Button>
            <div class="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ currentBoard?.title || 'Loading...' }}</h1>
              <p v-if="currentBoard?.description" class="text-sm text-gray-600">{{ currentBoard.description }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" @click="showInviteDialog = true">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              Invite
            </Button>
            <Button variant="outline" size="sm" @click="showBoardSettings = true">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="boardStore.loading || listStore.loading" class="flex justify-center items-center py-20">
      <div class="flex items-center space-x-2">
        <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">Loading board...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="boardStore.error" class="text-center py-20">
      <div class="text-red-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-lg font-medium">Error loading board</p>
        <p class="text-sm text-gray-600 mt-1">{{ boardStore.error }}</p>
      </div>
      <Button @click="loadBoardData" variant="outline">
        Try Again
      </Button>
    </div>

      <!-- Board Content -->
    <div v-else class="p-4 overflow-x-auto">
      <div class="flex space-x-4 min-w-max pb-4">
        <!-- Lists -->
        <ListColumn
          v-for="list in boardLists"
          :key="list.id"
          :list="list"
          @delete="handleDeleteList"
          @update="handleUpdateList"
        />
        
        <!-- Add List Column -->
        <div class="bg-gray-200/60 backdrop-blur-sm rounded-lg p-3 w-72 flex-shrink-0">
          <Button
            v-if="!showAddList"
            @click="showAddList = true"
            variant="ghost"
            class="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add another list
          </Button>
          
          <!-- Add List Form -->
          <div v-else class="space-y-2">
            <Input
              v-model="newListTitle"
              @keydown.enter="addList"
              @keydown.escape="cancelAddList"
              placeholder="Enter list title..."
              class="text-sm"
              ref="listInput"
            />
            <div class="flex items-center space-x-2">
              <Button @click="addList" size="sm" :disabled="!newListTitle.trim()">
                Add list
              </Button>
              <Button @click="cancelAddList" variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create List Dialog -->
    <CreateListDialog
      v-model:open="showCreateListDialog"
      :board-id="boardId"
      @created="handleListCreated"
    />

    <!-- Invite Member Dialog -->
    <InviteMemberDialog
      v-if="currentBoard"
      v-model:open="showInviteDialog"
      :board-id="currentBoard.id"
      @invited="handleMemberInvited"
    />

    <!-- Board Settings Dialog -->
    <EditBoardDialog
      v-if="currentBoard && showBoardSettings"
      v-model:open="showBoardSettings"
      :board="currentBoard"
      @updated="handleBoardUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ListColumn from '@/components/list/ListColumn.vue'
import CreateListDialog from '@/components/list/CreateListDialog.vue'
import EditBoardDialog from '@/components/board/EditBoardDialog.vue'
import InviteMemberDialog from '@/components/board/InviteMemberDialog.vue'
import { useBoardStore } from '@/stores/board'
import { useListStore } from '@/stores/list'
import type { List } from '@/apis/list.api'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const listStore = useListStore()

// Get board ID from route
const boardId = computed(() => route.params.id as string)

// UI State
const showCreateListDialog = ref(false)
const showInviteDialog = ref(false)
const showBoardSettings = ref(false)

// Add list state
const showAddList = ref(false)
const newListTitle = ref('')
const listInput = ref<HTMLInputElement>()

// Computed
const currentBoard = computed(() => boardStore.currentBoard)
const boardLists = computed(() => {
  return listStore.getListsByBoard(boardId.value)
})

// Load data on mount and route change
onMounted(() => {
  loadBoardData()
})

watch(boardId, () => {
  loadBoardData()
})

async function loadBoardData() {
  if (!boardId.value) return
  
  try {
    // Load board and lists in parallel
    await Promise.all([
      boardStore.fetchBoardById(boardId.value),
      listStore.fetchLists(boardId.value)
    ])
  } catch (error) {
    console.error('Failed to load board data:', error)
  }
}

async function addList() {
  if (!newListTitle.value.trim() || !boardId.value) return
  
  try {
    await listStore.createList({
      title: newListTitle.value.trim(),
      boardId: boardId.value
    })
    
    newListTitle.value = ''
    showAddList.value = false
  } catch (error) {
    console.error('Failed to create list:', error)
  }
}

function cancelAddList() {
  newListTitle.value = ''
  showAddList.value = false
}

function handleDeleteList(list: List) {
  // List is already deleted in the store via ListColumn component
  console.log('List deleted:', list.id)
}

function handleUpdateList(list: List) {
  // List is already updated in the store via ListColumn component
  console.log('List updated:', list.id)
}

function handleListCreated(list: List) {
  console.log('List created:', list.id)
  // List is automatically added to store
}

function handleMemberInvited() {
  console.log('Member invited successfully')
  // Optionally reload board data to get updated member list
}

async function handleBoardUpdated() {
  // Reload board data to get updated information
  await loadBoardData()
}

// Auto focus on list input when it becomes visible
watch(showAddList, async (show) => {
  if (show) {
    await nextTick()
    listInput.value?.focus()
  }
})
</script>