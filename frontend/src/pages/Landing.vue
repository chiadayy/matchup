<template>
  <div class="landing-page">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">MatchUp</div>
          <nav class="nav">
            <a href="#features" class="nav-link">Features</a>
            <a href="#how-it-works" class="nav-link">How it works</a>
            <a href="#pricing" class="nav-link">Pricing</a>
            <a href="#tech" class="nav-link">Tech</a>
            <RouterLink to="/register" class="btn btn-primary btn-sm">Get Started</RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Pick a game. Show up ready.</h1>
            <p class="hero-subtitle">Find nearby matches, see the weather at kickoff, and join in seconds — no more messy group chats.</p>
            <div class="hero-cta">
              <RouterLink to="/register" class="btn btn-primary btn-lg">Get Started Free</RouterLink>
              <RouterLink to="/login" class="btn btn-secondary btn-lg">Sign In</RouterLink>
            </div>
          </div>
          <div class="hero-visual">
            <!-- Sports Illustration -->
            <div class="sports-illustration">
              <!-- Basketball -->
              <svg class="sport-icon basketball" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="55" fill="#FF6B35" stroke="#D94E1F" stroke-width="3"/>
                <path d="M 60 5 Q 80 60 60 115" stroke="#D94E1F" stroke-width="2.5" fill="none"/>
                <path d="M 60 5 Q 40 60 60 115" stroke="#D94E1F" stroke-width="2.5" fill="none"/>
                <path d="M 5 60 Q 60 40 115 60" stroke="#D94E1F" stroke-width="2.5" fill="none"/>
                <path d="M 5 60 Q 60 80 115 60" stroke="#D94E1F" stroke-width="2.5" fill="none"/>
                <ellipse cx="60" cy="60" rx="55" ry="20" stroke="#D94E1F" stroke-width="2.5" fill="none"/>
              </svg>

              <!-- Soccer Ball -->
              <svg class="sport-icon soccer" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="55" fill="#FFFFFF" stroke="#1E293B" stroke-width="3"/>
                <path d="M 60 10 L 75 35 L 95 35 L 105 60 L 90 85 L 70 85 L 60 105 L 50 85 L 30 85 L 15 60 L 25 35 L 45 35 Z" fill="#1E293B"/>
                <polygon points="60,25 70,40 50,40" fill="#FFFFFF"/>
                <polygon points="85,45 95,60 80,70" fill="#FFFFFF"/>
                <polygon points="60,95 70,80 50,80" fill="#FFFFFF"/>
                <polygon points="35,45 25,60 40,70" fill="#FFFFFF"/>
              </svg>

              <!-- Tennis Ball -->
              <svg class="sport-icon tennis" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="55" fill="#BFFF00" stroke="#9CD900" stroke-width="3"/>
                <path d="M 20 35 Q 40 60 20 85" stroke="#FFFFFF" stroke-width="3" fill="none"/>
                <path d="M 100 35 Q 80 60 100 85" stroke="#FFFFFF" stroke-width="3" fill="none"/>
              </svg>

              <!-- Volleyball -->
              <svg class="sport-icon volleyball" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="55" fill="#FFD700" stroke="#E5BE00" stroke-width="3"/>
                <path d="M 15 60 Q 60 30 105 60" stroke="#E5BE00" stroke-width="2.5" fill="none"/>
                <path d="M 15 60 Q 60 90 105 60" stroke="#E5BE00" stroke-width="2.5" fill="none"/>
                <path d="M 60 5 L 60 115" stroke="#E5BE00" stroke-width="2.5"/>
                <path d="M 30 15 Q 60 60 90 105" stroke="#E5BE00" stroke-width="2.5" fill="none"/>
                <path d="M 90 15 Q 60 60 30 105" stroke="#E5BE00" stroke-width="2.5" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">Everything you need to organize and join games</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FF6B35" stroke="#D94E1F" stroke-width="1.5"/>
                <path d="M 12 3 Q 14 12 12 21" stroke="#D94E1F" stroke-width="1" fill="none"/>
                <path d="M 12 3 Q 10 12 12 21" stroke="#D94E1F" stroke-width="1" fill="none"/>
                <path d="M 3 12 Q 12 10 21 12" stroke="#D94E1F" stroke-width="1" fill="none"/>
                <path d="M 3 12 Q 12 14 21 12" stroke="#D94E1F" stroke-width="1" fill="none"/>
              </svg>
            </div>
            <h3 class="feature-title">Game creation & management</h3>
            <ul class="feature-list">
              <li>Create a match with sport, skill, date/time, location, and cost.</li>
              <li>Live cards show RSVP count and key details.</li>
              <li>Edits and cancellations update instantly.</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#3B82F6" stroke="#1E40AF" stroke-width="1.5"/>
                <circle cx="12" cy="10" r="3" fill="#FFFFFF" stroke="#1E40AF" stroke-width="1.5"/>
              </svg>
            </div>
            <h3 class="feature-title">Location & weather</h3>
            <ul class="feature-list">
              <li>Search venues in Singapore and see nearby games on the map.</li>
              <li>Forecast at kickoff: temperature, rain probability, and icon.</li>
              <li>Fewer cancellations with early weather advisories.</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#10B981" stroke="#059669" stroke-width="1.5"/>
                <circle cx="8" cy="10" r="1" fill="#FFFFFF"/>
                <circle cx="12" cy="10" r="1" fill="#FFFFFF"/>
                <circle cx="16" cy="10" r="1" fill="#FFFFFF"/>
              </svg>
            </div>
            <h3 class="feature-title">In-app chatrooms</h3>
            <ul class="feature-list">
              <li>Auto-created per game when the first player joins.</li>
              <li>Instant access for RSVPs; all logistics in one thread.</li>
              <li>Powered by TalkJS.</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
                <rect x="3" y="8" width="18" height="3" fill="#D97706"/>
                <circle cx="16" cy="14" r="1.5" fill="#FFFFFF"/>
              </svg>
            </div>
            <h3 class="feature-title">Wallet & payments</h3>
            <ul class="feature-list">
              <li>Pay on join for paid games; funds held in a game escrow.</li>
              <li>Auto-payouts when the game fills; auto-refunds if not by T-12h.</li>
              <li>Built on Stripe (PaymentIntents, Connect, Refunds, Webhooks).</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="how-it-works">
      <div class="container">
        <h2 class="section-title">How it works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3 class="step-title">Search a venue or browse the map</h3>
            <p class="step-text">Find courts and fields near you or explore what's available across Singapore.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3 class="step-title">Pick a game that fits your skill & schedule</h3>
            <p class="step-text">Filter by sport, skill level, time, and cost to find your perfect match.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3 class="step-title">Join, pay if needed, and get reminders</h3>
            <p class="step-text">Secure your spot, coordinate via chat, and never miss kickoff.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Extras -->
    <section class="extras">
      <div class="container">
        <h2 class="section-title">Profile & Calendar</h2>
        <div class="extras-grid">
          <div class="extra-card">
            <h3 class="extra-title">History</h3>
            <p class="extra-text">Track past games with date, time, court, and roster details.</p>
          </div>
          <div class="extra-card">
            <h3 class="extra-title">Calendar sync</h3>
            <p class="extra-text">Joining a game adds it automatically to Google, Outlook, or Apple Calendar.</p>
          </div>
          <div class="extra-card">
            <h3 class="extra-title">Reminders & push</h3>
            <p class="extra-text">Helpful nudges so you never miss kickoff.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social proof -->
    <section class="social-proof">
      <div class="container">
        <h2 class="section-title">Loved by players and organisers</h2>
        <div class="proof-grid">
          <div class="proof-card">
            <p class="proof-quote">"Organisers fill games 2× faster with built-in payments and chat."</p>
          </div>
          <div class="proof-card">
            <p class="proof-quote">"92% of players say the weather preview saved them from at least one bad game week."</p>
          </div>
          <div class="proof-card">
            <p class="proof-stat">Used by clubs across Singapore's most popular courts.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TECH / STACK -->
    <section id="tech" class="section tech">
      <div class="container">
        <header class="tech-head">
          <h2 class="tech-title">Powered by modern technology</h2>
          <p class="tech-sub">
            Built with fast, secure web tech so you can discover games,
            see the forecast, and join with confidence.
          </p>
        </header>

        <ul class="tech-grid" role="list">
          <!-- Vue -->
          <li class="tech-card" aria-label="Vue">
            <div class="tech-icon" aria-hidden="true">
              <!-- simple V glyph -->
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#10B981" stroke-width="1.6">
                <path d="M3 4h6l3 5 3-5h6l-9 16L3 4z"/>
              </svg>
            </div>
            <span class="tech-label">Vue</span>
          </li>

          <!-- Vite -->
          <li class="tech-card" aria-label="Vite">
            <div class="tech-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#06B6D4" stroke-width="1.6">
                <path d="M3 5l9-3 9 3-9 15L3 5z"/>
              </svg>
            </div>
            <span class="tech-label">Vite</span>
          </li>

          <!-- Google Maps -->
          <li class="tech-card" aria-label="Google Maps">
            <div class="tech-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#10B981" stroke-width="1.6">
                <circle cx="12" cy="10" r="4"/>
                <path d="M12 14c-3 0-6 2-6 5v2h12v-2c0-3-3-5-6-5z"/>
              </svg>
            </div>
            <span class="tech-label">Google&nbsp;Maps</span>
          </li>

          <!-- OpenWeather -->
          <li class="tech-card" aria-label="OpenWeather">
            <div class="tech-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#06B6D4" stroke-width="1.6">
                <path d="M7 15h8a4 4 0 0 0 0-8 5 5 0 0 0-9.7 1.6A3.5 3.5 0 0 0 7 15z"/>
              </svg>
            </div>
            <span class="tech-label">OpenWeather</span>
          </li>

          <!-- Stripe -->
          <li class="tech-card" aria-label="Stripe">
            <div class="tech-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#A78BFA" stroke-width="1.6">
                <path d="M4 12a6 6 0 0 1 6-6h7v4h-7a2 2 0 0 0 0 4h5a4 4 0 1 1 0 8H7v-4h8a2 2 0 0 0 0-4H10a6 6 0 0 1-6-6z"/>
              </svg>
            </div>
            <span class="tech-label">Stripe</span>
          </li>

          <!-- TalkJS -->
          <li class="tech-card" aria-label="TalkJS">
            <div class="tech-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F59E0B" stroke-width="1.6">
                <path d="M4 5h16v10H7l-3 3V5z"/>
                <circle cx="9" cy="10" r="1.5"/><circle cx="12" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/>
              </svg>
            </div>
            <span class="tech-label">TalkJS</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="pricing">
      <div class="container">
        <h2 class="section-title">Pricing</h2>
        <p class="pricing-note">MVP — subject to change</p>
        <div class="pricing-grid">
          <div class="pricing-card">
            <h3 class="pricing-tier">Free</h3>
            <p class="pricing-audience">Players</p>
            <p class="pricing-description">Join games, chat with teammates, and stay updated on weather and logistics.</p>
          </div>
          <div class="pricing-card pricing-card-featured">
            <h3 class="pricing-tier">Pro</h3>
            <p class="pricing-audience">Organisers</p>
            <p class="pricing-description">Advanced features for creating and managing games, payments, and analytics.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Band -->
    <section class="cta-band">
      <div class="container">
        <h2 class="cta-title">Ready to play?</h2>
        <RouterLink to="/register" class="btn btn-primary btn-lg">Join MatchUp Today</RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p class="footer-text">© {{ currentYear }} MatchUp</p>
        <div class="footer-links">
          <a href="#" class="footer-link">Privacy</a>
          <span class="footer-separator">·</span>
          <a href="#" class="footer-link">Terms</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const currentYear = computed(() => new Date().getFullYear())

