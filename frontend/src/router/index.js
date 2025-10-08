import { createRouter, createWebHistory } from 'vue-router'
import LocationWeather from '@/pages/LocationWeather.vue'
import PaymentPage from "@/pages/Pay.vue"; 

const routes = [
  { path: '/', redirect: '/location-weather' },
  { path: '/location-weather', name: 'LocationWeather', component: LocationWeather },
  { path: "/pay", component: PaymentPage },
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
