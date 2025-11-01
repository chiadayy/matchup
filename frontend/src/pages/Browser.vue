<template>
  <div class="browser-page">

    <div class="container mt-4">
      <div class="page-header">
        <h1 class="fw-bold">Browse Matches</h1>
        <p class="results-count">Showing <span>{{ filteredMatches.length }}</span> matches</p>
      </div>

      <!-- Weather Banner -->
      <div v-if="weatherBannerData && !weatherBannerDismissed" class="weather-banner-wrapper">
        <div class="weather-banner" :class="getWeatherBannerClass(weatherBannerData.condition)">
          <button class="weather-banner-dismiss" @click="weatherBannerDismissed = true">×</button>

          <div class="weather-banner-main">
            <div class="weather-banner-icon">
              {{ getWeatherIcon(weatherBannerData.condition) }}
            </div>
            <div class="weather-banner-content">
              <div class="weather-banner-location">
                <span class="location-icon">📍</span>
                <span class="location-text">{{ weatherBannerData.locationName }}</span>
              </div>
              <div class="weather-banner-stats">
                <span class="weather-temp">{{ weatherBannerData.temp }}°C</span>
                <span class="weather-divider">•</span>
                <span class="weather-condition">{{ weatherBannerData.condition }}</span>
                <span class="weather-divider">•</span>
                <span class="weather-humidity">{{ weatherBannerData.humidity }}% Humidity</span>
              </div>
              <div class="weather-banner-suggestion">
                <span class="suggestion-icon">💡</span>
                <span class="suggestion-text">{{ getWeatherSuggestion(weatherBannerData) }}</span>
              </div>
            </div>
          </div>

          <div v-if="weatherBannerData.advice" class="weather-banner-advice">
            <span class="advice-icon">💬</span>
            <span class="advice-text">"{{ weatherBannerData.advice }}"</span>
          </div>
        </div>
      </div>

      <div class="row py-4">
        <div class="map-wrapper">
          <MapView
            :games="mapGames"
            :center="mapCenter"
            :zoom="mapZoom"
            :searchedLocation="searchedLocationForMap"
          />
        </div>
      </div>

      <!-- Smart Suggestion Shortcuts -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="smart-shortcuts">
            <h6 class="shortcuts-label">Quick Discover</h6>
            <div class="shortcuts-container">
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'trending' }"
                @click="applyShortcut('trending')"
              >
                <span class="shortcut-icon">🔥</span>
                <span class="shortcut-text">Trending Now</span>
              </button>
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'free' }"
                @click="applyShortcut('free')"
              >
                <span class="shortcut-icon">💸</span>
                <span class="shortcut-text">Free Matches</span>
              </button>
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'almost-full' }"
                @click="applyShortcut('almost-full')"
              >
                <span class="shortcut-icon">🧍</span>
                <span class="shortcut-text">Almost Full</span>
              </button>
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'starting-soon' }"
                @click="applyShortcut('starting-soon')"
              >
                <span class="shortcut-icon">🕒</span>
                <span class="shortcut-text">Starting Soon</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filter Tags -->
      <div v-if="hasActiveFilters" class="row mb-3">
        <div class="col-12">
          <div class="active-filters">
            <span class="active-filters-label">Filters:</span>
            <div class="filter-tags">
              <span
                v-for="sport in selectedSports"
                :key="'sport-' + sport"
                class="filter-tag"
                @click="removeSportFilter(sport)"
              >
                {{ getSportIcon(sport) }} {{ sport }} <span class="tag-remove">×</span>
              </span>
              <span
                v-if="skillLevel"
                class="filter-tag"
                @click="skillLevel = ''; filterMatches()"
              >
                {{ skillLevel }} <span class="tag-remove">×</span>
              </span>
              <span
                v-if="location"
                class="filter-tag"
                @click="location = ''; locationSearch = ''; filterMatches()"
              >
                📍 {{ location }} <span class="tag-remove">×</span>
              </span>
              <span
                v-if="!location && locationSearch.trim()"
                class="filter-tag"
                @click="locationSearch = ''; filterMatches()"
              >
                🔍 "{{ locationSearch }}" <span class="tag-remove">×</span>
              </span>
              <span
                v-for="price in priceFilter"
                :key="'price-' + price"
                class="filter-tag"
                @click="removePriceFilter(price)"
              >
                {{ price === 'Free' ? '💸' : '💰' }} {{ price }} <span class="tag-remove">×</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-lg-3 col-md-4">
          <div class="sidebar">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Filters</h5>
              <a class="clear-filters" @click="clearFilters">Clear All</a>
            </div>

            <!-- Icon-Based Sport Type Filter -->
            <div class="filter-section">
              <label class="fw-600">Sport Type</label>
              <div class="sport-pills">
                <button
                  v-for="sport in sportsWithIcons"
                  :key="sport.name"
                  class="sport-pill"
                  :class="{ active: selectedSports.includes(sport.name) }"
                  @click="toggleSport(sport.name)"
                >
                  <span class="sport-pill-icon">{{ sport.icon }}</span>
                  <span class="sport-pill-text">{{ sport.name }}</span>
                </button>
              </div>
            </div>

            <!-- Skill Level Filter -->
            <div class="filter-section">
              <label class="fw-600">Skill Level</label>
              <div class="pill-group">
                <button
                  v-for="level in skillLevels"
                  :key="level"
                  class="filter-pill"
                  :class="{ active: skillLevel === level }"
                  @click="skillLevel = level; filterMatches()"
                >
                  {{ level }}
                </button>
                <button
                  class="filter-pill"
                  :class="{ active: skillLevel === '' }"
                  @click="skillLevel = ''; filterMatches()"
                >
                  All Levels
                </button>
              </div>
            </div>

            <!-- Location Filter (Hybrid) -->
            <div class="filter-section">
              <label class="fw-600">Location</label>

              <!-- Search Bar -->
              <div class="location-search-wrapper">
                <input
                  type="text"
                  class="location-search-input"
                  placeholder="🔍 Search by area or venue... (Press Enter to use exact location)"
                  v-model="locationSearch"
                  @input="handleLocationSearch"
                  @keyup.enter="useCustomLocation"
                  @focus="showLocationSuggestions = true"
                  @blur="hideLocationSuggestions"
                />

                <!-- Auto-complete Dropdown -->
                <div v-if="showLocationSuggestions && (addressSuggestions.length > 0 || filteredLocationSuggestions.length > 0 || locationSearch.trim())"
                     class="location-suggestions">
                  <!-- Loading indicator -->
                  <div v-if="isLoadingAddresses" class="location-suggestion-loading">
                    <span class="loading-spinner">🔄</span> Searching for exact addresses...
                  </div>

                  <!-- Exact Address Suggestions from OneMap API -->
                  <div v-if="addressSuggestions.length > 0 && !isLoadingAddresses" class="address-suggestions-section">
                    <div class="suggestions-label">📍 Exact Addresses</div>
                    <div
                      v-for="(address, index) in addressSuggestions"
                      :key="'addr-' + index"
                      class="location-suggestion-item location-suggestion-address"
                      @mousedown.prevent="selectAddressSuggestion(address)"
                    >
                      <div class="address-main">{{ address.building || address.road }}</div>
                      <div class="address-detail">{{ address.address }}</div>
                    </div>
                  </div>

                  <!-- Separator if both types exist -->
                  <div v-if="addressSuggestions.length > 0 && filteredLocationSuggestions.length > 0 && !isLoadingAddresses" class="suggestions-separator"></div>

                  <!-- General Area Suggestions -->
                  <div v-if="filteredLocationSuggestions.length > 0 && !isLoadingAddresses">
                    <div v-if="addressSuggestions.length > 0" class="suggestions-label">🗺️ General Areas</div>
                    <div
                      v-for="suggestion in filteredLocationSuggestions"
                      :key="suggestion"
                      class="location-suggestion-item"
                      @mousedown.prevent="selectLocationSuggestion(suggestion)"
                    >
                      📍 {{ suggestion }}
                    </div>
                  </div>

                  <!-- Custom location option at the bottom -->
                  <div
                    v-if="locationSearch.trim() && !isLoadingAddresses && !filteredLocationSuggestions.includes(locationSearch.trim())"
                    class="location-suggestion-item location-suggestion-custom"
                    @mousedown.prevent="useCustomLocation"
                  >
                    <span class="custom-icon">✨</span> Use "{{ locationSearch }}" as custom location
                  </div>
                </div>
              </div>

              <!-- Quick Pick Chips -->
              <div class="pill-group mt-2">
                <button
                  class="filter-pill"
                  :class="{ active: location === 'Near Me' }"
                  @click="selectNearMe()"
                >
                  🏠 Near Me
                </button>
                <button
                  v-for="loc in locations"
                  :key="loc"
                  class="filter-pill"
                  :class="{ active: location === loc }"
                  @click="location = loc; locationSearch = ''; filterMatches(); fetchWeatherBanner()"
                >
                  {{ loc }}
                </button>
                <button
                  class="filter-pill"
                  :class="{ active: location === '' && locationSearch === '' }"
                  @click="location = ''; locationSearch = ''; filterMatches()"
                >
                  All
                </button>
              </div>
            </div>

            <!-- Price Filter -->
            <div class="filter-section">
              <label class="fw-600">Price</label>
              <div class="pill-group">
                <button
                  class="filter-pill"
                  :class="{ active: priceFilter.includes('Free') }"
                  @click="togglePrice('Free')"
                >
                  💸 Free
                </button>
                <button
                  class="filter-pill"
                  :class="{ active: priceFilter.includes('Paid') }"
                  @click="togglePrice('Paid')"
                >
                  💰 Paid
                </button>
              </div>
            </div>

            <!-- Sort By -->
            <div class="filter-section">
              <label class="fw-600">Sort By</label>
              <select class="form-select" v-model="sortBy" @change="filterMatches">
                <option value="date">Date (Nearest First)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="spots">Available Spots</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Match Cards -->
        <div class="col-lg-9 col-md-8">
          <div id="matchContainer" class="match-container">
            <div
              v-for="match in paginatedMatches"
              :key="match.id"
              class="match-card"
              :class="['sport-' + match.sport_type.toLowerCase()]"
              @click="openMatchDetail(match)"
            >
              <!-- Sport Icon Badge -->
              <div class="sport-icon-badge" :style="{ backgroundColor: getSportColor(match.sport_type) }">
                {{ getSportIcon(match.sport_type) }}
              </div>

              <div class="match-header">
                <div>
                  <h3 class="match-title">{{ match.sport_type }} @ {{ match.location }}</h3>
                  <p class="sport-type">{{ match.skill_level }}</p>
                </div>
                <span :class="['match-price', match.total_price === 0 ? 'price-free' : 'price-paid']">
                  {{ match.total_price === 0 ? 'Free' : `$${match.total_price}` }}
                </span>
              </div>

              <div class="match-details">
                <p><strong>Skill level:</strong> {{ match.skill_level }}</p>
                <p><strong>Date and Time:</strong> {{ match.date }} {{ match.time }}</p>
                <p><strong>Distance:</strong> <span class="distance-badge">📍 {{ getMatchDistance(match) }} km away</span></p>
                <div class="player-progress">
                  <span class="player-count">{{ match.current_player_count }}/{{ match.total_player_count }} players</span>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: getPlayerPercentage(match) + '%', backgroundColor: getSportColor(match.sport_type) }"
                    ></div>
                  </div>
                </div>
              </div>
              <!-- <button
                class="btn-join-match"
                :class="{ 'pulse-btn': getAvailableSpots(match.current_player_count) < 3 }"
                @click.stop="handleJoinMatch(match.id)"
              > -->
              <button
                class="btn-join-match"
                :class="{ 'pulse-btn': getAvailableSpots(match.current_player_count) < 3 }"
                @click="openMatchDetail(match)"
              >
                <!-- {{ getAvailableSpots(match) === 0 ? 'Full' : 'Join Match' }} -->
                  {{ getAvailableSpots(match) === 0
                      ? 'Full'
                      : userMatches[match.id]
                        ? 'Joined'
                        : 'Join Match'
                  }}
              </button>
            </div>
          </div>

          <div v-if="filteredMatches.length === 0" class="text-center py-5">
            <h3 class="text-muted">No matches found</h3>
            <p class="text-muted">Try adjusting your filters</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredMatches.length > 0" class="pagination-container">
            <nav>
              <ul class="pagination">
                <li :class="['page-item', currentPage === 1 ? 'disabled' : '']">
                  <a class="page-link" href="javascript:void(0)" @click="changePage(currentPage - 1)">Previous</a>
                </li>
                <li v-for="page in totalPages" :key="page" :class="['page-item', currentPage === page ? 'active' : '']">
                  <a class="page-link" href="javascript:void(0)" @click="changePage(page)">{{ page }}</a>
                </li>
                <li :class="['page-item', currentPage === totalPages ? 'disabled' : '']">
                  <a class="page-link" href="javascript:void(0)" @click="changePage(currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Detail Modal -->
    <MatchDetailModal
      v-if="showMatchDetail" 
      :isOpen="showMatchDetail"
      :match="selectedMatch"
      :currentUser="currentUser"
      @close="closeMatchDetail"
      @join="handleJoinMatch"
      @leave="handleLeaveMatch"
      @message="handleMessagePlayer"
    />
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase';
import MatchDetailModal from '@/components/MatchDetailModal.vue';
import MapView from '@/components/MapView.vue';
import WeatherBadge from '@/components/WeatherBadge.vue';
// import { format } from 'node:util';

