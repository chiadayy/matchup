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

    <!-- Enhanced Hero Section -->
    <div class="hero-section">
      <div class="container-fluid px-5">
        <div class="row py-5 my-4 text-center">
          <div class="hero-content">
            <h1 class="hero-title">Find Your Next Game</h1>
            <p class="hero-subtitle">Join local sports matches, connect with players, and stay active in your community</p>
            <div class="hero-buttons">
              <button class="btn-primary-hero" @click="$router.push('/browser')">
                Browse Matches
              </button>
              <button class="btn-secondary-hero" @click="$router.push('/game-creation')">
                Create Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid px-5">

      <!-- Popular This Week - Auto-sliding Carousel -->
      <div class="row mb-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold">Popular This Week</h3>
          <div class="carousel-controls">
            <button class="carousel-nav-btn" @click="prevSlide" :disabled="isTransitioning">
              ←
            </button>
            <span class="carousel-indicator">{{ currentSlide + 1 }} / {{ carouselSlides.length }}</span>
            <button class="carousel-nav-btn" @click="nextSlide" :disabled="isTransitioning">
              →
            </button>
          </div>
        </div>

        <div class="carousel-container">
          <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div
              v-for="(slide, slideIndex) in carouselSlides"
              :key="slideIndex"
              class="carousel-slide"
            >
              <div class="row g-4">
                <div
                  v-for="match in slide"
                  :key="match.id"
                  class="col-xl-3 col-lg-6 col-md-6 col-sm-12"
                >
                  <div class="athlete-card" @click="openMatchDetail(match)">
                    <div class="athlete-image-container">
                      <img :src="getAthleteImage(match.sport)" :alt="match.sport" class="athlete-image" />
                      <div class="image-overlay"></div>
                      <div class="trending-tag">🔥 HOT</div>
                      <div class="sport-icon-overlay" :style="{ backgroundColor: getSportColor(match.sport) }">
                        {{ getSportIcon(match.sport) }}
                      </div>
                    </div>
                    <div class="athlete-card-content">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="sport-name">{{ match.sport }}</h5>
                        <span :class="['price-pill', match.price === 0 ? 'free' : 'paid']">
                          {{ match.price === 0 ? 'Free' : `$${match.price}` }}
                        </span>
                      </div>
                      <div class="match-quick-info">
                        <div class="info-item">
                          <span class="info-icon">📍</span>
                          <span class="info-text">{{ match.location }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-icon">🕒</span>
                          <span class="info-text">{{ match.date }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-icon">👥</span>
                          <span class="info-text">{{ match.players }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auto-slide progress bar -->
        <div class="auto-slide-progress">
          <div class="progress-bar-fill" :style="{ width: autoSlideProgress + '%' }"></div>
        </div>
      </div>

      <!-- Matches Near You -->
      <div class="row mb-5">
        <h3 class="fw-bold mb-4">Matches Near You</h3>
        <div class="row g-4">
          <div class="col-lg-8">
            <!-- Map Container with Caption -->
            <div class="map-container-shadow">
              <p class="map-caption">
                Explore games near you — hover to preview details or click to join.
              </p>
              <div class="map-wrapper">
                <MapView
                  :games="mapGames"
                  :center="mapCenter"
                  :zoom="12"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="nearby-sidebar">
              <h5 class="fw-bold mb-3 sidebar-title">Nearby Matches</h5>
              <div class="nearby-list">
                <div
                  v-for="(match, index) in nearbyMatches"
                  :key="index"
                  class="nearby-match-item"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <div class="sport-icon-small" :style="{ backgroundColor: getSportColor(match.sport) }">
                    {{ getSportIcon(match.sport) }}
                  </div>
                  <div class="match-info-container">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <div class="sport-title">{{ match.sport }}</div>
                      <span :class="['price-tag', match.isFree ? 'free' : 'paid']">
                        {{ match.price }}
                      </span>
                    </div>
                    <div class="match-details">
                      <div class="detail-row">
                        <span class="detail-icon">🎯</span>
                        <span class="detail-text">{{ match.skill }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-icon">🕒</span>
                        <span class="detail-text">{{ match.date }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-icon">📍</span>
                        <span class="detail-text">{{ match.distance }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="hover-arrow">→</div>
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
import MapView from '@/components/MapView.vue';

export default {
  name: 'Home',
  components: {
    MatchDetailModal,
    MapView
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
      mapCenter: { lat: 1.3521, lng: 103.8198 }, // Singapore center
      currentSlide: 0,
      isTransitioning: false,
      autoSlideInterval: null,
      autoSlideProgress: 0,
      autoSlideTimer: null,
      nearbyMatches: [
        { sport: 'Basketball', skill: 'Beginner', date: '8/10/25 6pm', distance: '2.3km', price: 'Free', isFree: true, location: 'Hougang' },
        { sport: 'Tennis', skill: 'Intermediate', date: '8/10/25 7pm', distance: '3.5km', price: '$15', isFree: false, location: 'Sengkang' },
        { sport: 'Football', skill: 'Advanced', date: '9/10/25 5pm', distance: '1.8km', price: 'Free', isFree: true, location: 'Punggol' },
        { sport: 'Badminton', skill: 'Beginner', date: '9/10/25 8pm', distance: '4.2km', price: '$10', isFree: false, location: 'Tampines' },
        { sport: 'Basketball', skill: 'Intermediate', date: '10/10/25 6pm', distance: '2.9km', price: 'Free', isFree: true, location: 'Bedok' }
      ]
    };
  },
  computed: {
    mapGames() {
      // Location coordinates for Singapore neighborhoods
      const locationCoords = {
        'Hougang': { lat: 1.3712, lng: 103.8863 },
        'Sengkang': { lat: 1.3917, lng: 103.8951 },
        'Punggol': { lat: 1.4043, lng: 103.9021 },
        'Tampines': { lat: 1.3529, lng: 103.9446 },
        'Bedok': { lat: 1.3236, lng: 103.9273 }
      };

      // Sport configuration
      const sportConfig = {
        'Basketball': { icon: '🏀', color: '#f97316' },
        'Tennis': { icon: '🎾', color: '#84cc16' },
        'Football': { icon: '⚽', color: '#10b981' },
        'Badminton': { icon: '🏸', color: '#ec4899' }
      };

      return this.nearbyMatches.map((match, index) => {
        const coords = locationCoords[match.location] || { lat: 1.3521, lng: 103.8198 };
        const sport = sportConfig[match.sport] || { icon: '🏃', color: '#3b82f6' };

        return {
          id: `nearby-${index}`,
          title: match.sport,
          venue: match.location,
          startTimeISO: this.parseDateTime(match.date),
          lat: coords.lat,
          lng: coords.lng,
          icon: sport.icon,
          color: sport.color,
          skillLevel: match.skill,
          price: match.isFree ? 0 : parseFloat(match.price.replace('$', '')),
          joined: Math.floor(Math.random() * 8) + 2,
          capacity: 10
        };
      });
    },
    carouselSlides() {
      // Split featuredMatches into slides of 4 matches each
      const slides = [];
      const matchesPerSlide = 4;

      if (this.featuredMatches.length === 0) {
        // Return empty array if no matches
        return [];
      }

      for (let i = 0; i < this.featuredMatches.length; i += matchesPerSlide) {
        slides.push(this.featuredMatches.slice(i, i + matchesPerSlide));
      }

      return slides;
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll);
    const { data: { user } } = await supabase.auth.getUser();
    this.currentUser = user;
    await this.fetchMatchesFromDB();
    this.startAutoSlide();
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.stopAutoSlide();
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

          // ✅ Use DB matches
          this.featuredMatches = dbMatches;

          console.log('🎯 Combined matches:', this.featuredMatches);
        } else {
          console.log('📝 No matches found in DB, using dummy data');
          this.loadDummyMatches();
        }

      } catch (error) {
        console.error('❌ Error fetching matches:', error);
        console.log('📝 Using dummy data as fallback');
        this.loadDummyMatches();
      }
    },

    loadDummyMatches() {
      // Dummy data for carousel when no DB matches are available
      this.featuredMatches = [
        { id: 1, sport: 'Basketball', skill: 'Intermediate', location: 'Hougang Sports Hall', date: '22/10/25 6pm', price: 0, players: '8/10' },
        { id: 2, sport: 'Tennis', skill: 'Advanced', location: 'Sengkang Tennis Court', date: '22/10/25 7pm', price: 15, players: '3/4' },
        { id: 3, sport: 'Football', skill: 'Beginner', location: 'Punggol Stadium', date: '23/10/25 5pm', price: 0, players: '18/22' },
        { id: 4, sport: 'Badminton', skill: 'Intermediate', location: 'Tampines Hub', date: '23/10/25 8pm', price: 10, players: '6/8' },
        { id: 5, sport: 'Basketball', skill: 'Advanced', location: 'Bedok Sports Complex', date: '24/10/25 6pm', price: 12, players: '9/10' },
        { id: 6, sport: 'Tennis', skill: 'Beginner', location: 'Hougang Country Club', date: '24/10/25 3pm', price: 0, players: '2/4' },
        { id: 7, sport: 'Football', skill: 'Intermediate', location: 'Sengkang Field', date: '25/10/25 7pm', price: 8, players: '14/22' },
        { id: 8, sport: 'Badminton', skill: 'Advanced', location: 'Punggol Sports Center', date: '25/10/25 9am', price: 15, players: '4/8' }
      ];
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

    // Parse date string for ISO format
    parseDateTime(dateStr) {
      try {
        // Example: "8/10/25 6pm" -> ISO string
        const parts = dateStr.match(/(\d+)\/(\d+)\/(\d+)\s+(\d+)(am|pm)/i);
        if (parts) {
          const day = parseInt(parts[1]);
          const month = parseInt(parts[2]) - 1; // 0-indexed
          const year = 2000 + parseInt(parts[3]);
          let hour = parseInt(parts[4]);
          const isPM = parts[5].toLowerCase() === 'pm';

          if (isPM && hour !== 12) hour += 12;
          if (!isPM && hour === 12) hour = 0;

          return new Date(year, month, day, hour, 0, 0).toISOString();
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
      return new Date().toISOString();
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

    // Carousel methods
    nextSlide() {
      if (this.isTransitioning || this.carouselSlides.length === 0) return;

      this.isTransitioning = true;
      this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;

      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);

      this.resetAutoSlide();
    },

    prevSlide() {
      if (this.isTransitioning || this.carouselSlides.length === 0) return;

      this.isTransitioning = true;
      this.currentSlide = this.currentSlide === 0
        ? this.carouselSlides.length - 1
        : this.currentSlide - 1;

      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);

      this.resetAutoSlide();
    },

    startAutoSlide() {
      // Auto-slide every 4 seconds
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 4000);

      // Progress bar animation (updates every 50ms)
      this.autoSlideProgress = 0;
      this.autoSlideTimer = setInterval(() => {
        this.autoSlideProgress += (100 / 4000) * 50; // 50ms interval
        if (this.autoSlideProgress >= 100) {
          this.autoSlideProgress = 0;
        }
      }, 50);
    },

    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = null;
      }
      if (this.autoSlideTimer) {
        clearInterval(this.autoSlideTimer);
        this.autoSlideTimer = null;
      }
    },

    resetAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideProgress = 0;
      this.startAutoSlide();
    },

    getSportIcon(sport) {
      const icons = {
        'Basketball': '🏀',
        'Tennis': '🎾',
        'Football': '⚽',
        'Badminton': '🏸'
      };
      return icons[sport] || '🏃';
    },

    getSportColor(sport) {
      const colors = {
        'Basketball': '#f97316',
        'Tennis': '#84cc16',
        'Football': '#10b981',
        'Badminton': '#ec4899'
      };
      return colors[sport] || '#3b82f6';
    },

    getAthleteImage(sport) {
      // Sport-specific athlete images from Unsplash
      const images = {
        'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
        'Tennis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop',
        'Football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
        'Badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop'
      };
      return images[sport] || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop';
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

/* ========== ENHANCED HERO SECTION ========== */
.hero-section {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%);
    border-radius: 24px;
    margin: 0 40px 40px 40px;
    padding: 60px 40px;
    position: relative;
    overflow: hidden;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: #1d1d1f;
    margin-bottom: 20px;
    animation: fadeInDown 0.8s ease;
    letter-spacing: -0.02em;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: #6c757d;
    margin-bottom: 35px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    animation: fadeInUp 0.8s ease 0.2s both;
    line-height: 1.6;
}

.hero-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    animation: fadeInUp 0.8s ease 0.4s both;
}

.btn-primary-hero {
    background: linear-gradient(135deg, #FF6B35 0%, #f97316 100%);
    color: white;
    border: none;
    padding: 16px 36px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.05rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.25);
}

.btn-primary-hero:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.35);
}

