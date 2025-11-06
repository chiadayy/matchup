<template>
  <div class="landing-page">
    <!-- Scroll Progress Bar -->
    <div class="scroll-progress-bar" :style="{ width: scrollProgress + '%' }"></div>

    <!-- Floating Particles Background -->
    <div class="particles-container">
      <div v-for="i in 30" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- Header with Glassmorphism -->
    <header class="header" :class="{ 'scrolled': isScrolled }">
      <div class="container">
        <div class="header-content">
          <div class="logo-container">
            <div class="logo">MatchUp</div>
            <div class="logo-badge">BETA</div>
          </div>
          <!-- Desktop Navigation -->
          <nav class="nav">
            <a href="#features" class="nav-link">Features</a>
            <a href="#how-it-works" class="nav-link">How it works</a>
            <a href="#testimonials" class="nav-link">Reviews</a>
            <template v-if="isLoggedIn">
              <RouterLink to="/location-weather" class="btn btn-primary btn-sm">Dashboard</RouterLink>
              <button @click="handleLogout" class="btn btn-secondary btn-sm">Logout</button>
            </template>
            <RouterLink v-else to="/register" class="btn btn-primary btn-sm glow-btn">Get Started</RouterLink>
          </nav>

          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
            <span class="hamburger-line" :class="{ 'active': mobileMenuOpen }"></span>
            <span class="hamburger-line" :class="{ 'active': mobileMenuOpen }"></span>
            <span class="hamburger-line" :class="{ 'active': mobileMenuOpen }"></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Menu -->
    <transition name="slide-fade">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click="mobileMenuOpen = false">
        <div class="mobile-menu" @click.stop>
          <div class="mobile-menu-header">
            <div class="logo">MatchUp</div>
            <button @click="mobileMenuOpen = false" class="mobile-menu-close" aria-label="Close menu">×</button>
          </div>
          <nav class="mobile-nav">
            <a href="#features" class="mobile-nav-link" @click="mobileMenuOpen = false">Features</a>
            <a href="#how-it-works" class="mobile-nav-link" @click="mobileMenuOpen = false">How it works</a>
            <a href="#testimonials" class="mobile-nav-link" @click="mobileMenuOpen = false">Reviews</a>
            <div class="mobile-menu-divider"></div>
            <template v-if="isLoggedIn">
              <RouterLink to="/location-weather" class="btn btn-primary w-100" @click="mobileMenuOpen = false">Dashboard</RouterLink>
              <button @click="handleLogout(); mobileMenuOpen = false" class="btn btn-secondary w-100">Logout</button>
            </template>
            <RouterLink v-else to="/register" class="btn btn-primary w-100" @click="mobileMenuOpen = false">Get Started</RouterLink>
          </nav>
        </div>
      </div>
    </transition>

    <!-- Hero Section with Enhanced Design -->
    <section class="hero">
      <div class="hero-gradient"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">🎮 The Future of Sports Matchmaking</div>
            <h1 class="hero-title">
              <span class="gradient-text">Pick a game.</span>
              <span class="gradient-text-alt">Show up ready.</span>
            </h1>
            <p class="hero-subtitle">Find nearby matches, see live weather at kickoff, and join in seconds — no more messy group chats or last-minute cancellations.</p>

            <!-- Live Stats with Glass Effect -->
            <div class="live-stats">
              <div class="stat-item" v-for="(stat, index) in stats" :key="index">
                <div class="stat-icon">{{ stat.icon }}</div>
                <div class="stat-content">
                  <div class="stat-number">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="hero-cta">
              <RouterLink v-if="isLoggedIn" to="/location-weather" class="btn btn-primary btn-lg btn-hero">
                <span>Go to Dashboard</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                </svg>
              </RouterLink>
              <template v-else>
                <RouterLink to="/register" class="btn btn-primary btn-lg btn-hero">
                  <span>Get Started Free</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                  </svg>
                </RouterLink>
                <RouterLink to="/login" class="btn btn-secondary btn-lg">
                  <span>Sign In</span>
                </RouterLink>
              </template>
            </div>

            <!-- Trust Indicators -->
            <div class="trust-badges">
              <div class="trust-item">
                <span class="trust-icon">⚡</span>
                <span>Instant Join</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">🔒</span>
                <span>Secure Payments</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">🌤️</span>
                <span>Live Weather</span>
              </div>
            </div>
          </div>

          <!-- Sporty Visual - Stadium Style -->
          <div class="hero-visual">
            <div class="sports-stadium">
              <!-- Main Sports Circle -->
              <div class="sports-orbit">
                <div class="center-ball">⚽</div>
                <div class="orbit-sport sport-1">🏀</div>
                <div class="orbit-sport sport-2">🎾</div>
                <div class="orbit-sport sport-3">🏐</div>
                <div class="orbit-sport sport-4">🏊</div>
                <div class="orbit-sport sport-5">🚴</div>
                <div class="orbit-sport sport-6">🏃</div>
              </div>

              <!-- Quick Match Cards -->
              <div class="quick-matches">
                <div class="match-ticket ticket-1">
                  <div class="ticket-sport">⚽ Soccer</div>
                  <div class="ticket-time">Starting Soon</div>
                </div>
                <div class="match-ticket ticket-2">
                  <div class="ticket-sport">🏀 Basketball</div>
                  <div class="ticket-time">2 spots left</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features with Enhanced Cards -->
    <section id="features" class="features section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">✨ Features</span>
          <h2 class="section-title">Everything you need to organize and join games</h2>
          <p class="section-subtitle">Powerful tools designed for both players and organizers</p>
        </div>

        <div class="features-grid">
          <div class="feature-card-modern" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon-modern">{{ feature.icon }}</div>
            <h3 class="feature-title-modern">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
            <ul class="feature-list-modern">
              <li v-for="(item, i) in feature.items" :key="i">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works with Timeline -->
    <section id="how-it-works" class="how-it-works section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">🎯 How It Works</span>
          <h2 class="section-title">Get started in 3 simple steps</h2>
        </div>

        <div class="timeline">
          <div class="timeline-item" v-for="(step, index) in steps" :key="index">
            <div class="timeline-marker">
              <div class="timeline-number">{{ index + 1 }}</div>
              <div class="timeline-line" v-if="index < steps.length - 1"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-icon">{{ step.icon }}</div>
              <h3 class="timeline-title">{{ step.title }}</h3>
              <p class="timeline-text">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Carousel -->
    <section id="testimonials" class="testimonials section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">💬 Testimonials</span>
          <h2 class="section-title">Loved by players and organizers</h2>
        </div>

        <div class="testimonials-carousel">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-stars">
              <span v-for="i in 5" :key="i">⭐</span>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img :src="testimonial.avatar" :alt="testimonial.name" />
              </div>
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-role">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Powered by Modern Technology -->
    <section id="technology" class="technology section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">⚡ Technology</span>
          <h2 class="section-title">Powered by modern technology</h2>
          <p class="section-subtitle">Built with cutting-edge tools for the best experience</p>
        </div>

        <div class="tech-grid">
          <div class="tech-card" v-for="(tech, index) in technologies" :key="index">
            <div class="tech-icon">{{ tech.icon }}</div>
            <h3 class="tech-name">{{ tech.name }}</h3>
            <p class="tech-desc">{{ tech.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section with Gradient -->
    <section class="cta-section">
      <div class="cta-gradient"></div>
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to level up your game?</h2>
          <p class="cta-subtitle">Join thousands of players finding their perfect match</p>
          <RouterLink to="/register" class="btn btn-primary btn-lg btn-hero btn-cta">
            <span>Get Started Now</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
            </svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="footer-logo-icon">🏆</span>
              <span class="footer-logo-text">MatchUp</span>
            </div>
            <p class="footer-tagline">Connect with local players and find your perfect sports match. Join the community today!</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© {{ currentYear }} MatchUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'

const currentYear = computed(() => new Date().getFullYear())
const isLoggedIn = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)
const mobileMenuOpen = ref(false)

// Stats with animation
const stats = ref([
  { icon: '🎮', value: '0+', target: 1247, label: 'Games Played', current: 0 },
  { icon: '👥', value: '0+', target: 523, label: 'Active Players', current: 0 },
  { icon: '📅', value: '0', target: 89, label: 'This Week', current: 0 }
])

const features = [
  {
    icon: '⚽',
    title: 'Game Creation & Management',
    description: 'Create and manage games with ease',
    items: [
      'Set sport, skill level, time & location',
      'Live RSVP tracking with capacity limits',
      'Instant updates on changes or cancellations'
    ]
  },
  {
    icon: '🗺️',
    title: 'Interactive Map & Weather',
    description: 'See everything at a glance',
    items: [
      'Discover games on an interactive map',
      'Real-time weather forecasts at game time',
      'Distance calculations from your location'
    ]
  },
  {
    icon: '💬',
    title: 'Built-in Chat',
    description: 'Coordinate seamlessly',
    items: [
      'Auto-created chatrooms for each game',
      'Instant messaging with all players',
      'Share updates and logistics easily'
    ]
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    description: 'Handle paid games safely',
    items: [
      'Integrated Stripe payment processing',
      'Automatic refunds for cancelled games',
      'Track your payment history'
    ]
  }
]

const steps = [
  {
    icon: '🔍',
    title: 'Search & Discover',
    description: 'Browse games on the map or search by location, sport, and skill level.'
  },
  {
    icon: '🎯',
    title: 'Pick Your Game',
    description: 'Check the weather, see who\'s joined, and find the perfect match for your schedule.'
  },
  {
    icon: '⚡',
    title: 'Join & Play',
    description: 'RSVP instantly, pay if needed, coordinate via chat, and show up ready!'
  }
]

const testimonials = [
  {
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Marcus Chen',
    role: 'Basketball Enthusiast',
    text: 'Found my regular pickup game crew through MatchUp. The weather feature alone has saved me from countless rainouts!'
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Sarah Williams',
    role: 'Soccer Organizer',
    text: 'As an organizer, MatchUp makes it so easy to fill games. The payment integration is seamless and the chat keeps everyone on the same page.'
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    name: 'David Tan',
    role: 'Tennis Player',
    text: 'Love how I can filter by skill level and distance. No more awkward mismatches or long commutes to games!'
  }
]

const technologies = [
  {
    icon: '⚡',
    name: 'Vue 3',
    description: 'Progressive JavaScript framework for building modern user interfaces'
  },
  {
    icon: '🔐',
    name: 'Supabase',
    description: 'Open-source Firebase alternative for authentication and database'
  },
  {
    icon: '🗺️',
    name: 'Google Maps API',
    description: 'Interactive maps with real-time location tracking'
  },
  {
    icon: '🌦️',
    name: 'OpenWeather API',
    description: 'Accurate weather forecasts for game planning'
  },
  {
    icon: '💳',
    name: 'Stripe',
    description: 'Secure payment processing for paid games'
  },
  {
    icon: '🚀',
    name: 'Vite',
    description: 'Lightning-fast build tool and dev server'
  }
]

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  isLoggedIn.value = !!session

  // Animate stats
  stats.value.forEach((stat, index) => {
    setTimeout(() => {
      animateValue(stat, stat.target, 2000)
    }, index * 200)
  })

  setupScrollAnimations()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 50
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight - windowHeight
  const scrolled = window.scrollY
  scrollProgress.value = (scrolled / documentHeight) * 100
}