// Smooth scroll for anchor links
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]')
    if (target) {
      e.preventDefault()
      const id = target.getAttribute('href').slice(1)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  })
}
</script>

<style scoped>
/* Reset & Base */
* {
  box-sizing: border-box;
}

.landing-page {
  background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
  color: #F1F5F9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 107, 53, 0.2);
  z-index: 100;
  padding: 1rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FF6B35 0%, #F59E0B 50%, #10B981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #94A3B8;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #FF6B35;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  min-height: 44px;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #D94E1F 0%, #D97706 100%);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}

.btn-primary:focus {
  outline: 2px solid #FF6B35;
  outline-offset: 2px;
}

.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  border: 2px solid #475569;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 107, 53, 0.1);
  border-color: #FF6B35;
  transform: translateY(-2px);
}

.btn-secondary:focus {
  outline: 2px solid #64748B;
  outline-offset: 2px;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.0625rem;
  min-height: 50px;
}

/* Hero */
.hero {
  padding: 4rem 0;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 107, 53, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1rem;
  color: #FFFFFF;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #CBD5E1;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Sports Illustration */
.sports-illustration {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 400px;
  width: 100%;
}

.sport-icon {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  transition: transform 0.3s ease;
}

.sport-icon:hover {
  transform: scale(1.1) rotate(5deg);
}

.basketball {
  animation: bounce 2s ease-in-out infinite;
}

.soccer {
  animation: bounce 2s ease-in-out 0.5s infinite;
}

.tennis {
  animation: bounce 2s ease-in-out 1s infinite;
}

.volleyball {
  animation: bounce 2s ease-in-out 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Sections */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 3rem;
  color: #FFFFFF;
}

/* Features */
.features {
  padding: 5rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.feature-card {
  background: rgba(30, 41, 59, 0.5);
  border: 2px solid rgba(71, 85, 105, 0.5);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
  border-color: #FF6B35;
  background: rgba(30, 41, 59, 0.7);
}

.feature-icon {
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #FFFFFF;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
  color: #CBD5E1;
  font-size: 0.9375rem;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #FF6B35;
  font-weight: 700;
}

/* How it works */
.how-it-works {
  padding: 5rem 0;
  background: rgba(15, 23, 42, 0.5);
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.step {
  text-align: center;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%);
  color: #FFFFFF;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #FFFFFF;
}

.step-text {
  color: #CBD5E1;
  font-size: 0.9375rem;
  margin: 0;
}

/* Extras */
.extras {
  padding: 5rem 0;
}

.extras-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.extra-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.extra-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #FFFFFF;
}

.extra-text {
  color: #CBD5E1;
  font-size: 0.9375rem;
  margin: 0;
}

/* Social proof */
.social-proof {
  padding: 5rem 0;
  background: rgba(15, 23, 42, 0.5);
}

.proof-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.proof-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(8px);
}

