<template>
  <div class="game-creation-page">
    <!-- Background Video -->
    <div class="video-background">
      <video autoplay muted loop playsinline>
        <source src="/game-creation.mp4" type="video/mp4">
      </video>
    </div>

    <div class="container-fluid px-5 py-4">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="fw-bold">Create a Match</h1>
          <p class="subtitle">Start organizing your next game and connect with players</p>
        </div>

        <div class="creation-container">
          <form @submit.prevent="createMatch">
            <!-- Step Indicator -->
            <div class="steps-indicator">
              <div v-for="step in 4" :key="step" class="step" :class="{ active: currentStep === step, completed: currentStep > step }">
                <span class="step-number">{{ step }}</span>
                <span class="step-label">{{ getStepLabel(step) }}</span>
              </div>
            </div>

            <!-- Step 1: Basic Info -->
            <div v-if="currentStep === 1" class="form-section">
              <h2 class="section-title">Match Details</h2>
              
              <div class="form-group">
                <label class="form-label">Match Name</label>
                <input 
                  ref="matchNameInput"
                  type="text" 
                  class="form-control" 
                  v-model="formData.matchName"
                  placeholder="e.g., Weekly Basketball Game, Doubles Badminton"
                  required
                >
                <div v-if="fieldErrors.matchName" class="input-error">{{ fieldErrors.matchName }}</div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Sport Type</label>
                  <input 
                        ref="sportInput"
                        type="text" 
                        class="form-control" 
                        v-model="formData.sport"
                        placeholder="e.g., Basketball, Tennis, Football, Badminton"
                        required
                      > 
                      <div v-if="fieldErrors.sport" class="input-error">{{ fieldErrors.sport }}</div>
                </div>
                <div class="form-group">
                  <label class="form-label">Skill Level</label>
                  <select ref="skillLevelInput" class="form-control" v-model="formData.skillLevel" required>
                    <option value="">Select skill level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Any Level">Any Level</option>
                  </select>
                  <div v-if="fieldErrors.skillLevel" class="input-error">{{ fieldErrors.skillLevel }}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Maximum Players</label>
                  <input 
                    ref="maxPlayersInput"
                    type="number" 
                    class="form-control" 
                    v-model.number="formData.maxPlayers"
                    min="2"
                    max="100"
                    required
                  >
                  <div v-if="fieldErrors.maxPlayers" class="input-error">{{ fieldErrors.maxPlayers }}</div>
                </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Pick Location on Map</label>
                  <div ref="pickerMap" style="width:100%;height:400px;border-radius:12px;overflow:hidden;margin-bottom:1em;"></div>
                  <div class="form-row" hidden>
                    <div class="form-group">
                      <label class="form-label">Latitude</label>
                      <input
                        ref="latitudeInput"
                        type="number"
                        class="form-control"
                        v-model="formData.latitude"
                        placeholder="Latitude"
                        required
                      >
                      <div v-if="fieldErrors.latitude" class="input-error">{{ fieldErrors.latitude }}</div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Longitude</label>
                      <input
                        ref="longitudeInput"
                        type="number"
                        class="form-control"
                        v-model="formData.longitude"
                        placeholder="Longitude"
                        required
                      >
                      <div v-if="fieldErrors.longitude" class="input-error">{{ fieldErrors.longitude }}</div>
                    </div>
                  </div>
                  <div style="margin-top:1em;">
                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input
                      ref="addressInput"
                      type="text"
                      class="form-control"
                      placeholder="Search for a location..."
                      v-model="searchQuery"
                      @input="() => { searchPlace(); updateLocationFromSearch(); }"
                      @keydown.down.prevent="moveSelection(1)"
                      @keydown.up.prevent="moveSelection(-1)"
                      @keydown.enter.prevent="selectPrediction(selectedIndex)"
                    />
                    <div v-if="fieldErrors.location" class="input-error">{{ fieldErrors.location }}</div>
                  </div>


                  <div v-if="predictions.length" class="suggestions-dropdown">
                    <div
                      v-for="(prediction, index) in predictions"
                      :key="prediction.place_id"
                      :class="{ 'suggestion-item': true, active: index === selectedIndex }"
                      @click="selectPrediction(index)"
                      @mouseover="hoverPrediction(index)"
                    >
                      {{ prediction.description }}
                    </div>
                  </div>

  <button class="btn btn-primary" style="margin-top:8px;" @click="searchPlace">Search</button>
                  </div>
                <!-- </div> -->
              </div>
            </div>

            <!-- Step 2: Date & Time -->
            <div v-if="currentStep === 2" class="form-section">
              <h2 class="section-title">Schedule</h2>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Date</label>
                  <input 
                    ref="dateInput"
                    type="date" 
                    class="form-control" 
                    v-model="formData.date"
                    required
                  >
                  <div v-if="fieldErrors.date" class="input-error">{{ fieldErrors.date }}</div>
                </div>

                <div class="form-group">
                  <label class="form-label">Time</label>
                  <input 
                    ref="timeInput"
                    type="time" 
                    class="form-control" 
                    v-model="formData.time"
                    required
                  >
                  <div v-if="fieldErrors.time" class="input-error">{{ fieldErrors.time }}</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Duration (minutes)</label>
                <input 
                  ref="durationInput"
                  type="number" 
                  class="form-control" 
                  v-model.number="formData.duration"
                  placeholder="e.g., 60, 90"
                  min="15"
                  required
                >
                <div v-if="fieldErrors.duration" class="input-error">{{ fieldErrors.duration }}</div>
              </div>
            </div>

            <!-- Step 3: Pricing -->
            <div v-if="currentStep === 3" class="form-section">
              <h2 class="section-title">Entry Fee</h2>

              <div class="pricing-options">
                <div class="option-card" :class="{ selected: formData.isPaid === false }" @click="formData.isPaid = false">
                  <div class="option-icon">🎁</div>
                  <h3>Free Match</h3>
                  <p>No entry fee</p>
                </div>

                <div class="option-card" :class="{ selected: formData.isPaid === true }" @click="formData.isPaid = true">
                  <div class="option-icon">💰</div>
                  <h3>Paid Match</h3>
                  <p>Players pay to join</p>
                </div>
              </div>

              <div v-if="formData.isPaid" class="paid-details">
                    <div class="form-group">
                          <label class="form-label">Total Match Price ($)</label>
                          <input 
                            ref="totalPriceInput"
                            type="number" 
                            class="form-control" 
                            v-model.number="formData.totalPrice"
                            placeholder="e.g., 50"
                            min="0"
                            step="0.01"
                            required
                          >
                          <div v-if="fieldErrors.totalPrice" class="input-error">{{ fieldErrors.totalPrice }}</div>
                    </div>

                    <div class="price-info">
                      <p class="info-text">
                        <strong>Total Price:</strong> ${{ formData.totalPrice.toFixed(2) }}
                      </p>
                    </div>
              </div>
            </div>

            <!-- Step 4: Description -->
            <div v-if="currentStep === 4" class="form-section">
              <h2 class="section-title">Match Description</h2>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  v-model="formData.description"
                  placeholder="Describe what you'll be playing. E.g., 'We'll be playing doubles in badminton. Bring your own rackets. Beginner-friendly!'"
                  rows="5"
                  required
                ></textarea>
                <p class="char-count">{{ formData.description.length }}/500</p>
              </div>

              <!-- Match Summary -->
              <div class="summary-card">
                <h3 class="summary-title">Match Summary</h3>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="label">Sport</span>
                    <span class="value">{{ formData.sport }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Date & Time</span>
                    <span class="value">{{ formatDateDisplay(formData.date) }} at {{ formData.time }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Location</span>
                    <span class="value">{{ formData.location }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Players</span>
                    <span class="value">{{ formData.maxPlayers }} max</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Skill Level</span>
                    <span class="value">{{ formData.skillLevel }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Entry Fee</span>
                    <span class="value" :class="formData.isPaid ? 'text-danger' : 'text-success'">
                      {{ formData.isPaid ? `$${formData.totalPrice}` : 'Free' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-navigation">
              <button 
                v-if="currentStep > 1"
                type="button" 
                class="btn btn-secondary"
                @click="previousStep"
                :disabled="isSubmitting"
              >
                Back
              </button>

              <button 
                v-if="currentStep < 4"
                type="button" 
                class="btn btn-primary"
                @click="nextStep"
                :disabled="isSubmitting"
              >
                Next
              </button>

              <button 
                v-if="currentStep === 4"
                type="submit" 
                class="btn btn-success"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Creating Match...</span>
                <span v-else>Create Match</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showSuccessMessage" class="success-notification">
      <div class="notification-content">
        <span class="icon">✓</span>
        <div class="message-text">
          <p class="title">Match Created Successfully!</p>
          <p class="subtitle">Your match is now live and players can join</p>
        </div>
        <button class="btn-close-notification" @click="closeSuccessMessage">✕</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'
import { ref, onMounted } from 'vue'

export default {
  name: 'GameCreation',
  data() {
    return {
      currentStep: 1,
      showSuccessMessage: false,
      isSubmitting: false,    
      submitError: null,
      searchQuery: '',
      map: null,
      marker: null,
      autocompleteService: null,
      placesService: null,
      highlightCircle: null,
      predictions: [],
      selectedIndex: -1,
      geocoder: null,
      fieldErrors: {},
      
      formData: {
        matchName: '',
        sport: '',
        skillLevel: '',
        location: '',
        maxPlayers: 8,
        date: '',
        time: '',
        duration: 60,
        isPaid: false,
        totalPrice: 0,
        description: '',
        latitude: '',
        longitude: '',
      },
    }
  },
  mounted() {
    this.initMapPicker();
  },
  methods: {
    getStepLabel(step) {
      const labels = ['Details', 'Schedule', 'Pricing', 'Description'];
      return labels[step - 1];
    },
    
  nextStep() {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    } else {
      this.$nextTick(() => {
        const firstErrorKey = Object.keys(this.fieldErrors)[0];
        if (firstErrorKey) {
          const refName = firstErrorKey + 'Input';
          const inputEl = this.$refs[refName];
          if (inputEl && inputEl.scrollIntoView) {
            inputEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            inputEl.focus();
          }
        }
      });
    }
  },

    previousStep() {
      this.currentStep--;
    },
    
    validateCurrentStep() {
      this.fieldErrors = {}; // Reset errors

      if (this.currentStep === 1) {
        if (!this.formData.matchName) this.fieldErrors.matchName = "Match Name is required.";
        if (!this.formData.sport) this.fieldErrors.sport = "Sport Type is required.";
        if (!this.formData.skillLevel) this.fieldErrors.skillLevel = "Skill Level is required.";
        if (!this.formData.location) this.fieldErrors.location = "Location is required.";
        if (this.formData.latitude === '' || isNaN(Number(this.formData.latitude))) this.fieldErrors.latitude = "Valid latitude is required.";
        if (this.formData.longitude === '' || isNaN(Number(this.formData.longitude))) this.fieldErrors.longitude = "Valid longitude is required.";
        if (!this.formData.maxPlayers || this.formData.maxPlayers < 2) this.fieldErrors.maxPlayers = "Maximum players must be at least 2.";
        return Object.keys(this.fieldErrors).length === 0;
      }
      if (this.currentStep === 2) {
        if (!this.formData.date) this.fieldErrors.date = "Date is required.";
        if (!this.formData.time) this.fieldErrors.time = "Time is required.";
        if (!this.formData.duration) this.fieldErrors.duration = "Duration is required.";
        return Object.keys(this.fieldErrors).length === 0;
      }
      if (this.currentStep === 3) {
        if (this.formData.isPaid && !(this.formData.totalPrice > 0)) this.fieldErrors.totalPrice = "Total price must be greater than 0 for paid matches.";
        return Object.keys(this.fieldErrors).length === 0;
      }
      if (this.currentStep === 4) {
        if (!this.formData.description) this.fieldErrors.description = "Description is required.";
        return Object.keys(this.fieldErrors).length === 0;
      }
      return true;
    },

    async createMatch() {
      if (!this.validateCurrentStep()) {
        return;
      }

      this.isSubmitting = true;
      this.submitError = null;

      try {
        // Get current user for authentication
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('You must be logged in to create a match');
        }

        // send this to backend
        const matchData = {
          name: this.formData.matchName,
          sport_type: this.formData.sport,
          skill_level: this.formData.skillLevel,
          location: this.formData.location,
          total_player_count: this.formData.maxPlayers,
          date: this.formData.date,
          time: this.formData.time,
          duration: this.formData.duration,
          total_price: this.formData.isPaid ? this.formData.totalPrice : 0,
          description: this.formData.description,
          host: user.id,
          current_player_count: 0,
          conversation_id: 0,
          latitude: this.formData.latitude,
          longitude: this.formData.longitude
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/matches`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify(matchData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create match');
        }

        const data = await response.json();
        const createdMatch = data.match;

        // Automatically join the match as the host
        const joinResponse = await fetch(`${import.meta.env.VITE_API_URL}/matches/${createdMatch.id}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            user_id: user.id,
            payment_success: true // Host is automatically confirmed
          })
        });

        if (!joinResponse.ok) {
          console.error('Failed to add host to match');
        }

        // Show success message
        this.showSuccessMessage = true;
        
        // Reset form and redirect after delay
        setTimeout(() => {
          this.resetForm();
          this.$router.push('/my-matches'); // Redirect to My Matches page
        }, 2000);

      } catch (error) {
        this.submitError = error.message || 'Failed to create match. Please try again.';
        alert(`Error: ${error.message}`);
      } finally {
        this.isSubmitting = false;
      }
    },    
    
    resetForm() {
      this.currentStep = 1;
      this.formData = {
        matchName: '',
        sport: '',
        skillLevel: '',
        location: '',
        maxPlayers: 8,
        date: '',
        time: '',
        duration: 60,
        isPaid: false,
        totalPrice: 0,
        description: ''
      };
    },
    
    closeSuccessMessage() {
      this.showSuccessMessage = false;
    },
        
    formatDateDisplay(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

  async initMapPicker() {
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps API not loaded.');
      return;
    }
    const { Map } = await google.maps.importLibrary('maps');
    this.map = new google.maps.Map(this.$refs.pickerMap, {
      center: { lat: 1.3521, lng: 103.8198 },
      zoom: 12,
      mapId: "1d622eb16f09ac0b3984b1bd"
    });
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: null,
      title: 'Selected Location'
    });
    this.map.addListener('click', (e) => {
      this.setLatLng(e.latLng.lat(), e.latLng.lng());
      this.marker.position = e.latLng;  
    });

    if (google.maps.places) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.map);
      this.geocoder = new google.maps.Geocoder();
    } else {
      console.error('Google Maps Places library not loaded.');
    }
  },

  setLatLng(lat, lng) {
    this.formData.latitude = lat;
    this.formData.longitude = lng;

    if (this.geocoder) {
      const latlng = { lat, lng };
      this.geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          // Use the first result's formatted address as location name
          this.formData.location = results[0].formatted_address;
          this.searchQuery = results[0].formatted_address; // update search bar input
        } else {
          console.warn('Geocoder failed due to: ' + status);
          // Optionally clear or fallback location name
        }
      });
    }
  },
      
  searchPlace() {

    if (!this.searchQuery || !this.autocompleteService) {
      this.predictions = [];
      return;
    }
    this.autocompleteService.getPlacePredictions(
  {
    input: this.searchQuery,
    componentRestrictions: { country: 'SG' }
  },
      (preds, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !preds) {
          this.predictions = [];
          return;
        }
        this.predictions = preds; // save predictions for showing dropdown  
        this.selectedIndex = -1;   // reset keyboard selection
      }
    );
  }
  ,
  highlightArea(radiusMeters = 500) {
    // Remove previous circle if exists
    if (this.highlightCircle) {
      this.highlightCircle.setMap(null);
    }

    // Create new circle centered at latitude/longitude
    this.highlightCircle = new google.maps.Circle({
      strokeColor: '#FF6B35',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF6B35',
      fillOpacity: 0.25,
      map: this.map,
      center: { lat: this.formData.latitude, lng: this.formData.longitude },
      radius: radiusMeters
    });
  },

  hoverPrediction(index) {
    this.selectedIndex = index;
  },
  moveSelection(direction) {
    const max = this.predictions.length - 1;
    if (direction === 1 && this.selectedIndex < max) this.selectedIndex++;
    else if (direction === -1 && this.selectedIndex > 0) this.selectedIndex--;
  },
  selectPrediction(index) {
    if (index < 0 || index >= this.predictions.length) return;
    const prediction = this.predictions[index];
    this.formData.location = prediction.description;
    this.searchQuery = prediction.description;
    this.predictions = [];

    this.fetchPlaceDetails(prediction.place_id);
  },
  fetchPlaceDetails(placeId) {
    this.placesService.getDetails({ placeId }, (placeResult, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !placeResult.geometry) {
        alert('Could not get location details');
        return;
      }
      const location = placeResult.geometry.location;
      this.map.setCenter(location);
      this.map.setZoom(15);
      this.marker.position = location;
      this.setLatLng(location.lat(), location.lng());
      this.highlightArea(500);
    });
  },
  updateLocationFromSearch() {
    this.formData.location = this.searchQuery;
  }


  },
  watch: {
  currentStep(newStep) {
    if (newStep === 1) {
      this.$nextTick(() => {
        this.initMapPicker();
      });
    }
  }
},
}
</script>

