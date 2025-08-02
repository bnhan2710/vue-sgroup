<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthLayout from '@/layouts/auth.vue'
import DefaultLayout from '@/layouts/default.vue'
import { Toaster } from '@/components/ui/sonner'

const route = useRoute()

const layout = computed(() => {
  if (route.meta.auth) {
    return AuthLayout
  } else {
    return DefaultLayout
  }
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
  <Toaster />
</template>

<style scoped></style>
