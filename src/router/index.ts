import { createRouter, createWebHistory } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import AboutView from '@/views/AboutView.vue'

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
      path: '/',
      redirect: { name: 'Boards' },
    },
    {
      name: 'About',
      path: '/about', component: AboutView,
    },
    {
      name: 'Profile',
      path: '/profile',
      component: () => import('@/views/user/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      name: 'Boards',
      path: '/boards',
      component: () => import('@/views/boards/BoardDashboard.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'BoardDetail',
      path: '/boards/:id',
      component: () => import('@/views/boards/BoardDetail.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ],
})


router.beforeEach(async (to) => {
  const token = useLocalStorage('accessToken', null)
  const authStore = useAuthStore()

  if (
    // make sure the user is authenticated
    !authStore.isAuthenticated &&
    to.meta.requiresAuth
  ) 
  {
    // redirect the user to the login page
    return { name: 'Login'}
  }

  else if (
    authStore.isAuthenticated &&
    to.meta.auth
  ) {
    // redirect the user to the boards page instead of home
    return { name: 'Boards' }
  }
})

export default router


