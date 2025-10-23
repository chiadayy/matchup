<template>
  <div class="browser-page">

    <div class="container mt-4">
      <div class="page-header">
        <h1 class="fw-bold">Browse Matches</h1>
        <p class="results-count">Showing <span>{{ filteredMatches.length }}</span> matches</p>
      </div>

      <div class="row py-4">
        <div class="map-wrapper">
          <MapView :games="mapGames" :center="{ lat: 1.3521, lng: 103.8198 }" :zoom="11" />
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
                  placeholder="🔍 Search by area or venue..."
                  v-model="locationSearch"
                  @input="handleLocationSearch"
                  @focus="showLocationSuggestions = true"
                  @blur="hideLocationSuggestions"
                />

                <!-- Auto-complete Dropdown -->
                <div v-if="showLocationSuggestions && filteredLocationSuggestions.length > 0"
                     class="location-suggestions">
                  <div
                    v-for="suggestion in filteredLocationSuggestions"
                    :key="suggestion"
                    class="location-suggestion-item"
                    @mousedown.prevent="selectLocationSuggestion(suggestion)"
                  >
                    📍 {{ suggestion }}
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
                  @click="location = loc; locationSearch = ''; filterMatches()"
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
                  <h3 class="match-title">{{ match.id }} Match</h3>
                  <p class="sport-type">{{ match.sport_type }}</p>
                </div>
                <span :class="['match-price', match.total_price === 0 ? 'price-free' : 'price-paid']">
                  {{ match.total_price === 0 ? 'Free' : `$${match.total_price}` }}
                </span>
              </div>

              <!-- Compact Weather Tag -->
              <div class="weather-section" @click.stop>
                <!-- <WeatherBadge
                  :lat="getMatchCoords('Hougang').lat"
                  :lon="getMatchCoords('Hougang').lng"
                  :eventTimeISO="getMatchISO(match)"
                  :locationName="match.location"
                  :compact="true"
                /> -->
                <WeatherBadge
                  :lat="match.latitude"
                  :lon="match.longitude"
                  :eventTimeISO="getMatchISO(match)"
                  :locationName="match.location"
                />
              </div>

              <div class="match-details">
                <p><strong>Skill level:</strong> {{ match.skill_level }}</p>
                <p><strong>Date and Time:</strong> {{ match.date }} {{ match.time }}</p>
                <div class="player-progress">
                  <span class="player-count">{{ match.current_player_count }} players</span>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: getPlayerPercentage(match.current_player_count) + '%', backgroundColor: getSportColor(match.sport_type) }"
                    ></div>
                  </div>
                </div>
              </div>
              <button
                class="btn-join-match"
                :class="{ 'pulse-btn': getAvailableSpots(match.current_player_count) < 3 }"
                @click.stop="handleJoinMatch(match.id)"
              >
                {{ getAvailableSpots(match.current_player_count) === 0 ? 'Full' : 'Join Match' }}
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
import { supabase } from '@/lib/supabase'
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
      allMatches: [
        { id: 1, sport: "Basketball", skill: "Beginner", location: "Hougang", date: "8/10/25", time: "6pm", price: 0, players: "7/8", organizer: "Alex Chen", description: "Casual basketball game for beginners. Bring your own water!" },
        { id: 2, sport: "Tennis", skill: "Beginner", location: "Sengkang", date: "8/10/25", time: "7pm", price: 15, players: "2/4", organizer: "Sarah Tan", description: "Evening tennis doubles. Court fees included." },
        { id: 3, sport: "Basketball", skill: "Beginner", location: "Hougang", date: "8/10/25", time: "6pm", price: 0, players: "7/8", organizer: "Mike Wong" },
        { id: 4, sport: "Basketball", skill: "Any Level", location: "Hougang", date: "8/10/25", time: "6pm", price: 0, players: "7/8", organizer: "David Lee" },
        { id: 5, sport: "Football", skill: "Intermediate", location: "Punggol", date: "9/10/25", time: "5pm", price: 10, players: "18/22", organizer: "James Lim" },
        { id: 6, sport: "Badminton", skill: "Advanced", location: "Tampines", date: "9/10/25", time: "8pm", price: 0, players: "3/4", organizer: "Emma Ng" },
        { id: 7, sport: "Basketball", skill: "Intermediate", location: "Bedok", date: "10/10/25", time: "7pm", price: 5, players: "9/10", organizer: "Tom Chen" },
        { id: 8, sport: "Tennis", skill: "Any Level", location: "Hougang", date: "10/10/25", time: "6pm", price: 0, players: "1/4", organizer: "Lisa Wong" },
        { id: 9, sport: "Football", skill: "Beginner", location: "Sengkang", date: "11/10/25", time: "4pm", price: 12 , players: "15/22", organizer: "Ryan Tan" },
        { id: 10, sport: "Badminton", skill: "Intermediate", location: "Punggol", date: "11/10/25", time: "9pm", price: 8, players: "2/4", organizer: "Amy Lee" },
        { id: 11, sport: "Basketball", skill: "Advanced", location: "Tampines", date: "12/10/25", time: "7pm", price: 0, players: "8/10", organizer: "Kevin Ng" },
        { id: 12, sport: "Tennis", skill: "Intermediate", location: "Bedok", date: "12/10/25", time: "5pm", price: 20, players: "3/4", organizer: "Sophie Tan" },
        { id: 13, sport: "Football", skill: "Any Level", location: "Hougang", date: "13/10/25", time: "6pm", price: 0, players: "20/22", organizer: "Ben Lim" },
        { id: 14, sport: "Basketball", skill: "Advanced", location: "Sengkang", date: "13/10/25", time: "8pm", price: 15, players: "6/10", organizer: "Carol Wong" },
        { id: 15, sport: "Tennis", skill: "Intermediate", location: "Punggol", date: "14/10/25", time: "7pm", price: 10, players: "3/4", organizer: "Daniel Koh" },
        { id: 16, sport: "Badminton", skill: "Any Level", location: "Tampines", date: "14/10/25", time: "9pm", price: 0, players: "1/4", organizer: "Fiona Ng" },
        { id: 17, sport: "Football", skill: "Intermediate", location: "Bedok", date: "15/10/25", time: "5pm", price: 18, players: "14/22", organizer: "Gary Lim" },
        { id: 18, sport: "Basketball", skill: "Beginner", location: "Hougang", date: "15/10/25", time: "6pm", price: 0, players: "5/8", organizer: "Helen Tan" },
        { id: 19, sport: "Tennis", skill: "Advanced", location: "Sengkang", date: "16/10/25", time: "7pm", price: 25, players: "2/4", organizer: "Ian Chen" },
        { id: 20, sport: "Badminton", skill: "Any Level", location: "Punggol", date: "16/10/25", time: "8pm", price: 12, players: "3/4", organizer: "Julia Wong" }
      ],
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

      // Location search
      locationSearch: '',
      showLocationSuggestions: false,
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

      // Current user (replace with real auth)
      currentUser: {
        id: '1',
        name: 'John Doe',
        profilePic: 'https://i.pravatar.cc/150?img=12'
      }
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
        'Bedok': { lat: 1.3236, lng: 103.9273 }
      };

      // Sport icons and colors
      const sportConfig = {
        'Basketball': { icon: '🏀', color: '#f97316' },
        'Tennis': { icon: '🎾', color: '#84cc16' },
        'Football': { icon: '⚽', color: '#10b981' },
        'Badminton': { icon: '🏸', color: '#ec4899' }
      };

      return this.filteredMatches.map(match => {
        const coords = { lat: match.latitude, lng: match.longitude } || { lat: 1.3521, lng: 103.8198 };
        const config = sportConfig[match.sport] || { icon: '🏃', color: '#3b82f6' };

        // Parse players "7/8" to joined and capacity
        // const [joined, capacity] = match.total_player_count.split('/').map(Number);
        const [joined, capacity] = "7/8".split('/').map(Number);

        // Create ISO timestamp from date and time
        const dateStr = match.date; // "2025-10-20" 
        const timeStr = match.time // "14:00:00"
        const [year, month, date] = dateStr.split('-').map(Number);
        // const hour = timeStr.includes('pm') && !timeStr.startsWith('12')
        //   ? parseInt(timeStr) + 12
        //   : parseInt(timeStr);
        // const startTimeISO = new Date(2000 + year, month - 1, day, hour, 0).toISOString();
        const startTimeISO = new Date(`${match.date}T${match.time}`).toISOString();

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
    this.filterMatches()
  },
  methods: {
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
          console.log("hi");
          console.log(data);
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

      if (this.skillLevel) {
        this.filteredMatches = this.filteredMatches.filter(m => m.skill === this.skillLevel)
      }

      if (this.location) {
        this.filteredMatches = this.filteredMatches.filter(m => m.location === this.location)
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
    handleLocationSearch() {
      this.location = '';
      this.filterMatches();
    },

    selectLocationSuggestion(suggestion) {
      this.locationSearch = '';
      this.location = suggestion;
      this.showLocationSuggestions = false;
      this.filterMatches();
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
      this.selectedMatch = match
      this.showMatchDetail = true
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
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
      alert('Successfully joined the match!')
    },
    handleLeaveMatch(matchId) {
      console.log('Left match:', matchId)
      // REAL API: Call leave match endpoint
      // await leaveMatch(matchId)
      
      // Update UI
      alert('You have left the match')
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
        'Bedok': { lat: 1.3236, lng: 103.9273 }
      };
      return locationCoords[location] || { lat: 1.3521, lng: 103.8198 };
    },

    getMatchISO(match) {
      const dateStr = match.date;
      const timeStr = match.time;
      const [year, month, date] = dateStr.split('/').map(Number);
      // const hour = timeStr.includes('pm') && !timeStr.startsWith('12')
      //   ? parseInt(timeStr) + 12
      //   : parseInt(timeStr);
      // return new Date(2000 + year, month - 1, day, hour, 0).toISOString();
      const startTimeISO = new Date(`${dateStr}T${timeStr}`).toISOString();
      return startTimeISO;
    },

    getPlayerPercentage(players) {
      const [joined, capacity] = "7/8".split('/').map(Number);
      return (joined / capacity) * 100;
    },

    getAvailableSpots(players) {
      const [joined, capacity] = "7/8".split('/').map(Number);
      return capacity - joined;
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
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.match-card:hover .sport-icon-badge {
  transform: scale(1.15) rotate(-5deg);
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
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
}

.match-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--dark-bg);
}

.match-price {
  font-size: 1.2rem;
  font-weight: bold;
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
</style>