<template>
  <div class="min-h-screen" style="background-color: #F7F9FC">
    <!-- Logout Button -->
    <div class="container-fluid px-5 pt-3">
      <div class="d-flex justify-content-end">
        <button class="btn-logout-custom" @click="logout">
          Logout
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="container-fluid px-5">
      <div class="row py-5 my-4 hero-section text-center">
        <h1 class="fw-bold mb-3">Find Your Next Game</h1>
        <p class="text-muted mb-4">Join local sports matches, connect with players, and find your perfect match</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn-dark-custom" @click="$router.push('/browser')">Browse Matches</button>
          <button class="btn-outline-custom" @click="$router.push('/map')">View Nearby Matches</button>
        </div>
      </div>

      <!-- Featured Matches -->
      <div class="row mb-5">
        <div class="d-flex justify-content-between mb-4">
          <h3 class="fw-bold">Featured Matches</h3>
          <button class="btn-dark-custom" @click="$router.push('/browser')">View All</button>
        </div>
        
        <div class="row g-3">
          <div v-for="(match, index) in featuredMatches" :key="match.id" class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
            <div class="match-card" @click="openMatchDetail(match)">
              <div class="d-flex justify-content-between mb-2">
                <h5 class="fw-bold m-0">Match {{ match.id }}</h5>
                <span :class="['fw-bold', match.price === 0 ? 'text-success' : 'text-danger']">
                  {{ match.price === 0 ? 'Free' : `$${match.price}` }}
                </span>
              </div>
              <h6 class="fw-bold mb-2">{{ match.sport }}</h6>
              <p class="text-muted mb-2" style="font-size: 0.9rem">
                Skill level: {{ match.skill }}<br />
                Location: {{ match.location }}<br />
                Date: {{ match.date }}
              </p>
              <div class="text-end mb-2">
                <span class="fw-semibold">{{ match.players }} players</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Matches Near You -->
      <div class="row mb-5">
        <h3 class="fw-bold mb-4">Matches Near You</h3>
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="map-placeholder">
              <span class="fs-4 fw-bold text-muted">🗺️ Interactive Map</span>
            </div>
          </div>
          <div class="col-lg-4">
            <h5 class="fw-bold mb-3">Nearby Matches</h5>
            <div>
              <div v-for="(match, index) in nearbyMatches" :key="index" class="list-item-custom">
                <div class="d-flex justify-content-between">
                  <div>
                    <div class="fw-bold">{{ match.sport }} | {{ match.skill }}</div>
                    <div class="small text-muted">{{ match.date }}</div>
                    <div class="small text-muted">{{ match.distance }}</div>
                  </div>
                  <span :class="['fw-semibold', match.isFree ? 'text-success' : 'text-danger']">
                    {{ match.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   <MatchDetailModal
      :isOpen="showMatchDetail"
      :match="selectedMatch"
      :currentUser="currentUser || { 
        id: 'guest', 
        name: 'Guest User', 
        profilePic: userProfilePic 
      }"
      @close="closeMatchDetail"
      @join="handleModalJoin"
      @leave="handleModalLeave"
    />
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'
import MatchDetailModal from '@/components/MatchDetailModal.vue';

export default {
  name: 'Home',
  components: {
    MatchDetailModal
  },
  data() {
    return {
      showMatchDetail: false,
      selectedMatch: null,
      isScrolled: false,
      isLoggedIn: false, // Change to true to simulate logged-in state
      userProfilePic: 'https://i.pravatar.cc/150?img=12',
      currentUser: null,
      featuredMatches: [],
      nearbyMatches: [
        { sport: 'Basketball', skill: 'Beginner', date: '8/10/25 6pm', distance: '2.3km', price: 'Free', isFree: true },
        { sport: 'Tennis', skill: 'Intermediate', date: '8/10/25 7pm', distance: '3.5km', price: '$15', isFree: false },
        { sport: 'Football', skill: 'Advanced', date: '9/10/25 5pm', distance: '1.8km', price: 'Free', isFree: true },
        { sport: 'Badminton', skill: 'Beginner', date: '9/10/25 8pm', distance: '4.2km', price: '$10', isFree: false },
        { sport: 'Basketball', skill: 'Intermediate', date: '10/10/25 6pm', distance: '2.9km', price: 'Free', isFree: true }
      ]
    };
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll);
    const { data: { user } } = await supabase.auth.getUser();
    this.currentUser = user;
    await this.fetchMatchesFromDB();
  },
  
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  
  methods: {
    // ✅ NEW: Fetch matches from Supabase and combine with dummy data
    async fetchMatchesFromDB() {
      try {
        console.log('🎯 Fetching matches from backend...');
        
        const response = await fetch('http://localhost:3000/matches');
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        
        const data = await response.json();
        console.log('✅ Received matches from DB:', data);
        
        if (data.success && data.matches && data.matches.length > 0) {
          // Transform Supabase data to match your UI format
          const dbMatches = data.matches.map(match => ({
            id: match.id,
            sport: match.sport_type,
            skill: match.skill_level,
            location: match.location,
            date: this.formatDateTime(match.date, match.time),
            price: match.total_price,
            players: `${match.current_player_count}/${match.total_player_count}`,
            // Add extra data for modal
            name: match.name,
            description: match.description,
            duration: match.duration,
            host: match.host
          }));
          
          // ✅ Combine DB matches with existing dummy data
          this.featuredMatches = dbMatches;
          
          console.log('🎯 Combined matches:', this.featuredMatches);
        } else {
          console.log('📝 No matches found in DB, keeping dummy data');
          this.featuredMatches = [];
        }
        
      } catch (error) {
        console.error('❌ Error fetching matches:', error);
        console.log('📝 Using dummy data as fallback');
        // Keep existing dummy data if API fails
      }
    },
    
    // ✅ NEW: Format date and time for display
    formatDateTime(date, time) {
      try {
        // Handle date format
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear().toString().slice(-2);
        
        // Handle time format (remove seconds if present)
        const timeStr = time.split(':').slice(0, 2).join(':');
        
        return `${day}/${month}/${year} ${timeStr}`;
      } catch (error) {
        console.error('Error formatting date/time:', error);
        return 'TBD';
      }
    },

    openMatchDetail(match) {
      this.selectedMatch = match;
      this.showMatchDetail = true;
      document.body.style.overflow = 'hidden';
    },

    closeMatchDetail() {
      this.showMatchDetail = false;
      this.selectedMatch = null;
      document.body.style.overflow = 'auto';
    },

    async handleModalJoin(matchId) {
      await this.fetchMatchesFromDB();
      this.closeMatchDetail();
    },

    async handleModalLeave(matchId) {
      await this.fetchMatchesFromDB();
      this.closeMatchDetail();
    },

    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    

    
    async logout() {
      if (confirm('Are you sure you want to logout?')) {
        await supabase.auth.signOut()
        this.isLoggedIn = false;
        this.$router.push('/');
      }
    }
  }
};
</script>

