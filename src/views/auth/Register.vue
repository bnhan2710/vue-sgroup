<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import router from '@/router'
import { $post } from '@/apis'

const email = ref('')
const password = ref('')

function handleSubmit(event: Event) {
  event.preventDefault()
  register()
}

async function register() {
  try {
    // validate email and password
    if (!isEmailValid.value) {
      alert('Invalid email format')
      return
    }
    if (!isPasswordValid.value) {
      alert(
        'Password must be at least 8 characters long and contain at least one letter and one number',
      )
      return
    }

    const username = email.value.split('@')[0]

    const response = await $post('/auth/register', {
      username: username,
      email: email.value,
      password: password.value,
    })

    console.log('Register successful:', response.data)

    // Redirect to login page after successful registration
    await router.push({ name: 'Login' })
  } catch (error) {
    console.error('Register failed:', error)
    alert('Register failed. Please try again.')
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const isEmailValid = computed(() => emailRegex.test(email.value))
const isPasswordValid = computed(() => passwordRegex.test(password.value))

defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Card class="mx-auto w-full max-w-sm">
    <CardHeader>
      <CardTitle>Register to your account</CardTitle>
      <CardDescription> Enter your email below to Register to your account </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col gap-6">
          <div class="grid gap-3">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              @input="email = $event.target.value"
              required
            />
          </div>
          <div class="grid gap-3">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" @input="password = $event.target.value" required />
          </div>
          <div class="flex flex-col gap-3">
            <Button type="submit" class="w-full" @click="handleSubmit"> Register </Button>
            <Button variant="outline" class="w-full"> Login with Google </Button>
          </div>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="#" class="underline underline-offset-4"> Sign up </a>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
