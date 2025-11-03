<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// If your Vite alias "@" -> src is NOT set, change these to relative paths like:
// import PlaceSearch from '../components/PlaceSearch.vue'
import PlaceSearch from '@/components/PlaceSearch.vue'
import MapView from '@/components/MapView.vue'
import WeatherBadge from '@/components/WeatherBadge.vue'

const allGames = ref([
  { id: 1, title: 'Marina Bay Soccer', venue: 'Marina Bay Sands Field', lat: 1.2808, lng: 103.8608, startTimeISO: new Date(Date.now()+24*3600e3).toISOString(), icon: '⚽', color: '#10b981', sport: 'Soccer', skillLevel: 'Intermediate', capacity: 10, joined: 7, price: 15 },
  { id: 2, title: 'East Coast Basketball', venue: 'East Coast Park Court 3', lat: 1.3014, lng: 103.9132, startTimeISO: new Date(Date.now()+48*3600e3).toISOString(), icon: '🏀', color: '#f97316', sport: 'Basketball', skillLevel: 'Beginner', capacity: 8, joined: 3, price: 0 },
  { id: 3, title: 'Sentosa Beach Volleyball', venue: 'Palawan Beach', lat: 1.2494, lng: 103.8303, startTimeISO: new Date(Date.now()+72*3600e3).toISOString(), icon: '🏐', color: '#eab308', sport: 'Volleyball', skillLevel: 'Advanced', capacity: 6, joined: 6, price: 20 },
  { id: 4, title: 'Bishan Park Football', venue: 'Bishan-Ang Mo Kio Park', lat: 1.3520, lng: 103.8480, startTimeISO: new Date(Date.now()+96*3600e3).toISOString(), icon: '⚽', color: '#10b981', sport: 'Soccer', skillLevel: 'Beginner', capacity: 12, joined: 5, price: 0 },
  { id: 5, title: 'Kallang Tennis', venue: 'Kallang Tennis Centre', lat: 1.3010, lng: 103.8710, startTimeISO: new Date(Date.now()+120*3600e3).toISOString(), icon: '🎾', color: '#84cc16', sport: 'Tennis', skillLevel: 'Intermediate', capacity: 4, joined: 2, price: 25 },
  { id: 6, title: 'Pasir Ris Beach Frisbee', venue: 'Pasir Ris Beach Park', lat: 1.3810, lng: 103.9480, startTimeISO: new Date(Date.now()+144*3600e3).toISOString(), icon: '🥏', color: '#06b6d4', sport: 'Frisbee', skillLevel: 'Beginner', capacity: 10, joined: 8, price: 0 },
  { id: 7, title: 'Jurong Lake Running', venue: 'Jurong Lake Gardens', lat: 1.3400, lng: 103.7270, startTimeISO: new Date(Date.now()+168*3600e3).toISOString(), icon: '🏃', color: '#8b5cf6', sport: 'Running', skillLevel: 'All Levels', capacity: 20, joined: 15, price: 0 },
  { id: 8, title: 'Bedok Reservoir Kayaking', venue: 'Bedok Reservoir', lat: 1.3370, lng: 103.9290, startTimeISO: new Date(Date.now()+192*3600e3).toISOString(), icon: '🛶', color: '#3b82f6', sport: 'Kayaking', skillLevel: 'Advanced', capacity: 6, joined: 4, price: 30 },
  { id: 9, title: 'Orchard Road Basketball', venue: 'Orchard Community Court', lat: 1.3048, lng: 103.8318, startTimeISO: new Date(Date.now()+216*3600e3).toISOString(), icon: '🏀', color: '#f97316', sport: 'Basketball', skillLevel: 'Advanced', capacity: 10, joined: 9, price: 12 },
  { id: 10, title: 'Changi Beach Soccer', venue: 'Changi Beach Park', lat: 1.3907, lng: 103.9872, startTimeISO: new Date(Date.now()+240*3600e3).toISOString(), icon: '⚽', color: '#10b981', sport: 'Soccer', skillLevel: 'Intermediate', capacity: 14, joined: 11, price: 18 },
  { id: 11, title: 'Clementi Basketball', venue: 'Clementi Sports Hall', lat: 1.3154, lng: 103.7649, startTimeISO: new Date(Date.now()+264*3600e3).toISOString(), icon: '🏀', color: '#f97316', sport: 'Basketball', skillLevel: 'Intermediate', capacity: 10, joined: 6, price: 15 },
  { id: 12, title: 'Tampines Soccer', venue: 'Our Tampines Hub', lat: 1.3529, lng: 103.9446, startTimeISO: new Date(Date.now()+288*3600e3).toISOString(), icon: '⚽', color: '#10b981', sport: 'Soccer', skillLevel: 'Advanced', capacity: 16, joined: 14, price: 22 },
  { id: 13, title: 'Yishun Badminton', venue: 'Yishun Sports Hall', lat: 1.4304, lng: 103.8354, startTimeISO: new Date(Date.now()+312*3600e3).toISOString(), icon: '🏸', color: '#ec4899', sport: 'Badminton', skillLevel: 'Beginner', capacity: 8, joined: 4, price: 10 },
  { id: 14, title: 'Punggol Tennis', venue: 'Punggol Sports Complex', lat: 1.4043, lng: 103.9021, startTimeISO: new Date(Date.now()+336*3600e3).toISOString(), icon: '🎾', color: '#84cc16', sport: 'Tennis', skillLevel: 'Advanced', capacity: 4, joined: 3, price: 30 },
  { id: 15, title: 'Sentosa Cycling', venue: 'Sentosa Island Loop', lat: 1.2498, lng: 103.8303, startTimeISO: new Date(Date.now()+360*3600e3).toISOString(), icon: '🚴', color: '#06b6d4', sport: 'Cycling', skillLevel: 'Intermediate', capacity: 15, joined: 10, price: 0 },
  { id: 16, title: 'MacRitchie Running', venue: 'MacRitchie Reservoir', lat: 1.3416, lng: 103.8197, startTimeISO: new Date(Date.now()+384*3600e3).toISOString(), icon: '🏃', color: '#8b5cf6', sport: 'Running', skillLevel: 'Intermediate', capacity: 25, joined: 18, price: 0 },
  { id: 17, title: 'West Coast Volleyball', venue: 'West Coast Park Beach', lat: 1.2881, lng: 103.7535, startTimeISO: new Date(Date.now()+408*3600e3).toISOString(), icon: '🏐', color: '#eab308', sport: 'Volleyball', skillLevel: 'Beginner', capacity: 8, joined: 5, price: 12 },
  { id: 18, title: 'Hougang Badminton', venue: 'Hougang Sports Centre', lat: 1.3712, lng: 103.8863, startTimeISO: new Date(Date.now()+432*3600e3).toISOString(), icon: '🏸', color: '#ec4899', sport: 'Badminton', skillLevel: 'Intermediate', capacity: 8, joined: 7, price: 15 },
  { id: 19, title: 'Toa Payoh Soccer', venue: 'Toa Payoh Stadium', lat: 1.3264, lng: 103.8565, startTimeISO: new Date(Date.now()+456*3600e3).toISOString(), icon: '⚽', color: '#10b981', sport: 'Soccer', skillLevel: 'Beginner', capacity: 14, joined: 8, price: 10 },
  { id: 20, title: 'Woodlands Basketball', venue: 'Woodlands Sports Hall', lat: 1.4382, lng: 103.7891, startTimeISO: new Date(Date.now()+480*3600e3).toISOString(), icon: '🏀', color: '#f97316', sport: 'Basketball', skillLevel: 'Beginner', capacity: 10, joined: 4, price: 0 },
  { id: 21, title: 'Sengkang Swimming', venue: 'Sengkang Sports Centre', lat: 1.3917, lng: 103.8951, startTimeISO: new Date(Date.now()+504*3600e3).toISOString(), icon: '🏊', color: '#0ea5e9', sport: 'Swimming', skillLevel: 'All Levels', capacity: 12, joined: 9, price: 8 },
  { id: 22, title: 'Bedok Badminton', venue: 'Bedok Sports Complex', lat: 1.3236, lng: 103.9273, startTimeISO: new Date(Date.now()+528*3600e3).toISOString(), icon: '🏸', color: '#ec4899', sport: 'Badminton', skillLevel: 'Advanced', capacity: 6, joined: 6, price: 20 },
  { id: 23, title: 'Bukit Timah Hiking', venue: 'Bukit Timah Nature Reserve', lat: 1.3547, lng: 103.7762, startTimeISO: new Date(Date.now()+552*3600e3).toISOString(), icon: '🥾', color: '#16a34a', sport: 'Hiking', skillLevel: 'Beginner', capacity: 20, joined: 12, price: 0 },
  { id: 24, title: 'Jurong Swimming', venue: 'Jurong West Swimming Complex', lat: 1.3408, lng: 103.7050, startTimeISO: new Date(Date.now()+576*3600e3).toISOString(), icon: '🏊', color: '#0ea5e9', sport: 'Swimming', skillLevel: 'Intermediate', capacity: 15, joined: 11, price: 10 },
  { id: 25, title: 'Alexandra Tennis', venue: 'Queenstown Tennis Centre', lat: 1.2904, lng: 103.8032, startTimeISO: new Date(Date.now()+600*3600e3).toISOString(), icon: '🎾', color: '#84cc16', sport: 'Tennis', skillLevel: 'Beginner', capacity: 4, joined: 1, price: 18 },
])

