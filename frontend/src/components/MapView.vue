<template>
  <div ref="mapEl" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  games: { type: Array, default: () => [] },
  center: { type: Object, default: null },
  zoom: { type: Number, default: 12 },
  searchedLocation: { type: Object, default: null }
})

const mapEl = ref(null)
let map = null
let markers = []
let searchMarker = null

onMounted(async () => {
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

  const initialCenter = props.center || { lat: 1.3521, lng: 103.8198 }

  map = new Map(mapEl.value, {
    center: initialCenter,
    zoom: props.zoom,
    mapId: 'DEMO_MAP_ID'
  })

  updateMarkers(AdvancedMarkerElement)
})

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
    // Zoom in when focusing on a specific location
    map.setZoom(15)
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
  }
}, { deep: true })

function updateMarkers(AdvancedMarkerElement) {
  // Clear existing markers
  markers.forEach(m => m.map = null)
  markers = []

  if (!props.games.length) return

  const bounds = new google.maps.LatLngBounds()

  props.games.forEach(game => {
    const position = { lat: game.lat, lng: game.lng }
    const marker = new AdvancedMarkerElement({
      map,
      position,
      title: game.title
    })

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
</script>
