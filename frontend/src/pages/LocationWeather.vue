<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// If your Vite alias "@" -> src is NOT set, change these to relative paths like:
// import PlaceSearch from '../components/PlaceSearch.vue'
import PlaceSearch from '@/components/PlaceSearch.vue'
import MapView from '@/components/MapView.vue'
import WeatherBadge from '@/components/WeatherBadge.vue'

const games = ref([
  { id: 1, title: 'Marina Bay Soccer',         lat: 1.2808, lng: 103.8608, startTimeISO: new Date(Date.now()+24*3600e3).toISOString(), icon: '⚽', color: '#10b981' },
  { id: 2, title: 'East Coast Basketball',     lat: 1.3014, lng: 103.9132, startTimeISO: new Date(Date.now()+48*3600e3).toISOString(), icon: '🏀', color: '#f97316' },
  { id: 3, title: 'Sentosa Beach Volleyball',  lat: 1.2494, lng: 103.8303, startTimeISO: new Date(Date.now()+72*3600e3).toISOString(), icon: '🏐', color: '#eab308' },
  { id: 4, title: 'Bishan Park Football',      lat: 1.3520, lng: 103.8480, startTimeISO: new Date(Date.now()+96*3600e3).toISOString(), icon: '⚽', color: '#10b981' },
  { id: 5, title: 'Kallang Tennis',            lat: 1.3010, lng: 103.8710, startTimeISO: new Date(Date.now()+120*3600e3).toISOString(), icon: '🎾', color: '#84cc16' },
  { id: 6, title: 'Pasir Ris Beach Frisbee',   lat: 1.3810, lng: 103.9480, startTimeISO: new Date(Date.now()+144*3600e3).toISOString(), icon: '🥏', color: '#06b6d4' },
  { id: 7, title: 'Jurong Lake Running',       lat: 1.3400, lng: 103.7270, startTimeISO: new Date(Date.now()+168*3600e3).toISOString(), icon: '🏃', color: '#8b5cf6' },
  { id: 8, title: 'Bedok Reservoir Kayaking',  lat: 1.3370, lng: 103.9290, startTimeISO: new Date(Date.now()+192*3600e3).toISOString(), icon: '🛶', color: '#3b82f6' },
])

const selectedGame = ref(games.value[0])
const center = ref({ lat: games.value[0].lat, lng: games.value[0].lng })
const userLocation = ref(null)
const searchedLocation = ref(null)

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function getDistanceText(game) {
  if (!userLocation.value) return ''
  const distance = calculateDistance(
    userLocation.value.lat,
    userLocation.value.lng,
    game.lat,
    game.lng
  )
  return `${distance.toFixed(1)} km away`
}

function onPlaceSelect(place) {
  center.value = { lat: place.lat, lng: place.lng }
  // Store searched location with current time as event time
  searchedLocation.value = {
    name: place.name || 'Searched Location',
    lat: place.lat,
    lng: place.lng,
    eventTimeISO: new Date().toISOString()
  }
}
function selectGame(game) {
  selectedGame.value = game
  // Update map center when game is selected
  center.value = { lat: game.lat, lng: game.lng }
}
function handleGameSelect(e) {
  selectGame(e.detail)
}

onMounted(() => {
  window.addEventListener('game:select', handleGameSelect)

  // Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      },
      (error) => {
        console.log('Location access denied or unavailable:', error)
      }
    )
  }
})
onUnmounted(() => {
  window.removeEventListener('game:select', handleGameSelect)
})
</script>

