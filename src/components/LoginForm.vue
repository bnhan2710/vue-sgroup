<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const authStore = useAuthStore()

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
})

type LoginForm = z.infer<typeof loginSchema>

const form = useForm<LoginForm>({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: '',
    password: '',
  },
})

// Get form validation state
const { isSubmitting, handleSubmit } = form

const handleFormSubmit = handleSubmit(onSubmit)

async function onSubmit(values: LoginForm) {
  try {
    const response = await authStore.login({
      email: values.email,
      password: values.password,
    })

    // toast.success('Login successful!')
    router.push('/boards')
  } catch (error: any) {
    console.error('Login failed:', error)
    const errorMessage = error?.message || 'Login failed. Please try again.'
    toast.error(errorMessage)
  }
}



defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Card class="mx-auto w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription> Enter your email below to login to your account </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleFormSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="m@example.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <div class="flex items-center justify-between">
              <FormLabel class="sr-only">Password</FormLabel>
              <a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-3">
          <Button 
            type="submit" 
            class="w-full" 
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Logging in...' : 'Login' }}
          </Button>
          <Button variant="outline" class="w-full" type="button"> 
            Login with Google 
          </Button>
        </div>

        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="/register" class="underline underline-offset-4"> Sign up </a>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