.btn-secondary-hero {
    background: white;
    color: #1d1d1f;
    border: 2px solid #e8e8ed;
    padding: 16px 36px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.05rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.btn-secondary-hero:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #10b981;
    color: #10b981;
}

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

/* ========== CAROUSEL STYLES ========== */
.carousel-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.carousel-nav-btn {
    background: white;
    border: 2px solid #e8e8ed;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    color: #1d1d1f;
}

.carousel-nav-btn:hover:not(:disabled) {
    background: #f7f9fc;
    border-color: #10b981;
    color: #10b981;
    transform: scale(1.1);
}

.carousel-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.carousel-indicator {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 600;
    min-width: 50px;
    text-align: center;
}

.carousel-container {
    overflow: hidden;
    position: relative;
    width: 100%;
}

.carousel-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
    min-width: 100%;
    flex-shrink: 0;
}

/* ========== ATHLETE CARDS ========== */
.athlete-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.athlete-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.athlete-image-container {
    position: relative;
    height: 280px;
    overflow: hidden;
}

.athlete-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.athlete-card:hover .athlete-image {
    transform: scale(1.1);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%);
    transition: opacity 0.3s ease;
}

.athlete-card:hover .image-overlay {
    opacity: 0.7;
}

.trending-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 2;
    animation: pulseTrending 2s ease-in-out infinite;
}

