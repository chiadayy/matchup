<template>
  <div>
    <input
      ref="inputEl"
      type="text"
      placeholder="Search for a location in Singapore"
      style="width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['select'])
const inputEl = ref(null)

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

    emit('select', {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address,
      name: place.name || place.formatted_address
    })
  })
})
</script>
