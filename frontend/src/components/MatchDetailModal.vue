<template>
  <!-- Match Detail Modal -->
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-title-section">
          <span class="sport-icon">{{ getSportIcon(match.sport_type) }}</span>
          <div>
            <h2 class="modal-title">{{ match.name }}</h2>
            <p class="modal-subtitle">Match #{{ match.id }}</p>
          </div>
        </div>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Match Info Card -->
        <div class="info-card">
          <h3 class="section-title">Match Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">📍 Location</span>
              <span class="info-value">{{ match.location }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📅 Date & Time</span>
              <span class="info-value"
                >{{ match.date }} at {{ match.time }}</span
              >
            </div>
            <div class="info-item">
              <span class="info-label">🎯 Skill Level</span>
              <span class="info-value">{{ match.skill_level }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">💰 Entry Fee</span>
              <span
                :class="[
                  'info-value',
                  match.total_price === 0 ? 'text-success' : 'text-danger',
                ]"
              >
                {{ match.total_price === 0 ? "Free" : `$${match.total_price}` }}
              </span>
            </div>
          </div>

          <!-- Player Count -->
          <div class="player-status">
            <div class="progress-bar-container">
              <div
                class="progress-bar"
                :style="{ width: playerPercentage + '%' }"
              ></div>
            </div>
            <p class="player-count-text">
              <strong>{{ currentPlayers }}</strong> out of
              <strong>{{ maxPlayers }}</strong> players joined
              <span v-if="spotsRemaining > 0" class="spots-remaining">
                ({{ spotsRemaining }} spot{{
                  spotsRemaining > 1 ? "s" : ""
                }}
                remaining)
              </span>
              <span v-else class="match-full">Match Full!</span>
            </p>
          </div>
        </div>

        <!-- Players List -->
        <div class="players-card">
          <h3 class="section-title">
            Players ({{ matchPlayers.length }})
            <!-- <span class="organizer-badge" v-if="match.organizer">Organized by {{ match.organizer }}</span> -->
          </h3>

          <div class="players-list">
            <div
              v-for="player in matchPlayers"
              :key="player.id"
              class="player-item"
            >
              <div class="player-info clickable-player" @click="navigateToProfile(player.id)">
                <img
                  :src="player?.profile_image || defaultProfileImage"
                  :alt="player.name"
                  class="player-avatar"
                />
                <div class="player-details">
                  <div class="player-name">
                    {{ player.name }}
                    <span
                      v-if="player.isOrganizer"
                      class="badge badge-organizer"
                      >Organizer</span
                    >
                  </div>
                  <div class="player-stats">
                    <!-- <span class="attendance-rate" :class="getAttendanceClass(player.attendance)"> -->
                    <span
                      class="attendance-rate"
                      :class="getAttendanceClass(90)"
                    >
                      <!-- {{ player.attendance }}% attendance -->
                      90% attendance
                    </span>
                    <!-- <span class="player-level">{{ player.skillLevel }}</span> -->
                    <span class="player-level">Excellent</span>
                  </div>
                </div>
              </div>
              <button
                v-if="currentUser && player.id !== currentUser.id"
                class="btn-message"
                @click.stop="messagePlayer(player)"
                title="Send message"
              >
                💬
              </button>
            </div>

            <!-- Empty Slots -->
            <div
              v-for="slot in emptySlots"
              :key="'empty-' + slot"
              class="player-item empty-slot"
            >
              <div class="player-info">
                <div class="empty-avatar">?</div>
                <div class="player-details">
                  <div class="player-name text-muted">
                    Waiting for player...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Match Description -->
        <div v-if="match.description" class="description-card">
          <h3 class="section-title">Description</h3>
          <p class="match-description">{{ match.description }}</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button
          v-if="!isUserJoined"
          class="btn-join-modal"
          :disabled="spotsRemaining === 0"
          @click="joinMatch"
        >
          {{ spotsRemaining === 0 ? "Match Full" : "Join Match" }}
        </button>
        <div v-else class="joined-status">
          <span class="joined-badge">✓ You're in this match!</span>
          <button class="btn-leave" @click="leaveMatch">Leave Match</button>
        </div>
      </div>

      <!-- leave confirmation -->
      <div v-if="showLeaveConfirm" class="modal-overlay" @click="cancelLeave">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Leave Match?</h3>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to leave this match?</p>
            <div v-if="match.total_price > 0" class="refund-notice">
              <div class="refund-icon">💰</div>
              <div class="refund-text">
                <strong>Refund: ${{ match.total_price }}</strong>
                <p>Your payment will be refunded within 3-5 business days.</p>
              </div>
            </div>
            <p style="color: #dc3545; margin-top: 16px;">This action cannot be undone.</p>
          </div>
          <div class="modal-actions">
            <button @click="showLeaveConfirm = false" class="modal-button cancel">Cancel</button>
            <button @click="confirmLeave" class="modal-button confirm" :disabled="leavingMatch">
              <span v-if="leavingMatch">Leaving...</span>
              <span v-else-if="match.total_price > 0">Yes, Leave & Refund</span>
              <span v-else>Yes, Leave</span>
            </button>
          </div>
        </div>
      </div>

      <!-- payment confirmation -->
      <div v-if="showPaymentConfirm" class="modal-overlay" @click="cancelPayment">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Confirm Payment</h3>
          </div>
          <div class="modal-body">
            <p>This match requires a payment of <strong style="color: #FF6B35; font-size: 1.2em;">${{ match.total_price }}</strong>.</p>
            <p>You will be redirected to the payment page to complete your registration.</p>
          </div>
          <div class="modal-actions">
            <button @click="showPaymentConfirm = false" class="modal-button cancel">Cancel</button>
            <button @click="confirmPayment" class="modal-button confirm-payment">Proceed to Payment</button>
          </div>
        </div>
      </div>

      <!-- leave success -->
      <div v-if="showLeaveSuccess" class="confirm-overlay" @click.self="handleSuccessOk">
        <div class="confirm-box">
          <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
          <p style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">You have successfully left the match.</p>
          <div v-if="match.total_price > 0" class="success-refund-info">
            <p>💰 <strong>Refund Amount: ${{ match.total_price }}</strong></p>
            <p style="font-size: 0.9rem; color: #6b7280;">Refund will be processed within 3-5 business days.</p>
          </div>
          <div class="confirm-actions">
            <button
              :style="{ 'background-color': '#FF6B35', color: 'white' }"
              @click="handleSuccessOk"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { match } from 'assert';
import { supabase } from "@/lib/supabase";
import PayPage from "@/pages/Pay.vue";

export default {
  name: "MatchDetailModal",
  components: { PayPage },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    match: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      matchPlayers: [],
      currentUser: null,
      showLeaveConfirm: false,
      leavingMatchId: null,
      leavingMatch: false,
      showLeaveSuccess: false,
      showPaymentConfirm: false,
      defaultProfileImage: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/default-avatar.png`,
    };
  },
  mounted() {
    this.fetchCurrentUser();
  },
  computed: {
    currentPlayers() {
      return this.matchPlayers.length;
    },
    maxPlayers() {
      return this.match.total_player_count;
    },
    spotsRemaining() {
      return this.maxPlayers - this.currentPlayers;
    },
    playerPercentage() {
      return (this.currentPlayers / this.maxPlayers) * 100;
    },
    emptySlots() {
      return Math.max(0, this.spotsRemaining);
    },
    isUserJoined() {
      if (!this.currentUser) return false;
      return this.matchPlayers.some((p) => p.id === this.currentUser.id);
    },
  },
  methods: {
    async fetchCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      try {
        const { data: user_profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Failed to fetch current user's profile:", error);
          return;
        }

        this.currentUser = user_profile;
      } catch (err) {
        console.error("Error fetching current user's profile:", err);
      }
    },
    async getPlayers() {
      try {
        const { data, error } = await supabase
          .from("users_matches")
          .select("profiles(*)")
          .eq("match_id", this.match.id)
          .eq("payment_success", true);

        if (error) {
          console.error("Failed to fetch players data", error);
          return;
        } else {
          this.matchPlayers = data.map((u) => u.profiles);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    },
    closeModal() {
      this.$emit("close");
    },
    cancelLeave() {
      this.showLeaveConfirm = false;
    },
    getSportIcon(sport) {
      const icons = {
        Basketball: "🏀",
        Tennis: "🎾",
        Football: "⚽",
        Badminton: "🏸",
        Volleyball: "🏐",
      };
      return icons[sport] || "🏆";
    },
    getAttendanceClass(attendance) {
      if (attendance >= 90) return "excellent";
      if (attendance >= 75) return "good";
      if (attendance >= 50) return "fair";
      return "poor";
    },
    async joinMatch() {
      if (!this.isUserJoined && this.spotsRemaining > 0) {
        // Show payment confirmation for paid matches
        if (this.match.total_price !== 0) {
          this.showPaymentConfirm = true;
          return;
        }
        
        // For free matches, join directly
        await this.processJoin();
      }
    },
    cancelPayment() {
      this.showPaymentConfirm = false;
    },
    confirmPayment() {
      this.showPaymentConfirm = false;
      // Navigate to payment page
      this.$router.push({ name: 'Pay', params: { matchid: this.match.id } });
    },
    async processJoin() {
      const paymentSuccess = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/matches/${this.match.id}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: this.currentUser.id,
            payment_success: paymentSuccess
          })
        });
        const result = await response.json();
        if (result.success) {
          this.matchPlayers.push({
            ...this.currentUser
          });

          // NEW: Notify existing players that someone joined
          const { data: existingUsers } = await supabase
            .from('users_matches')
            .select('user_id')
            .eq('match_id', this.match.id)
            .eq('payment_success', true)
            .neq('user_id', this.currentUser.id); // Don't notify the person who just joined

          if (existingUsers && existingUsers.length > 0) {
            const joinNotifications = existingUsers.map(user => ({
              user_id: user.user_id,
              title: "New Player Joined!",
              message: `${this.currentUser.name} has joined "${this.match.name}"`,
              read: false
            }));

            await supabase
              .from('notifications')
              .insert(joinNotifications);
          }

          // get the latest match update
          const { data: latestMatch } = await supabase
          .from('matches')
          .select('current_player_count, total_player_count')
          .eq('id', this.match.id)
          .single();

          // Check if this is the 2nd player (chat unlocks)
          if (latestMatch.current_player_count === 2) {
            // Get all users in this match
            const { data: matchUsers } = await supabase
              .from('users_matches')
              .select('user_id')
              .eq('match_id', this.match.id)
              .eq('payment_success', true);

            // Create notification for each user
            const notifications = matchUsers.map(user => ({
              user_id: user.user_id,
              title: "Chat Unlocked!",
              message: `The chat for "${this.match.name}" is now available. Head to My Matches to start chatting!`,
              read: false
            }));

            await supabase
              .from('notifications')
              .insert(notifications);
            
            console.log(`Notified ${notifications.length} players that chat is unlocked.`);
          }

          // Check if match is full
          if (latestMatch.current_player_count == latestMatch.total_player_count) {
            console.log("match players ", this.matchPlayers);
            const notifications = this.matchPlayers.map(u => ({
              user_id: u.id,
              title: "Match Can Begin!",
              message: `Match "${this.match.name}" is now full and will begin as scheduled.`,
              read: false
            }));

            const { error: notifError } = await supabase
              .from('notifications')
              .insert(notifications);

            if (notifError) {
              console.error('Error inserting notification:', notifError)
            } else {
              console.log(`Notified ${notifications.length} players that the match is full.`);
            }
          }

          // send msg back to browser
          this.$emit('join', this.match.id);

        } else {
          alert('Failed to join match: ' + result.error);
        }
      } catch (err) {
        alert('Error joining match: ' + err.message);
      }
    },
    leaveMatch(match) {
      this.leavingMatchId = this.match.id;
      this.showLeaveConfirm = true;
    },
    async confirmLeave() {
      this.leavingMatch = true;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/matches/${this.match.id}/leave`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: this.currentUser.id,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          // Remove current user from matchPlayers list
          this.matchPlayers = this.matchPlayers.filter(
            (p) => p.id !== this.currentUser.id
          );
          this.$emit("leave", this.match.id);

          // ✅ ONLY show success modal if API call succeeded
          this.showLeaveSuccess = true;

          // Add refund notification if paid match
          if (this.match.total_price != 0) {
            const { error } = await supabase.from("notifications").insert([
              {
                user_id: this.currentUser.id,
                title: "Refund",
                message: `Refund for match "${this.match.name}" successful`,
                read: false,
              },
            ]);

            if (error) {
              console.error("Error inserting notification:", error);
            }
          }
        } else {
          console.log(
            "Failed to leave match: " + (result.error || "Unknown error")
          );
          alert("Failed to leave match. Please try again.");
        }
      } catch (err) {
        console.log("Error leaving match: " + err.message);
        alert("Error leaving match: " + err.message);
      } finally {
        this.showLeaveConfirm = false;
        this.leavingMatchId = null;
        this.leavingMatch = false;
      }
    },
    handleSuccessOk() {
      this.showLeaveSuccess = false;
      this.closeModal();
    },
    async fetchMatchPlayers() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/matches/${this.match.id}/users`
        );
        const result = await response.json();
        this.matchPlayers = Array.isArray(result)
          ? result.map((u) => ({
              id: u.user_id,
              name: `User ${u.user_id.substring(0, 6)}`,
              profilePic: "https://i.pravatar.cc/150?u=" + u.user_id,
              attendance: 100,
              skillLevel: "Unknown",
              isOrganizer: false,
            }))
          : [];
      } catch (err) {
        console.error("Failed to fetch match players:", err);
      }
    },
    messagePlayer(player) {
      this.$emit("message", player);
    },
    navigateToProfile(playerId) {
      this.closeModal();
      this.$router.push(`/profile/${playerId}`);
    },
  },
  watch: {
    "match.id": {
      handler(newId) {
        if (newId) {
          this.getPlayers();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px 28px;
  border-bottom: 2px solid #e8ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sport-icon {
  font-size: 3rem;
}

.modal-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: bold;
  color: #2c3e50;
}

.modal-subtitle {
  margin: 4px 0 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.close-btn {
  background: #f8f9fa;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #6c757d;
}

.close-btn:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.info-card,
.players-card,
.description-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.organizer-badge {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6c757d;
  background: white;
  padding: 4px 12px;
  border-radius: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.player-status {
  margin-top: 20px;
}

.progress-bar-container {
  height: 12px;
  background: #e9ecef;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35 0%, #ff5722 100%);
  transition: width 0.3s ease;
  border-radius: 20px;
}

.player-count-text {
  margin: 0;
  color: #495057;
  font-size: 0.95rem;
}

.spots-remaining {
  color: #28a745;
  font-weight: 600;
}

.match-full {
  color: #dc3545;
  font-weight: 600;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  transition: all 0.2s;
}

.player-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.empty-slot {
  opacity: 0.5;
}

.empty-slot:hover {
  transform: none;
  box-shadow: none;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.player-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff6b35;
}

.empty-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #adb5bd;
  border: 2px dashed #dee2e6;
}

.player-details {
  flex: 1;
}

.player-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.badge-organizer {
  background: #ffe0b2;
  color: #e65100;
}

.player-stats {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
}

.attendance-rate {
  font-weight: 600;
}

.attendance-rate.excellent {
  color: #28a745;
}

.attendance-rate.good {
  color: #17a2b8;
}

.attendance-rate.fair {
  color: #ffc107;
}

.attendance-rate.poor {
  color: #dc3545;
}

.player-level {
  color: #6c757d;
}

.btn-message {
  background: #f8f9fa;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-message:hover {
  background: #ff6b35;
  transform: scale(1.1);
}

.match-description {
  color: #495057;
  line-height: 1.8;
  margin: 0;
}

.modal-footer {
  padding: 20px 28px;
  border-top: 2px solid #e8ecef;
  flex-shrink: 0;
}

.btn-join-modal {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff5722 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-join-modal:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
}

.btn-join-modal:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.joined-status {
  display: flex;
  gap: 12px;
  align-items: center;
}

.joined-badge {
  flex: 1;
  padding: 16px;
  background: #d4edda;
  color: #155724;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
}

.btn-leave {
  padding: 16px 24px;
  background: white;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-leave:hover {
  background: #dc3545;
  color: white;
}

/* Mobile Responsive */
@media (max-width: 576px) {
  .modal-container {
    max-height: 95vh;
    border-radius: 16px;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px 20px;
  }

  .modal-title {
    font-size: 1.4rem;
  }

  .sport-icon {
    font-size: 2.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .joined-status {
    flex-direction: column;
  }

  .joined-badge,
  .btn-leave {
    width: 100%;
  }
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #ff6b35;
  border-radius: 10px;
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  animation: fadeIn 0.2s ease;
}

.confirm-box {
  background: white;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.confirm-box p {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 500;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-actions button {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.confirm-actions button:first-child {
  background: #dc3545;
  color: white;
}

.confirm-actions button:first-child:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.confirm-actions button:last-child {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #dee2e6;
}

.confirm-actions button:last-child:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

@media (max-width: 576px) {
  .confirm-box {
    padding: 24px;
  }

  .confirm-actions {
    flex-direction: column;
    gap: 10px;
  }

  .confirm-actions button {
    width: 100%;
  }
}

/* New leave confirmation modal styles */
.modal-content {
  background: white;
  border-radius: 16px;
  padding: 20px 32px 32px 32px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.modal-body p {
  margin: 0;
  color: #4a5568;
  font-size: 15px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.modal-button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-button.cancel {
  background: #e2e8f0;
  color: #475569;
}

.modal-button.cancel:hover {
  background: #cbd5e0;
}

.modal-button.confirm {
  background: #e53e3e;
  color: white;
}

.modal-button.confirm:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.modal-button.confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-button.confirm-payment {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.modal-button.confirm-payment:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 16px 24px 24px 24px;
  }
}

/* Refund notice styling */
.refund-notice {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  margin: 20px 0;
}

.refund-icon {
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
}

.refund-text {
  flex: 1;
}

.refund-text strong {
  display: block;
  font-size: 1.1rem;
  color: #92400e;
  margin-bottom: 8px;
}

.refund-text p {
  margin: 0;
  color: #78350f;
  font-size: 0.9rem;
  line-height: 1.4;
}

.success-refund-info {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 2px solid #10b981;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
}

.success-refund-info p {
  margin: 4px 0;
  color: #065f46;
}

.success-refund-info strong {
  color: #047857;
  font-size: 1.1rem;
}

.clickable-player {
  cursor: pointer;
  transition: background 0.2s ease;
  border-radius: 8px;
  padding: 4px;
  margin: -4px;  /* Negative margin to maintain spacing */
}

.clickable-player:hover {
  background: #f8f9fa;
}

.clickable-player:active {
  transform: scale(0.98);
}
</style>