@keyframes pulseTrending {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.sport-icon-overlay {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
    z-index: 2;
    transition: transform 0.3s ease;
}

.athlete-card:hover .sport-icon-overlay {
    transform: rotate(15deg) scale(1.1);
}

.athlete-card-content {
    padding: 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.sport-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1d1d1f;
    margin: 0;
}

.price-pill {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
}

.price-pill.free {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
}

.price-pill.paid {
    background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
    color: #9a3412;
}

.match-quick-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-icon {
    font-size: 1rem;
    width: 20px;
}

.info-text {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
}

.auto-slide-progress {
    width: 100%;
    height: 4px;
    background: #e8e8ed;
    border-radius: 2px;
    margin-top: 20px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF6B35 0%, #10b981 100%);
    transition: width 50ms linear;
    border-radius: 2px;
}

/* ========== ENHANCED NEARBY SIDEBAR ========== */
.nearby-sidebar {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    position: sticky;
    top: 20px;
    animation: fadeInUp 0.8s ease 0.8s both;
}

.sidebar-title {
    position: relative;
    padding-bottom: 12px;
}

.sidebar-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #FF6B35 0%, #10b981 100%);
    border-radius: 2px;
}

.nearby-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 500px;
    overflow-y: auto;
    padding-right: 8px;
}

