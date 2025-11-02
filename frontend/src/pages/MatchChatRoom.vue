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
      <div class="chat-area">
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
    // const hostProfile = ref(null);
    // const playerProfile = ref(null);
    const allPlayers = ref([]);

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
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        return await response.json();
      } catch (err) {
        console.error("Profile fetch failed:", err);
        return null;
      }
    };

    onMounted(async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        currentUserId.value = user.id;

        // Fetch match data
        const matchResponse = await fetch(
          `http://localhost:3000/matches/${matchId.value}`
        );
        matchData.value = await matchResponse.json();
        console.log("🎯 MATCH DATA:", matchData.value);

        // Check if chat exists, if not try to create it
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
              "http://localhost:3000/chat/check-and-create",
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
              // Not enough players yet
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
          `http://localhost:3000/matches/${matchId.value}/users`
        );
        const users = await usersResponse.json();

        if (Array.isArray(users)) {
          // Fetch all player profiles
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
      // hostProfile,
      // playerProfile,
      allPlayers,
      formatDate,
    };
  },
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
  position: relative;
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.match-header::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20%, -20%);
  }
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.price-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  padding: 10px 20px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: #1a1a1a;
}

.player img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #1a1a1a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
