<template>
  <!-- Match Detail Modal -->
  <div 
    v-if="isOpen" 
    class="modal-overlay" 
    @click.self="closeModal"
  >
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
              <!-- <span class="info-value">{{ match.date.split(" ")[0] }} at {{ match.date.split(" ")[1] }}</span> -->
              <span class="info-value">{{ match.date }} at {{ match.time }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🎯 Skill Level</span>
              <span class="info-value">{{ match.skill_level }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">💰 Entry Fee</span>
              <span :class="['info-value', match.total_price === 0 ? 'text-success' : 'text-danger']">
                {{ match.total_price === 0 ? 'Free' : `$${match.total_price}` }}
              </span>
            </div>
          </div>

          <!-- Player Count -->
          <div class="player-status">
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: playerPercentage + '%' }"></div>
            </div>
            <p class="player-count-text">
              <strong>{{ currentPlayers }}</strong> out of <strong>{{ maxPlayers }}</strong> players joined
              <span v-if="spotsRemaining > 0" class="spots-remaining">
                ({{ spotsRemaining }} spot{{ spotsRemaining > 1 ? 's' : '' }} remaining)
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
              <div class="player-info">
                <img :src="player.profile_image" :alt="player.name" class="player-avatar">
                <div class="player-details">
                  <div class="player-name">
                    {{ player.profiles.name }}
                    <span v-if="player.isOrganizer" class="badge badge-organizer">Organizer</span>
                  </div>
                  <div class="player-stats">
                    <!-- <span class="attendance-rate" :class="getAttendanceClass(player.attendance)"> -->
                    <span class="attendance-rate" :class="getAttendanceClass(90)">
                      <!-- {{ player.attendance }}% attendance -->
                      90% attendance
                    </span>
                    <!-- <span class="player-level">{{ player.skillLevel }}</span> -->
                    <span class="player-level">Excellent</span>
                  </div>
                </div>
              </div>
              <button 
                v-if="player.id !== currentUser.id"
                class="btn-message" 
                @click="messagePlayer(player)"
                title="Send message"
              >
                💬
              </button>
            </div>

            <!-- Empty Slots -->
            <!-- <div 
              v-for="slot in emptySlots" 
              :key="'empty-' + slot"
              class="player-item empty-slot"
            >
              <div class="player-info">
                <div class="empty-avatar">?</div>
                <div class="player-details">
                  <div class="player-name text-muted">Waiting for player...</div>
                </div>
              </div>
            </div> -->
          </div>
        </div>

        <!-- Match Description -->
        <!-- <div v-if="match.description" class="description-card">
          <h3 class="section-title">Description</h3>
          <p class="match-description">{{ match.description }}</p>
        </div> -->
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button 
          v-if="!isUserJoined" 
          class="btn-join-modal"
          :disabled="spotsRemaining === 0"
          @click="joinMatch"
        >
          {{ spotsRemaining === 0 ? 'Match Full' : 'Join Match' }}
        </button>
        <div v-else class="joined-status">
          <span class="joined-badge">✓ You're in this match!</span>
          <button class="btn-leave" @click="leaveMatch">Leave Match</button>
        </div>
      </div>
    </div>
  </div>
</template>