<template>
  <div class="min-h-screen" style="background-color: #FFFFFF">
    <!-- Dynamic Welcome Back Section -->
    <div class="welcome-section" ref="vantaFogRef">
      <div class="container-fluid px-5">
        <div class="row py-4">
          <div class="col-lg-8">
            <div class="welcome-content" ref="vantaBirdsRef">
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

      <!-- Stars of the Week -->
      <div class="row mb-5" v-if="starsOfWeek.topPlayer || starsOfWeek.topOrganiser">
        <div class="col-12">
          <h3 class="fw-bold mb-4">⭐ Stars of the Week</h3>
          <div class="row g-4">
            <!-- Player of the Week -->
            <div class="col-lg-6" v-if="starsOfWeek.topPlayer">
              <div class="featured-card player-of-week" @click="navigateToProfile(starsOfWeek.topPlayer.id)" style="cursor: pointer;">
                <div class="featured-badge">🏅 PLAYER OF THE WEEK</div>
                <div class="featured-content">
                  <div class="featured-avatar">
                    <img :src="starsOfWeek.topPlayer.image" :alt="starsOfWeek.topPlayer.name" />
                    <div class="featured-ring"></div>
                  </div>
                  <div class="featured-info">
                    <h4 class="featured-name">{{ starsOfWeek.topPlayer.name }}</h4>
                    <p class="featured-stat">
                      Joined <strong>{{ starsOfWeek.topPlayer.gamesCount }} games</strong> this week
                    </p>
                    <div class="featured-sports">
                      <span 
                        v-for="sport in starsOfWeek.topPlayer.favourites?.slice(0, 3)" 
                        :key="sport"
                        class="sport-tag"
                      >
                        {{ getSportIcon(sport) }} {{ sport }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="featured-quote">
                  "Always ready to play! Active community member."
                </div>
              </div>
            </div>

            <!-- Top Organiser -->
            <div class="col-lg-6" v-if="starsOfWeek.topOrganiser">
              <div class="featured-card organiser-of-week" @click="navigateToProfile(starsOfWeek.topOrganiser.id)" style="cursor: pointer;">
                <div class="featured-badge organiser">🎯 TOP ORGANISER</div>
                <div class="featured-content">
                  <div class="featured-avatar">
                    <img :src="starsOfWeek.topOrganiser.image" :alt="starsOfWeek.topOrganiser.name" />
                    <div class="featured-ring organiser"></div>
                  </div>
                  <div class="featured-info">
                    <h4 class="featured-name">{{ starsOfWeek.topOrganiser.name }}</h4>
                    <p class="featured-stat">
                      Hosted <strong>{{ starsOfWeek.topOrganiser.gamesCount }} matches</strong> this week
                    </p>
                    <div class="featured-sports">
                      <span 
                        v-for="sport in starsOfWeek.topOrganiser.favourites?.slice(0, 2)" 
                        :key="sport"
                        class="sport-tag organiser"
                      >
                        {{ getSportIcon(sport) }} {{ sport }}
                      </span>
                      <span class="sport-tag organiser">⭐ Top Host</span>
                    </div>
                  </div>
                </div>
                <div class="featured-quote">
                  "Bringing the community together!"
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
                            <span class="detail-text">{{ match.hostName }}</span>
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
                  @click="openMatchDetail(match.matchData)"
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
    currentUser: null,
    profileData: null,
    userStats: {
      gamesPlayed: 0,
      reliability: 0,
      badges: 0,
      favoriteSport: ''
    },
    weatherData: {
      temp: '--',
      description: 'Loading...',
      icon: '☀️'
    },
    mapCenter: { lat: 1.3521, lng: 103.8198 },
    currentSlide: 0,
    isTransitioning: false,
    autoSlideInterval: null,
    autoSlideProgress: 0,
    autoSlideTimer: null,
    nearbyMatches: [ /* keep your existing nearbyMatches */ ],
    userCurrentLocation: null,
    // REPLACE THIS - start with empty array, will be populated from DB
    featuredMatches: [],
    starsOfWeek: {
      topPlayer: null,
      topOrganiser: null
    },
    isLoadingMatches: true,  // Add loading state
    vantaBirdsEffect: null,  // Store the Vanta.js birds effect instance
    vantaFogEffect: null  // Store the Vanta.js fog effect instance
  };
},
  computed: {
    greetingMessage() {
      if (!this.profileData) return 'Welcome!';

      const hour = new Date().getHours();
      const isWeekend = [0, 6].includes(new Date().getDay());
      // console.log("hi");

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

      const games = this.nearbyMatches.map((match) => {
      const matchCoords = this.getMatchCoords(match.location);
      const sportConfig = this.getSportConfigForMatch(match.sport);

      // Fix: Better date handling
      let startTimeISO;
      try {
        if (match.matchData?.date && match.matchData?.time) {
          const dateStr = match.matchData.date; // "2025-11-05"
          const timeStr = match.matchData.time; // "18:00:00"
          startTimeISO = new Date(`${dateStr}T${timeStr}`).toISOString();
        } else {
          startTimeISO = new Date().toISOString();
        }
      } catch (error) {
        console.warn('Invalid date for match:', match);
        startTimeISO = new Date().toISOString();
      }

      return {
        id: match.matchData?.id || `nearby-${match.location}`,
        title: match.sport,
        venue: match.location,
        startTimeISO: startTimeISO,
        lat: matchCoords.lat,
        lng: matchCoords.lng,
        icon: sportConfig.icon,
        color: sportConfig.color,
        skillLevel: match.skill,
        price: match.matchData?.price || 0,
        joined: match.matchData?.current_player_count || 0,
        capacity: match.matchData?.total_player_count || 10
      };
    });

      // console.log('🗺️ Map Games:', games);
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
    },
    mapGames() {
      // Use nearby matches (already sorted by distance)
      const games = this.nearbyMatches.map((match) => {
        const matchCoords = this.getMatchCoords(match.location);
        const sportConfig = this.getSportConfigForMatch(match.sport);

        return {
          id: match.matchData?.id || `nearby-${match.location}`,
          title: match.sport,
          venue: match.location,
          startTimeISO: (() => {
            if (!match.matchData?.date || !match.matchData?.time) {
              return new Date().toISOString();
            }
             
            // Remove day name prefix from time if present (e.g., "Thu, ")
            let cleanTime = match.matchData.time.replace(/^[A-Za-z]+,\s*/, '');
            
            // Combine date and time
            const fullDateTime = `${match.matchData.date} ${cleanTime}`;
            
            const parsed = new Date(fullDateTime);
        
            // Check if valid
            if (isNaN(parsed.getTime())) {
              console.error('Invalid date/time:', fullDateTime);
              return new Date().toISOString();
            }
            
            return parsed.toISOString();
          })(),
          lat: matchCoords.lat,
          lng: matchCoords.lng,
          icon: sportConfig.icon,
          color: sportConfig.color,
          skillLevel: match.skill,
          price: match.matchData?.price || 0,
          joined: match.matchData?.current_player_count || 0,
          capacity: match.matchData?.total_player_count || 10
        };
      });

      // console.log('🗺️ Map Games:', games.length, 'markers');
      return games;
    }
    
    
  },
  watch: {
    featuredMatches: {
      handler(newMatches) {
        if (newMatches && newMatches.length > 0) {
          // console.log('👀 Featured matches changed, recalculating nearby');
          this.calculateNearbyMatches();
        }
      },
      immediate: false
    },
    userCurrentLocation: {
      handler(newLocation) {
        if (newLocation && this.featuredMatches.length > 0) {
          // console.log('👀 Watcher: Location updated, recalculating nearby');
          this.calculateNearbyMatches();
        }
      }
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll);

    this.getUserCurrentLocation();
    await Promise.all([
      this.fetchMatchesFromDB(),
      this.loadCurrentUser(),
      this.fetchWeather(),
      this.fetchStarsOfWeek()
    ]);
    

    // Load Vanta.js scripts and initialize birds animation
    this.loadVantaScripts();
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    // this.stopAutoSlide();

    // Cleanup Vanta effects
    if (this.vantaBirdsEffect) {
      this.vantaBirdsEffect.destroy();
    }
    if (this.vantaFogEffect) {
      this.vantaFogEffect.destroy();
    }
    // this.stopAutoSlide();
  },
  
  methods: {
  loadVantaScripts() {
    // Load Three.js first
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    threeScript.onload = () => {
      // Load Vanta.js FOG effect
      const vantaFogScript = document.createElement('script');
      vantaFogScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js';
      vantaFogScript.onload = () => {
        // Load Vanta.js Birds effect
        const vantaBirdsScript = document.createElement('script');
        vantaBirdsScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js';
        vantaBirdsScript.onload = () => {
          this.initVantaEffects();
        };
        document.head.appendChild(vantaBirdsScript);
      };
      document.head.appendChild(vantaFogScript);
    };
    document.head.appendChild(threeScript);
  },

  initVantaEffects() {
    // Initialize FOG effect on outer section
    if (this.$refs.vantaFogRef && window.VANTA && window.VANTA.FOG) {
      this.vantaFogEffect = window.VANTA.FOG({
        el: this.$refs.vantaFogRef,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0xffc300,  // Yellow/orange highlights
        midtoneColor: 0xff1100,    // Red midtones
        lowlightColor: 0x2d00ff,   // Blue lowlights
        baseColor: 0xfebeb,        // Light peachy base
        blurFactor: 0.6,
        speed: 1.00,
        zoom: 1.00
      });
    }

    // Initialize BIRDS effect on inner card
    if (this.$refs.vantaBirdsRef && window.VANTA && window.VANTA.BIRDS) {
      this.vantaBirdsEffect = window.VANTA.BIRDS({
        el: this.$refs.vantaBirdsRef,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0xffffff,  // White background
        color1: 0xff6b35,  // Primary orange color
        color2: 0x10b981,  // Secondary green color
        colorMode: 'lerp',
        birdSize: 1.20,
        wingSpan: 20.00,
        speedLimit: 4.00,
        separation: 30.00,
        alignment: 30.00,
        cohesion: 30.00,
        quantity: 3.00
      });
    }
  },

  openMatchDetail(match) {
    // console.log('🔍 Opening match detail:', match);
    // console.log('🔍 Match data check:', {
    //   id: match.id,
    //   sport: match.sport,
    //   hasAllProps: !!(match.sport_type && match.location)
    // });

    this.selectedMatch = match;
    this.showMatchDetail = true;
    document.body.style.overflow = 'hidden';

    // console.log('🔍 Modal should be visible now:', this.showMatchDetail);
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

          const { count: gamesPlayed, error: gamesError } = await supabase
            .from('users_matches')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', data.user.id)
            .eq('payment_success', true);

          if (!gamesError) {
            this.userStats.gamesPlayed = gamesPlayed || 0;
          }

          this.userStats.reliability = gamesPlayed > 0 ? 100 : 0;

          const { data: matchesData, error: matchesError } = await supabase
            .from('users_matches')
            .select('matches(sport_type)')
            .eq('user_id', data.user.id)
            .eq('payment_success', true);

          if (!matchesError && matchesData) {
            // Count occurrences of each sport
            const sportCounts = {};
            matchesData.forEach(item => {
              const sport = item.matches?.sport_type;
              if (sport) {
                sportCounts[sport] = (sportCounts[sport] || 0) + 1;
              }
            });
            const favoriteSport = Object.keys(sportCounts).reduce((a, b) => 
              sportCounts[a] > sportCounts[b] ? a : b, 
              profileData?.favourites?.[0] || 'Basketball'  // Fallback to first favorite or Basketball
            );

            this.userStats.favoriteSport = favoriteSport;
          } else {
            this.userStats.favoriteSport = profileData?.favourites?.[0] || '';
          }

          this.userStats.badges = Math.floor((gamesPlayed || 0) / 5);
        }
          
      } catch (err) {
        console.error('Unexpected error loading user:', err);
      }
    },
    async fetchWeather() {
      try {
        // Singapore default coordinates
        const lat = 1.3521;
        const lng = 103.8198;
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        
        if (!apiKey) {
          console.warn('OpenWeather API key not found');
          this.weatherData = {
            temp: 28,
            description: 'Perfect for sports',
            icon: '☀️',
            humidity: 75
          };
          return;
        }
        
        // Fetch weather from OpenWeatherMap API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format condition with proper capitalization
        const condition = data.weather[0].description.charAt(0).toUpperCase() + 
                        data.weather[0].description.slice(1);
        
        this.weatherData = {
          temp: Math.round(data.main.temp),
          description: this.getWeatherDescription(condition, data.main.temp, data.main.humidity),
          icon: this.getWeatherIcon(condition),
          humidity: data.main.humidity,
          condition: condition,
          raw: data
        };
        
        // console.log('🌤️ Weather updated:', this.weatherData);
        
      } catch (error) {
        // console.error('Error fetching weather:', error);
        // Fallback to default
        this.weatherData = {
          temp: 28,
          description: 'Perfect for sports',
          icon: '☀️',
          humidity: 75
        };
      }
    },

    getWeatherDescription(condition, temp, humidity) {
      const c = condition.toLowerCase();
      
      if (c.includes('rain') || c.includes('drizzle')) {
        return 'Indoor sports today?';
      }
      
      if (c.includes('thunder') || c.includes('storm')) {
        return 'Stay safe indoors';
      }
      
      if (c.includes('clear') || c.includes('cloud')) {
        if (temp > 32) {
          return 'Hot! Stay hydrated';
        } else if (temp > 28) {
          if (humidity > 80) {
            return 'Humid - bring water';
          }
          return 'Perfect for sports';
        } else if (temp < 24) {
          return 'Great weather!';
        } else {
          return 'Nice and cool';
        }
      }
      
      if (c.includes('mist') || c.includes('fog') || c.includes('haze')) {
        return 'Low visibility';
      }
      
      return 'Check conditions';
    },
    getWeatherIcon(condition) {
      const c = condition.toLowerCase();
      if (c.includes('thunder') || c.includes('storm')) return '⛈️';
      if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
      if (c.includes('snow')) return '❄️';
      if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
      if (c.includes('cloud')) return '☁️';
      if (c.includes('clear')) return '☀️';
      return '🌤️';
    },
    getWeatherDescription(condition, temp, humidity) {
      // More detailed logic like Browser.vue
      const c = condition.toLowerCase();
      
      // Rain conditions
      if (c.includes('rain') || c.includes('drizzle')) {
        return 'Indoor sports today?';
      }
      
      // Thunderstorm
      if (c.includes('thunder') || c.includes('storm')) {
        return 'Stay safe indoors';
      }
      
      // Temperature-based for clear/cloudy weather
      if (c.includes('clear') || c.includes('cloud')) {
        if (temp > 32) {
          return 'Hot! Stay hydrated';
        } else if (temp > 28) {
          if (humidity > 80) {
            return 'Humid - bring water';
          }
          return 'Perfect for sports';
        } else if (temp < 24) {
          return 'Great weather!';
        } else {
          return 'Nice and cool';
        }
      }
      
      // Fog/Mist
      if (c.includes('mist') || c.includes('fog') || c.includes('haze')) {
        return 'Low visibility';
      }
      
      // Default
      return 'Check conditions';
    },
    async fetchMatchesFromDB() {
      this.isLoadingMatches = true;
      
      try {
        // console.log('📡 Fetching matches from Supabase...');

        // Step 1: Get all matches
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .order('date', { ascending: true });

        if (error) {
          console.error('Error fetching matches:', error);
          this.featuredMatches = [];
          return;
        }

        if (!data || data.length === 0) {
          this.featuredMatches = [];
          return;
        }

        // Step 2: Get unique host IDs
        const hostIds = [...new Set(data.map(match => match.host))];
        
        // Step 3: Fetch all host profiles in one query
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, profile_image')
          .in('id', hostIds);

        if (profileError) {
          console.error('Error fetching profiles:', profileError);
        }

        // Step 4: Create a lookup map for quick access
        const profileMap = {};
        if (profiles) {
          profiles.forEach(profile => {
            profileMap[profile.id] = profile;
          });
        }

        // Step 5: Filter matches
        const now = new Date();
        const filteredData = data.filter(match => {
          const matchDateTime = new Date(`${match.date}T${match.time}`);
          if (matchDateTime <= now) return false;
          if (match.current_player_count >= match.total_player_count) return false;
          return true;
        });

        // Step 6: Transform for display
        const dbMatches = filteredData.map(match => {
          const sportConfig = this.getSportConfigForMatch(match.sport_type);
          const badge = this.getMatchBadge(match);
          
          // Get host profile from map
          const hostProfile = profileMap[match.host];

          return {
            ...match,
            icon: sportConfig.icon,
            color: sportConfig.color,
            badge: badge,
            image: sportConfig.image,
            sport: match.sport_type,
            title: match.name || `${match.sport_type} Match`,
            venue: match.location,
            skillLevel: match.skill_level,
            joined: match.current_player_count,
            capacity: match.total_player_count,
            price: match.total_price,
            players: `${match.current_player_count}/${match.total_player_count}`,
            time: this.formatDateTimeForDisplay(match.date, match.time),
            
            // Use host profile data
            hostName: hostProfile?.name || 'Anonymous',
            hostImage: hostProfile?.profile_image || null
          };
        });

        this.featuredMatches = dbMatches;
        // console.log('✅ Featured matches loaded:', this.featuredMatches.length, 'matches');
        this.calculateNearbyMatches();

      } catch (error) {
        // console.error('❌ Error fetching matches:', error);
        this.featuredMatches = [];
      } finally {
        this.isLoadingMatches = false;
      }
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

    // startAutoSlide() {
    //   // Auto-slide every 4 seconds
    //   this.autoSlideInterval = setInterval(() => {
    //     this.nextSlide();
    //   }, 4000);

    //   // Progress bar animation (updates every 50ms)
    //   this.autoSlideProgress = 0;
    //   this.autoSlideTimer = setInterval(() => {
    //     this.autoSlideProgress += (100 / 4000) * 50; // 50ms interval
    //     if (this.autoSlideProgress >= 100) {
    //       this.autoSlideProgress = 0;
    //     }
    //   }, 50);
    // },

    // stopAutoSlide() {
    //   if (this.autoSlideInterval) {
    //     clearInterval(this.autoSlideInterval);
    //     this.autoSlideInterval = null;
    //   }
    //   if (this.autoSlideTimer) {
    //     clearInterval(this.autoSlideTimer);
    //     this.autoSlideTimer = null;
    //   }
    // },

    // resetAutoSlide() {
    //   this.stopAutoSlide();
    //   this.autoSlideProgress = 0;
    //   this.startAutoSlide();
    // },

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
      const configs = {
        'Basketball': {
          icon: '🏀',
          color: '#f97316',
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop'
        },
        'Tennis': {
          icon: '🎾',
          color: '#84cc16',
          image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop'
        },
        'Football': {
          icon: '⚽',
          color: '#10b981',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop'
        },
        'Badminton': {
          icon: '🏸',
          color: '#ec4899',
          image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop'
        },
        'Volleyball': {
          icon: '🏐',
          color: '#8b5cf6',
          image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop'
        }
      };

      // Try exact match first
      if (configs[sportType]) {
        return configs[sportType];
      }

      // Try case-insensitive match
      const normalizedSport = sportType.charAt(0).toUpperCase() + sportType.slice(1).toLowerCase();
      if (configs[normalizedSport]) {
        // console.warn(`⚠️ Sport type case mismatch: "${sportType}" → "${normalizedSport}"`);
        return configs[normalizedSport];
      }

      // Log unknown sport
      // console.warn(`⚠️ Unknown sport type: "${sportType}" - using default config`);
      // console.warn(`Available sports: ${Object.keys(configs).join(', ')}`);

      // Return default
      return {
        icon: '🏃',
        color: '#3b82f6',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop'
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
    },

    async getUserCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userCurrentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            // console.log('📍 User location obtained:', this.userCurrentLocation);
          },
          (error) => {
            console.warn("Could not get user location:", error);
            // Default to Singapore if geolocation fails
            this.userCurrentLocation = { lat: 1.3521, lng: 103.8198 };
          }
        );
      } else {
        // Default to Singapore if geolocation not supported
        this.userCurrentLocation = { lat: 1.3521, lng: 103.8198 };
      }
    },

    // Get match coordinates (exact copy from Browser.vue)
    getMatchCoords(location) {
      const locationCoords = {
        Hougang: { lat: 1.3712, lng: 103.8863 },
        Sengkang: { lat: 1.3917, lng: 103.8951 },
        Punggol: { lat: 1.4043, lng: 103.9021 },
        Tampines: { lat: 1.3529, lng: 103.9446 },
        Bedok: { lat: 1.3236, lng: 103.9273 },
        "Serangoon CC": { lat: 1.3537, lng: 103.8721 },
        "Choa Chu Kang CC": { lat: 1.3853, lng: 103.7459 },
        "Bukit Merah CC": { lat: 1.2827, lng: 103.8179 },
        Woodlands: { lat: 1.4382, lng: 103.7891 },
        Yishun: { lat: 1.4304, lng: 103.8354 },
        "Ang Mo Kio": { lat: 1.3691, lng: 103.8454 },
        Bishan: { lat: 1.3526, lng: 103.8352 },
        "Toa Payoh": { lat: 1.3343, lng: 103.8567 },
        "Jurong East": { lat: 1.3329, lng: 103.7436 },
        Clementi: { lat: 1.3162, lng: 103.7649 },
      };
      return locationCoords[location] || { lat: 1.3521, lng: 103.8198 };
    },

    // Calculate distance between two coordinates (exact copy from Browser.vue)
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

    // Calculate distance for a specific match (similar to Browser.vue's getMatchDistance)
    getMatchDistance(match) {
      // Use user's current location or default to Singapore
      const refLocation = this.userCurrentLocation || { lat: 1.3521, lng: 103.8198 };
      
      const matchCoords = this.getMatchCoords(match.location);
      const distance = this.calculateDistance(
        refLocation.lat,
        refLocation.lng,
        matchCoords.lat,
        matchCoords.lng
      );
      return distance.toFixed(1); // Return with 1 decimal place
    },
    calculateNearbyMatches() {
      if (!this.featuredMatches.length) {
        // console.log('⏳ Waiting for matches to load...');
        return;
      }

      // console.log('📍 Calculating nearby matches...');

      // Add distance to each match
      const matchesWithDistance = this.featuredMatches.map(match => {
        const distance = parseFloat(this.getMatchDistance(match));
        
        return {
          ...match,
          distanceKm: distance,
          distanceText: `${distance} km away`
        };
      });

      // Sort by distance (ascending) and take top 5
      const sortedMatches = matchesWithDistance
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 3);

      // Transform to display format
      this.nearbyMatches = sortedMatches.map(match => ({
        sport: match.sport_type,
        location: match.location,
        skill: match.skill_level,
        date: match.time, // Already formatted from fetchMatchesFromDB
        distance: match.distanceText,
        price: match.price === 0 ? 'Free' : `$${match.price}`,
        isFree: match.price === 0,
        distanceKm: match.distanceKm, // Keep for reference
        matchData: match // Keep full match data for modal
      }));

      // console.log('✅ Nearby matches calculated:', this.nearbyMatches.length, 'matches');
      // console.log('📊 Distances:', this.nearbyMatches.map(m => m.distance));
    },
    async fetchStarsOfWeek() {
      try {
        // Get date range for this week
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        // console.log('📊 Fetching stars of the week from', startOfWeek, 'to', endOfWeek);

        // Get all matches this week
        const { data: weekMatches, error: matchError } = await supabase
          .from('matches')
          .select('id, host, date')
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lt('date', endOfWeek.toISOString().split('T')[0]);

        if (matchError) throw matchError;

        // Get all user-match joins this week
        const { data: userMatches, error: joinError } = await supabase
          .from('users_matches')
          .select('user_id, match_id, matches!inner(date)')
          .gte('matches.date', startOfWeek.toISOString().split('T')[0])
          .lt('matches.date', endOfWeek.toISOString().split('T')[0])
          .eq('payment_success', true);

        if (joinError) throw joinError;

        // Count games joined per user
        const playerCounts = {};
        userMatches.forEach(um => {
          playerCounts[um.user_id] = (playerCounts[um.user_id] || 0) + 1;
        });

        // Count games hosted per user
        const hostCounts = {};
        weekMatches.forEach(match => {
          hostCounts[match.host] = (hostCounts[match.host] || 0) + 1;
        });

        // Get top player (most games joined)
        let topPlayerId = null;
        let topPlayerCount = 0;
        Object.entries(playerCounts).forEach(([userId, count]) => {
          if (count > topPlayerCount) {
            topPlayerId = userId;
            topPlayerCount = count;
          }
        });

        // Get top organiser (most games hosted)
        let topOrganiserId = null;
        let topOrganiserCount = 0;
        Object.entries(hostCounts).forEach(([userId, count]) => {
          if (count > topOrganiserCount) {
            topOrganiserId = userId;
            topOrganiserCount = count;
          }
        });

        // Fetch profiles
        if (topPlayerId) {
          const { data: playerProfile } = await supabase
            .from('profiles')
            .select('id, name, profile_image, favourites')
            .eq('id', topPlayerId)
            .single();

          if (playerProfile) {
            this.starsOfWeek.topPlayer = {
              ...playerProfile,
              gamesCount: topPlayerCount,
              image: playerProfile.profile_image || `https://i.pravatar.cc/150?u=${playerProfile.id}`
            };
          }
        }

        if (topOrganiserId) {
          const { data: organiserProfile } = await supabase
            .from('profiles')
            .select('id, name, profile_image, favourites')
            .eq('id', topOrganiserId)
            .single();

          if (organiserProfile) {
            this.starsOfWeek.topOrganiser = {
              ...organiserProfile,
              gamesCount: topOrganiserCount,
              image: organiserProfile.profile_image || `https://i.pravatar.cc/150?u=${organiserProfile.id}`
            };
          }
        }

        // console.log('⭐ Stars of the week:', this.starsOfWeek);

      } catch (error) {
        console.error('Error fetching stars of the week:', error);
      }
    },
    navigateToProfile(userId) {
      if (!userId) {
        console.warn('No user ID provided');
        return;
      }
      this.$router.push(`/profile/${userId}`);
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
    position: relative;
    overflow: hidden;
}

.welcome-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    height: 100%;
    position: relative;
    overflow: hidden;
}

.welcome-greeting {
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
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
    position: relative;
    z-index: 1;
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