<style>
/* CSS Variables */
:root {
    --primary-color: #FF6B35;
    --back-color: #F7F9FC;
    --secondary-color: #2C3E50;
    --highlight-color: white;
}

body {
    background-color: var(--back-color);
    min-height: 100vh;
}

/* ========== CUSTOM BUTTONS ========== */
.btn-dark-custom {
    background-color: #2C3E50;
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-dark-custom:hover {
    background-color: #1a252f;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(44, 62, 80, 0.3);
}

.btn-outline-custom {
    background-color: transparent;
    color: #2C3E50;
    border: 2px solid #2C3E50;
    padding: 12px 28px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-outline-custom:hover {
    background-color: #2C3E50;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(44, 62, 80, 0.2);
}

/* ========== MATCH CARDS ========== */
.match-card {
    background: white;
    border: 2px solid #e8ecef;
    border-radius: 16px;
    padding: 20px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    animation: cardAppear 0.5s ease forwards;
}

.match-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(255, 107, 53, 0.15);
    border-color: var(--primary-color);
}

.match-card:hover .btn-dark-custom {
    background-color: var(--primary-color);
}

/* ========== HERO SECTION ========== */
.hero-section h1 {
    animation: fadeInDown 1s ease;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ========== FEATURED MATCHES HEADING ========== */
.row.mb-5 > .d-flex > h3.fw-bold {
    position: relative;
    display: inline-block;
    padding-bottom: 8px;
}

.row.mb-5 > .d-flex > h3.fw-bold::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: var(--primary-color);
}

/* ========== LIST ITEMS ========== */
.list-item-custom {
    background: white;
    border: 1px solid #e8ecef;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.list-item-custom:hover {
    border-left-color: var(--primary-color);
    background-color: #F7F9FC;
    transform: translateX(10px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* ========== MAP PLACEHOLDER ========== */
.map-placeholder {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    position: relative;
    overflow: hidden;
}

.map-placeholder::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 70%
    );
    animation: shimmer 3s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

/* ========== ANIMATIONS ========== */
@keyframes cardAppear {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

/* ========== LOGOUT BUTTON ========== */
.btn-logout-custom {
    background-color: #FF6B35;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
}

.btn-logout-custom:hover {
    background-color: #E55A2B;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
}
</style>