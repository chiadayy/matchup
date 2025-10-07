<template>
  <div style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    color: white;
  ">
    <div v-if="loading" style="text-align: center; font-size: 14px; opacity: 0.9;">
      ⏳ Loading weather...
    </div>
    <div v-else-if="error" style="
      background: rgba(255, 255, 255, 0.2);
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      font-size: 14px;
    ">
      ⚠️ {{ error }}
    </div>
    <div v-else-if="weather" style="display: flex; align-items: center; gap: 16px;">
      <img
        v-if="weather.icon"
        :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`"
        :alt="weather.description"
        style="
          width: 70px;
          height: 70px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        "
      />
      <div style="flex: 1;">
        <div style="
          font-size: 36px;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          {{ weather.temp }}°C
        </div>
        <div style="
          font-size: 16px;
          opacity: 0.95;
          text-transform: capitalize;
          margin-bottom: 6px;
        ">
          {{ weather.description }}
        </div>
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.25);
          padding: 4px 12px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        ">
          💧 Rain: {{ weather.rain }}%
        </div>
        <div v-if="weather.message" style="
          margin-top: 12px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.3);
          padding: 10px 14px;
          border-radius: 10px;
          border-left: 4px solid #fbbf24;
          backdrop-filter: blur(10px);
        ">
          {{ weather.message }}
        </div>
      </div>
    </div>
    <div v-else style="text-align: center; opacity: 0.8; font-size: 14px;">
      🌤️ No weather data
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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
    const icon = nearest.weather?.[0]?.icon
    const description = nearest.weather?.[0]?.description ?? ''

    let message = ''
    if (pop >= 70) {
      message = '⚠️ High chance of rain - bring an umbrella!'
    }

    weather.value = {
      temp,
      rain: pop,
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
