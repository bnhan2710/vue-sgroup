<template>
  <div class="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0">
    <!-- List Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex-1">
        <h3 
          v-if="!isEditing"
          @click="startEditing"
          class="font-semibold text-sm text-gray-800 cursor-pointer hover:bg-gray-200 p-1 rounded"
        >
          {{ list.title }}
        </h3>
        <Input
          v-else
          v-model="editTitle"
          @blur="finishEditing"
          @keydown.enter="finishEditing"
          @keydown.escape="cancelEditing"
          class="h-7 text-sm font-semibold"
          ref="titleInput"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="h-7 w-7 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="startEditing">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Title
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleDelete" class="text-red-600 focus:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Cards Container -->
    <div class="space-y-2 min-h-[100px] max-h-[calc(100vh-200px)] overflow-y-auto">
      <!-- Card placeholders - will be replaced with actual card components -->
      <div
        v-for="card in (list.cards || [])"
        :key="card.id"
        class="bg-white p-3 rounded shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      >
        <p class="text-sm">{{ card.title || 'Card Title' }}</p>
        <div v-if="card.description" class="text-xs text-gray-600 mt-1">
          {{ card.description }}
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-if="!list.cards?.length" class="text-center py-4 text-gray-500 text-sm">
        No cards yet
      </div>
    </div>

    <!-- Add Card Button -->
    <div class="mt-3">
      <Button
        v-if="!showAddCard"
        @click="showAddCard = true"
        variant="ghost"
        class="w-full justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add a card
      </Button>
      
      <!-- Add Card Form -->
      <div v-else class="space-y-2">
        <textarea
          v-model="newCardTitle"
          @keydown.enter.exact.prevent="addCard"
          @keydown.escape="cancelAddCard"
          placeholder="Enter a title for this card..."
          class="w-full p-2 text-sm border rounded resize-none"
          rows="2"
          ref="cardInput"
        />
        <div class="flex items-center space-x-2">
          <Button @click="addCard" size="sm" :disabled="!newCardTitle.trim()">
            Add card
          </Button>
          <Button @click="cancelAddCard" variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useListStore } from '@/stores/list'
import type { List } from '@/apis/list.api'

interface Props {
  list: List
}

interface Emits {
  (e: 'delete', list: List): void
  (e: 'update', list: List): void
}

const emit = defineEmits<Emits>()

const listStore = useListStore()

// Editing state
const isEditing = ref(false)
const editTitle = ref('')
const titleInput = ref<HTMLInputElement>()

// Add card state
const showAddCard = ref(false)
const newCardTitle = ref('')
const cardInput = ref<HTMLTextAreaElement>()

async function startEditing() {
  editTitle.value = props.list.title
  isEditing.value = true
  await nextTick()
  titleInput.value?.focus()
}

async function finishEditing() {
  if (editTitle.value.trim() && editTitle.value !== props.list.title) {
    try {
      await listStore.updateList(props.list.id, { title: editTitle.value.trim() })
      emit('update', { ...props.list, title: editTitle.value.trim() })
    } catch (error) {
      console.error('Failed to update list:', error)
    }
  }
  isEditing.value = false
}

function cancelEditing() {
  editTitle.value = props.list.title
  isEditing.value = false
}

async function handleDelete() {
  if (confirm('Are you sure you want to delete this list? All cards in this list will also be deleted.')) {
    try {
      await listStore.deleteList(props.list.id)
      emit('delete', props.list)
    } catch (error) {
      console.error('Failed to delete list:', error)
    }
  }
}

async function addCard() {
  if (!newCardTitle.value.trim()) return
  
  // TODO: Implement card creation when card API is available
  console.log('Creating card:', newCardTitle.value.trim(), 'in list:', props.list.id)
  
  // For now, just clear the form
  newCardTitle.value = ''
  showAddCard.value = false
}

function cancelAddCard() {
  newCardTitle.value = ''
  showAddCard.value = false
}

// Auto focus on card input when it becomes visible
watch(showAddCard, async (show) => {
  if (show) {
    await nextTick()
    cardInput.value?.focus()
  }
})

const props = defineProps<Props>()
</script>