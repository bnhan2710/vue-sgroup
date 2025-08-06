<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent class="w-[400px] sm:w-[540px]">
      <SheetHeader>
        <SheetTitle>Edit Board</SheetTitle>
        <SheetDescription>
          Update your board information and settings.
        </SheetDescription>
      </SheetHeader>
      
      <form @submit.prevent="handleSubmit" class="space-y-6 mt-6">
        <div class="space-y-2">
          <Label for="title">Board Title *</Label>
          <Input
            id="title"
            v-model="form.title"
            placeholder="Enter board title"
            required
            :disabled="loading"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Enter board description (optional)"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading"
          />
        </div>
        
        <div class="space-y-3">
          <Label>Board Visibility</Label>
          <div class="space-y-3">
            <!-- Private Option -->
            <div 
              class="relative flex cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50"
              :class="{
                'border-blue-200 bg-blue-50': form.type === 'private',
                'border-gray-200': form.type !== 'private'
              }"
              @click="form.type = 'private'"
            >
              <div class="flex h-5 items-center">
                <input
                  type="radio"
                  value="private"
                  v-model="form.type"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                  :disabled="loading"
                />
              </div>
              <div class="ml-3 flex-1">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <label class="block text-sm font-medium text-gray-900 cursor-pointer">Private</label>
                </div>
                <p class="text-sm text-gray-500 mt-1">Only board members can see and access this board</p>
              </div>
            </div>

            <!-- Public Option -->
            <div 
              class="relative flex cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50"
              :class="{
                'border-green-200 bg-green-50': form.type === 'public',
                'border-gray-200': form.type !== 'public'
              }"
              @click="form.type = 'public'"
            >
              <div class="flex h-5 items-center">
                <input
                  type="radio"
                  value="public"
                  v-model="form.type"
                  class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600"
                  :disabled="loading"
                />
              </div>
              <div class="ml-3 flex-1">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <label class="block text-sm font-medium text-gray-900 cursor-pointer">Public</label>
                </div>
                <p class="text-sm text-gray-500 mt-1">Anyone can see this board, but only members can edit</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <Label for="cover">Cover Image URL</Label>
          <Input
            id="cover"
            v-model="form.cover"
            placeholder="Enter cover image URL (optional)"
            type="url"
            :disabled="loading"
          />
        </div>
        
        <div class="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            @click="$emit('update:open', false)"
            :disabled="loading"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            :disabled="loading || !form.title?.trim()"
            class="min-w-[100px]"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Update Board
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useBoardStore } from '@/stores/board'
import type { Board, UpdateBoardDto } from '@/apis/board.api'

interface Props {
  open: boolean
  board: Board
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'updated'): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const boardStore = useBoardStore()
const loading = ref(false)

const form = reactive<UpdateBoardDto>({
  title: '',
  description: '',
  type: 'private'
})

// Initialize form when board prop changes
watch(() => props.board, (newBoard) => {
  if (newBoard) {
    form.title = newBoard.title || ''
    form.description = newBoard.description || ''
    form.type = newBoard.type || 'private'
  }
}, { immediate: true })

// Reset form when dialog closes
watch(() => props.open, (newValue) => {
  if (!newValue) {
    // Reset form
    form.title = ''
    form.description = ''
    form.type = 'private'
  } else if (props.board) {
    // Re-initialize form with current board data
    form.title = props.board.title || ''
    form.description = props.board.description || ''
    form.type = props.board.type || 'private'
  }
})

async function handleSubmit() {
  if (!props.board?.id) return
  
  try {
    loading.value = true
    
    const updateData: UpdateBoardDto = {
      title: form.title?.trim(),
      description: form.description?.trim() || undefined,
      type: form.type
    }
    
    await boardStore.updateBoard(props.board.id, updateData)
    emit('updated')
    emit('update:open', false)
  } catch (error) {
    console.error('Failed to update board:', error)
  } finally {
    loading.value = false
  }
}
</script>