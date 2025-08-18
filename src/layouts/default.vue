<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <main class="min-h-screen bg-gray-50">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
  
</template>

<script setup lang="ts">
import AppSidebar from '@/components/layout/default/AppSidebar.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
</script>