import { createRouter, createWebHistory } from 'vue-router'
import LocationWeather from '@/pages/LocationWeather.vue'
import PaymentPage from "@/pages/Pay.vue";
import Home from '@/pages/Home.vue'
import Browser from '@/pages/Browser.vue'
import Map from '@/pages/Map.vue'
import Calendar from '@/pages/Calendar.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import GameCreation from '@/pages/GameCreation.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
  // { path: '/', redirect: '/location-weather' },
  { path: '/location-weather', name: 'LocationWeather', component: LocationWeather },
  { path: "/pay", component: PaymentPage },
  { path: '/', name: 'Home', component: Home },
  { path: '/browser', name: 'Browser', component: Browser },
  { path: '/map', name: 'Map', component: Map },
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/game-creation', name: 'GameCreation', component: GameCreation },
  { path: '/profile', name: 'Profile', component: Profile }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
