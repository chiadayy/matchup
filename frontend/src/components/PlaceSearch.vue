<template>
  <div style="display: flex; gap: 12px; align-items: center;">
    <input
      ref="inputEl"
      type="text"
      v-model="searchValue"
      placeholder="Search for a location in Singapore"
      style="flex: 1; padding: 12px 16px; font-size: 16px; border: 2px solid #334155; border-radius: 10px; background: #0f172a; color: #f1f5f9;"
      @keydown.enter="handleSearch"
    />
    <button
      @click="handleSearch"
      style="
        padding: 12px 24px;
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      "
      @mouseenter="e => e.target.style.transform = 'translateY(-2px)'"
      @mouseleave="e => e.target.style.transform = 'translateY(0)'"
    >
      🔍 Search
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['select', 'clear'])
const inputEl = ref(null)
const searchValue = ref('')

onMounted(async () => {
  const { Autocomplete } = await google.maps.importLibrary('places')

  const autocomplete = new Autocomplete(inputEl.value, {
    fields: ['geometry', 'formatted_address', 'name'],
    componentRestrictions: { country: ['SG'] }
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()

    if (!place.geometry || !place.geometry.location) {
      return
    }

    searchValue.value = place.name || place.formatted_address

    emit('select', {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address,
      name: place.name || place.formatted_address
    })
  })
})

function handleSearch() {
  // If search input is empty, emit clear event to remove green pin
  if (!searchValue.value || searchValue.value.trim() === '') {
    emit('clear')
  }
}
</script>
