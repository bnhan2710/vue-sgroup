<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AuthLayout from '@/layouts/auth.vue'
import DefaultLayout from '@/layouts/default.vue'

const route = useRoute();

const layout = computed(() => {
    if(route.meta.auth) {
        return AuthLayout;
    } else {
        return DefaultLayout;
    }      
})

</script>

<template>
    <component :is="layout">
        <RouterView />
    </component>
</template>

<style scoped>

</style>
