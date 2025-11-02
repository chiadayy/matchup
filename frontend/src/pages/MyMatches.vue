<template>
  <div class="my-matches-page">
    <div class="page-content">
      <div class="page-header">
        <div>
          <h1>My Matches</h1>
          <p class="subtitle">Your upcoming games and conversations</p>
        </div>
        <div class="filter-group">
          <button 
            @click="setSortType('date')" 
            class="filter-button"
            :class="{ active: sortType === 'date' }"
          >
            <span class="filter-icon">📅</span>
            <span>Date</span>
          </button>
          <button 
            @click="setSortType('price')" 
            class="filter-button"
            :class="{ active: sortType === 'price' }"
          >
            <span class="filter-icon">💰</span>
            <span>Price</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading your matches...</p>
      </div>

      <div v-else-if="error" class="error">
        <span>⚠️</span>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="matches.length === 0" class="empty-state">
        <div class="empty-icon">🎾</div>
        <h2>No matches yet</h2>
        <p>Join a match to start playing!</p>
        <router-link to="/home" class="browse-button">
          Back to Home
        </router-link>
      </div>

      <div v-else class="matches-container">
        <div 
          v-for="match in sortedMatches" 
          :key="match.id" 
          class="match-card"
          :class="{ 'has-chat': match.confirmed_player_count >= 2 }"
        >
          <div class="match-content">
            <div class="match-header">
              <div class="sport-info">
                <div class="sport-icon">{{ getSportIcon(match.sport_type) }}</div>
                <h3>{{ match.name }}</h3>
              </div>
              <div class="price-badge" :class="{ free: match.total_price === 0 }">
                {{ match.total_price === 0 ? 'Free' : `$${match.total_price}` }}
              </div>
            </div>

            <div class="match-info-grid">
              <div class="info-section">
                <div class="info-label">📍 Location</div>
                <div class="info-value">{{ match.location }}</div>
              </div>

              <div class="info-section">
                <div class="info-label">📅 Date & Time</div>
                <div class="info-value">{{ formatDate(match.date) }} at {{ match.time }}</div>
              </div>

              <div class="info-section">
                <div class="info-label">🎯 Skill Level</div>
                <div class="info-value">{{ match.skill_level || 'All Levels' }}</div>
              </div>

              <div class="info-section">
                <div class="info-label">👥 Players</div>
                <div class="info-value">{{ match.current_player_count }}/{{ match.total_player_count }}</div>
              </div>
            </div>

            <router-link 
              v-if="match.confirmed_player_count >= 2"
              :to="`/matches/${match.id}/chat`" 
              class="chat-available"
            >
              <div class="chat-available-content">
                <div class="chat-available-icon">💬</div>
                <div class="chat-available-text">
                  <div class="chat-available-title">Chat Room Available</div>
                  <div class="chat-available-subtitle">Connect with your teammates</div>
                </div>
                <div class="chat-available-arrow">→</div>
              </div>
            </router-link>

            <div v-else class="waiting-message">
              <div class="waiting-icon">⏳</div>
              <div class="waiting-text">
                <strong>Waiting for more players</strong>
                <p>Need {{ 2 - match.confirmed_player_count }} more {{ 2 - match.confirmed_player_count === 1 ? 'player' : 'players' }} to join before chat opens</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/lib/supabase';

