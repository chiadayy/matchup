import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import LocationWeather from '@/pages/LocationWeather.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import { supabase } from '@/lib/supabase'

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/location-weather',
    name: 'LocationWeather',
    component: LocationWeather,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({ history: createWebHistory(), routes })

// Navigation guard to check authentication
router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    // Check if user is authenticated with Supabase
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      next()
    } else {
      // Not authenticated, redirect to login with return URL
      next({
        path: '/login',
        query: { next: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
