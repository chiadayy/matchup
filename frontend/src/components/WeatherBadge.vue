<template>
  <!-- Compact Inline Weather Tag -->
  <div
    v-if="compact"
    class="weather-compact"
    @mouseenter="showExpanded = true"
    @mouseleave="showExpanded = false"
  >
    <div v-if="loading" class="weather-compact-content">
      <span class="weather-loading">⏳</span>
      <span class="weather-compact-text">Loading...</span>
    </div>
    <div v-else-if="error" class="weather-compact-content weather-error">
      <span>⚠️ Weather unavailable</span>
    </div>
    <div v-else-if="weather" class="weather-compact-content">
      <span class="weather-icon-small">{{ getWeatherEmoji(weather.description) }}</span>
      <span class="weather-temp-compact">{{ weather.temp }}°C</span>
      <span class="weather-divider">|</span>
      <span class="weather-desc-compact">{{ weather.description }}</span>
      <span class="weather-divider">|</span>
      <span class="weather-humidity-compact">{{ weather.humidity }}% humidity</span>
      <span v-if="weather.rain > 30" class="weather-rain-indicator" :class="getRainClass(weather.rain)">
        💧 {{ weather.rain }}%
      </span>
    </div>
    <div v-else class="weather-compact-content">
      <span>🌤️ No data</span>
    </div>

    <!-- Expanded Weather Card (shown on hover) -->
    <Transition name="weather-expand">
      <div
        v-if="showExpanded && weather"
        class="weather-expanded-card"
        @mouseenter="showExpanded = true"
        @mouseleave="showExpanded = false"
      >
        <div class="weather-expanded-header">
          <AnimatedWeatherIcon :condition="weather.description" />
          <div class="weather-expanded-temp">{{ weather.temp }}°C</div>
        </div>
        <div class="weather-expanded-details">
          <div class="weather-detail-item">
            <span class="detail-icon">💧</span>
            <span class="detail-label">Rain</span>
            <span class="detail-value">{{ weather.rain }}%</span>
          </div>
          <div class="weather-detail-item">
            <span class="detail-icon">💨</span>
            <span class="detail-label">Humidity</span>
            <span class="detail-value">{{ weather.humidity }}%</span>
          </div>
        </div>
        <div v-if="weather.message" class="weather-expanded-message">
          {{ weather.message }}
        </div>
      </div>
    </Transition>
  </div>

  <!-- Full Weather Card (Original) -->
  <div v-else style="
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
  locationName: { type: String, default: '' },
  compact: { type: Boolean, default: false }
})

const showExpanded = ref(false)

// Helper: Get weather emoji based on description
const getWeatherEmoji = (description) => {
  const desc = description.toLowerCase()
  if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️'
  if (desc.includes('cloud')) return '☁️'
  if (desc.includes('clear')) return '☀️'
  if (desc.includes('snow')) return '❄️'
  if (desc.includes('thunder')) return '⛈️'
  if (desc.includes('mist') || desc.includes('fog')) return '🌫️'
  return '🌤️'
}

// Helper: Get rain severity class
const getRainClass = (rainPercent) => {
  if (rainPercent >= 70) return 'rain-high'
  if (rainPercent >= 40) return 'rain-medium'
  return 'rain-low'
}

const loading = ref(false)
const error = ref(null)
const weather = ref(null)

watch(() => [props.lat, props.lon, props.eventTimeISO], async () => {
  loading.value = true
  error.value = null
  weather.value = null

  try {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    const url = new URL('https://api.openweathermap.org/data/2.5/forecast')
    url.searchParams.set('lat', String(props.lat))
    url.searchParams.set('lon', String(props.lon))
    url.searchParams.set('units', 'metric')
    url.searchParams.set('appid', apiKey)

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
  } catch (err) {
    console.error('Weather error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}, { immediate: true })
</script>

<style scoped>
/* Compact Weather Tag Styles */
.weather-compact {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.weather-compact-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0369a1;
  border: 1px solid #bae6fd;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.weather-compact:hover .weather-compact-content {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.15);
  transform: translateY(-1px);
}

.weather-icon-small {
  font-size: 1rem;
  line-height: 1;
}

.weather-temp-compact {
  font-weight: 700;
  color: #0c4a6e;
}

.weather-divider {
  color: #7dd3fc;
  font-weight: 400;
}

.weather-desc-compact {
  text-transform: capitalize;
  color: #0369a1;
}

.weather-humidity-compact {
  color: #0284c7;
}

.weather-rain-indicator {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 4px;
}

.weather-rain-indicator.rain-high {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.weather-rain-indicator.rain-medium {
  background: rgba(251, 191, 36, 0.15);
  color: #d97706;
}

.weather-rain-indicator.rain-low {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.weather-loading {
  animation: spin 1s linear infinite;
}

.weather-error {
  background: rgba(254, 226, 226, 1);
  border-color: #fca5a5;
  color: #dc2626;
}

.weather-compact-text {
  font-size: 0.75rem;
}

/* Expanded Weather Card */
.weather-expanded-card {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1000;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  border: 1px solid #e5e7eb;
}

.weather-expanded-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.weather-expanded-temp {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
}

.weather-expanded-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.weather-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.detail-icon {
  font-size: 1.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.weather-expanded-message {
  padding: 12px 16px;
  background: rgba(251, 191, 36, 0.1);
  border-left: 4px solid #fbbf24;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #92400e;
}

/* Transition Animations */
.weather-expand-enter-active,
.weather-expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.weather-expand-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.weather-expand-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

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
