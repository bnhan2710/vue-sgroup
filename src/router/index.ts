import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useLocalStorage } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Login',
      path: '/login', component: () => import('@/views/auth/Login.vue'),
      meta: {
        auth: true
      }    
    },
    {
      path: '/register', component: () => import('@/views/auth/Register.vue'),
        meta: {
        auth: true
      }    
    },
    {
      name: 'Home',
      path: '/' , component: HomeView,
    }
  ],
})


router.beforeEach(async (to) => {
  const token = useLocalStorage('accessToken', null)
  const authStore = useAuthStore()

  if (
    // make sure the user is authenticated
    !authStore.isAuthenticated &&
 
    !to.meta.auth
  ) 
  {
    // redirect the user to the login page
    return { name: 'Login'}
  }

  else if (
    authStore.isAuthenticated &&
    to.meta.auth
  ) {
    // redirect the user to the home page
    return { name: 'Home' }
  }
})

export default router


