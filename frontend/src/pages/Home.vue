<template>
  <div class="min-h-screen" style="background-color: #FFFFFF">
    <!-- Logout Button -->
    <!-- <div class="container-fluid px-5 pt-3">
      <div class="d-flex justify-content-end">
        <button class="btn-logout-custom" @click="logout">
          Logout
        </button>
      </div>
    </div> -->

    <!-- Dynamic Welcome Back Section -->
    <div class="welcome-section">
      <div class="container-fluid px-5">
        <div class="row py-4">
          <div class="col-lg-8">
            <div class="welcome-content">
              <div class="welcome-greeting">
                <h1 class="welcome-title">{{ greetingMessage }} 👋</h1>
                <p class="welcome-subtitle">{{ personalizedMessage }}</p>
              </div>
              <div class="welcome-stats">
                <div class="stat-card">
                  <div class="stat-icon">🎾</div>
                  <div class="stat-info">
                    <div class="stat-value">{{ userStats.gamesPlayed }}</div>
                    <div class="stat-label">Games Played</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">⭐</div>
                  <div class="stat-info">
                    <div class="stat-value">{{ userStats.reliability }}%</div>
                    <div class="stat-label">Reliability</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">🏆</div>
                  <div class="stat-info">
                    <div class="stat-value">{{ userStats.badges }}</div>
                    <div class="stat-label">Badges Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="quick-actions-card">
              <h5 class="quick-actions-title">Quick Actions</h5>
              <button class="btn-quick-action primary" @click="$router.push('/browser')">
                <span class="action-icon">🔍</span>
                <span class="action-text">Browse Matches</span>
              </button>
              <button class="btn-quick-action secondary" @click="$router.push('/create-game')">
                <span class="action-icon">➕</span>
                <span class="action-text">Create Game</span>
              </button>
              <div class="weather-widget">
                <div class="weather-info">
                  <span class="weather-icon">{{ weatherData.icon }}</span>
                  <div>
                    <div class="weather-temp">{{ weatherData.temp }}°C</div>
                    <div class="weather-desc">{{ weatherData.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid px-5">

      <!-- Featured Players of the Week -->
      <div class="row mb-5">
        <div class="col-12">
          <h3 class="fw-bold mb-4">⭐ Stars of the Week</h3>
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="featured-card player-of-week">
                <div class="featured-badge">🏅 PLAYER OF THE WEEK</div>
                <div class="featured-content">
                  <div class="featured-avatar">
                    <img src="https://i.pravatar.cc/150?img=33" alt="Jason Lee" />
                    <div class="featured-ring"></div>
                  </div>
                  <div class="featured-info">
                    <h4 class="featured-name">Jason Lee</h4>
                    <p class="featured-stat">Joined <strong>5 games</strong> this week</p>
                    <div class="featured-sports">
                      <span class="sport-tag">🏀 Basketball</span>
                      <span class="sport-tag">🎾 Tennis</span>
                      <span class="sport-tag">⚽ Football</span>
                    </div>
                  </div>
                </div>
                <div class="featured-quote">
                  "Always ready to play! Great sportsmanship and team player."
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="featured-card organiser-of-week">
                <div class="featured-badge organiser">🎯 TOP ORGANISER</div>
                <div class="featured-content">
                  <div class="featured-avatar">
                    <img src="https://i.pravatar.cc/150?img=20" alt="Rachel Wong" />
                    <div class="featured-ring organiser"></div>
                  </div>
                  <div class="featured-info">
                    <h4 class="featured-name">Rachel Wong</h4>
                    <p class="featured-stat">Hosted <strong>12 badminton sessions</strong></p>
                    <div class="featured-sports">
                      <span class="sport-tag organiser">🏸 Badminton Expert</span>
                      <span class="sport-tag organiser">⭐ 98% Rating</span>
                    </div>
                  </div>
                </div>
                <div class="featured-quote">
                  "Bringing the community together, one match at a time!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Matches Carousel -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 class="fw-bold mb-1">🎯 Featured Matches</h3>
              <p class="text-muted mb-0" style="font-size: 0.9rem;">Upcoming and curated matches for you to join</p>
            </div>
            <div class="carousel-controls" v-if="!isLoadingMatches && featuredMatchesSlides.length > 0">
              <button class="carousel-nav-btn" @click="prevSlide" :disabled="isTransitioning">
                ←
              </button>
              <span class="carousel-indicator">{{ currentSlide + 1 }} / {{ featuredMatchesSlides.length }}</span>
              <button class="carousel-nav-btn" @click="nextSlide" :disabled="isTransitioning">
                →
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingMatches" class="loading-matches">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading matches...</span>
            </div>
            <p class="mt-3 text-muted">Loading featured matches...</p>
          </div>

          <!-- No Matches State -->
          <div v-else-if="featuredMatches.length === 0" class="no-matches">
            <p class="text-muted">No matches available at the moment. Check back soon!</p>
          </div>

          <!-- Carousel with Matches -->
          <div v-else class="carousel-container">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div
                v-for="(slide, slideIndex) in featuredMatchesSlides"
                :key="slideIndex"
                class="carousel-slide"
              >
                <div class="row g-4">
                  <div
                    v-for="match in slide"
                    :key="match.id"
                    class="col-xl-3 col-lg-6 col-md-6 col-sm-12"
                  >
                    <div class="featured-match-card" @click="openMatchDetail(match)">
                      <!-- Keep existing card content -->
                      <div class="featured-match-header">
                        <img :src="match.image" :alt="match.sport" class="featured-match-image" />
                        <div class="featured-match-overlay" :style="{ background: `linear-gradient(180deg, transparent 0%, ${match.color}99 100%)` }"></div>
                        <div class="featured-match-sport-icon">{{ match.icon }}</div>
                        <div class="featured-match-badge">{{ match.badge }}</div>
                      </div>
                      <div class="featured-match-content">
                        <div class="featured-match-sport" :style="{ color: match.color }">
                          {{ match.sport }}
                        </div>
                        <h5 class="featured-match-title">{{ match.title }}</h5>
                        <div class="featured-match-details">
                          <div class="match-detail-item">
                            <span class="detail-icon">👤</span>
                            <span class="detail-text">{{ match.host }}</span>
                          </div>
                          <div class="match-detail-item">
                            <span class="detail-icon">📍</span>
                            <span class="detail-text">{{ match.venue }}</span>
                          </div>
                          <div class="match-detail-item">
                            <span class="detail-icon">🕒</span>
                            <span class="detail-text">{{ match.time }}</span>
                          </div>
                          <div class="match-detail-item">
                            <span class="detail-icon">🎯</span>
                            <span class="detail-text">{{ match.skillLevel }}</span>
                          </div>
                        </div>
                        <div class="featured-match-footer">
                          <div class="match-capacity">
                            <span class="capacity-icon">👥</span>
                            <span class="capacity-text">{{ match.joined }}/{{ match.capacity }}</span>
                          </div>
                          <div class="match-price" :class="{ free: match.price === 0 }">
                            {{ match.price === 0 ? 'Free' : `$${match.price}` }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Matches Near You -->
      <div class="row mb-5">
        <div class="col-12">
          <h3 class="fw-bold mb-4">Matches Near You</h3>
        </div>
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
    </div> <!-- Close container-fluid -->

    <MatchDetailModal
      v-if="showMatchDetail && selectedMatch"
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
  </div> <!-- Close min-h-screen -->
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
    isLoggedIn: false,
    userProfilePic: 'https://i.pravatar.cc/150?img=12',
    currentUser: null,
    profileData: null,
    userStats: {
      gamesPlayed: 23,
      reliability: 95,
      badges: 5,
      favoriteSport: 'Tennis'
    },
    weatherData: {
      temp: 28,
      description: 'Perfect for sports',
      icon: '☀️'
    },
    mapCenter: { lat: 1.3521, lng: 103.8198 },
    currentSlide: 0,
    isTransitioning: false,
    autoSlideInterval: null,
    autoSlideProgress: 0,
    autoSlideTimer: null,
    gameHighlights: [ /* keep your existing gameHighlights */ ],
    nearbyMatches: [ /* keep your existing nearbyMatches */ ],
    
    // REPLACE THIS - start with empty array, will be populated from DB
    featuredMatches: [],
    isLoadingMatches: true  // Add loading state
  };
},
  computed: {
    greetingMessage() {
      if (!this.profileData) return 'Welcome!';

      const hour = new Date().getHours();
      const isWeekend = [0, 6].includes(new Date().getDay());
      console.log("hi");

      if (isWeekend) {
        return `Happy ${hour < 12 ? 'Weekend Morning' : 'Weekend'}, ${this.profileData.name}`;
      }

      if (hour < 12) return `Good Morning, ${this.profileData.name}`;
      if (hour < 18) return `Good Afternoon, ${this.profileData.name}`;
      return `Good Evening, ${this.profileData.name}`;
    },

    personalizedMessage() {
      const hour = new Date().getHours();
      const sport = this.userStats.favoriteSport.toLowerCase();

      const messages = [
        `Ready for your next ${sport} rally?`,
        `Perfect ${this.weatherData.description.toLowerCase()} for ${sport} tonight!`,
        `Your favorite ${sport} courts are calling`,
        `${this.userStats.gamesPlayed} games down — ready for another?`,
        `Let's keep that ${this.userStats.reliability}% reliability streak going!`
      ];

      // Pick message based on time of day
      const index = hour % messages.length;
      return messages[index];
    },

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

      const games = this.nearbyMatches.map((match, index) => {
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

      console.log('🗺️ Map Games:', games);
      return games;
    },
    tipsCarouselSlides() {
      // Split gameHighlights into slides of 4 highlights each
      const slides = [];
      const highlightsPerSlide = 4;

      for (let i = 0; i < this.gameHighlights.length; i += highlightsPerSlide) {
        slides.push(this.gameHighlights.slice(i, i + highlightsPerSlide));
      }

      return slides;
    },
    featuredMatchesSlides() {
      // Split featured matches into slides of 4 matches each
      const slides = [];
      const matchesPerSlide = 4;

      for (let i = 0; i < this.featuredMatches.length; i += matchesPerSlide) {
        slides.push(this.featuredMatches.slice(i, i + matchesPerSlide));
      }

      return slides;
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll);

    // this.startAutoSlide();

    await this.fetchMatchesFromDB();
    await this.loadCurrentUser()
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.stopAutoSlide();
  },
  
  methods: {
  openMatchDetail(match) {
    console.log('🔍 Opening match detail:', match);
    console.log('🔍 Match data check:', {
      id: match.id,
      sport: match.sport,
      hasAllProps: !!(match.sport_type && match.location)
    });
    
    this.selectedMatch = match;
    this.showMatchDetail = true;
    document.body.style.overflow = 'hidden';
    
    console.log('🔍 Modal should be visible now:', this.showMatchDetail);
  },

    async loadCurrentUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) return console.error(error);

        if (data.user) {
          this.currentUser = data.user;

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) console.error(profileError);
          else this.profileData = profileData;
        }
      } catch (err) {
        console.error('Unexpected error loading user:', err);
      }
    },
   async fetchMatchesFromDB() {
  this.isLoadingMatches = true;
  
  try {
    console.log('Fetching matches from backend...');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/matches`);

    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }

    const data = await response.json();
    console.log('Received matches from DB:', data);

    if (data.success && data.matches && data.matches.length > 0) {
      const dbMatches = data.matches.map(match => {
        const sportConfig = this.getSportConfigForMatch(match.sport_type);
        const badge = this.getMatchBadge(match);

        const totalPlayers = parseInt(match.total_player_count) || 10;
        const currentPlayers = parseInt(match.current_player_count) || 0;
        const price = parseFloat(match.total_price) || 0;

        return {
          id: match.id,
          sport: match.sport_type,
          sport_type: match.sport_type,
          icon: sportConfig.icon,
          color: sportConfig.color,
          badge: badge,
          image: sportConfig.image,
          title: match.name || `${match.sport_type} Match`,
          name: match.name || `${match.sport_type} Match`,
          host: match.host || 'Anonymous Host',
          venue: match.location,
          location: match.location,
          time: this.formatDateTimeForDisplay(match.date, match.time),
          date: match.date,
          skillLevel: match.skill_level,
          skill_level: match.skill_level,
          joined: currentPlayers,
          capacity: totalPlayers,
          total_player_count: totalPlayers,
          current_player_count: currentPlayers,
          price: price,
          total_price: price,
          description: match.description || 'Join us for a great game!',
          duration: match.duration || '2 hours',
          players: `${currentPlayers}/${totalPlayers}`
        };
      });

      this.featuredMatches = dbMatches; // Take ALL matches, not just first 8
      console.log('✅ Featured matches loaded:', this.featuredMatches.length, 'matches');
    } else {
      console.log('No matches found in DB');
      this.featuredMatches = [];
    }
  } catch (error) {
    console.error('❌ Error fetching matches:', error);
    this.featuredMatches = [];
  } finally {
    this.isLoadingMatches = false;
  }
},
    // Format date and time for display
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
      if (this.isTransitioning || this.featuredMatchesSlides.length === 0) return;

      this.isTransitioning = true;
      this.currentSlide = (this.currentSlide + 1) % this.featuredMatchesSlides.length;

      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);

      // this.resetAutoSlide();
    },

    prevSlide() {
      if (this.isTransitioning || this.featuredMatchesSlides.length === 0) return;

      this.isTransitioning = true;
      this.currentSlide = this.currentSlide === 0
        ? this.featuredMatchesSlides.length - 1
        : this.currentSlide - 1;

      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);

      // this.resetAutoSlide();
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

    getSportConfigForMatch(sportType) {
      const sportConfigs = {
        'Basketball': {
          icon: '🏀',
          color: '#f97316',
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop'
        },
        'Badminton': {
          icon: '🏸',
          color: '#ec4899',
          image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop'
        },
        'Football': {
          icon: '⚽',
          color: '#10b981',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop'
        },
        'Soccer': {
          icon: '⚽',
          color: '#10b981',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop'
        },
        'Futsal': {
          icon: '⚽',
          color: '#10b981',
          image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop'
        },
        'Tennis': {
          icon: '🎾',
          color: '#84cc16',
          image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop'
        },
        'Volleyball': {
          icon: '🏐',
          color: '#06b6d4',
          image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop'
        }
      };

      return sportConfigs[sportType] || {
        icon: '🏃',
        color: '#3b82f6',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
      };
    },

    getMatchBadge(match) {
      const capacity = match.total_player_count;
      const joined = match.current_player_count;
      const percentage = (joined / capacity) * 100;

      // Almost full if 80% or more capacity
      if (percentage >= 80) {
        return 'Almost Full';
      }

      // Check if match is starting soon (within next 24 hours)
      const matchDateTime = new Date(`${match.date}T${match.time}`);
      const now = new Date();
      const hoursUntilMatch = (matchDateTime - now) / (1000 * 60 * 60);

      if (hoursUntilMatch > 0 && hoursUntilMatch <= 24) {
        return 'Starting Soon';
      }

      // Check if it's a new match (created recently)
      const createdAt = new Date(match.created_at);
      const hoursSinceCreated = (now - createdAt) / (1000 * 60 * 60);

      if (hoursSinceCreated <= 48) {
        return 'New';
      }

      // Check if popular (more than 60% capacity)
      if (percentage >= 60) {
        return 'Popular';
      }

      // Check if it's a weekend match
      const matchDay = matchDateTime.getDay();
      if (matchDay === 0 || matchDay === 6) {
        return 'Weekend';
      }

      return 'Featured';
    },

    formatDateTimeForDisplay(date, time) {
      try {
        const matchDate = new Date(date);
        const now = new Date();

        // Reset time components for date comparison
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const matchDateOnly = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());

        // Format time
        const timeParts = time.split(':');
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;

        // Check if today, tomorrow, or show day name
        if (matchDateOnly.getTime() === today.getTime()) {
          return `Today, ${formattedTime}`;
        } else if (matchDateOnly.getTime() === tomorrow.getTime()) {
          return `Tomorrow, ${formattedTime}`;
        } else {
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dayName = daysOfWeek[matchDate.getDay()];
          return `${dayName}, ${formattedTime}`;
        }
      } catch (error) {
        console.error('Error formatting date/time:', error);
        return 'TBD';
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

/* ========== DYNAMIC WELCOME SECTION ========== */
.welcome-section {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
    margin: 0 40px 40px 40px;
    border-radius: 24px;
    padding: 32px 0;
}

.welcome-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    height: 100%;
}

.welcome-greeting {
    margin-bottom: 24px;
}

.welcome-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1d1d1f;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
}

.welcome-subtitle {
    font-size: 1.1rem;
    color: #6c757d;
    margin: 0;
}

.welcome-stats {
    display: flex;
    gap: 16px;
}

.stat-card {
    flex: 1;
    background: #f9fafb;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;
}

.stat-card:hover {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
    transform: translateY(-2px);
}

.stat-icon {
    font-size: 2rem;
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1d1d1f;
    line-height: 1;
}

.stat-label {
    font-size: 0.8rem;
    color: #9ca3af;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
}

.quick-actions-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.quick-actions-title {
    font-weight: 700;
    margin-bottom: 16px;
    color: #1d1d1f;
}

.btn-quick-action {
    width: 100%;
    padding: 14px 20px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.btn-quick-action.primary {
    background: linear-gradient(135deg, #FF6B35 0%, #f97316 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
}

.btn-quick-action.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
}

.btn-quick-action.secondary {
    background: white;
    color: #1d1d1f;
    border: 2px solid #e8e8ed;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.btn-quick-action.secondary:hover {
    transform: translateY(-2px);
    border-color: #10b981;
    color: #10b981;
}

.action-icon {
    font-size: 1.2rem;
}

.action-text {
    flex: 1;
    text-align: left;
}

.weather-widget {
    margin-top: auto;
    padding-top: 16px;
    border-top: 2px solid #f3f4f6;
}

.weather-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.weather-icon {
    font-size: 2.5rem;
}

.weather-temp {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1d1d1f;
}

.weather-desc {
    font-size: 0.85rem;
    color: #6c757d;
}

/* ========== ENHANCED HERO SECTION (OLD) ========== */
.hero-section-old {
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

/* ========== COMMUNITY ACTIVITY FEED ========== */
/* Activity Feed Container */
.activity-feed-container {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    animation: fadeInUp 0.8s ease 1s both;
}

.activity-feed-grouped {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

/* Time Category Headers */
.activity-time-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.time-category-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
}

.time-category-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.time-category-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #e5e7eb 0%, transparent 100%);
}

/* Activity Cards Container */
.activity-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
}

/* Activity Card - Social Post Style */
.activity-card {
    position: relative;
    background: white;
    border-radius: 12px;
    padding: 16px;
    border-left: 4px solid;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    animation: slideInUp 0.5s ease both;
}

.activity-card:hover {
    transform: scale(1.02) translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* New Activity Highlight Animation */
.activity-card-new {
    animation: slideInFromTop 0.6s ease both, highlightFade 3s ease 0.6s both;
}

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

@keyframes highlightFade {
    0% {
        background: #fffbe6;
    }
    100% {
        background: white;
    }
}

/* Card Header with Avatar */
.activity-card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
}

.activity-user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: transform 0.2s ease;
}

.activity-card:hover .activity-user-avatar {
    transform: scale(1.1);
}

.avatar-initials {
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
}

.activity-card-info {
    flex: 1;
    min-width: 0;
}

.activity-card-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #1d1d1f;
    margin-bottom: 6px;
}

.activity-user-name {
    font-weight: 700;
    color: #1d1d1f;
}

.activity-action {
    color: #4b5563;
}

.activity-card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.activity-time {
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 500;
}

.activity-badge-pill {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
}

/* Thumbnail Preview */
.activity-thumbnail {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Card Footer - Social Proof Metrics */
.activity-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
    margin-top: 12px;
}

.activity-reactions {
    display: flex;
    align-items: center;
    gap: 4px;
}

.reaction-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: #f9fafb;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8rem;
}

.reaction-btn:hover {
    background: #f3f4f6;
    transform: scale(1.05);
}

.reaction-icon {
    font-size: 0.95rem;
    line-height: 1;
}

.reaction-count {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
}

.activity-sport-icon {
    font-size: 0.85rem;
    font-weight: 800;
    padding: 6px 10px;
    background: rgba(0,0,0,0.03);
    border-radius: 8px;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ========== FEATURED PLAYERS/ORGANISERS ========== */
.featured-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    border: 2px solid transparent;
}

.featured-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
    transition: height 0.3s ease;
}

.featured-card.organiser-of-week::before {
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.featured-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

.featured-badge {
    display: inline-block;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
}

.featured-badge.organiser {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
}

.featured-content {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 16px;
}

.featured-avatar {
    position: relative;
}

.featured-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 2;
}

.featured-ring {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 3px solid #f59e0b;
    animation: pulse-ring 2s ease-in-out infinite;
}

.featured-ring.organiser {
    border-color: #10b981;
}

@keyframes pulse-ring {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
}

.featured-info {
    flex: 1;
}

.featured-name {
    font-size: 1.3rem;
    font-weight: 800;
    color: #1d1d1f;
    margin: 0 0 6px 0;
}

.featured-stat {
    font-size: 0.95rem;
    color: #6c757d;
    margin: 0 0 10px 0;
}

.featured-stat strong {
    color: #1d1d1f;
    font-weight: 700;
}

.featured-sports {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.sport-tag {
    background: #f3f4f6;
    color: #4b5563;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.sport-tag.organiser {
    background: #ecfdf5;
    color: #059669;
}

.featured-quote {
    font-style: italic;
    color: #6c757d;
    font-size: 0.9rem;
    padding: 12px 16px;
    background: #f9fafb;
    border-radius: 8px;
    border-left: 3px solid #f59e0b;
}

.organiser-of-week .featured-quote {
    border-left-color: #10b981;
}

/* ========== FEATURED MATCH CARDS ========== */
.featured-match-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 2px solid transparent;
}

.featured-match-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    border-color: currentColor;
}

.featured-match-header {
    position: relative;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.featured-match-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.featured-match-card:hover .featured-match-image {
    transform: scale(1.1);
}

.featured-match-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.featured-match-sport-icon {
    font-size: 3rem;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    position: relative;
    z-index: 2;
}

.featured-match-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.95);
    color: #1d1d1f;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 2;
}

.featured-match-content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.featured-match-sport {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.featured-match-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1d1d1f;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.featured-match-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    flex: 1;
}

.match-detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
}

.match-detail-item .detail-icon {
    font-size: 0.9rem;
    width: 20px;
    text-align: center;
}

.match-detail-item .detail-text {
    color: #6c757d;
    font-weight: 500;
}

.featured-match-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
}

.match-capacity {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: #1d1d1f;
}

.capacity-icon {
    font-size: 1rem;
}

.capacity-text {
    font-size: 0.9rem;
}

.match-price {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    background: #fed7aa;
    color: #9a3412;
}

.match-price.free {
    background: #d1fae5;
    color: #065f46;
}

/* ========== TIPS CARDS (NOW GAME HIGHLIGHTS) ========== */
.tips-card {
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

.tips-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.tips-image-container {
    position: relative;
    height: 240px;
    overflow: hidden;
}

.tips-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.tips-card:hover .tips-image {
    transform: scale(1.1);
}

.tips-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
}

.tips-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    z-index: 2;
    transition: transform 0.3s ease;
}

.tips-card:hover .tips-icon {
    transform: rotate(15deg) scale(1.1);
}

.tips-card-content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.tips-category {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.tips-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1d1d1f;
    margin: 0 0 10px 0;
    line-height: 1.4;
}

.tips-description {
    font-size: 0.9rem;
    color: #6c757d;
    line-height: 1.6;
    margin-bottom: 16px;
    flex: 1;
}

.btn-read-more {
    background: transparent;
    border: 2px solid;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: flex-start;
}

.btn-read-more:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.highlight-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.meta-icon {
    font-size: 0.9rem;
}

.meta-text {
    font-size: 0.85rem;
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
/* ========== MODAL Z-INDEX FIX ========== */
.modal-backdrop {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9998 !important;
}

.modal-dialog,
.modal-wrapper,
[class*="modal"] {
  z-index: 9999 !important;
}
/* ========== LOADING & EMPTY STATES ========== */
.loading-matches,
.no-matches {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.text-primary {
  color: #FF6B35 !important;
}

/* ========== RESPONSIVE DESIGN FOR MOBILE & TABLETS ========== */

/* Base mobile-first approach */
.min-h-screen {
  width: 100%;
  overflow-x: hidden;
}

.container-fluid {
  width: 100%;
  max-width: 100%;
  padding-left: 20px;
  padding-right: 20px;
}

/* Tablets and below (iPad, smaller screens) */
@media (max-width: 991px) {
  .welcome-section {
    margin: 0 20px 30px 20px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-stats {
    flex-direction: column;
    gap: 12px;
  }

  .stat-card {
    width: 100%;
  }

  .quick-actions-card {
    margin-top: 20px;
  }

  /* Carousel adjustments */
  .carousel-container {
    margin: 0 -10px;
  }

  /* Featured Players */
  .featured-card {
    margin-bottom: 20px;
  }

  /* Map adjustments */
  .map-wrapper {
    height: 300px;
  }

  .nearby-sidebar {
    margin-top: 20px;
    position: relative;
    top: 0;
  }
}

/* Mobile phones (landscape and portrait) */
@media (max-width: 768px) {
  .container-fluid {
    padding-left: 15px;
    padding-right: 15px;
  }

  .welcome-section {
    margin: 0 15px 25px 15px;
    padding: 20px 0;
  }

  .welcome-content {
    padding: 24px;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .stat-value {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .quick-actions-card {
    padding: 20px;
  }

  .btn-quick-action {
    padding: 12px 16px;
    font-size: 0.9rem;
  }

  /* Stars of the Week - Stack vertically */
  .row.g-4 > .col-lg-6 {
    margin-bottom: 15px;
  }

  .featured-card {
    padding: 20px;
  }

  .featured-name {
    font-size: 1.2rem;
  }

  /* Carousel */
  .carousel-controls {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  .carousel-nav-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .featured-match-card {
    margin-bottom: 15px;
  }

  .featured-match-header {
    height: 150px;
  }

  .featured-match-title {
    font-size: 1rem;
  }

  .match-detail-item {
    font-size: 0.8rem;
  }

  /* Map section */
  .map-wrapper {
    height: 250px;
  }

  .nearby-match-item {
    padding: 12px;
  }

  .sport-icon-small {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .sport-title {
    font-size: 0.95rem;
  }

  .detail-row {
    font-size: 0.8rem;
  }

  /* Weather widget */
  .weather-temp {
    font-size: 1.2rem;
  }

  .weather-desc {
    font-size: 0.8rem;
  }
}

/* Small phones (iPhone SE, small Android phones) */
@media (max-width: 576px) {
  .container-fluid {
    padding-left: 10px;
    padding-right: 10px;
  }

  .welcome-section {
    margin: 0 10px 20px 10px;
    padding: 15px 0;
  }

  .welcome-content {
    padding: 20px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-subtitle {
    font-size: 0.9rem;
  }

  .welcome-stats {
    gap: 10px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .quick-actions-card {
    padding: 16px;
  }

  .quick-actions-title {
    font-size: 0.9rem;
  }

  .btn-quick-action {
    padding: 10px 14px;
    font-size: 0.85rem;
  }

  .action-icon {
    font-size: 1rem;
  }

  /* Hide emojis on very small screens to save space */
  h3.fw-bold {
    font-size: 1.3rem;
  }

  /* Featured players */
  .featured-badge {
    font-size: 0.65rem;
    padding: 4px 10px;
  }

  .featured-avatar img {
    width: 60px;
    height: 60px;
  }

  .featured-name {
    font-size: 1.1rem;
  }

  .featured-stat {
    font-size: 0.85rem;
  }

  .sport-tag {
    font-size: 0.75rem;
    padding: 3px 10px;
  }

  .featured-quote {
    font-size: 0.85rem;
    padding: 10px 14px;
  }

  /* Carousel */
  .carousel-indicator {
    font-size: 0.8rem;
  }

  .featured-match-header {
    height: 120px;
  }

  .featured-match-sport-icon {
    font-size: 2.5rem;
  }

  .featured-match-badge {
    font-size: 0.65rem;
    padding: 4px 10px;
  }

  .featured-match-content {
    padding: 16px;
  }

  .featured-match-title {
    font-size: 0.95rem;
  }

  .match-detail-item {
    font-size: 0.75rem;
  }

  .match-detail-item .detail-icon {
    font-size: 0.85rem;
    width: 18px;
  }

  .capacity-text, .match-price {
    font-size: 0.8rem;
  }

  /* Map section */
  .map-wrapper {
    height: 200px;
  }

  .map-caption {
    font-size: 0.85rem;
  }

  .nearby-sidebar {
    padding: 16px;
  }

  .sidebar-title {
    font-size: 0.95rem;
  }

  .nearby-match-item {
    padding: 10px;
  }

  .sport-icon-small {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .sport-title {
    font-size: 0.9rem;
  }

  .price-tag {
    font-size: 0.7rem;
    padding: 3px 8px;
  }

  .detail-row {
    font-size: 0.75rem;
  }

  .detail-icon {
    font-size: 0.8rem;
  }

  /* Weather widget */
  .weather-widget {
    padding-top: 12px;
  }

  .weather-icon {
    font-size: 2rem;
  }

  .weather-temp {
    font-size: 1.1rem;
  }
}

/* Extra small phones (very small screens) */
@media (max-width: 375px) {
  .welcome-title {
    font-size: 1.3rem;
  }

  .welcome-subtitle {
    font-size: 0.85rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  h3.fw-bold {
    font-size: 1.2rem;
  }

  .featured-match-title {
    font-size: 0.9rem;
  }

  .carousel-nav-btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>