function animateValue(stat, target, duration) {
  const start = 0
  const increment = target / (duration / 16)
  const timer = setInterval(() => {
    stat.current += increment
    if (stat.current >= target) {
      stat.current = target
      stat.value = target.toLocaleString() + (target > 100 ? '+' : '')
      clearInterval(timer)
    } else {
      stat.value = Math.floor(stat.current).toLocaleString() + (target > 100 ? '+' : '')
    }
  }, 16)
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    },
    { threshold: 0.1 }
  )

  setTimeout(() => {
    const elements = document.querySelectorAll('.section, .feature-card-modern, .timeline-item, .testimonial-card, .pricing-card-modern')
    elements.forEach((el) => observer.observe(el))
  }, 100)
}

function getParticleStyle(index) {
  return {
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (Math.random() * 10 + 10) + 's'
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  isLoggedIn.value = false
}
</script>

<style scoped>
/* Modern Reset & Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.landing-page {
  background: radial-gradient(circle at top, #f5f3ed 0%, #f0ddb8 45%, #f0ddb8 90%);
  color: #1F2937;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

/* Scroll Progress Bar */
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #FF8B3D, #F59E0B, #6BE8E0);
  z-index: 10000;
  transition: width 0.1s ease;
  box-shadow: 0 0 20px rgba(255, 139, 61, 0.8);
}

