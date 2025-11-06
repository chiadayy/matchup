<template>
  <div class="match-container">
    <!-- Background Video -->
    <div class="video-background">
      <video autoplay muted loop playsinline>
        <source src="/cool.mp4" type="video/mp4">
      </video>
    </div>

    <div class="content-wrapper">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading your match...</p>
      </div>
      <div v-else-if="error" class="error">
        <span>⚠️</span>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="conversationId" class="match-layout">
        <!-- Mobile Tabs -->
        <div class="mobile-tabs">
          <button 
            @click="activeTab = 'chat'" 
            :class="{ active: activeTab === 'chat' }"
            class="tab-button"
          >
            💬 Chat
          </button>
          <button 
            @click="activeTab = 'info'" 
            :class="{ active: activeTab === 'info' }"
            class="tab-button"
          >
            📋 Match Info
          </button>
        </div>

        <!-- Sidebar -->
        <div class="sidebar" :class="{ 'mobile-hidden': activeTab === 'chat' }">
          <!-- Move back button here, inside match-header -->
          <div class="match-header">
            <router-link to="/my-matches" class="back-button-inline">
              <span class="back-icon">←</span>
              <span>Back to Matches</span>
            </router-link>
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
                <span class="value"
                  >{{ matchData.total_player_count }} spots</span
                >
              </div>
            </div>
          </div>

          <div class="match-section" v-if="matchData.description">
            <h3><span class="icon">📝</span> Match Details</h3>
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
              <div class="player" v-for="player in allPlayers" :key="player.id">
                <img
                  :src="
                    player.profile_image ||
                    'https://ui-avatars.com/api/?name=' +
                      player.name +
                      '&background=1a1a1a&color=fff'
                  "
                  :alt="player.name"
                />
                <div class="player-info">
                  <p class="player-name">
                    {{ player.name }}
                    <span class="badge" v-if="player.isHost">Host</span>
                  </p>
                  <p class="player-role">{{ player.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="chat-area" :class="{ 'mobile-hidden': activeTab === 'info' }">
          <ChatRoom
            :matchId="matchId"
            :conversationId="conversationId"
            :currentUserId="currentUserId"
          />
        </div>
      </div>
      <div v-else class="no-chat">
        <div class="no-chat-icon">⏳</div>
        <h3>Chat Room Not Available</h3>
        <p>Waiting for more players to join and confirm their participation.</p>
        <p class="sub-info">
          The chat will open automatically once 2 or more players have joined this
          match.
        </p>
        <router-link to="/my-matches" class="back-link"
          >Back to My Matches</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/lib/supabase";
import ChatRoom from "../components/ChatRoom.vue";

export default {
  name: "MatchChatRoom",
  components: { ChatRoom },

  setup() {
    const route = useRoute();
    const matchId = ref(parseInt(route.params.id));
    const loading = ref(true);
    const error = ref(null);
    const conversationId = ref(null);
    const currentUserId = ref(null);
    const matchData = ref({});
    const weather = ref(null);
    const allPlayers = ref([]);
    const activeTab = ref('chat');

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const fetchWeather = async (location) => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!apiKey) {
          console.log("No weather API key");
          return;
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
          console.log("Weather API failed:", response.status);
          return;
        }

        const data = await response.json();

        if (data.main && data.main.temp && data.weather && data.weather[0]) {
          weather.value = {
            temp: Math.round(data.main.temp),
            description:
              data.weather[0].description.charAt(0).toUpperCase() +
              data.weather[0].description.slice(1),
          };
        }
      } catch (err) {
        console.log("Weather fetch skipped:", err.message);
      }
    };

    const fetchProfile = async (userId) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
        return await response.json();
      } catch (err) {
        console.error("Profile fetch failed:", err);
        return null;
      }
    };

    onMounted(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        currentUserId.value = user.id;

        const matchResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/matches/${matchId.value}`
        );
        matchData.value = await matchResponse.json();
        console.log("🎯 MATCH DATA:", matchData.value);

        console.log("🔎 Raw conversation_id:", matchData.value.conversation_id);
        console.log("🔎 Type:", typeof matchData.value.conversation_id);
        console.log("🔎 Equals 0?", matchData.value.conversation_id === 0);
        console.log('🔎 Equals "0"?', matchData.value.conversation_id === "0");
        console.log("🔎 Is falsy (!)?", !matchData.value.conversation_id);
        console.log(
          "🔎 Full condition:",
          !matchData.value.conversation_id ||
            matchData.value.conversation_id === 0
        );

        if (
          !matchData.value.conversation_id ||
          matchData.value.conversation_id === 0 ||
          matchData.value.conversation_id === "0"
        ) {
          try {
            const createChatResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/chat/check-and-create`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ match_id: matchId.value }),
              }
            );

            const createChatResult = await createChatResponse.json();
            console.log("🔍 CHAT CREATION RESULT:", createChatResult);

            if (createChatResult.conversation_id) {
              conversationId.value = createChatResult.conversation_id;
              matchData.value.conversation_id =
                createChatResult.conversation_id;
            } else {
              console.log(createChatResult.message);
            }
          } catch (chatError) {
            console.error("Error creating chat:", chatError);
          }
        } else {
          conversationId.value = matchData.value.conversation_id;
        }

        if (matchData.value.location) {
          await fetchWeather(matchData.value.location);
        }

        const usersResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/matches/${matchId.value}/users`
        );
        const users = await usersResponse.json();

        if (Array.isArray(users)) {
          const profiles = await Promise.all(
            users.map((u) => fetchProfile(u.user_id))
          );
          allPlayers.value = profiles.map((profile) => ({
            ...profile,
            isHost: profile.id === matchData.value.host,
          }));
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    return {
      matchId,
      loading,
      error,
      conversationId,
      currentUserId,
      matchData,
      weather,
      allPlayers,
      activeTab,
      formatDate,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* Video Background */
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.video-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.match-container {
  position: relative;
  min-height: 100vh;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  background: rgba(255, 255, 255, 0.75);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.back-button-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
}

.back-button-inline:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.back-icon {
  font-size: 18px;
  font-weight: bold;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.95);
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
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
  border-top: 4px solid #1a1a1a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
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
  margin-bottom: 12px;
}

.no-chat .sub-info {
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  padding: 12px 24px;
  background: #1a1a1a;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-link:hover {
  background: #2d2d2d;
  transform: translateY(-2px);
}

.match-layout {
  display: flex;
  width: 100%;
  height: calc(100vh - 200px);
  max-height: 900px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sidebar {
  width: 380px;
  background: #fafbfc;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.match-header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0;
  background: #ffffff;
  color: #1a1a1a;
  border-bottom: 1px solid #e2e8f0;
}

.match-header::before {
  display: none;
}

.back-button-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.back-button-inline:hover {
  color: #1a1a1a;
  background: #f8fafc;
}

.back-icon {
  font-size: 16px;
}

.header-content {
  padding: 24px;
}

.match-header h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  text-shadow: none;
}

.price-badge {
  display: inline-flex;
  align-items: center;
  background: #0f172a;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  border: none;
  box-shadow: none;
}

.dollar {
  font-size: 14px;
  margin-right: 2px;
  opacity: 0.8;
}

.match-section {
  background: white;
  padding: 20px 24px;
  margin: 12px 16px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.match-section:hover {
  border-color: #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.match-section h3 {
  margin: 0 0 16px 0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  font-size: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
}

.description {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.weather-section {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fde68a;
}

.weather-card {
  text-align: center;
  padding: 12px;
}

.weather-temp {
  font-size: 36px;
  font-weight: 600;
  color: #0f172a;
  text-shadow: none;
}

.weather-desc {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  margin-top: 4px;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.player:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  transform: translateX(4px);
}

.player img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  box-shadow: none;
  transition: all 0.2s ease;
}

.player:hover img {
  transform: none;
  border-color: #cbd5e0;
}

.player-name {
  margin: 0 0 2px 0;
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.player-role {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.badge {
  background: #0f172a;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: none;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* Mobile Tabs */
.mobile-tabs {
  display: none;
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 2px solid #e2e8f0;
  padding: 8px;
  gap: 8px;
}

.tab-button {
  flex: 1;
  padding: 14px 20px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-button:hover {
  background: #f1f5f9;
  color: #475569;
}

.tab-button.active {
  background: #0f172a;
  color: white;
}

/* Only hide on mobile/tablet */
@media (max-width: 991px) {
  .mobile-hidden {
    display: none !important;
  }
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablets and below (991px) */
@media (max-width: 991px) {
  .match-container {
    padding: 20px;
  }

  .content-wrapper {
    padding: 10px;
    background: transparent; 
  }

  .mobile-tabs {
    display: flex;
  }

  .match-layout {
    flex-direction: column;
    max-width: 100%;
    height: calc(100vh - 40px);
    max-height: none; 
  }

  .sidebar {
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: calc(100vh - 150px);
  }

  .chat-area {
    width: 100%;
    height: calc(100vh - 100px);
    min-height: 500px;
  }

  .match-header h2 {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Mobile phones (768px) */
@media (max-width: 768px) {
  .match-container {
    padding: 15px;
  }

  .content-wrapper {
    padding: 25px 15px;
  }

  .match-header {
    padding: 20px;
  }

  .match-header h2 {
    font-size: 1.3rem;
  }

  .price-badge {
    font-size: 1.2rem;
    padding: 8px 16px;
  }

  .back-button-inline {
    padding: 10px 20px;
    font-size: 13px;
  }

  .match-section {
    padding: 16px 20px;
  }

  .match-section h3 {
    font-size: 1rem;
  }

  .info-item .label {
    font-size: 11px;
  }

  .info-item .value {
    font-size: 13px;
  }

  .players-list {
    gap: 10px;
  }

  .player img {
    width: 35px;
    height: 35px;
  }

  .player-name {
    font-size: 13px;
  }

  .player-role {
    font-size: 11px;
  }

  .chat-area {
    height: 450px;
  }

  .weather-temp {
    font-size: 2rem;
  }
}

/* Small phones (576px) */
@media (max-width: 576px) {
  .match-container {
    padding: 10px;
  }

  .content-wrapper {
    padding: 20px 10px;
  }

  .sidebar {
    border-radius: 12px;
  }

  .match-header {
    padding: 16px;
  }

  .match-header h2 {
    font-size: 1.1rem;
  }

  .price-badge {
    font-size: 1rem;
    padding: 6px 12px;
  }

  .back-button-inline {
    padding: 8px 16px;
    font-size: 12px;
    gap: 6px;
  }

  .back-icon {
    font-size: 16px;
  }

  .match-section {
    padding: 12px 16px;
  }

  .match-section h3 {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  .icon {
    font-size: 1rem;
  }

  .info-item {
    padding: 8px;
  }

  .info-item .label {
    font-size: 10px;
  }

  .info-item .value {
    font-size: 12px;
  }

  .description {
    font-size: 13px;
  }

  .weather-card {
    padding: 12px;
  }

  .weather-temp {
    font-size: 1.8rem;
  }

  .weather-desc {
    font-size: 13px;
  }

  .player {
    padding: 8px;
  }

  .player img {
    width: 32px;
    height: 32px;
  }

  .player-name {
    font-size: 12px;
  }

  .player-role {
    font-size: 10px;
  }

  .badge {
    font-size: 8px;
    padding: 2px 6px;
  }

  .chat-area {
    height: 400px;
    border-radius: 12px;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 13px;
  }
}

/* Extra small phones (375px) */
@media (max-width: 375px) {
  .match-header h2 {
    font-size: 1rem;
  }

  .price-badge {
    font-size: 0.9rem;
  }

  .match-section h3 {
    font-size: 0.85rem;
  }

  .chat-area {
    height: 350px;
  }
}

/* ========== LANDSCAPE ORIENTATION SUPPORT ========== */

/* Tablets in landscape */
@media (max-height: 768px) and (orientation: landscape) {
  .match-layout {
    max-height: 90vh;
  }

  .sidebar {
    max-height: 90vh;
  }

  .chat-area {
    height: 90vh;
  }

  .match-section {
    padding: 16px 20px;
  }
}

/* Mobile phones in landscape */
@media (max-height: 500px) and (orientation: landscape) {
  .match-container {
    padding: 16px;
  }

  .content-wrapper {
    padding: 20px;
  }

  .match-layout {
    flex-direction: row;
    max-height: 85vh;
  }

  .sidebar {
    width: 320px;
    max-height: 85vh;
  }

  .match-header {
    padding: 16px;
  }

  .match-section {
    padding: 12px 16px;
    margin: 8px 12px;
  }

  .chat-area {
    height: 85vh;
  }

  .player img {
    width: 40px;
    height: 40px;
  }

  .mobile-tabs {
    display: none;
  }

  .mobile-hidden {
    display: block !important;
  }
}
</style>