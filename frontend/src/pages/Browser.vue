<template>
  <div style="background-color: #f8f9fa; min-height: 100vh;">

    <div class="container mt-4">
      <div class="page-header">
        <h1 class="fw-bold">Browse Matches</h1>
        <p class="results-count">Showing <span>{{ filteredMatches.length }}</span> matches</p>
      </div>

      <div class="row py-4">
        <div class="map-placeholder">
          <span class="fs-4 fw-bold text-muted">🗺️ Interactive Map</span>
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

            <!-- Sport Type Filter -->
            <div class="filter-section">
              <label class="fw-600">Sport Type</label>
              <div class="form-check" v-for="sport in sports" :key="sport">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :value="sport" 
                  :id="sport.toLowerCase()"
                  v-model="selectedSports"
                  @change="filterMatches"
                >
                <label class="form-check-label" :for="sport.toLowerCase()">{{ sport }}</label>
              </div>
            </div>

            <!-- Skill Level Filter -->
            <div class="filter-section">
              <label class="fw-600">Skill Level</label>
              <select class="form-select" v-model="skillLevel" @change="filterMatches">
                <option value="">All Levels</option>
                <option value="Any Level">Any Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <!-- Location Filter -->
            <div class="filter-section">
              <label class="fw-600">Location</label>
              <select class="form-select" v-model="location" @change="filterMatches">
                <option value="">All Locations</option>
                <option value="Hougang">Hougang</option>
                <option value="Sengkang">Sengkang</option>
                <option value="Punggol">Punggol</option>
                <option value="Tampines">Tampines</option>
                <option value="Bedok">Bedok</option>
              </select>
            </div>

            <!-- Price Filter -->
            <div class="filter-section">
              <label class="fw-600">Price</label>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Free" id="free" v-model="priceFilter" @change="filterMatches">
                <label class="form-check-label" for="free">Free</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Paid" id="paid" v-model="priceFilter" @change="filterMatches">
                <label class="form-check-label" for="paid">Paid</label>
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
              @click="openMatchDetail(match)"
            >
              <div class="match-header">
                <div>
                  <h3 class="match-title">Match {{ match.id }}</h3>
                  <p class="sport-type">{{ match.sport }}</p>
                </div>
                <span :class="['match-price', match.price === 0 ? 'price-free' : 'price-paid']">
                  {{ match.price === 0 ? 'Free' : `$${match.price}` }}
                </span>
              </div>
              <div class="match-details">
                <p><strong>Skill level:</strong> {{ match.skill }}</p>
                <p><strong>Location:</strong> {{ match.location }}</p>
                <p><strong>Date and Time:</strong> {{ match.date }} {{ match.time }}</p>
                <span class="player-count">{{ match.players }} players</span>
              </div>
              <button class="btn-view-details" @click.stop="openMatchDetail(match)">
                View Details
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
import MatchDetailModal from '@/components/MatchDetailModal.vue';

export default {
  name: 'Browser',
  components: {
    MatchDetailModal
  },
  data() {
    return {
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
      selectedSports: [],
      skillLevel: '',
      location: '',
      priceFilter: [],
      sortBy: 'date',
      
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
    totalPages() {
      return Math.ceil(this.filteredMatches.length / this.itemsPerPage)
    },
    paginatedMatches() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredMatches.slice(startIndex, endIndex)
    }
  },
  mounted() {
    this.filterMatches()
  },
  methods: {
    filterMatches() {
      this.filteredMatches = [...this.allMatches]

      if (this.selectedSports.length > 0) {
        this.filteredMatches = this.filteredMatches.filter(m => this.selectedSports.includes(m.sport))
      }

      if (this.skillLevel) {
        this.filteredMatches = this.filteredMatches.filter(m => m.skill === this.skillLevel)
      }

      if (this.location) {
        this.filteredMatches = this.filteredMatches.filter(m => m.location === this.location)
      }

      if (this.priceFilter.length > 0) {
        if (this.priceFilter.includes('Free') && !this.priceFilter.includes('Paid')) {
          this.filteredMatches = this.filteredMatches.filter(m => m.price === 0)
        } else if (this.priceFilter.includes('Paid') && !this.priceFilter.includes('Free')) {
          this.filteredMatches = this.filteredMatches.filter(m => m.price > 0)
        }
      }

      if (this.sortBy === 'price-low') {
        this.filteredMatches.sort((a, b) => a.price - b.price)
      } else if (this.sortBy === 'price-high') {
        this.filteredMatches.sort((a, b) => b.price - a.price)
      }

      this.currentPage = 1
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
      this.priceFilter = []
      this.sortBy = 'date'
      this.filterMatches()
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

.sidebar {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 20px;
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
  border: 1px solid #dee2e6;
}

.form-check-input:checked {
  background-color: var(--primary-orange);
  border-color: var(--primary-orange);
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
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 2px solid #e8ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.match-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(255, 107, 53, 0.15);
  border-color: var(--primary-orange);
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

.player-count {
  display: inline-block;
  background: #e9ecef;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 10px;
}

.btn-view-details {
  background-color: var(--dark-bg);
  color: white;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.match-card:hover .btn-view-details {
  background-color: var(--primary-orange);
}

.btn-view-details:hover {
  transform: scale(1.02);
}

.page-header {
  margin: 30px 0;
}

.page-header h1 {
  font-weight: bold;
  color: var(--dark-bg);
}

.results-count {
  color: #6c757d;
  margin-top: 10px;
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