.proof-quote, .proof-stat {
  font-size: 1.0625rem;
  color: #F1F5F9;
  margin: 0;
  font-style: italic;
}

.proof-stat {
  font-weight: 600;
  font-style: normal;
}

/* Pricing */
.pricing {
  padding: 5rem 0;
}

.pricing-note {
  text-align: center;
  color: #94A3B8;
  font-size: 0.875rem;
  margin: -1.5rem 0 2rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.pricing-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  backdrop-filter: blur(8px);
}

.pricing-card-featured {
  border-color: #FF6B35;
  border-width: 2px;
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.2);
}

.pricing-tier {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #FFFFFF;
}

.pricing-audience {
  font-size: 1rem;
  color: #FF6B35;
  font-weight: 600;
  margin: 0 0 1rem;
}

.pricing-description {
  color: #CBD5E1;
  font-size: 0.9375rem;
  margin: 0;
}

/* CTA Band */
.cta-band {
  padding: 4rem 0;
  background: linear-gradient(135deg, #FF6B35 0%, #F59E0B 50%, #10B981 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-band::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 1.5rem;
  position: relative;
  z-index: 1;
}

.cta-band .btn-primary {
  background: #FFFFFF;
  color: #FF6B35;
  position: relative;
  z-index: 1;
}

.cta-band .btn-primary:hover {
  background: #F7F8FA;
  color: #D94E1F;
}

/* Footer */
.footer {
  padding: 2rem 0;
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(71, 85, 105, 0.5);
}

.footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-text {
  color: #94A3B8;
  font-size: 0.875rem;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.footer-link {
  color: #94A3B8;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #FF6B35;
}

.footer-link:focus {
  outline: 2px solid #64748B;
  outline-offset: 2px;
  border-radius: 2px;
}

.footer-separator {
  color: #475569;
}

/* Responsive - Desktop */
@media (min-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr 1fr;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps {
    grid-template-columns: repeat(3, 1fr);
  }

  .extras-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .proof-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .nav-link {
    display: none;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.0625rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .hero-cta {
    flex-direction: column;
  }

  .hero-cta .btn {
    width: 100%;
  }
}

/* Focus styles for accessibility */
a:focus, button:focus {
  outline: 2px solid #FF6B35;
  outline-offset: 2px;
}

/* Tech Section */
.tech {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.tech::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.tech::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.tech .container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.tech-head {
  text-align: center;
  margin-bottom: 3.5rem;
}

.tech-title {
  color: #FFFFFF;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #10B981 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tech-sub {
  color: #CBD5E1;
  margin: 0;
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.tech-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  list-style: none;
  padding: 0;
  margin: 0;
}

@media (min-width: 540px) {
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .tech-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.tech-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 2px solid rgba(71, 85, 105, 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: default;
  backdrop-filter: blur(12px);
}

.tech-card:hover {
  transform: translateY(-4px);
  border-color: #10B981;
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
  background: rgba(15, 23, 42, 0.95);
}

.tech-card:focus-visible {
  outline: 3px solid #06B6D4;
  outline-offset: 2px;
}

.tech-icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.tech-card:hover .tech-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%);
  border-color: #10B981;
  transform: scale(1.05);
}

.tech-icon svg {
  width: 32px;
  height: 32px;
}

.tech-label {
  color: #F1F5F9;
  font-weight: 700;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
}

/* Scroll margin for sticky header offset */
#tech,
#features,
#how-it-works,
#pricing {
  scroll-margin-top: 80px;
}

html {
  scroll-behavior: smooth;
}
</style>