<style scoped>
/* Video Background */
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.video-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-creation-page {
  position: relative;
  min-height: 100vh;
  padding: 40px 20px;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.75);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

:root {
  --primary-color: #FF6B35;
  --secondary-color: #2C3E50;
  --back-color: #F7F9FC;
  --success-color: #28a745;
  --danger-color: #dc3545;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-row .form-group {
  width: 100%;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h1 {
  color: var(--secondary-color);
  margin-bottom: 8px;
}

.subtitle {
  color: #999;
  font-size: 1.05rem;
}

.creation-container {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.steps-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e8ecef;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e8ecef;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.step.completed .step-number {
  background: var(--success-color);
  background: #e8ecef;
  color: #999;
}

.step-label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}

.step.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}

.form-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.section-title {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 30px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
  position: relative;

}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--secondary-color);
}

.form-control {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.char-count {
  font-size: 0.85rem;
  color: #999;
  margin-top: 4px;
}

.pricing-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.option-card {
  padding: 24px;
  border: 2px solid #e8ecef;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.1);
}

.option-card.selected {
  border-color: var(--primary-color);
  background: rgba(255, 107, 53, 0.05);
}

.option-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.option-card h3 {
  color: var(--secondary-color);
  margin: 0 0 4px 0;
  font-weight: 600;
}

.option-card p {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.paid-details {
  background: var(--back-color);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.price-info {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
}

.info-text {
  margin: 0;
  color: var(--secondary-color);
  font-weight: 500;
}

.info-text.small {
  font-size: 0.9rem;
  color: #999;
  font-weight: normal;
}

.payment-title {
  font-size: 1.1rem;
  color: var(--secondary-color);
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  border-top: 2px solid #e8ecef;
  padding-top: 16px;
}

.security-notice {
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
}

.security-notice p {
  margin: 0;
  font-weight: 500;
}

.summary-card {
  background: var(--back-color);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.summary-title {
  font-size: 1.1rem;
  color: var(--secondary-color);
  margin: 0 0 16px 0;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.summary-item .label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}

.summary-item .value {
  color: var(--secondary-color);
  font-weight: 600;
}

.text-success {
  color: var(--success-color);
}

.text-danger {
  color: var(--danger-color);
}

.form-navigation {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e8ecef;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #FF5722;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e8ecef;
  color: var(--secondary-color);
}

.btn-secondary:hover {
  background: #dee2e6;
}

.btn-success {
  background: var(--success-color);
  color: white;
  min-width: 150px;
}

.btn-success:hover {
  background: #218838;
  transform: translateY(-2px);
}

.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3000;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-content {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-content .icon {
  width: 40px;
  height: 40px;
  background: var(--success-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.message-text {
  flex: 1;
}

.message-text .title {
  margin: 0;
  color: var(--secondary-color);
  font-weight: 600;
}

.message-text .subtitle {
  margin: 0;
  color: #999;
  font-size: 0.85rem;
}

.btn-close-notification {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
}

.btn-close-notification:hover {
  color: var(--secondary-color);
  transform: rotate(90deg);
}

.btn-success {
  background: #28a745 !important;
  color: white !important;
  min-width: 150px;
}

.btn-success:hover {
  background: #28a745 !important;
  color: white !important;
  transform: none !important;
}

.btn-success:disabled {
  background: #28a745 !important;
  color: white !important;
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success:disabled:hover {
  background: #28a745 !important;
  color: white !important;
  transform: none !important;
}

.btn:disabled {
  cursor: not-allowed;
}

.suggestions-dropdown {
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  position: absolute;
  z-index: 1000;
  width: 100%;
}
.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}
.suggestion-item.active,
.suggestion-item:hover {
  background-color: #f0f0f0;
}


.input-error {
  color: red;
  font-size: 0.95rem;
  margin-top: 4px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .game-creation-page {
    padding: 24px 20px;
  }

  .content-wrapper {
    padding: 30px 20px;
  }

  .creation-container {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .pricing-options {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .steps-indicator {
    flex-direction: row;
    gap: 8px;
  }

  .steps-indicator::before {
    display: block;
  }

  .form-navigation {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .success-notification {
    left: 20px;
    right: 20px;
  }
}

/* Mobile phones (768px) */
@media (max-width: 768px) {
  .creation-container {
    padding: 20px 15px;
  }

  .creation-card {
    padding: 30px 20px;
  }

  .creation-title {
    font-size: 1.8rem;
  }

  .creation-subtitle {
    font-size: 0.95rem;
  }

  .step-item {
    padding: 15px;
  }

  .step-number {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .step-label {
    font-size: 0.85rem;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  input, textarea, select {
    font-size: 0.9rem;
    padding: 10px 14px;
  }
}

/* Small phones (576px) */
@media (max-width: 576px) {
  .creation-container {
    padding: 15px 10px;
  }

  .creation-card {
    padding: 25px 15px;
    border-radius: 16px;
  }

  .creation-title {
    font-size: 1.5rem;
  }

  .creation-subtitle {
    font-size: 0.9rem;
  }

  .steps-indicator {
    gap: 12px;
  }

  .step-item {
    padding: 12px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .step-label {
    font-size: 0.8rem;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-group label {
    font-size: 0.85rem;
    margin-bottom: 6px;
  }

  input, textarea, select {
    font-size: 0.85rem;
    padding: 9px 12px;
  }

  .btn {
    padding: 11px 20px;
    font-size: 0.9rem;
  }

  .success-icon {
    font-size: 3rem;
  }

  .success-title {
    font-size: 1.5rem;
  }
}

/* Extra small phones (375px) */
@media (max-width: 375px) {
  .creation-title {
    font-size: 1.3rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  input, textarea, select {
    font-size: 0.8rem;
  }
}
</style>