// Filters
const selectedSport = ref('All')
const selectedSkillLevel = ref('All')
const maxDistance = ref(50) // km

// Computed filtered games for the list (uses all filters)
const games = computed(() => {
  let filtered = allGames.value

  // Filter by sport
  if (selectedSport.value !== 'All') {
    filtered = filtered.filter(g => g.sport === selectedSport.value)
  }

  // Filter by skill level
  if (selectedSkillLevel.value !== 'All') {
    filtered = filtered.filter(g => g.skillLevel === selectedSkillLevel.value)
  }

  // Filter by distance
  if (userLocation.value) {
    filtered = filtered.filter(g => {
      const distance = calculateDistance(
        userLocation.value.lat,
        userLocation.value.lng,
        g.lat,
        g.lng
      )
      return distance <= maxDistance.value
    })
  }

  return filtered
})

// Computed games for map (only sport filter)
const mapGames = computed(() => {
  let filtered = allGames.value

  // Only filter by sport for the map
  if (selectedSport.value !== 'All') {
    filtered = filtered.filter(g => g.sport === selectedSport.value)
  }

  return filtered
})

// Get unique sports for filter
const sports = computed(() => {
  const sportSet = new Set(allGames.value.map(g => g.sport))
  return ['All', ...Array.from(sportSet).sort()]
})