/* Floating Particles */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255, 139, 61, 0.8), transparent);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* Header with Glassmorphism */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 139, 61, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  font-size: 1.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FF8B3D 0%, #F59E0B 50%, #6BE8E0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.logo-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 139, 61, 0.2);
  color: #FF8B3D;
  border-radius: 4px;
  border: 1px solid rgba(255, 139, 61, 0.3);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #4B5563;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #FF8B3D, #F59E0B);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #FF8B3D;
}

.nav-link:hover::after {
  width: 100%;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  font-size: 0.9375rem;
  position: relative;
  overflow: hidden;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.0625rem;
}

.btn-primary {
  background: linear-gradient(135deg, #FF8B3D 0%, #F59E0B 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(255, 139, 61, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 139, 61, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #1F2937;
  border: 2px solid #E5E7EB;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #FF8B3D;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 139, 61, 0.2);
}

.btn-hero {
  padding: 1.125rem 2.5rem;
  font-size: 1.125rem;
  border-radius: 16px;
}

.btn-hero svg {
  transition: transform 0.3s ease;
}

.btn-hero:hover svg {
  transform: translateX(4px);
}

.glow-btn {
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(255, 139, 61, 0.4);
  }
  50% {
    box-shadow: 0 4px 32px rgba(255, 139, 61, 0.8);
  }
}

