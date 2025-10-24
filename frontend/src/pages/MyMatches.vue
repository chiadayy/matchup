<template>
  <div class="my-matches-container">
    <div class="header">
      <router-link to="/home" class="back-button">
        <span class="back-icon">←</span>
        <span>Back</span>
      </router-link>
      <div class="header-content">
        <h1>My Matches</h1>
        <p>View and manage your upcoming games</p>
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
      <router-link to="/browser" class="browse-button">
        Browse Matches
      </router-link>
    </div>

    <div v-else class="matches-grid">
      <div 
        v-for="match in matches" 
        :key="match.id" 
        class="match-card"
      >
        <div class="match-card-header">
          <h3>{{ match.name }}</h3>
          <div class="price-badge">
            <span class="dollar">$</span>{{ match.total_price }}
          </div>
        </div>

        <div class="match-details">
          <div class="detail-row">
            <span class="icon">📍</span>
            <span>{{ match.location }}</span>
          </div>
          <div class="detail-row">
            <span class="icon">📅</span>
            <span>{{ formatDate(match.date) }}</span>
          </div>
          <div class="detail-row">
            <span class="icon">🕐</span>
            <span>{{ match.time }}</span>
          </div>
          <div class="detail-row">
            <span class="icon">👥</span>
            <span>{{ match.current_player_count }}/{{ match.total_player_count }} players</span>
          </div>
        </div>

        <div class="match-actions">
          <router-link 
            :to="`/matches/${match.id}/chat`" 
            class="chat-button"
            :class="{ disabled: !match.conversation_id }"
          >
            <span class="chat-icon">💬</span>
            <span>{{ match.conversation_id ? 'Open Chat' : 'Waiting for confirmation' }}</span>
          </router-link>
        </div>

        <div v-if="!match.conversation_id" class="pending-badge">
          Pending Confirmation
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';

export default {
  name: 'MyMatches',
  
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const matches = ref([]);
    const currentUserId = ref(null);

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

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

        matches.value = matchesData || [];

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
      formatDate,
    };
  },
};
</script>

<style scoped>
.my-matches-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 40px;
}

.header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
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
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20%, -20%); }
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

.back-button:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.back-icon {
  font-size: 18px;
  font-weight: bold;
}

.header-content {
  padding: 32px;
  position: relative;
  z-index: 1;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 36px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  min-height: 60vh;
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
  min-height: 60vh;
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.browse-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.matches-grid {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.match-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.match-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
}

.match-card-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #2d3748;
  flex: 1;
}

.price-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.dollar {
  font-size: 12px;
  margin-right: 2px;
  opacity: 0.9;
}

.match-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
}

.icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.match-actions {
  margin-top: 20px;
}

.chat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.chat-button:not(.disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.chat-button.disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
  box-shadow: none;
}

.chat-icon {
  font-size: 20px;
}

.pending-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #fbbf24;
  color: #78350f;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}
</style>