// Get unique skill levels for filter
const skillLevels = computed(() => {
  const skillSet = new Set(allGames.value.map(g => g.skillLevel))
  return ['All', ...Array.from(skillSet).sort()]
})

const selectedGame = ref(null)
const center = ref({ lat: 1.3521, lng: 103.8198 })
const userLocation = ref(null)
const searchedLocation = ref(null)
const shouldZoomMap = ref(false)
const mapZoomLevel = ref(null)

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

function onClearSearch() {
  // Remove the green pin by clearing searched location
  searchedLocation.value = null
  // Reset center to default Singapore center
  center.value = { lat: 1.3521, lng: 103.8198 }
}
function selectGame(game) {
  // If clicking the same game, unselect it
  if (selectedGame.value?.id === game.id) {
    selectedGame.value = null
    // Reset to default view
    center.value = { lat: 1.3521, lng: 103.8198 }
    // Zoom out
    mapZoomLevel.value = 12
    setTimeout(() => {
      mapZoomLevel.value = null
    }, 100)
  } else {
    selectedGame.value = game
    // Update map center when game is selected
    center.value = { lat: game.lat, lng: game.lng }
    // Trigger zoom when game is clicked
    shouldZoomMap.value = true
    // Reset zoom flag after a short delay
    setTimeout(() => {
      shouldZoomMap.value = false
    }, 100)
  }
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
<!-- Main Content -->
<div style="padding: 32px;">
  <PlaceSearch @select="onPlaceSelect" @clear="onClearSearch" style="margin-bottom: 24px; max-width: 600px;" />

  <!-- Filters -->
  <div style="
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 2px solid #334155;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  ">
    <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #f1f5f9; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">🎯</span> Filter Games
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
      <!-- Sport Filter -->
      <div>
        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #cbd5e1;">
          Sport Type
        </label>
        <select
          v-model="selectedSport"
          style="
            width: 100%;
            padding: 12px 16px;
            background: #0f172a;
            border: 2px solid #334155;
            border-radius: 10px;
            color: #f1f5f9;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          "
          @focus="e => e.target.style.borderColor = '#3b82f6'"
          @blur="e => e.target.style.borderColor = '#334155'"
        >
          <option v-for="sport in sports" :key="sport" :value="sport">
            {{ sport }}
          </option>
        </select>
      </div>

      <!-- Skill Level Filter -->
      <div>
        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #cbd5e1;">
          Skill Level
        </label>
        <select
          v-model="selectedSkillLevel"
          style="
            width: 100%;
            padding: 12px 16px;
            background: #0f172a;
            border: 2px solid #334155;
            border-radius: 10px;
            color: #f1f5f9;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          "
          @focus="e => e.target.style.borderColor = '#3b82f6'"
          @blur="e => e.target.style.borderColor = '#334155'"
        >
          <option v-for="level in skillLevels" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </div>

      <!-- Distance Filter -->
      <div>
        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #cbd5e1;">
          Max Distance: {{ maxDistance }}km
        </label>
        <input
          v-model.number="maxDistance"
          type="range"
          min="1"
          max="50"
          step="1"
          style="
            width: 100%;
            height: 8px;
            background: linear-gradient(to right, #3b82f6 0%, #3b82f6 var(--value), #334155 var(--value), #334155 100%);
            border-radius: 10px;
            outline: none;
            cursor: pointer;
            -webkit-appearance: none;
          "
          :style="{ '--value': (maxDistance / 50 * 100) + '%' }"
        />
      </div>
    </div>

    <!-- Results Count -->
    <div style="
      margin-top: 20px;
      padding: 12px 16px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      animation: fadeIn 0.3s ease;
    ">
      <span style="font-size: 20px;">🎮</span>
      <span style="color: #f1f5f9; font-weight: 600; font-size: 14px;">
        {{ games.length }} {{ games.length === 1 ? 'game' : 'games' }} in list
      </span>
      <span v-if="mapGames.length !== games.length" style="color: #94a3b8; font-weight: 400; font-size: 13px; margin-left: 4px;">
        ({{ mapGames.length }} on map)
      </span>
    </div>
  </div>

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
              padding: '16px',
              border: selectedGame?.id === game.id ? '2px solid #3b82f6' : '2px solid transparent',
              borderRadius: '12px',
              cursor: 'pointer',
              background: selectedGame?.id === game.id
                ? 'linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#fff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: selectedGame?.id === game.id
                ? '0 8px 24px rgba(59, 130, 246, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.2)',
              transform: selectedGame?.id === game.id ? 'translateY(-2px)' : 'translateY(0)',
            }"
            @mouseenter="e => {
              if (selectedGame?.id !== game.id) {
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.2)'
              }
            }"
            @mouseleave="e => {
              if (selectedGame?.id !== game.id) {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'
              }
            }"
          >
            <!-- Top Section: Icon + Info -->
            <div style="display: flex; gap: 12px; align-items: flex-start;">
              <!-- Sport Icon -->
              <div :style="{
                fontSize: '40px',
                lineHeight: '1',
                flexShrink: 0,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
                animation: selectedGame?.id === game.id ? 'bounce 1s ease' : 'none'
              }">
                {{ game.icon }}
              </div>

              <!-- Game Info -->
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; margin-bottom: 6px; color: #f8fafc; font-size: 15px; line-height: 1.3;">
                  {{ game.title }}
                </div>
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px;">
                  🕒 {{ new Date(game.startTimeISO).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) }}
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;">
                  <!-- Skill Level Badge -->
                  <span :style="{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: game.skillLevel === 'Beginner' ? 'rgba(34, 197, 94, 0.2)' :
                                game.skillLevel === 'Intermediate' ? 'rgba(59, 130, 246, 0.2)' :
                                game.skillLevel === 'Advanced' ? 'rgba(239, 68, 68, 0.2)' :
                                'rgba(168, 85, 247, 0.2)',
                    color: game.skillLevel === 'Beginner' ? '#4ade80' :
                            game.skillLevel === 'Intermediate' ? '#60a5fa' :
                            game.skillLevel === 'Advanced' ? '#f87171' :
                            '#c084fc',
                    border: '1px solid',
                    borderColor: game.skillLevel === 'Beginner' ? 'rgba(34, 197, 94, 0.3)' :
                                game.skillLevel === 'Intermediate' ? 'rgba(59, 130, 246, 0.3)' :
                                game.skillLevel === 'Advanced' ? 'rgba(239, 68, 68, 0.3)' :
                                'rgba(168, 85, 247, 0.3)',
                    fontWeight: '600'
                  }">
                    {{ game.skillLevel }}
                  </span>
                  <!-- Sport Type Badge -->
                  <span style="
                    fontSize: 11px;
                    padding: 3px 8px;
                    borderRadius: 12px;
                    background: rgba(99, 102, 241, 0.2);
                    color: #a5b4fc;
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    fontWeight: 600;
                  ">
                    {{ game.sport }}
                  </span>
                  <!-- Price Badge -->
                  <span :style="{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: game.price === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                    color: game.price === 0 ? '#10b981' : '#fbbf24',
                    border: '1px solid',
                    borderColor: game.price === 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 191, 36, 0.3)',
                    fontWeight: '700'
                  }">
                    {{ game.price === 0 ? 'FREE' : `$${game.price}` }}
                  </span>
                </div>
                <div v-if="userLocation" style="font-size: 11px; color: #60a5fa; display: flex; align-items: center; gap: 4px;">
                  <span>📍</span>
                  <span style="font-weight: 600;">{{ getDistanceText(game) }}</span>
                </div>
              </div>
            </div>

            <!-- Capacity Bar -->
            <div style="width: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 11px; color: #cbd5e1; font-weight: 600;">
                  {{ game.joined }}/{{ game.capacity }} joined
                </span>
                <span :style="{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: game.joined >= game.capacity ? '#f87171' :
                          game.joined / game.capacity >= 0.8 ? '#fbbf24' : '#4ade80'
                }">
                  {{ game.joined >= game.capacity ? 'FULL' :
                      game.capacity - game.joined === 1 ? '1 spot left' :
                      `${game.capacity - game.joined} spots left` }}
                </span>
              </div>
              <!-- Animated Progress Bar -->
              <div style="
                width: 100%;
                height: 8px;
                background: rgba(30, 41, 59, 0.8);
                borderRadius: 8px;
                overflow: hidden;
                border: 1px solid rgba(71, 85, 105, 0.5);
              ">
                <div :style="{
                  width: (game.joined / game.capacity * 100) + '%',
                  height: '100%',
                  background: game.joined >= game.capacity
                    ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                    : game.joined / game.capacity >= 0.8
                    ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: game.joined >= game.capacity
                    ? '0 0 12px rgba(239, 68, 68, 0.6)'
                    : game.joined / game.capacity >= 0.8
                    ? '0 0 12px rgba(245, 158, 11, 0.6)'
                    : '0 0 12px rgba(16, 185, 129, 0.6)',
                }"></div>
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
        <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #f1f5f9;">
          Map View
          <span v-if="selectedSport !== 'All'" style="font-size: 14px; color: #94a3b8; font-weight: 400; margin-left: 8px;">
            (Showing all {{ selectedSport }} games)
          </span>
        </h2>
        <div style="height: calc(100% - 40px); border-radius: 6px; overflow: hidden; border: 1px solid #334155;">
          <MapView :games="mapGames" :center="center" :searchedLocation="searchedLocation" :shouldZoom="shouldZoomMap" :zoomLevel="mapZoomLevel" />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Custom range slider styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.7);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.7);
}

