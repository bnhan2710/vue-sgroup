<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent class="w-[400px]">
      <SheetHeader>
        <SheetTitle>Invite Member</SheetTitle>
        <SheetDescription>
          Invite team members to collaborate on this board.
        </SheetDescription>
      </SheetHeader>
      
      <form @submit.prevent="handleSubmit" class="space-y-6 mt-6">
        <div class="space-y-2">
          <Label for="email">Email Address *</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            required
            :disabled="loading"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="role">Role</Label>
          <select
            id="role"
            v-model="form.roleName"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
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
            :disabled="loading || !form.email.trim()"
            class="min-w-[100px]"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Send Invitation
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

interface Props {
  open: boolean
  boardId: string
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'invited'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const boardStore = useBoardStore()
const loading = ref(false)

const form = reactive({
  email: '',
  roleName: 'member'
})

// Reset form when dialog closes
watch(() => props.open, (newValue) => {
  if (!newValue) {
    form.email = ''
    form.roleName = 'member'
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    
    await boardStore.inviteMember(
      props.boardId,
      form.email.trim(),
      form.roleName
    )
    
    emit('invited')
    emit('update:open', false)
  } catch (error) {
    console.error('Failed to invite member:', error)
  } finally {
    loading.value = false
  }
}
</script>