export default {
  name: 'Browser',
  components: {
    MatchDetailModal,
    MapView,
    WeatherBadge
  },
  data() {
    return {
      matches: [],
      filteredMatches: [],
      currentPage: 1,
      itemsPerPage: 8,
      sports: ['Basketball', 'Tennis', 'Football', 'Badminton'],
      sportsWithIcons: [
        { name: 'Basketball', icon: '🏀' },
        { name: 'Tennis', icon: '🎾' },
        { name: 'Football', icon: '⚽' },
        { name: 'Badminton', icon: '🏸' }
      ],
      skillLevels: ['Any Level', 'Beginner', 'Intermediate', 'Advanced'],
      locations: ['Hougang', 'Sengkang', 'Punggol', 'Tampines', 'Bedok'],
      selectedSports: [],
      skillLevel: '',
      location: '',
      priceFilter: [],
      sortBy: 'date',
      activeShortcut: null,
      isFiltering: false,
      currentUser: null,
      userMatches: {}, 

      // Location search
      locationSearch: '',
      showLocationSuggestions: false,
      addressSuggestions: [], // Geocoded address suggestions
      isLoadingAddresses: false,
      selectedLocationCoords: null, // Store exact coordinates of selected location
      searchTimeout: null, // Debounce timer for geocoding API
      allLocationSuggestions: [
        // Pre-set locations
        'Hougang', 'Sengkang', 'Punggol', 'Tampines', 'Bedok',
        // Additional areas
        'Woodlands', 'Yishun', 'Ang Mo Kio', 'Bishan', 'Toa Payoh',
        'Novena', 'Orchard', 'Marina Bay', 'Bugis', 'Chinatown',
        'Jurong East', 'Clementi', 'Bukit Timah', 'Newton', 'Outram',
        // Venues
        'Sports Hub', 'Kallang Stadium', 'OCBC Arena', 'Singapore Indoor Stadium',
        'ActiveSG Courts', 'Heartbeat@Bedok', 'Our Tampines Hub', 'Woodlands Stadium',
        'Choa Chu Kang Stadium', 'Bishan Stadium', 'Jurong East Sports Centre',
        'Toa Payoh Sports Hall', 'Delta Sports Complex', 'Hougang Sports Hall'
      ],

      // Modal state
      showMatchDetail: false,
      selectedMatch: null,

      // Weather banner
      weatherBannerData: null,
      weatherBannerDismissed: false,

      // Current user (replace with real auth)
      // currentUser: {
      //   id: '1',
      //   name: 'John Doe',
      //   profilePic: 'https://i.pravatar.cc/150?img=12'
      // },

      // User's current location
      userCurrentLocation: null
    }
  },
  computed: {
    hasActiveFilters() {
      const hasSkillFilter = this.skillLevel && this.skillLevel !== '' && this.skillLevel !== 'Any Level';
      const hasLocationFilter = this.location !== '' || this.locationSearch.trim() !== '';
      return this.selectedSports.length > 0 ||
             hasSkillFilter ||
             hasLocationFilter ||
             this.priceFilter.length > 0;
    },

    // Map center - use searched location if available, otherwise default
    mapCenter() {
      if (this.selectedLocationCoords) {
        return this.selectedLocationCoords;
      } else if (this.location && this.location !== 'Near Me') {
        return this.getMatchCoords(this.location);
      }
      return { lat: 1.3521, lng: 103.8198 }; // Default Singapore
    },

    // Map zoom - zoom in when location is searched
    mapZoom() {
      return (this.selectedLocationCoords || this.location) ? 15 : 11;
    },

    // Searched location for red marker
    searchedLocationForMap() {
      console.log('🎯 Computing searchedLocationForMap:', {
        selectedLocationCoords: this.selectedLocationCoords,
        location: this.location
      })

      if (this.selectedLocationCoords) {
        const result = {
          lat: this.selectedLocationCoords.lat,
          lng: this.selectedLocationCoords.lng,
          name: this.location || 'Searched Location'
        };
        console.log('📍 Returning exact coords:', result)
        return result;
      } else if (this.location && this.location !== 'Near Me' && this.location !== '') {
        const coords = this.getMatchCoords(this.location);
        const result = {
          lat: coords.lat,
          lng: coords.lng,
          name: this.location
        };
        console.log('📍 Returning location coords:', result)
        return result;
      }
      console.log('❌ Returning null')
      return null;
    },
    filteredLocationSuggestions() {
      if (!this.locationSearch.trim()) {
        return this.allLocationSuggestions.slice(0, 8);
      }
      const query = this.locationSearch.toLowerCase();
      return this.allLocationSuggestions
        .filter(loc => loc.toLowerCase().includes(query))
        .slice(0, 8);
    },
    totalPages() {
      return Math.ceil(this.filteredMatches.length / this.itemsPerPage)
    },
    paginatedMatches() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredMatches.slice(startIndex, endIndex)
    },
    mapGames() {
      // Map coordinates for Singapore locations
      const locationCoords = {
        'Hougang': { lat: 1.3712, lng: 103.8863 },
        'Sengkang': { lat: 1.3917, lng: 103.8951 },
        'Punggol': { lat: 1.4043, lng: 103.9021 },
        'Tampines': { lat: 1.3529, lng: 103.9446 },
        'Bedok': { lat: 1.3236, lng: 103.9273 },
        'Serangoon CC': { lat: 1.3537, lng: 103.8721 },
        'Choa Chu Kang CC': { lat: 1.3853, lng: 103.7459 },
        'Bukit Merah CC': { lat: 1.2827, lng: 103.8179 },
        'Woodlands': { lat: 1.4382, lng: 103.7891 },
        'Yishun': { lat: 1.4304, lng: 103.8354 },
        'Ang Mo Kio': { lat: 1.3691, lng: 103.8454 },
        'Bishan': { lat: 1.3526, lng: 103.8352 },
        'Toa Payoh': { lat: 1.3343, lng: 103.8567 },
        'Jurong East': { lat: 1.3329, lng: 103.7436 },
        'Clementi': { lat: 1.3162, lng: 103.7649 }
      };

      // Sport icons and colors
      const sportConfig = {
        'Basketball': { icon: '🏀', color: '#f97316' },
        'Tennis': { icon: '🎾', color: '#84cc16' },
        'Football': { icon: '⚽', color: '#10b981' },
        'Badminton': { icon: '🏸', color: '#ec4899' }
      };

      return this.filteredMatches.map(match => {
        const coords = locationCoords[match.location] || { lat: 1.3521, lng: 103.8198 };
        const config = sportConfig[match.sport_type] || { icon: '🏃', color: '#3b82f6' };

        const [joined, capacity] = "7/8".split('/').map(Number);

        // Create ISO timestamp from date and time
        const dateStr = match.date; // "2025-10-20" 
        const timeStr = match.time // "14:00:00"
        const [year, month, date] = dateStr.split('-').map(Number);
        const startTimeISO = new Date(`${dateStr}T${timeStr}`).toISOString();

        return {
          id: match.id,
          title: `${match.sport_type} Match ${match.id}`,
          venue: match.location,
          lat: coords.lat,
          lng: coords.lng,
          startTimeISO,
          icon: config.icon,
          color: config.color,
          sport: match.sport_type,
          skillLevel: match.skill_level,
          capacity,
          joined,
          price: match.total_price
        };
      });
    }
  },
  async mounted() {
    await this.getAllMatches();
    await this.getUserCurrentLocation();
    this.filterMatches();
    await this.checkAllMatches();
    await this.fetchWeatherBanner();
  },
  methods: {
    // Get user's current location
    async getUserCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userCurrentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          },
          (error) => {
            console.warn('Could not get user location:', error);
            // Default to Singapore if geolocation fails
            this.userCurrentLocation = { lat: 1.3521, lng: 103.8198 };
          }
        );
      } else {
        // Default to Singapore if geolocation not supported
        this.userCurrentLocation = { lat: 1.3521, lng: 103.8198 };
      }
    },

    // Calculate distance from current/searched location to match
    getMatchDistance(match) {
      // Determine reference location: searched location > user location > default
      let refLocation;
      if (this.selectedLocationCoords) {
        // User searched for an exact address
        refLocation = this.selectedLocationCoords;
      } else if (this.location && this.location !== 'Near Me') {
        // User selected a predefined location
        refLocation = this.getMatchCoords(this.location);
      } else if (this.userCurrentLocation) {
        // Use user's current location
        refLocation = this.userCurrentLocation;
      } else {
        // Default to Singapore
        refLocation = { lat: 1.3521, lng: 103.8198 };
      }

      const matchCoords = this.getMatchCoords(match.location);
      const distance = this.calculateDistance(
        refLocation.lat,
        refLocation.lng,
        matchCoords.lat,
        matchCoords.lng
      );
      return distance.toFixed(1); // Return with 1 decimal place
    },

    async getAllMatches() {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select("*");

        if (error) {
          console.error("Error fetching matches:", error);
          return;
        } 
        else {
          this.matches = data;
        }
      }
      catch (err) {
        console.error("Unexpected error:", err);
      }
    },
    filterMatches() {
      this.filteredMatches = [...this.matches]

      if (this.selectedSports.length > 0) {
        this.filteredMatches = this.filteredMatches.filter(m => this.selectedSports.includes(m.sport_type))
      }

      if (this.skillLevel && this.skillLevel !== 'Any Level') {
        this.filteredMatches = this.filteredMatches.filter(m => m.skill_level === this.skillLevel)
      }

        // Location filtering with 5km radius
      if (this.location) {
        // Use exact coordinates if available (from address search), otherwise use predefined coords
        const searchCoords = this.selectedLocationCoords || this.getMatchCoords(this.location);
        this.filteredMatches = this.filteredMatches.filter(m => {
          const matchCoords = this.getMatchCoords(m.location);
          const distance = this.calculateDistance(
            searchCoords.lat,
            searchCoords.lng,
            matchCoords.lat,
            matchCoords.lng
          );
          return distance <= 5; // Within 5km
        });
      } else if (this.locationSearch.trim()) {
        const query = this.locationSearch.toLowerCase();
        this.filteredMatches = this.filteredMatches.filter(m =>
          m.location.toLowerCase().includes(query)
        )
      }

      if (this.priceFilter.length > 0) {
        if (this.priceFilter.includes('Free') && !this.priceFilter.includes('Paid')) {
          this.filteredMatches = this.filteredMatches.filter(m => m.total_price === 0)
        } else if (this.priceFilter.includes('Paid') && !this.priceFilter.includes('Free')) {
          this.filteredMatches = this.filteredMatches.filter(m => m.total_price > 0)
        }
      }

      if (this.sortBy === 'price-low') {
        this.filteredMatches.sort((a, b) => a.total_price - b.total_price)
      } else if (this.sortBy === 'price-high') {
        this.filteredMatches.sort((a, b) => b.total_price - a.total_price)
      }

      this.currentPage = 1
    },
    async ifUserInMatch(matchId) {
      const { data: { user } } = await supabase.auth.getUser();
     const { data, error } = await supabase
        .from('users_matches')
        .select('*')
        .eq('match_id', matchId)
        .eq('user_id', user.id);

      return data.some(u => u.user_id === user.id);
    },
    async checkAllMatches() {
      for (const match of this.matches) {
        const joined = await this.ifUserInMatch(match.id);
        this.userMatches[match.id] = joined;
      }
    },
    // async ifUserInMatch(matchid) {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   try {
    //     const { data, error } = await supabase
    //     .from('users_matches')
    //     .eq("match_id", matchid);

    //     if (error) {
    //       console.error("Failed to fetch players data", error);
    //       return;
    //     }
    //     else {
    //       // this.matchPlayers = data;
    //       return data.some(u => u.user_id === user.id);
    //     }
    //   }
    //   catch (err) {
    //     console.error("Unexpected error:", err);
    //     return false;
    //   }
    // },
    formatMatchDate(match) {
      if (!match.match_date) return { date: '', time: '' };

      const d = new Date(match.match_date);
      if (isNaN(d.getTime())) return { date: '', time: '' }; 

      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear() % 100; // last 2 digits
      let hour = d.getHours();
      const ampm = hour >= 12 ? 'pm' : 'am';
      if (hour > 12) hour -= 12;
      if (hour === 0) hour = 12;

      return {
        date: `${month}/${day}/${year}`,
        time: `${hour}${ampm}`
      };
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    clearFilters() {
      this.selectedSports = []
      this.skillLevel = ''
      this.location = ''
      this.locationSearch = ''
      this.priceFilter = []
      this.sortBy = 'date'
      this.activeShortcut = null
      this.filterMatches()
    },

    // Location search methods
    async handleLocationSearch() {
      this.location = '';

      // Clear suggestions if search is empty
      if (!this.locationSearch.trim()) {
        this.addressSuggestions = [];
        this.filterMatches();
        return;
      }

      // Debounce the geocoding API call
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        await this.fetchAddressSuggestions();
      }, 500);

      this.filterMatches();
    },

    async fetchAddressSuggestions() {
      const query = this.locationSearch.trim();
      if (query.length < 3) return;

      this.isLoadingAddresses = true;

      try {
        // Use OneMap Search API for Singapore addresses
        const response = await fetch(
          `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
        );

        if (!response.ok) {
          console.error('OneMap API failed:', response.status);
          this.addressSuggestions = [];
          return;
        }

        const data = await response.json();

        if (data.found > 0) {
          // Transform OneMap results to address suggestions with coordinates
          this.addressSuggestions = data.results.slice(0, 6).map(result => ({
            address: result.ADDRESS,
            building: result.BUILDING || '',
            road: result.ROAD_NAME || '',
            postalCode: result.POSTAL || '',
            lat: parseFloat(result.LATITUDE),
            lng: parseFloat(result.LONGITUDE),
            displayName: result.ADDRESS
          }));
        } else {
          this.addressSuggestions = [];
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        this.addressSuggestions = [];
      } finally {
        this.isLoadingAddresses = false;
      }
    },

    selectLocationSuggestion(suggestion) {
      this.locationSearch = '';
      this.location = suggestion;
      this.selectedLocationCoords = null;
      this.showLocationSuggestions = false;
      this.filterMatches();
      this.fetchWeatherBanner(); // Update weather for new location
    },

    selectAddressSuggestion(addressObj) {
      this.location = addressObj.displayName;
      this.selectedLocationCoords = { lat: addressObj.lat, lng: addressObj.lng };
      this.locationSearch = '';
      this.showLocationSuggestions = false;
      this.addressSuggestions = [];
      this.filterMatches();
      this.fetchWeatherBanner(); // Update weather for exact address
    },

    useCustomLocation() {
      if (!this.locationSearch.trim()) return;
      this.location = this.locationSearch.trim();
      this.selectedLocationCoords = null;
      this.locationSearch = '';
      this.showLocationSuggestions = false;
      this.filterMatches();
      this.fetchWeatherBanner(); // Update weather for custom location
    },

    hideLocationSuggestions() {
      setTimeout(() => {
        this.showLocationSuggestions = false;
      }, 200);
    },

    selectNearMe() {
      this.location = 'Near Me';
      this.locationSearch = '';
      // In a real app, you'd use geolocation to filter by distance
      // For now, just set the location
      this.filterMatches();
    },

    // Filter toggle methods
    toggleSport(sport) {
      const index = this.selectedSports.indexOf(sport);
      if (index > -1) {
        this.selectedSports.splice(index, 1);
      } else {
        this.selectedSports.push(sport);
      }
      this.activeShortcut = null;
      this.filterMatches();
    },

    togglePrice(price) {
      const index = this.priceFilter.indexOf(price);
      if (index > -1) {
        this.priceFilter.splice(index, 1);
      } else {
        this.priceFilter.push(price);
      }
      this.activeShortcut = null;
      this.filterMatches();
    },

    removeSportFilter(sport) {
      this.selectedSports = this.selectedSports.filter(s => s !== sport);
      this.filterMatches();
    },

    removePriceFilter(price) {
      this.priceFilter = this.priceFilter.filter(p => p !== price);
      this.filterMatches();
    },

    getSportIcon(sport) {
      const sportObj = this.sportsWithIcons.find(s => s.name === sport);
      return sportObj ? sportObj.icon : '🏃';
    },

    applyShortcut(type) {
      // Toggle off if clicking the same shortcut
      if (this.activeShortcut === type) {
        this.activeShortcut = null;
        this.clearFilters();
        return;
      }

      this.activeShortcut = type;

      // Clear other filters
      this.selectedSports = [];
      this.skillLevel = '';
      this.location = '';
      this.priceFilter = [];

      switch(type) {
        case 'trending':
          // Sort by most players joined (higher capacity filled = trending)
          this.sortBy = 'date';
          this.filteredMatches = [...this.allMatches];
          this.filteredMatches.sort((a, b) => {
            const aFillRate = parseInt(a.players.split('/')[0]) / parseInt(a.players.split('/')[1]);
            const bFillRate = parseInt(b.players.split('/')[0]) / parseInt(b.players.split('/')[1]);
            return bFillRate - aFillRate;
          });
          this.currentPage = 1;
          return;

        case 'free':
          this.priceFilter = ['Free'];
          break;

        case 'almost-full':
          // Filter matches with 75%+ capacity
          this.filteredMatches = this.allMatches.filter(m => {
            const [joined, capacity] = m.players.split('/').map(Number);
            return (joined / capacity) >= 0.75;
          });
          this.currentPage = 1;
          return;

        case 'starting-soon':
          // Sort by date (earliest first)
          this.sortBy = 'date';
          this.filteredMatches = [...this.allMatches];
          this.filteredMatches.sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return dateA - dateB;
          });
          this.currentPage = 1;
          return;
      }

      this.filterMatches();
    },

    // Modal methods
    openMatchDetail(match) {
        this.selectedMatch = match;
        this.showMatchDetail = true;
        // prevent scrolling
        document.body.style.overflow = 'hidden';
    },
    closeMatchDetail() {
      this.showMatchDetail = false
      this.selectedMatch = null
      // Restore body scroll
      document.body.style.overflow = 'auto'
    },
    handleJoinMatch(matchId) {
      console.log('Joined match:', matchId)
      // REAL API: Call join match endpoint
      // await joinMatch(matchId)
      
      // Update UI
      // alert('Successfully joined the match!')
    },
    handleLeaveMatch(matchId) {
      console.log('Left match:', matchId)
      // REAL API: Call leave match endpoint
      // await leaveMatch(matchId)
      
      // Update UI
      // alert('You have left the match')
    },
    handleMessagePlayer(player) {
      console.log('Message player:', player)
      // Open chat or navigate to messages
      // this.$router.push(`/messages/${player.id}`)
      alert(`Opening chat with ${player.name}`)
    },

    // Helper methods for enhanced features
    getSportColor(sport) {
      const colors = {
        'Basketball': '#f97316',
        'Tennis': '#84cc16',
        'Football': '#10b981',
        'Badminton': '#ec4899'
      };
      return colors[sport] || '#3b82f6';
    },

    getMatchCoords(location) {
      const locationCoords = {
        'Hougang': { lat: 1.3712, lng: 103.8863 },
        'Sengkang': { lat: 1.3917, lng: 103.8951 },
        'Punggol': { lat: 1.4043, lng: 103.9021 },
        'Tampines': { lat: 1.3529, lng: 103.9446 },
        'Bedok': { lat: 1.3236, lng: 103.9273 },
        'Serangoon CC': { lat: 1.3537, lng: 103.8721 },
        'Choa Chu Kang CC': { lat: 1.3853, lng: 103.7459 },
        'Bukit Merah CC': { lat: 1.2827, lng: 103.8179 },
        'Woodlands': { lat: 1.4382, lng: 103.7891 },
        'Yishun': { lat: 1.4304, lng: 103.8354 },
        'Ang Mo Kio': { lat: 1.3691, lng: 103.8454 },
        'Bishan': { lat: 1.3526, lng: 103.8352 },
        'Toa Payoh': { lat: 1.3343, lng: 103.8567 },
        'Jurong East': { lat: 1.3329, lng: 103.7436 },
        'Clementi': { lat: 1.3162, lng: 103.7649 }
      };
      return locationCoords[location] || { lat: 1.3521, lng: 103.8198 };
    },

    // Calculate distance between two coordinates using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of Earth in kilometers
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers
      return distance;
    },

    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    },

    getMatchISO(match) {
      const dateStr = match.date;
      const timeStr = match.time;
      const [year, month, date] = dateStr.split('/').map(Number);
      const startTimeISO = new Date(`${dateStr}T${timeStr}`).toISOString();
      return startTimeISO;
    },

    getPlayerPercentage(match) {
      const joined = match.current_player_count;
      const capacity = match.total_player_count;
      if (!capacity || capacity === 0) return 0;
      return (joined / capacity) * 100;
    },

    getAvailableSpots(match) {
      const capacity = match.total_player_count;
      const joined = match.current_player_count;
      return capacity - joined;
    },

    // Weather Banner Methods
    async fetchWeatherBanner() {
      try {
        // Get user's location or use Singapore default
        const locationName = this.location || this.locationSearch || 'Singapore';
        // Use exact coordinates if available (from address search), otherwise use predefined coords
        const coords = this.selectedLocationCoords || this.getMatchCoords(locationName);

        // Fetch weather from OpenWeatherMap API
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
          console.error('Weather API failed:', response.status);
          return;
        }

        const data = await response.json();

        this.weatherBannerData = {
          locationName: locationName === 'Singapore' ? 'Singapore' : locationName,
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
          humidity: data.main.humidity,
          rain: data.rain ? Math.round((data.rain['1h'] || 0) / 10 * 100) : 0,
          advice: this.getWeatherAdvice(data)
        };
      } catch (error) {
        console.error('Error fetching weather banner:', error);
      }
    },

    getWeatherIcon(condition) {
      const c = condition.toLowerCase();
      if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
      if (c.includes('cloud')) return '☁️';
      if (c.includes('clear')) return '☀️';
      if (c.includes('snow')) return '❄️';
      if (c.includes('thunder')) return '⛈️';
      if (c.includes('mist') || c.includes('fog')) return '🌫️';
      return '🌤️';
    },

    getWeatherBannerClass(condition) {
      const c = condition.toLowerCase();

      // Thunderstorm - distinct dark purple/electric theme
      if (c.includes('thunder') || c.includes('storm')) return 'weather-banner-thunderstorm';

      // Heavy Rain - darker blue with rain animation
      if (c.includes('heavy rain') || c.includes('downpour')) return 'weather-banner-heavy-rain';

      // Light Rain/Drizzle - softer blue
      if (c.includes('rain') || c.includes('drizzle')) return 'weather-banner-rainy';

      // Snow - white/icy blue theme
      if (c.includes('snow') || c.includes('sleet')) return 'weather-banner-snowy';

      // Fog/Mist - gray misty theme
      if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'weather-banner-foggy';

      // Overcast/Heavy Clouds - darker gray
      if (c.includes('overcast')) return 'weather-banner-overcast';

      // Partly Cloudy - mix of blue and yellow
      if (c.includes('partly') || c.includes('few clouds') || c.includes('scattered')) return 'weather-banner-partly-cloudy';

      // Cloudy - light gray/blue
      if (c.includes('cloud')) return 'weather-banner-cloudy';

      // Clear/Sunny - bright yellow/orange
      if (c.includes('clear') || c.includes('sunny')) return 'weather-banner-sunny';

      // Default - neutral teal
      return 'weather-banner-default';
    },

    getWeatherSuggestion(weatherData) {
      const temp = weatherData.temp;
      const condition = weatherData.condition.toLowerCase();
      const humidity = weatherData.humidity;

      if (condition.includes('rain') || condition.includes('drizzle')) {
        return 'Perfect for indoor sports like badminton!';
      } else if (temp > 32) {
        return 'Hot day! Stay hydrated and consider indoor courts.';
      } else if (temp < 24) {
        return 'Great weather for outdoor activities!';
      } else if (humidity > 80) {
        return 'High humidity - indoor sports recommended!';
      } else if (condition.includes('clear')) {
        return 'Perfect weather for sports!';
      }
      return 'Good conditions for all sports!';
    },

    getWeatherAdvice(data) {
      const condition = data.weather[0].description.toLowerCase();
      const temp = Math.round(data.main.temp);
      const rain = data.rain ? data.rain['1h'] : 0;

      if (rain > 2) {
        return 'Looks like rain later — maybe book an indoor court?';
      } else if (temp > 32) {
        return 'Pretty hot out there — bring extra water!';
      } else if (condition.includes('cloud') && !condition.includes('clear')) {
        return 'Cloudy conditions — perfect timing for outdoor games!';
      } else if (condition.includes('clear')) {
        return 'Clear skies ahead — great day for sports!';
      }
      return null;
    }
  },
  beforeUnmount() {
    // Cleanup: restore body scroll if modal was open
    document.body.style.overflow = 'auto'
  }
}
</script>

<style scoped>
:root {
  --primary-orange: #FF6B35;
  --dark-bg: #2b2d42;
}

.browser-page {
  min-height: 100vh;
  background: #f7f9fc;
}

.container {
  position: relative;
}

.map-wrapper {
  height: 400px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  background: #ffffff;
}

.sidebar {
  background: #f9f9f9;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: none;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  transition: box-shadow 0.3s ease;
}

.sidebar:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

.sidebar h5 {
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--dark-bg);
}

.filter-section {
  margin-bottom: 25px;
}

.filter-section label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  display: block;
}

.form-select, .form-control {
  border-radius: 8px;
  border: 2px solid #dee2e6;
  padding: 10px 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
}

.form-select:hover, .form-control:hover {
  border-color: var(--primary-orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-select:focus, .form-control:focus {
  border-color: var(--primary-orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  outline: none;
}

.form-check {
  margin-bottom: 12px;
  padding-left: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-check-input[type="checkbox"] {
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  cursor: pointer !important;
  border: 2px solid #dee2e6 !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-color: white !important;
  position: relative !important;
  flex-shrink: 0 !important;
  background-image: none !important;
}

.form-check-input[type="checkbox"]:hover {
  border-color: var(--primary-orange) !important;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
}

.form-check-input[type="checkbox"]:checked {
  background-color: var(--primary-orange) !important;
  border-color: var(--primary-orange) !important;
  background-image: none !important;
}

.form-check-input[type="checkbox"]:checked::after {
  content: '' !important;
  position: absolute !important;
  left: 6px !important;
  top: 2px !important;
  width: 5px !important;
  height: 10px !important;
  border: solid white !important;
  border-width: 0 2px 2px 0 !important;
  transform: rotate(45deg) !important;
  display: block !important;
}

.form-check-input[type="checkbox"]:focus {
  border-color: var(--primary-orange) !important;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2) !important;
  outline: none !important;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  color: #495057;
  transition: color 0.2s ease;
  margin: 0;
}

.form-check-label:hover {
  color: var(--primary-orange);
}

.match-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 991px) {
  .match-container {
    grid-template-columns: 1fr;
  }
}

.match-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-height: 380px;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background: #fafafa;
}

.sport-icon-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

.match-card:hover .sport-icon-badge {
  transform: scale(1.15) rotate(-5deg);
}

/* Weather Banner Styles - Futuristic/Ambient Design */
.weather-banner-wrapper {
  margin-bottom: 24px;
  animation: slideInFromTop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.weather-banner {
  position: relative;
  border-radius: 24px;
  padding: 32px 36px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.weather-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  opacity: 0.5;
  animation: ambientPulse 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes ambientPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.02); }
}

.weather-banner-sunny {
  background: linear-gradient(135deg,
    rgba(254, 243, 199, 0.9) 0%,
    rgba(253, 230, 138, 0.85) 50%,
    rgba(252, 211, 77, 0.9) 100%);
  box-shadow:
    0 8px 32px rgba(251, 191, 36, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 60px rgba(252, 211, 77, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.weather-banner-cloudy {
  background: linear-gradient(135deg,
    rgba(224, 231, 255, 0.9) 0%,
    rgba(199, 210, 254, 0.85) 50%,
    rgba(165, 180, 252, 0.9) 100%);
  box-shadow:
    0 8px 32px rgba(129, 140, 248, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 60px rgba(165, 180, 252, 0.2);
  border: 1px solid rgba(129, 140, 248, 0.3);
}

.weather-banner-rainy {
  background: linear-gradient(135deg,
    rgba(219, 234, 254, 0.9) 0%,
    rgba(191, 219, 254, 0.85) 50%,
    rgba(147, 197, 253, 0.9) 100%);
  box-shadow:
    0 8px 32px rgba(96, 165, 250, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 60px rgba(147, 197, 253, 0.2);
  border: 1px solid rgba(96, 165, 250, 0.3);
  animation: rainShimmer 3s ease-in-out infinite;
}

@keyframes rainShimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.05); }
}

.weather-banner-default {
  background: linear-gradient(135deg,
    rgba(240, 253, 250, 0.9) 0%,
    rgba(204, 251, 241, 0.85) 50%,
    rgba(153, 246, 228, 0.9) 100%);
  box-shadow:
    0 8px 32px rgba(94, 234, 212, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 60px rgba(153, 246, 228, 0.2);
  border: 1px solid rgba(94, 234, 212, 0.3);
}

/* Thunderstorm - Dark purple with electric accents */
.weather-banner-thunderstorm {
  background: linear-gradient(135deg,
    rgba(88, 28, 135, 0.95) 0%,
    rgba(109, 40, 217, 0.9) 50%,
    rgba(147, 51, 234, 0.95) 100%);
  box-shadow:
    0 8px 32px rgba(147, 51, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 80px rgba(168, 85, 247, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.4);
  animation: thunderPulse 2s ease-in-out infinite;
}

@keyframes thunderPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.15); box-shadow: 0 8px 40px rgba(147, 51, 234, 0.5), 0 0 100px rgba(168, 85, 247, 0.4); }
}

/* Heavy Rain - Deep blue with intense rain animation */
.weather-banner-heavy-rain {
  background: linear-gradient(135deg,
    rgba(29, 78, 216, 0.95) 0%,
    rgba(37, 99, 235, 0.9) 50%,
    rgba(59, 130, 246, 0.95) 100%);
  box-shadow:
    0 8px 32px rgba(59, 130, 246, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 60px rgba(96, 165, 250, 0.25);
  border: 1px solid rgba(96, 165, 250, 0.4);
  animation: heavyRainShimmer 1.5s ease-in-out infinite;
}

@keyframes heavyRainShimmer {
  0%, 100% { filter: brightness(1) saturate(1); }
  50% { filter: brightness(1.1) saturate(1.15); }
}

/* Snow - Icy white/blue theme */
.weather-banner-snowy {
  background: linear-gradient(135deg,
    rgba(240, 249, 255, 0.98) 0%,
    rgba(224, 242, 254, 0.95) 50%,
    rgba(186, 230, 253, 0.98) 100%);
  box-shadow:
    0 8px 32px rgba(125, 211, 252, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 0 70px rgba(186, 230, 253, 0.25);
  border: 1px solid rgba(186, 230, 253, 0.5);
  animation: snowGlimmer 3s ease-in-out infinite;
}

@keyframes snowGlimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.08); }
}

/* Foggy/Misty - Gray with mysterious blur */
.weather-banner-foggy {
  background: linear-gradient(135deg,
    rgba(241, 245, 249, 0.95) 0%,
    rgba(226, 232, 240, 0.9) 50%,
    rgba(203, 213, 225, 0.95) 100%);
  box-shadow:
    0 8px 32px rgba(148, 163, 184, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 0 80px rgba(203, 213, 225, 0.3);
  border: 1px solid rgba(203, 213, 225, 0.4);
  animation: fogDrift 4s ease-in-out infinite;
}

@keyframes fogDrift {
  0%, 100% { filter: blur(0px); opacity: 0.95; }
  50% { filter: blur(0.5px); opacity: 1; }
}

/* Overcast - Darker gray clouds */
.weather-banner-overcast {
  background: linear-gradient(135deg,
    rgba(226, 232, 240, 0.95) 0%,
    rgba(203, 213, 225, 0.9) 50%,
    rgba(148, 163, 184, 0.95) 100%);
  box-shadow:
    0 8px 32px rgba(100, 116, 139, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 60px rgba(148, 163, 184, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.35);
}

/* Partly Cloudy - Mix of sun and clouds */
.weather-banner-partly-cloudy {
  background: linear-gradient(135deg,
    rgba(254, 249, 195, 0.92) 0%,
    rgba(224, 231, 255, 0.88) 50%,
    rgba(254, 240, 138, 0.92) 100%);
  box-shadow:
    0 8px 32px rgba(234, 179, 8, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 0 65px rgba(254, 240, 138, 0.2);
  border: 1px solid rgba(250, 204, 21, 0.35);
  animation: partlyCloudyShift 5s ease-in-out infinite;
}

@keyframes partlyCloudyShift {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(5deg); }
}

/* Text color overrides for dark backgrounds */
.weather-banner-thunderstorm .location-text,
.weather-banner-thunderstorm .weather-temp,
.weather-banner-thunderstorm .weather-condition,
.weather-banner-thunderstorm .weather-humidity,
.weather-banner-thunderstorm .suggestion-text,
.weather-banner-thunderstorm .advice-text {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  -webkit-text-fill-color: rgba(255, 255, 255, 0.95);
}

.weather-banner-thunderstorm .weather-temp {
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.weather-banner-thunderstorm .weather-divider {
  color: rgba(255, 255, 255, 0.5);
}

.weather-banner-thunderstorm .weather-banner-dismiss {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.weather-banner-thunderstorm .weather-banner-dismiss:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
}

.weather-banner-thunderstorm .weather-banner-suggestion {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.weather-banner-thunderstorm .weather-banner-advice {
  border-top-color: rgba(255, 255, 255, 0.25);
}

.weather-banner-dismiss {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(0, 0, 0, 0.7);
  font-size: 22px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
  z-index: 10;
}

.weather-banner-dismiss:hover {
  background: rgba(255, 255, 255, 0.35);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(0, 0, 0, 0.9);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.weather-banner-main {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.weather-banner-icon {
  font-size: 64px;
  line-height: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  animation: floatIcon 3s ease-in-out infinite;
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.weather-banner-content {
  flex: 1;
}

.weather-banner-location {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.location-icon {
  font-size: 18px;
  opacity: 0.8;
}

.location-text {
  font-size: 20px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  letter-spacing: -0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.weather-banner-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.weather-temp {
  font-size: 36px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.95);
  letter-spacing: -1px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.weather-divider {
  color: rgba(0, 0, 0, 0.3);
  font-weight: 400;
  font-size: 20px;
}

.weather-condition {
  font-size: 17px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  letter-spacing: -0.2px;
}

.weather-humidity {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  letter-spacing: -0.1px;
}

.weather-banner-suggestion {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.weather-banner-suggestion:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.suggestion-icon {
  font-size: 18px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.suggestion-text {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.1px;
}

.weather-banner-advice {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.advice-icon {
  font-size: 20px;
  opacity: 0.9;
}

.advice-text {
  font-size: 15px;
  font-style: italic;
  color: rgba(0, 0, 0, 0.75);
  font-weight: 500;
  letter-spacing: -0.1px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .weather-banner {
    padding: 18px 20px;
  }

  .weather-banner-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .weather-banner-icon {
    font-size: 36px;
  }

  .weather-temp {
    font-size: 24px;
  }

  .weather-banner-stats {
    font-size: 14px;
  }
}

.weather-section {
  margin: 12px -4px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 12px;
  border: 1px solid #e8e8ed;
}

.match-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
  gap: 12px;
  margin-left: 52px;
}

.match-header > div:first-child {
  flex: 1;
  min-width: 0;
}

.match-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--dark-bg);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.match-price {
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
  white-space: nowrap;
}

.price-free {
  color: #28a745;
}

.price-paid {
  color: #dc3545;
}

.sport-type {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 10px;
}

.match-details {
  color: #495057;
  line-height: 1.8;
  flex-grow: 1;
}

.match-details p {
  margin: 5px 0;
}

.distance-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #1e40af;
  white-space: nowrap;
}

.player-progress {
  margin-top: 15px;
}

.player-count {
  display: inline-block;
  background: #e9ecef;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--primary-orange);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.6);
}

.btn-join-match {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  color: white !important;
  padding: 12px 20px;
  width: 100%;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.btn-join-match:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.btn-join-match:active {
  transform: translateY(0);
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.7);
  }
}

.pulse-btn {
  background: linear-gradient(135deg, var(--primary-orange) 0%, #e85a2a 100%);
  animation: pulse-glow 2s infinite;
}

.page-header {
  margin: 0 0 24px 0;
  padding: 28px 32px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: none;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF6B35 0%, #f97316 50%, #10b981 100%);
}

.page-header h1 {
  font-weight: 700;
  color: #1d1d1f;
  font-size: 2rem;
  margin: 0;
}

.results-count {
  color: #86868b;
  margin-top: 6px;
  font-weight: 500;
  font-size: 0.95rem;
}

.results-count span {
  color: var(--primary-orange);
  font-weight: 600;
}

.clear-filters {
  color: var(--primary-orange);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.clear-filters:hover {
  text-decoration: underline;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.pagination {
  margin: 0;
}

.page-link {
  color: var(--dark-bg);
  border: 1px solid #dee2e6;
  padding: 10px 15px;
  margin: 0 3px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.page-link:hover {
  background-color: var(--primary-orange);
  color: white;
  border-color: var(--primary-orange);
}

.page-item.active .page-link {
  background-color: var(--dark-bg);
  border-color: var(--dark-bg);
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #f8f9fa;
}
</style>

<style>
/* Non-scoped styles for checkboxes to override Bootstrap */
.sidebar .form-check {
  margin-bottom: 12px !important;
  padding-left: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.sidebar .form-check-input[type="checkbox"] {
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  margin-top: 0 !important;
  cursor: pointer !important;
  border: 2px solid #dee2e6 !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-color: white !important;
  position: relative !important;
  flex-shrink: 0 !important;
  background-image: none !important;
  background-size: 0 !important;
}

.sidebar .form-check-input[type="checkbox"]:hover {
  border-color: #FF6B35 !important;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
}

.sidebar .form-check-input[type="checkbox"]:checked {
  background-color: #FF6B35 !important;
  border-color: #FF6B35 !important;
  background-image: none !important;
}

.sidebar .form-check-input[type="checkbox"]:checked::after {
  content: '✓' !important;
  position: absolute !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: white !important;
  font-size: 18px !important;
  font-weight: bold !important;
  display: block !important;
  line-height: 1 !important;
}

.sidebar .form-check-input[type="checkbox"]:focus {
  border-color: #FF6B35 !important;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2) !important;
  outline: none !important;
}

.sidebar .form-check-label {
  cursor: pointer !important;
  user-select: none !important;
  font-weight: 500 !important;
  color: #495057 !important;
  transition: color 0.2s ease !important;
  margin: 0 !important;
  margin-bottom: 0 !important;
}

.sidebar .form-check-label:hover {
  color: #FF6B35 !important;
}

/* Smart Shortcuts Styles */
.smart-shortcuts {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
}

.shortcuts-label {
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.95;
}

.shortcuts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.shortcut-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.shortcut-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shortcut-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
  transform: translateY(-2px) scale(1.05);
}

.shortcut-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.shortcut-text {
  line-height: 1;
}

/* Active Filters Tags */
.active-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 16px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 12px;
  margin-bottom: 20px;
  animation: slideInFromTop 0.4s ease;
}

.active-filters-label {
  font-weight: 700;
  color: #856404;
  font-size: 0.9rem;
  white-space: nowrap;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: white;
  border: 1px solid #ffc107;
  border-radius: 20px;
  color: #856404;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: bounceIn 0.3s ease;
}

.filter-tag:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
  transform: scale(1.05);
}

.tag-remove {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
  opacity: 0.7;
}

/* Sport Pills */
.sport-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sport-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.sport-pill:hover {
  border-color: #FF6B35;
  color: #FF6B35;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
  transform: translateY(-2px);
}

.sport-pill.active {
  background: linear-gradient(135deg, #FF6B35 0%, #ff8c61 100%);
  border-color: #FF6B35;
  color: white;
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.35);
  transform: translateY(-2px) scale(1.05);
  animation: bounceIn 0.3s ease;
}

.sport-pill-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.sport-pill-text {
  line-height: 1;
}

/* Location Search Styles */
.location-search-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.location-search-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: white;
  color: #4b5563;
}

.location-search-input::placeholder {
  color: #9ca3af;
}

.location-search-input:focus {
  outline: none;
  border-color: #FF6B35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.location-suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-height: 280px;
  overflow-y: auto;
  z-index: 100;
  animation: slideDownFade 0.2s ease;
}

@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.location-suggestion-item {
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9rem;
  border-bottom: 1px solid #f3f4f6;
}

.location-suggestion-item:last-child {
  border-bottom: none;
}

.location-suggestion-item:hover {
  background: #fff7ed;
  color: #FF6B35;
  padding-left: 18px;
}

.location-suggestion-custom {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom: 2px solid #fbbf24 !important;
  font-weight: 600;
  color: #92400e;
}

.location-suggestion-custom:hover {
  background: linear-gradient(135deg, #fde68a 0%, #fbbf24 100%);
  color: #78350f;
  padding-left: 18px;
}

.location-suggestion-custom .custom-icon {
  font-size: 1.1rem;
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
}

/* Address Suggestions Styling */
.location-suggestion-loading {
  padding: 14px;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.address-suggestions-section {
  padding: 4px 0;
}

.suggestions-label {
  padding: 8px 14px 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.suggestions-separator {
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
}

.location-suggestion-address {
  padding: 12px 14px !important;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-left: 3px solid #0ea5e9 !important;
}

.location-suggestion-address:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-left-color: #0284c7 !important;
}

.address-main {
  font-weight: 600;
  color: #0c4a6e;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.address-detail {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.3;
}

/* Filter Pills (Generic) */
.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-pill:hover {
  border-color: #FF6B35;
  color: #FF6B35;
  box-shadow: 0 3px 10px rgba(255, 107, 53, 0.15);
  transform: translateY(-1px);
}

.filter-pill.active {
  background: #FF6B35;
  border-color: #FF6B35;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transform: translateY(-1px);
  animation: bounceIn 0.3s ease;
}

/* Animations */
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Match Cards Fade Animation */
.match-card {
  animation: fadeIn 0.4s ease;
}

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

/* Additional Responsive Styles for Zoom and Resize */
.browser-page {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.container {
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}

/* Responsive text sizing */
@media (max-width: 1400px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .match-title {
    font-size: 1.2rem;
  }

  .shortcuts-container {
    justify-content: flex-start;
  }
}

@media (max-width: 1200px) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .match-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
  }

  .map-wrapper {
    height: 350px;
  }

  .weather-banner {
    padding: 24px 28px;
  }

  .shortcut-btn {
    padding: 8px 14px;
    font-size: 0.8rem;
  }
}

@media (max-width: 991px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .map-wrapper {
    height: 300px;
  }

  .match-card {
    min-height: 340px;
  }

  .smart-shortcuts {
    padding: 16px;
  }

  .shortcuts-container {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .container {
    padding-left: 12px;
    padding-right: 12px;
  }

  .page-header {
    margin-bottom: 16px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .results-count {
    font-size: 0.9rem;
  }

  .match-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .match-card {
    min-height: auto;
    padding: 16px;
  }

  .match-title {
    font-size: 1.1rem;
  }

  .match-price {
    font-size: 1.1rem;
  }

  .map-wrapper {
    height: 250px;
  }

  .shortcuts-container {
    gap: 6px;
  }

  .shortcut-btn {
    padding: 6px 12px;
    font-size: 0.75rem;
  }

  .shortcut-icon {
    font-size: 1rem;
  }

  .filter-pills-wrapper {
    padding: 12px;
  }

  .active-filters {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 576px) {
  .container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .page-header h1 {
    font-size: 1.3rem;
  }

  .match-card {
    padding: 14px;
  }

  .match-header {
    margin-left: 48px;
  }

  .sport-icon-badge {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .map-wrapper {
    height: 220px;
  }

  .smart-shortcuts {
    padding: 12px;
  }

  .shortcuts-label {
    font-size: 0.8rem;
    margin-bottom: 8px;
  }

  .shortcut-btn {
    padding: 5px 10px;
    font-size: 0.7rem;
    gap: 6px;
  }

  .pagination-container {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .weather-banner-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .weather-divider {
    display: none;
  }
}

/* High zoom levels (zoom > 150%) */
@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.2rem;
  }

  .results-count {
    font-size: 0.85rem;
  }

  .match-title {
    font-size: 1rem;
    white-space: normal;
  }

  .match-details {
    font-size: 0.9rem;
  }

  .shortcut-btn {
    flex: 1 1 45%;
    justify-content: center;
  }

  .shortcuts-container {
    justify-content: space-between;
  }
}
</style>