<template>
  <div style="min-height: 100vh; background: #0f172a;">
    <!-- Header -->
    <div style="background: #1e293b; border-bottom: 1px solid #334155; padding: 20px 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
      <div style="display: flex; align-items: center; gap: 16px; max-width: 2000px; margin: 0 auto;">
        <!-- Logo SVG with glow effect -->
        <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 12px rgba(23, 195, 212, 0.7));">
          <!-- Cloud -->
          <circle cx="70" cy="80" r="32" fill="#3B82F6"/>
          <circle cx="95" cy="75" r="27" fill="#3B82F6"/>
          <!-- Sun with glow -->
          <circle cx="130" cy="60" r="22" fill="#17C3D4"/>
          <line x1="130" y1="33" x2="130" y2="20" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
          <line x1="152" y1="48" x2="162" y2="38" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
          <line x1="160" y1="70" x2="172" y2="70" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
          <line x1="152" y1="92" x2="162" y2="102" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
          <!-- Location Pin -->
          <path d="M100 110 C100 110, 78 138, 78 155 C78 172, 88 182, 100 182 C112 182, 122 172, 122 155 C122 138, 100 110, 100 110 Z" fill="#10B981"/>
          <circle cx="100" cy="148" r="12" fill="white"/>
          <!-- Grid/Building -->
          <rect x="48" y="128" width="38" height="48" rx="4" fill="#3B82F6" stroke="#3B82F6" stroke-width="2"/>
          <line x1="67" y1="128" x2="67" y2="176" stroke="white" stroke-width="3"/>
          <line x1="48" y1="152" x2="86" y2="152" stroke="white" stroke-width="3"/>
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <div style="max-width: 2000px; margin: 0 auto; padding: 32px;">
      <PlaceSearch @select="onPlaceSelect" style="margin-bottom: 24px; max-width: 600px;" />

      <div style="display: grid; grid-template-columns: 380px 1fr; gap: 24px; align-items: start;">
        <!-- Left column: Game list (Sticky) -->
        <div style="position: sticky; top: 24px;">
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <h2 style="margin: 0 0 18px; font-size: 18px; font-weight: 600; color: #f1f5f9;">Upcoming Games</h2>
            <div style="display: flex; flex-direction: column; gap: 10px; max-height: calc(100vh - 220px); overflow-y: auto; padding-right: 6px;">
              <div
                v-for="game in games"
                :key="game.id"
                @click="selectGame(game)"
                :style="{
                  padding: '14px',
                  border: selectedGame?.id === game.id ? '2px solid #3b82f6' : '1px solid #334155',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedGame?.id === game.id ? '#1e3a5f' : '#0f172a',
                  color: '#fff',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }"
                @mouseenter="e => e.currentTarget.style.borderColor = '#3b82f6'"
                @mouseleave="e => e.currentTarget.style.borderColor = selectedGame?.id === game.id ? '#3b82f6' : '#334155'"
              >
                <!-- Sport Icon -->
                <div :style="{
                  fontSize: '32px',
                  lineHeight: '1',
                  flexShrink: 0,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }">
                  {{ game.icon }}
                </div>

                <!-- Game Info -->
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 600; margin-bottom: 5px; color: #f8fafc; font-size: 14px;">{{ game.title }}</div>
                  <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">
                    {{ new Date(game.startTimeISO).toLocaleString() }}
                  </div>
                  <div v-if="userLocation" style="font-size: 11px; color: #60a5fa; margin-top: 5px;">
                    📍 {{ getDistanceText(game) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Weather & Map -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Show searched location weather -->
          <div v-if="searchedLocation" style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div style="font-size: 32px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                📍
              </div>
              <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #f1f5f9;">{{ searchedLocation.name }}</h3>
            </div>
            <WeatherBadge :lat="searchedLocation.lat" :lon="searchedLocation.lng" :eventTimeISO="searchedLocation.eventTimeISO" :locationName="searchedLocation.name" />
          </div>

          <!-- Show selected game weather -->
          <div v-if="selectedGame" style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div style="font-size: 32px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                {{ selectedGame.icon }}
              </div>
              <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #f1f5f9;">{{ selectedGame.title }}</h3>
            </div>
            <WeatherBadge :lat="selectedGame.lat" :lon="selectedGame.lng" :eventTimeISO="selectedGame.startTimeISO" :locationName="selectedGame.title" />
          </div>

          <!-- Map -->
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); height: 650px;">
            <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #f1f5f9;">Map View</h2>
            <div style="height: calc(100% - 40px); border-radius: 6px; overflow: hidden; border: 1px solid #334155;">
              <MapView :games="games" :center="center" :searchedLocation="searchedLocation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- <style scoped>
.page {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
  color: #111827;
}

.h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; margin-bottom: 18px; }

.grid {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr); /* left fixed, right fills */
  gap: 20px;
}

/* Left column: games */
.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,.04);
}

.panel-title { font-weight: 700; font-size: 18px; margin-bottom: 10px; }

.game-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; max-height: 560px; overflow: auto; }

.game {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .08s ease, background .08s ease;
}
.game:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(0,0,0,.06); }
.game.active { background: #f3f4f6; border-color: #cbd5e1; }

.game-title { font-weight: 700; margin: 0 0 4px; }
.game-meta  { font-size: 12px; color: #475569; margin-bottom: 8px; }

.weather-chip {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
}

/* Right column: map */
.map-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 10px;
  height: 600px;
  display: flex;
  flex-direction: column;
}
.map-title { font-weight: 700; font-size: 18px; margin: 4px 10px 10px; }
.map-box { flex: 1; border-radius: 12px; overflow: hidden; }

/* Search */
.search {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;
  margin-bottom: 14px;
}
.search::placeholder { color: #6b7280; }

/* Mobile */
@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
  .map-panel { height: 420px; }
}
</style> -->