.nearby-list::-webkit-scrollbar {
    width: 6px;
}

.nearby-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.nearby-list::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #FF6B35 0%, #10b981 100%);
    border-radius: 3px;
}

.nearby-match-item {
    background: #f9fafb;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    animation: slideInRight 0.5s ease both;
    border: 2px solid transparent;
}

.nearby-match-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background: linear-gradient(90deg, rgba(255, 107, 53, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
    transition: width 0.4s ease;
    z-index: 0;
}

.nearby-match-item:hover::before {
    width: 100%;
}

.nearby-match-item:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    border-color: #10b981;
    background: white;
}

.sport-icon-small {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    transition: transform 0.3s ease;
    z-index: 1;
}

.nearby-match-item:hover .sport-icon-small {
    transform: rotate(10deg) scale(1.1);
}

.match-info-container {
    flex: 1;
    z-index: 1;
}

.sport-title {
    font-weight: 700;
    font-size: 1rem;
    color: #1d1d1f;
    margin-bottom: 4px;
}

.price-tag {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
}

.price-tag.free {
    background: #d1fae5;
    color: #065f46;
}

.price-tag.paid {
    background: #fed7aa;
    color: #9a3412;
}

.match-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
}

.detail-icon {
    font-size: 0.9rem;
}

.detail-text {
    color: #6c757d;
    font-weight: 500;
}

.hover-arrow {
    font-size: 1.2rem;
    color: #10b981;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    z-index: 1;
}

.nearby-match-item:hover .hover-arrow {
    opacity: 1;
    transform: translateX(0);
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* ========== MAP CONTAINER WITH SHADOW ========== */
.map-container-shadow {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    animation: fadeInUp 0.8s ease 0.6s both;
}

.map-caption {
    font-size: 0.95rem;
    color: #6c757d;
    margin-bottom: 16px;
    text-align: center;
    font-weight: 500;
    line-height: 1.5;
}

.map-wrapper {
    border-radius: 12px;
    overflow: hidden;
    height: 450px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
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