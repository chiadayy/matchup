import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import Home from '@/pages/Home.vue'
import LocationWeather from '@/pages/LocationWeather.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Pay from '@/pages/Pay.vue'
import { supabase } from '@/lib/supabase'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: { guestOnly: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/location-weather',
    name: 'LocationWeather',
    component: LocationWeather,
    meta: { requiresAuth: true }
  },
  {
    path: '/pay',
    name: 'Pay',
    component: Pay,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({ history: createWebHistory(), routes })

// Navigation guard to check authentication
router.beforeEach(async (to, _from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect authenticated users away from guest-only pages
  if (to.meta.guestOnly && session) {
    next('/home')
    return
  }

  // Redirect unauthenticated users away from protected pages
  if (to.meta.requiresAuth && !session) {
    next({
      path: '/login',
      query: { next: to.fullPath }
    })
    return
  }

  next()
})

export default router
