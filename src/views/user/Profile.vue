<template>
  <div class="p-6 max-w-3xl">
    <h1 class="text-2xl font-semibold mb-6">Profile</h1>

    <Card>
      <CardHeader>
        <CardTitle>Account information</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input v-model="form.displayName" placeholder="Your name" />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input v-model.number="form.age" type="number" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <select v-model="form.gender" class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option :value="undefined">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" @click="reset">Reset</Button>
            <Button type="submit" :disabled="userStore.loading">Save changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const auth = useAuthStore()

const form = reactive<{ displayName?: string; age?: number; gender?: 'male' | 'female' | 'other' }>(
  { displayName: undefined, age: undefined, gender: undefined },
)

const userId = computed(() => (auth.user as any)?.id || (auth.user as any)?.user?.id)

function fillFromProfile() {
  if (!userStore.profile) return
  form.displayName = userStore.profile.displayName ?? undefined
  form.age = userStore.profile.age ?? undefined
  form.gender = userStore.profile.gender ?? undefined
}

onMounted(async () => {
  if (!userStore.profile && userId.value) {
    await userStore.fetchById(userId.value)
  }
  fillFromProfile()
})

watch(() => userStore.profile, fillFromProfile)

async function onSubmit() {
  await userStore.update({ ...form })
}

function reset() {
  fillFromProfile()
}
</script>