export default {
  name: 'MyMatches',
  
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const matches = ref([]);
    const currentUserId = ref(null);
    const sortType = ref('date');

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const getSportIcon = (sportType) => {
      const icons = {
        'basketball': '🏀',
        'tennis': '🎾',
        'football': '⚽',
        'badminton': '🏸',
        'volleyball': '🏐',
        'soccer': '⚽',
      };
      return icons[sportType?.toLowerCase()] || '🎾';
    };

    const setSortType = (type) => {
      sortType.value = type;
    };

    const sortedMatches = computed(() => {
      const matchesCopy = [...matches.value];
      
      if (sortType.value === 'date') {
        return matchesCopy.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });
      } else if (sortType.value === 'price') {
        return matchesCopy.sort((a, b) => a.total_price - b.total_price);
      }
      
      return matchesCopy;
    });

    const fetchUserMatches = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        currentUserId.value = user.id;

        // Get all match IDs where user is a confirmed participant
        const { data: userMatches, error: userMatchesError } = await supabase
          .from('users_matches')
          .select('match_id')
          .eq('user_id', user.id)
          .eq('payment_success', true);

        if (userMatchesError) throw userMatchesError;

        if (!userMatches || userMatches.length === 0) {
          matches.value = [];
          return;
        }

        // Get the actual match details
        const matchIds = userMatches.map(um => um.match_id);
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .in('id', matchIds)
          .order('date', { ascending: true });

        if (matchesError) throw matchesError;

        // For each match, get the confirmed player count
        const matchesWithPlayerCount = await Promise.all(
          (matchesData || []).map(async (match) => {
            const { data: confirmedPlayers, error: playersError } = await supabase
              .from('users_matches')
              .select('user_id')
              .eq('match_id', match.id)
              .eq('payment_success', true);

            if (playersError) {
              console.error('Error fetching players for match:', match.id, playersError);
              return { ...match, confirmed_player_count: 0 };
            }

            return {
              ...match,
              confirmed_player_count: confirmedPlayers?.length || 0
            };
          })
        );

        matches.value = matchesWithPlayerCount;

      } catch (err) {
        error.value = err.message;
        console.error('Error fetching matches:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchUserMatches();
    });

    return {
      loading,
      error,
      matches,
      sortType,
      sortedMatches,
      formatDate,
      getSportIcon,
      setSortType,
    };
  },
};
</script>

<style scoped>
.my-matches-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  padding: 40px 60px;
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.filter-group {
  display: flex;
  gap: 8px;
  background: white;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background: #f8fafc;
  color: #475569;
}

.filter-button.active {
  background: linear-gradient(135deg, #ff6b35 0%, #e85d2a 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.25);
}

.filter-icon {
  font-size: 16px;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  min-height: 50vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #ff6b35;
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

.error span {
  font-size: 48px;
}

.error p {
  color: #e53e3e;
  font-size: 18px;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.empty-state h2 {
  font-size: 28px;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  color: #718096;
  margin: 0 0 32px 0;
}

.browse-button {
  display: inline-block;
  padding: 14px 32px;
  background: #ff6b35;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.browse-button:hover {
  background: #e85d2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.matches-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 24px;
}

.match-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.match-card.has-chat {
  border-color: #48bb78;
  border-width: 2px;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.match-content {
  padding: 28px;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.sport-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.sport-icon {
  font-size: 36px;
  line-height: 1;
}

.match-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.3;
}

.price-badge {
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  background: linear-gradient(135deg, #ff6b35 0%, #e85d2a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
}

.price-badge.free {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.2);
}

.match-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.info-value {
  font-size: 15px;
  color: #0f172a;
  font-weight: 600;
}

.chat-available {
  display: block;
  text-decoration: none;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #48bb78;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chat-available:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(72, 187, 120, 0.2);
  border-color: #38a169;
}

.chat-available-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-available-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.chat-available-text {
  flex: 1;
}

.chat-available-title {
  font-size: 16px;
  font-weight: 700;
  color: #064e3b;
  margin-bottom: 4px;
}

.chat-available-subtitle {
  font-size: 13px;
  color: #047857;
  font-weight: 500;
}

.chat-available-arrow {
  font-size: 24px;
  color: #48bb78;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.chat-available:hover .chat-available-arrow {
  transform: translateX(4px);
}

.waiting-message {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fde68a;
  border-radius: 12px;
}

.waiting-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.waiting-text {
  flex: 1;
}

.waiting-text strong {
  display: block;
  color: #78350f;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
}

.waiting-text p {
  margin: 0;
  color: #92400e;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .my-matches-page {
    padding: 24px 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .matches-container {
    grid-template-columns: 1fr;
  }

  .match-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>