/* Hero Section */
.hero {
  position: relative;
  padding: 10rem 0 6rem;
  overflow: hidden;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(ellipse at top, rgba(255, 139, 61, 0.15), transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(107, 232, 224, 0.1), transparent 50%);
  pointer-events: none;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 139, 61, 0.1);
  border: 1px solid rgba(255, 139, 61, 0.2);
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #FF8B3D;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease 0.1s backwards;
}

.gradient-text {
  display: block;
  background: linear-gradient(135deg, #1F2937 0%, #4B5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-alt {
  display: block;
  background: linear-gradient(135deg, #FF8B3D 0%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #4B5563;
  line-height: 1.7;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease 0.2s backwards;
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

/* Live Stats */
.live-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.6s ease 0.3s backwards;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.75rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 139, 61, 0.3);
  box-shadow: 0 8px 24px rgba(255, 139, 61, 0.15);
}

.stat-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 8px rgba(255, 139, 61, 0.3));
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #1F2937;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Hero CTA */
.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease 0.4s backwards;
}

/* Trust Badges */
.trust-badges {
  display: flex;
  gap: 2rem;
  animation: fadeInUp 0.6s ease 0.5s backwards;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4B5563;
}

.trust-icon {
  font-size: 1.25rem;
}

/* Sports Stadium Visual */
.hero-visual {
  position: relative;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInScale 0.8s ease 0.6s backwards;
}

