<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent class="w-[400px]">
      <SheetHeader>
        <SheetTitle>Create New List</SheetTitle>
        <SheetDescription>
          Add a new list to organize your cards in this board.
        </SheetDescription>
      </SheetHeader>
      
      <form @submit.prevent="handleSubmit" class="space-y-6 mt-6">
        <div class="space-y-2">
          <Label for="title">List Title *</Label>
          <Input
            id="title"
            v-model="form.title"
            placeholder="Enter list title"
            required
            :disabled="loading"
            ref="titleInput"
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
            :disabled="loading || !form.title.trim()"
            class="min-w-[100px]"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Create List
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
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
import { useListStore } from '@/stores/list'
import type { CreateListDto } from '@/apis/list.api'

interface Props {
  open: boolean
  boardId: string
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'created', list: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const listStore = useListStore()
const loading = ref(false)
const titleInput = ref<HTMLInputElement>()

const form = reactive<CreateListDto>({
  title: '',
  boardId: ''
})

// Update boardId when prop changes
watch(() => props.boardId, (newBoardId) => {
  form.boardId = newBoardId
}, { immediate: true })

// Reset form and focus when dialog opens
watch(() => props.open, async (newValue) => {
  if (newValue) {
    form.title = ''
    form.boardId = props.boardId
    await nextTick()
    titleInput.value?.focus()
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    
    const formData = {
      title: form.title.trim(),
      boardId: form.boardId
    }
    
    const newList = await listStore.createList(formData)
    emit('created', newList)
    emit('update:open', false)
  } catch (error) {
    console.error('Failed to create list:', error)
  } finally {
    loading.value = false
  }
}
</script>