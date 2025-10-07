import { createRouter, createWebHistory } from 'vue-router'
import LocationWeather from '@/pages/LocationWeather.vue'

const routes = [
  { path: '/', redirect: '/location-weather' },
  { path: '/location-weather', name: 'LocationWeather', component: LocationWeather }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