.sports-stadium {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

/* Sports Orbit */
.sports-orbit {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-ball {
  font-size: 5rem;
  animation: spin-ball 4s linear infinite, bounce-ball 2s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(255, 107, 53, 0.8));
  z-index: 2;
}

@keyframes spin-ball {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce-ball {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.orbit-sport {
  position: absolute;
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 107, 53, 0.5);
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.4);
  animation: orbit 8s linear infinite;
  transition: all 0.3s ease;
  cursor: pointer;
}

.orbit-sport:hover {
  transform: scale(1.3);
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 107, 53, 0.8);
  box-shadow: 0 12px 48px rgba(255, 107, 53, 0.6);
  z-index: 3;
}

.sport-1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.sport-2 {
  top: 25%;
  right: 0;
  animation-delay: -1.3s;
}

.sport-3 {
  bottom: 25%;
  right: 0;
  animation-delay: -2.6s;
}

.sport-4 {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: -4s;
}

.sport-5 {
  bottom: 25%;
  left: 0;
  animation-delay: -5.3s;
}

.sport-6 {
  top: 25%;
  left: 0;
  animation-delay: -6.6s;
}

@keyframes orbit {
  from {
    transform: rotate(0deg) translateX(150px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(150px) rotate(-360deg);
  }
}

/* Stadium Stats */
.stadium-stats {
  display: flex;
  gap: 3rem;
}

.stat-display {
  text-align: center;
  padding: 1.5rem 2.5rem;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.stat-display:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 107, 53, 0.6);
  box-shadow: 0 16px 48px rgba(255, 107, 53, 0.4);
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-number.pulse {
  animation: stat-pulse 2s ease-in-out infinite;
}

@keyframes stat-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.stat-text {
  font-size: 0.875rem;
  color: #4B5563;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Quick Match Tickets */
.quick-matches {
  display: flex;
  gap: 1.5rem;
}

.match-ticket {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(245, 158, 11, 0.2));
  border: 2px solid rgba(255, 107, 53, 0.4);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ticket-float 3s ease-in-out infinite;
}

.ticket-1 {
  animation-delay: 0s;
}

.ticket-2 {
  animation-delay: 1.5s;
}

@keyframes ticket-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.match-ticket:hover {
  transform: translateY(-12px) scale(1.05);
  border-color: rgba(255, 107, 53, 0.8);
  box-shadow: 0 16px 48px rgba(255, 107, 53, 0.6);
}

.ticket-sport {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.ticket-time {
  font-size: 0.875rem;
  color: #FBBF24;
  font-weight: 600;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Section Styles */
.section {
  padding: 6rem 0;
  position: relative;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #FF8B3D;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1F2937 0%, #4B5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #1F2937;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card-modern {
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(30px);
}

.feature-card-modern.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.feature-card-modern:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 20px 60px rgba(255, 107, 53, 0.3);
}

.feature-icon-modern {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 12px rgba(255, 107, 53, 0.3));
}

.feature-title-modern {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.feature-desc {
  color: #4a4a4a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.feature-list-modern {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-list-modern li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4a4a4a;
  font-size: 0.9375rem;
}

.feature-list-modern svg {
  color: #6BE8E0;
  flex-shrink: 0;
}

/* Timeline */
.timeline {
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.6s ease;
}

.timeline-item.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.timeline-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-number {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  border-radius: 50%;
  font-size: 2rem;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-number {
  transform: scale(1.1) rotate(360deg);
  box-shadow: 0 12px 32px rgba(255, 107, 53, 0.6);
}

.timeline-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, rgba(255, 107, 53, 0.5), transparent);
  margin-top: 1rem;
}

.timeline-content {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.timeline-content:hover {
  transform: translateX(8px);
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 107, 53, 0.5);
}

.timeline-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.timeline-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.timeline-text {
  color: #4B5563;
  line-height: 1.7;
}

/* Testimonials */
.testimonials-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  opacity: 0;
  transform: scale(0.95);
}

