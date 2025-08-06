<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import router from '@/router'
import { $post } from '@/apis'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

const form = useForm<RegisterForm>({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const { isSubmitting, handleSubmit } = form

const onSubmitHandler = handleSubmit(async (values: RegisterForm) => {
  try {
    console.log('Registering user:', values)



    const username = values.email.split('@')[0]
    await $post('/auth/register', {
      username: username,
      email: values.email,
      password: values.password,
    })


    await router.push({ name: 'Login' })
  } catch (error: unknown) {
    console.error('Register failed:', error)
    toast.error('Registration failed. Please try again.')
  }
})

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
      <form @submit.prevent="onSubmitHandler" class="space-y-6">
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
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Confirm your password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-3">
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? 'Registering...' : 'Register' }}
          </Button>
          <Button variant="outline" class="w-full" type="button"> Login with Google </Button>
        </div>

        <div class="mt-4 text-center text-sm">
          Already have an account?
          <a href="/login" class="underline underline-offset-4"> Sign in </a>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
