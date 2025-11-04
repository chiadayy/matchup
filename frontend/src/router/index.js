import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import Home from '@/pages/Home.vue'
import MatchChatRoom from '@/pages/MatchChatRoom.vue'
import LocationWeather from '@/pages/LocationWeather.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Pay from '@/pages/Pay.vue'
import MyMatches from '@/pages/MyMatches.vue'
import Browser from '@/pages/Browser.vue'
import Calendar from '@/pages/Calendar.vue'
import GameCreation from '@/pages/GameCreation.vue'
import Profile from '@/pages/Profile.vue'
import AdminDashboard from '@/pages/AdminDashboard.vue'
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
    path: '/pay/:matchid',
    name: 'Pay',
    component: Pay,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-game',
    name: 'GameCreation',
    component: GameCreation,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-matches',
    name: 'MyMatches',
    component: MyMatches,
    meta: { requiresAuth: true }
  },
  {
    path: '/matches/:id/chat',
    name: 'MatchChatRoom',
    component: MatchChatRoom,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:id?',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/browser',
    name: 'Browser',
    component: Browser,
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({ 
  history: createWebHistory(import.meta.env.BASE_URL),
  routes 
})

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

  // Only for admin
  if (to.meta.requiresAdmin) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        next('/login')
        return
      }

      // ✅ FIX: Get role from profiles table instead of user_metadata
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        next('/home')
        return
      }

      // Check if user is organiser
      if (profile?.role !== 'organiser') {
        console.warn('Access denied: User is not an admin')
        next('/home')
        return
      }

      // User is organiser, allow access
      next()
      return
      
    } catch (error) {
      console.error('Error in admin check:', error)
      next('/home')
      return
    }
  }

  next()
})

export default router