.testimonial-card.animate-in {
  opacity: 1;
  transform: scale(1);
}

.testimonial-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 20px 60px rgba(255, 107, 53, 0.3);
}

.testimonial-stars {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.testimonial-text {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: #4a4a4a;
  margin-bottom: 2rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 107, 53, 0.5);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #1f1f1f;
}

.author-role {
  font-size: 0.875rem;
  color: #6b6b6b;
}

/* Technology Section */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.tech-card {
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  text-align: center;
}

.tech-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 20px 60px rgba(255, 107, 53, 0.3);
}

.tech-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 12px rgba(255, 107, 53, 0.3));
}

.tech-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tech-desc {
  color: #4B5563;
  line-height: 1.6;
}

/* Pricing */
.pricing-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.pricing-card-modern {
  position: relative;
  padding: 3rem 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(30px);
}

.pricing-card-modern.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.pricing-card-modern.featured {
  border-color: rgba(255, 107, 53, 0.5);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 60px rgba(255, 107, 53, 0.3);
  transform: scale(1.05);
}

.pricing-card-modern:hover {
  transform: translateY(-8px) scale(1.05);
  border-color: rgba(255, 107, 53, 0.7);
  box-shadow: 0 24px 70px rgba(255, 107, 53, 0.4);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pricing-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.pricing-tier-modern {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.pricing-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.price-amount {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-period {
  font-size: 1.125rem;
  color: #1F2937;
}

.pricing-desc-modern {
  color: #4B5563;
  margin-bottom: 2rem;
}

.pricing-features {
  list-style: none;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #CBD5E1;
}

.pricing-features svg {
  color: #6BE8E0;
  flex-shrink: 0;
}

.btn-pricing {
  display: block;
  width: 100%;
  padding: 1rem;
  text-align: center;
  background: rgba(255, 107, 53, 0.1);
  color: #FF8B3D;
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-pricing:hover {
  background: rgba(255, 107, 53, 0.2);
  border-color: rgba(255, 107, 53, 0.5);
  transform: translateY(-2px);
}

.btn-pricing-featured {
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  color: white;
  border-color: transparent;
}

.btn-pricing-featured:hover {
  background: linear-gradient(135deg, #F59E0B, #FF8B3D);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.5);
}

/* CTA Section */
.cta-section {
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
}

.cta-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(16, 185, 129, 0.1));
  pointer-events: none;
}

.cta-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1F2937 0%, #4B5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: #4B5563;
  margin-bottom: 2.5rem;
}

.btn-cta {
  font-size: 1.25rem;
  padding: 1.25rem 3rem;
}

/* Footer */
.footer {
  padding: 4rem 0 2rem;
  background: linear-gradient(135deg, #2c3e5f 0%, #3d5a80 50%, #2c3e5f 100%);
  color: #ffffff;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 600px;
  text-align: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-logo-icon {
  font-size: 1.5rem;
  background: #2d3e50;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.footer-logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
}

.footer-right {
  display: flex;
  gap: 4rem;
}

.footer-section {
  min-width: 150px;
}

.footer-heading {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.2s;
  display: inline-block;
}

.footer-link:hover {
  color: #FF8B3D;
  transform: translateX(4px);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

/* Responsive Design */

/* Base mobile optimization */
.landing-page {
  width: 100%;
  overflow-x: hidden;
}

/* Tablets and smaller laptops */
@media (max-width: 991px) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .hero-title {
    font-size: 3rem;
    line-height: 1.1;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2.25rem;
  }

  .feature-card, .sport-card {
    padding: 1.75rem;
  }

  .timeline-item {
    gap: 2rem;
  }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 32px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: linear-gradient(135deg, #FF8B3D, #F59E0B);
  border-radius: 3px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-line.active:nth-child(1) {
  transform: translateY(10.5px) rotate(45deg);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: translateY(-10.5px) rotate(-45deg);
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 85%;
  max-width: 400px;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  z-index: 1001;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
  background: linear-gradient(135deg, rgba(255, 139, 61, 0.05), rgba(245, 158, 11, 0.05));
}

.mobile-menu-close {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 139, 61, 0.1);
  color: #FF8B3D;
  font-size: 2rem;
  line-height: 1;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mobile-menu-close:hover {
  background: rgba(255, 139, 61, 0.2);
  transform: rotate(90deg);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 0.5rem;
}

.mobile-nav-link {
  padding: 1rem 1.25rem;
  color: #1F2937;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.mobile-nav-link:hover {
  background: rgba(255, 139, 61, 0.08);
  color: #FF8B3D;
  border-color: rgba(255, 139, 61, 0.2);
  transform: translateX(4px);
}

.mobile-menu-divider {
  height: 1px;
  background: #E5E7EB;
  margin: 1rem 0;
}

.mobile-nav .btn {
  margin-top: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  justify-content: center;
}

.w-100 {
  width: 100%;
}

/* Slide Fade Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-from .mobile-menu,
.slide-fade-leave-to .mobile-menu {
  transform: translateX(100%);
}

.slide-fade-enter-to .mobile-menu,
.slide-fade-leave-from .mobile-menu {
  transform: translateX(0);
}

/* Tablets and mobile phones */
@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .container {
    padding-left: 15px;
    padding-right: 15px;
  }

  .hero {
    padding: 4rem 0;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-visual {
    height: 400px;
  }

  .live-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stat-item {
    text-align: center;
  }

  .hero-cta {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }

  .trust-badges {
    flex-direction: column;
    gap: 1rem;
  }

  .section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .features-grid, .sports-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .timeline-item {
    grid-template-columns: 80px 1fr;
    gap: 1.5rem;
  }

  .timeline-number {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .timeline-title {
    font-size: 1.25rem;
  }

  .cta-title {
    font-size: 2rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }
}

/* Mobile phones */
@media (max-width: 576px) {
  .container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .hero {
    padding: 3rem 0;
  }

  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }

  .hero-description {
    font-size: 0.95rem;
  }

  .hero-visual {
    height: 300px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .cta-button {
    padding: 0.9rem 1.75rem;
    font-size: 0.95rem;
  }

  .trust-badge {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
  }

  .section {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .section-subtitle {
    font-size: 0.9rem;
  }

  .feature-card, .sport-card {
    padding: 1.5rem;
  }

  .feature-icon, .sport-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .feature-title, .sport-name {
    font-size: 1.1rem;
  }

  .feature-description, .sport-description {
    font-size: 0.875rem;
  }

  .timeline-item {
    grid-template-columns: 60px 1fr;
    gap: 1rem;
  }

  .timeline-number {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .timeline-title {
    font-size: 1.1rem;
  }

  .timeline-description {
    font-size: 0.875rem;
  }

  .cta-section {
    padding: 3rem 0;
  }

  .cta-title {
    font-size: 1.75rem;
  }

  .cta-description {
    font-size: 0.95rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-buttons .cta-button {
    width: 100%;
  }

  .footer {
    padding: 2.5rem 0 1.5rem;
  }

  .footer-brand {
    font-size: 1.25rem;
  }

  .footer-description {
    font-size: 0.85rem;
  }

  .footer-links {
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .footer-link {
    font-size: 0.85rem;
  }
}

/* Extra small phones */
@media (max-width: 375px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 0.9rem;
  }

  .hero-visual {
    height: 250px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .cta-title {
    font-size: 1.5rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }

  .timeline-item {
    grid-template-columns: 50px 1fr;
  }

  .timeline-number {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }

  .feature-card, .sport-card {
    padding: 1.25rem;
  }
}

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}
</style>
