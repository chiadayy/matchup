import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import LocationWeather from '@/pages/LocationWeather.vue'

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/location-weather', name: 'LocationWeather', component: LocationWeather }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
