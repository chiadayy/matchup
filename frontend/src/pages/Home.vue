<template>
  <div class="min-h-screen" style="background-color: #F7F9FC">
    

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
            <div class="match-card">
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
              <button class="btn-dark-custom w-100" @click="joinMatch(match.id)">Join Match</button>
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

  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      isScrolled: false,
      isLoggedIn: false, // Change to true to simulate logged-in state
      userProfilePic: 'https://i.pravatar.cc/150?img=12',
      featuredMatches: [
        { id: 1, sport: 'Basketball', skill: 'Beginner', location: 'Hougang', date: '8/10/25 6pm', price: 0, players: '7/8' },
        { id: 2, sport: 'Tennis', skill: 'Beginner', location: 'Sengkang', date: '8/10/25 7pm', price: 15, players: '2/4' },
        { id: 3, sport: 'Basketball', skill: 'Beginner', location: 'Hougang', date: '8/10/25 6pm', price: 0, players: '7/8' },
        { id: 4, sport: 'Football', skill: 'Intermediate', location: 'Bedok', date: '9/10/25 5pm', price: 0, players: '18/22' }
      ],
      nearbyMatches: [
        { sport: 'Basketball', skill: 'Beginner', date: '8/10/25 6pm', distance: '2.3km', price: 'Free', isFree: true },
        { sport: 'Tennis', skill: 'Intermediate', date: '8/10/25 7pm', distance: '3.5km', price: '$15', isFree: false },
        { sport: 'Football', skill: 'Advanced', date: '9/10/25 5pm', distance: '1.8km', price: 'Free', isFree: true },
        { sport: 'Badminton', skill: 'Beginner', date: '9/10/25 8pm', distance: '4.2km', price: '$10', isFree: false },
        { sport: 'Basketball', skill: 'Intermediate', date: '10/10/25 6pm', distance: '2.9km', price: 'Free', isFree: true }
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    joinMatch(matchId) {
      alert(`Joining Match ${matchId}!`);
      // this.$router.push(`/match/${matchId}`);
    },
    logout() {
      if (confirm('Are you sure you want to logout?')) {
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
</style>