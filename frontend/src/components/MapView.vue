<template>
  <div ref="mapEl" style="width: 100%; height: 100%;"></div>
</template>

<style>
/* User Location Marker with Pulsing Effect */
.user-location-marker {
  position: relative;
  width: 30px;
  height: 30px;
}

.pulse-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #ef4444;
  border: 3px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
  z-index: 2;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid #ef4444;
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}
</style>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  games: { type: Array, default: () => [] },
  center: { type: Object, default: null },
  zoom: { type: Number, default: 12 },
  searchedLocation: { type: Object, default: null },
  shouldZoom: { type: Boolean, default: false },
  zoomLevel: { type: Number, default: null }
})

const mapEl = ref(null)
let map = null
let markers = []
let searchMarker = null
let infoWindow = null
let userLocationMarker = null

onMounted(async () => {
  const { Map, InfoWindow } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

  const initialCenter = props.center || { lat: 1.3521, lng: 103.8198 }

  map = new Map(mapEl.value, {
    center: initialCenter,
    zoom: props.zoom,
    mapId: 'DEMO_MAP_ID'
  })

  // Create InfoWindow instance
  infoWindow = new InfoWindow()

  // Get and show user's current location
  getUserLocation()

  updateMarkers(AdvancedMarkerElement)
})

// Get user's current location and add red marker
async function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        const { PinElement, AdvancedMarkerElement } = await google.maps.importLibrary('marker')

        // Create a pulsing red marker for user location
        const userPin = document.createElement('div')
        userPin.className = 'user-location-marker'
        userPin.innerHTML = `
          <div class="pulse-ring"></div>
          <div class="pulse-dot"></div>
        `

        userLocationMarker = new AdvancedMarkerElement({
          map,
          position: userPosition,
          title: 'Your Location',
          content: userPin
        })

        // Optionally pan to user location
        // map.panTo(userPosition)
      },
      (error) => {
        console.log('Could not get user location:', error)
      }
    )
  }
}

watch(() => props.games, () => {
  if (map) {
    google.maps.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
      updateMarkers(AdvancedMarkerElement)
    })
  }
}, { deep: true })

watch(() => props.center, (newCenter) => {
  if (map && newCenter) {
    map.setCenter(newCenter)
  }
})

watch(() => props.shouldZoom, (shouldZoom) => {
  if (map && shouldZoom) {
    map.setZoom(15)
  }
})

watch(() => props.zoomLevel, (newZoom) => {
  if (map && newZoom !== null) {
    map.setZoom(newZoom)
  }
})

watch(() => props.searchedLocation, async (newLocation) => {
  if (map && newLocation) {
    // Remove existing search marker
    if (searchMarker) {
      searchMarker.map = null
    }

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker')

    // Create a custom pin for the searched location
    const pinBackground = new PinElement({
      background: '#10b981',
      borderColor: '#059669',
      glyphColor: '#fff',
      scale: 1.3
    })

    searchMarker = new AdvancedMarkerElement({
      map,
      position: { lat: newLocation.lat, lng: newLocation.lng },
      title: newLocation.name,
      content: pinBackground.element
    })

    // Zoom in when search location is set
    map.setZoom(15)
  }
}, { deep: true })

async function updateMarkers(AdvancedMarkerElement) {
  // Clear existing markers
  markers.forEach(m => m.map = null)
  markers = []

  if (!props.games.length) return

  const bounds = new google.maps.LatLngBounds()
  const { PinElement } = await google.maps.importLibrary('marker')

  props.games.forEach(game => {
    const position = { lat: game.lat, lng: game.lng }

    // Create custom colored pin based on sport
    const pinElement = new PinElement({
      background: game.color || '#3b82f6',
      borderColor: game.color ? adjustColor(game.color, -20) : '#1e40af',
      glyphColor: '#ffffff',
      glyph: game.icon || '',
      scale: 1.2
    })

    const marker = new AdvancedMarkerElement({
      map,
      position,
      title: game.title,
      content: pinElement.element
    })

    // Create info window content
    const contentString = `
      <div style="
        font-family: 'Inter', system-ui, sans-serif;
        padding: 16px;
        max-width: 280px;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        color: #f8fafc;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      ">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 36px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${game.icon}</span>
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #f1f5f9; line-height: 1.3;">${game.title}</h3>
            <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">📍 ${game.venue}</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #cbd5e1;">
            <span>🕒</span>
            <span>${new Date(game.startTimeISO).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span style="
              font-size: 11px;
              padding: 4px 10px;
              border-radius: 12px;
              background: ${game.skillLevel === 'Beginner' ? 'rgba(34, 197, 94, 0.2)' :
                          game.skillLevel === 'Intermediate' ? 'rgba(59, 130, 246, 0.2)' :
                          game.skillLevel === 'Advanced' ? 'rgba(239, 68, 68, 0.2)' :
                          'rgba(168, 85, 247, 0.2)'};
              color: ${game.skillLevel === 'Beginner' ? '#4ade80' :
                      game.skillLevel === 'Intermediate' ? '#60a5fa' :
                      game.skillLevel === 'Advanced' ? '#f87171' :
                      '#c084fc'};
              border: 1px solid ${game.skillLevel === 'Beginner' ? 'rgba(34, 197, 94, 0.3)' :
                                 game.skillLevel === 'Intermediate' ? 'rgba(59, 130, 246, 0.3)' :
                                 game.skillLevel === 'Advanced' ? 'rgba(239, 68, 68, 0.3)' :
                                 'rgba(168, 85, 247, 0.3)'};
              font-weight: 600;
            ">
              ${game.skillLevel}
            </span>
            <span style="
              font-size: 11px;
              padding: 4px 10px;
              border-radius: 12px;
              background: ${game.price === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)'};
              color: ${game.price === 0 ? '#10b981' : '#fbbf24'};
              border: 1px solid ${game.price === 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 191, 36, 0.3)'};
              font-weight: 700;
            ">
              ${game.price === 0 ? 'FREE' : `$${game.price}`}
            </span>
          </div>
        </div>

        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: rgba(30, 41, 59, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(71, 85, 105, 0.5);
        ">
          <span style="font-size: 12px; color: #cbd5e1; font-weight: 600;">
            ${game.joined}/${game.capacity} joined
          </span>
          <span style="
            font-size: 11px;
            font-weight: 700;
            color: ${game.joined >= game.capacity ? '#f87171' :
                    game.joined / game.capacity >= 0.8 ? '#fbbf24' : '#4ade80'};
          ">
            ${game.joined >= game.capacity ? 'FULL' :
              game.capacity - game.joined === 1 ? '1 spot left' :
              `${game.capacity - game.joined} spots left`}
          </span>
        </div>
      </div>
    `

    // Add hover effect for pin scale
    pinElement.element.addEventListener('mouseenter', () => {
      pinElement.element.style.transform = 'scale(1.3)'
      pinElement.element.style.transition = 'transform 0.2s ease'

      // Show info window on hover
      infoWindow.setContent(contentString)
      infoWindow.open(map, marker)
    })

    pinElement.element.addEventListener('mouseleave', () => {
      pinElement.element.style.transform = 'scale(1)'
      // Hide info window when mouse leaves
      infoWindow.close()
    })

    // Click to select game
    marker.addListener('click', () => {
      window.dispatchEvent(new CustomEvent('game:select', { detail: game }))
    })

    markers.push(marker)
    bounds.extend(position)
  })

  // Fit bounds if no explicit center provided
  if (!props.center && props.games.length > 1) {
    map.fitBounds(bounds)
  }
}

// Helper function to darken/lighten color
function adjustColor(color, amount) {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}
</script>
