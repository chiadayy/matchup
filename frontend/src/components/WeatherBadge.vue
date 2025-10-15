<template>
  <div style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 24px;
    border-radius: 20px;
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
    color: white;
    position: relative;
    overflow: hidden;
  ">
    <!-- Animated Background -->
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      animation: shimmer 3s ease-in-out infinite;
      pointer-events: none;
    "></div>

    <div v-if="loading" style="text-align: center; font-size: 14px; opacity: 0.9; position: relative; z-index: 1;">
      <div style="display: inline-block; animation: spin 1s linear infinite;">⏳</div>
      <span style="margin-left: 8px;">Loading weather...</span>
    </div>
    <div v-else-if="error" style="
      background: rgba(255, 255, 255, 0.2);
      padding: 12px;
      border-radius: 12px;
      text-align: center;
      font-size: 14px;
      position: relative;
      z-index: 1;
    ">
      ⚠️ {{ error }}
    </div>
    <div v-else-if="weather" style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
      <!-- Animated Weather Icon -->
      <AnimatedWeatherIcon :condition="weather.description" />

      <div style="flex: 1;">
        <div style="
          font-size: 48px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 10px;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
          background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">
          {{ weather.temp }}°C
        </div>
        <div style="
          font-size: 18px;
          opacity: 0.95;
          text-transform: capitalize;
          margin-bottom: 10px;
          font-weight: 600;
        ">
          {{ weather.description }}
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px;">
          <!-- Rain Badge -->
          <div :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            background: weather.rain >= 70 ? 'rgba(239, 68, 68, 0.3)' :
                       weather.rain >= 40 ? 'rgba(251, 191, 36, 0.3)' :
                       'rgba(16, 185, 129, 0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: '600',
          }">
            <span style="font-size: 16px;">💧</span>
            <span>Rain: {{ weather.rain }}%</span>
          </div>

          <!-- Additional Weather Details -->
          <div v-if="weather.humidity" style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            fontSize: 14px;
            background: rgba(255, 255, 255, 0.25);
            padding: 6px 14px;
            borderRadius: 20px;
            backdropFilter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            fontWeight: 600;
          ">
            <span>💨</span>
            <span>{{ weather.humidity }}% humidity</span>
          </div>
        </div>
        <div v-if="weather.message" style="
          margin-top: 12px;
          font-size: 14px;
          background: rgba(251, 191, 36, 0.25);
          padding: 12px 16px;
          border-radius: 12px;
          border-left: 4px solid #fbbf24;
          backdropFilter: blur(10px);
          fontWeight: 600;
        ">
          {{ weather.message }}
        </div>
      </div>
    </div>
    <div v-else style="text-align: center; opacity: 0.8; font-size: 14px; position: relative; z-index: 1;">
      🌤️ No weather data
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AnimatedWeatherIcon from './AnimatedWeatherIcon.vue'

const props = defineProps({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  eventTimeISO: { type: String, required: true },
  locationName: { type: String, default: '' }
})

const loading = ref(false)
const error = ref(null)
const weather = ref(null)

watch(() => [props.lat, props.lon, props.eventTimeISO], async () => {
  console.log('OWM fetch', props.lat, props.lon, new Date(props.eventTimeISO).toISOString())
  console.log('OWM key len', import.meta.env.VITE_OPENWEATHER_API_KEY?.length)

  loading.value = true
  error.value = null
  weather.value = null

  try {
    const url = new URL('https://api.openweathermap.org/data/2.5/forecast')
    url.searchParams.set('lat', String(props.lat))
    url.searchParams.set('lon', String(props.lon))
    url.searchParams.set('units', 'metric')
    url.searchParams.set('appid', import.meta.env.VITE_OPENWEATHER_API_KEY)

    const response = await fetch(url)

    if (!response.ok) {
      // Show URL without appid for debugging
      const debugUrl = new URL(url)
      debugUrl.searchParams.delete('appid')
      throw new Error(`Weather API ${response.status} - ${debugUrl.toString()}`)
    }

    const data = await response.json()

    // Find the forecast slot nearest to eventTimeISO
    const eventTime = new Date(props.eventTimeISO).getTime()
    let nearest = null
    let minDiff = Infinity

    for (const slot of data.list || []) {
      const slotTime = slot.dt * 1000
      const diff = Math.abs(slotTime - eventTime)
      if (diff < minDiff) {
        minDiff = diff
        nearest = slot
      }
    }

    if (!nearest) {
      throw new Error('No forecast data available')
    }

    const pop = Math.round((nearest.pop ?? 0) * 100)
    const temp = Math.round(nearest.main?.temp ?? 0)
    const humidity = Math.round(nearest.main?.humidity ?? 0)
    const icon = nearest.weather?.[0]?.icon
    const description = nearest.weather?.[0]?.description ?? ''

    let message = ''
    if (pop >= 70) {
      message = '⚠️ High chance of rain - bring an umbrella!'
    } else if (temp >= 32) {
      message = '🌡️ Very hot - stay hydrated!'
    } else if (temp <= 18) {
      message = '🧥 Cool weather - bring a jacket!'
    }

    weather.value = {
      temp,
      rain: pop,
      humidity,
      icon,
      description,
      message
    }

    console.log('Weather loaded:', weather.value)
  } catch (err) {
    console.error('Weather error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}, { immediate: true })
</script>

<style scoped>
@keyframes shimmer {
  0%, 100% {
    opacity: 0.5;
    transform: translateX(-50%);
  }
  50% {
    opacity: 1;
    transform: translateX(50%);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