/* Select dropdown styling */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23cbd5e1' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

select:hover {
  border-color: #60a5fa !important;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}
</style>

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

/* Mobile phones (768px) */
@media (max-width: 768px) {
  .dashboard { padding: 20px 15px; }

  .header-bar h1 { font-size: 1.5rem; }

  .filter-section { flex-direction: column; gap: 12px; }

  .games-list { gap: 12px; }

  .game { padding: 14px; }

  .game-title { font-size: 0.95rem; }

  .game-meta { font-size: 11px; }

  .map-panel { height: 350px; padding: 8px; }

  .map-title { font-size: 16px; }
}

/* Small phones (576px) */
@media (max-width: 576px) {
  .dashboard { padding: 15px 10px; }

  .header-bar { flex-direction: column; align-items: flex-start; gap: 12px; }

  .header-bar h1 { font-size: 1.3rem; }

  .filter-section input, .filter-section select { font-size: 0.85rem; }

  .game { padding: 12px; }

  .game-title { font-size: 0.9rem; }

  .weather-chip { padding: 5px 8px; font-size: 11px; }

  .map-panel { height: 300px; }
}

/* Extra small phones (375px) */
@media (max-width: 375px) {
  .header-bar h1 { font-size: 1.2rem; }

  .game-title { font-size: 0.85rem; }

  .map-panel { height: 280px; }
}
</style> -->

