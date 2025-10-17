<template>
  <div class="match-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading your match...</p>
    </div>
    <div v-else-if="error" class="error">
      <span>⚠️</span>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="conversationId" class="match-layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="match-header">
          <div class="header-content">
            <h2>{{ matchData.name }}</h2>
            <div class="price-badge">
              <span class="dollar">$</span>{{ matchData.total_price }}
            </div>
          </div>
        </div>
        
        <div class="match-section">
          <h3><span class="icon">📍</span> Location & Time</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Location</span>
              <span class="value">{{ matchData.location }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date</span>
              <span class="value">{{ formatDate(matchData.date) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Time</span>
              <span class="value">{{ matchData.time }}</span>
            </div>
            <div class="info-item">
              <span class="label">Players</span>
              <span class="value">{{ matchData.total_player_count }} spots</span>
            </div>
          </div>
        </div>

        <div class="match-section" v-if="matchData.description">
          <h3><span class="icon">📝</span> Details</h3>
          <p class="description">{{ matchData.description }}</p>
        </div>

        <div class="match-section weather-section" v-if="weather">
          <h3><span class="icon">🌤️</span> Weather Forecast</h3>
          <div class="weather-card">
            <div class="weather-temp">{{ weather.temp }}°C</div>
            <div class="weather-desc">{{ weather.description }}</div>
          </div>
        </div>

        <div class="match-section">
          <h3><span class="icon">👥</span> Match Players</h3>
          <div class="players-list">
            <div class="player" v-if="hostProfile">
              <img :src="hostProfile.profile_image || 'https://ui-avatars.com/api/?name=' + hostProfile.name + '&background=667eea&color=fff'" alt="host" />
              <div class="player-info">
                <p class="player-name">
                  {{ hostProfile.name }}
                  <span class="badge">Host</span>
                </p>
                <p class="player-role">{{ hostProfile.role }}</p>
              </div>
            </div>
            <div class="player" v-if="playerProfile">
              <img :src="playerProfile.profile_image || 'https://ui-avatars.com/api/?name=' + playerProfile.name + '&background=764ba2&color=fff'" alt="player" />
              <div class="player-info">
                <p class="player-name">{{ playerProfile.name }}</p>
                <p class="player-role">{{ playerProfile.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area">
        <ChatRoom :matchId="1" :conversationId="conversationId" :currentUserId="currentUserId" />
      </div>
    </div>
    <div v-else class="no-chat">
      <div class="no-chat-icon">⏳</div>
      <h3>Waiting for Confirmation</h3>
      <p>Both players need to confirm before the chat becomes available.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ChatRoom from '../components/ChatRoom.vue';

export default {
  name: 'MyMatches',
  components: { ChatRoom },
  
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const conversationId = ref(null);
    // const currentUserId = ref('17c26d43-eba7-445e-af45-84e34dac8ece');
    const currentUserId = ref('77995803-7951-4f0e-9797-f84a6fecec1e'); // User 2
    
    const matchData = ref({});
    const weather = ref(null);
    const hostProfile = ref(null);
    const playerProfile = ref(null);
    
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    };

    const fetchWeather = async (location) => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        weather.value = {
          temp: Math.round(data.main.temp),
          description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)
        };
      } catch (err) {
        console.error('Weather fetch failed:', err);
      }
    };

    const fetchProfile = async (userId) => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        return await response.json();
      } catch (err) {
        console.error('Profile fetch failed:', err);
        return null;
      }
    };
    
    onMounted(async () => {
      try {
        const matchResponse = await fetch('http://localhost:3000/matches/1');
        matchData.value = await matchResponse.json();
        conversationId.value = matchData.value.conversation_id;

        if (matchData.value.location) {
          await fetchWeather(matchData.value.location);
        }

        if (matchData.value.host) {
          hostProfile.value = await fetchProfile(matchData.value.host);
        }

        const usersResponse = await fetch(`http://localhost:3000/matches/1/users`);
        const users = await usersResponse.json();
        if (Array.isArray(users)) {
          const player = users.find(u => u.user_id !== matchData.value.host);
          if (player) {
            playerProfile.value = await fetchProfile(player.user_id);
          }
        }

      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });
    
    return { 
      loading, 
      error, 
      conversationId, 
      currentUserId, 
      matchData, 
      weather,
      hostProfile,
      playerProfile,
      formatDate 
    };
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.match-container {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: #4a5568;
  font-size: 16px;
  font-weight: 500;
}

.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.error span {
  font-size: 48px;
}

.error p {
  color: #e53e3e;
  font-size: 18px;
  font-weight: 600;
}

.no-chat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
}

.no-chat-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.no-chat h3 {
  font-size: 24px;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.no-chat p {
  font-size: 16px;
  color: #718096;
  max-width: 400px;
}

.match-layout {
  display: flex;
  width: 100%;
  max-width: 1400px;
  height: 85vh;
  max-height: 900px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.sidebar {
  width: 380px;
  background: #ffffff;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f3f5;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.match-header {
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.match-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20%, -20%); }
}

.header-content {
  position: relative;
  padding: 36px 28px;
  z-index: 1;
}

.match-header h2 {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.price-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  color: white;
  padding: 10px 20px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.dollar {
  font-size: 16px;
  margin-right: 4px;
  opacity: 0.9;
}

.match-section {
  background: white;
  padding: 24px 28px;
  margin: 0;
  border-bottom: 1px solid #f1f3f5;
  transition: all 0.3s ease;
}

.match-section:hover {
  background: #fafbfc;
}

.match-section h3 {
  margin: 0 0 20px 0;
  font-size: 14px;
  font-weight: 700;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 18px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: #a0aec0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 15px;
  color: #2d3748;
  font-weight: 600;
}

.description {
  margin: 0;
  color: #4a5568;
  font-size: 15px;
  line-height: 1.7;
}

.weather-section {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border: none;
}

.weather-section h3 {
  color: #2d3748;
}

.weather-card {
  text-align: center;
  padding: 16px;
}

.weather-temp {
  font-size: 48px;
  font-weight: 700;
  color: #2d3748;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.weather-desc {
  font-size: 16px;
  color: #4a5568;
  font-weight: 500;
  margin-top: 8px;
  text-transform: capitalize;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.player:hover {
  transform: translateX(8px) scale(1.02);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.player img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.player:hover img {
  transform: rotate(5deg) scale(1.1);
}

.player-info {
  flex: 1;
}

.player-name {
  margin: 0 0 4px 0;
  font-weight: 700;
  font-size: 16px;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-role {
  margin: 0;
  font-size: 13px;
  color: #718096;
  text-transform: capitalize;
}

.badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>