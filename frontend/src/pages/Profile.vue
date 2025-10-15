<template>
  <div style="background-color: #F7F9FC; min-height: 100vh; padding: 40px 20px;">
    <div class="container-fluid px-5 py-4">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="row align-items-center">
          <div class="col-md-3 text-center">
            <!-- View Mode -->
            <div v-if="!isEditMode">
              <img 
                :src="userProfile.profilePicture || 'https://via.placeholder.com/200'" 
                alt="Profile" 
                class="profile-picture"
              >
            </div>
            <!-- Edit Mode -->
            <div v-else>
              <div class="form-group mb-3">
                <label class="form-label">Profile Picture URL</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="editForm.profilePicture"
                  placeholder="Paste image URL here"
                >
              </div>
              <div v-if="editForm.profilePicture" class="text-center">
                <img 
                  :src="editForm.profilePicture" 
                  alt="Preview" 
                  class="img-preview"
                >
              </div>
            </div>
          </div>

          <div class="col-md-9">
            <div class="profile-info">
              <!-- View Mode -->
              <div v-if="!isEditMode">
                <h1 class="fw-bold mb-2">{{ userProfile.displayName }}</h1>
                <p class="text-muted mb-3">Member since {{ formatDate(userProfile.createdAt) }}</p>
                
                <div class="stats-row mb-4">
                  <div class="stat-item">
                    <div class="stat-value">{{ userProfile.totalMatches }}</div>
                    <div class="stat-label">Matches Played</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ attendanceRate }}%</div>
                    <div class="stat-label">Attendance Rate</div>
                  </div>
                </div>

                <div class="badges-row mb-4">
                  <span 
                    v-for="sport in userProfile.favoriteSports" 
                    :key="sport"
                    class="sport-badge"
                  >
                    {{ sportEmojis[sport] }} {{ sport }}
                  </span>
                </div>

                <div class="about-section mb-4">
                  <h4 class="fw-bold mb-2">About</h4>
                  <p class="text-muted">{{ userProfile.description || 'No description added yet.' }}</p>
                </div>

                <button v-if="isOwnProfile" class="btn btn-edit" @click="enterEditMode">
                  Edit Profile
                </button>
              </div>
              <!-- Edit Mode -->
              <div v-else>
                <div class="form-group mb-3">
                  <label class="form-label">Display Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="editForm.displayName"
                    placeholder="Your display name"
                  >
                </div>

                <div class="form-group mb-4">
                  <label class="form-label">Personal Description</label>
                  <textarea 
                    class="form-control" 
                    v-model="editForm.description"
                    placeholder="Tell us about yourself..."
                    rows="4"
                  ></textarea>
                </div>

                <div class="form-group mb-4">
                  <label class="form-label">Favorite Sports</label>
                  <div class="sports-checkbox-group">
                    <label v-for="sport in availableSports" :key="sport" class="sport-checkbox">
                      <input 
                        type="checkbox" 
                        :value="sport"
                        v-model="editForm.favoriteSports"
                      >
                      <span>{{ sportEmojis[sport] }} {{ sport }}</span>
                    </label>
                  </div>
                </div>

                <div class="edit-actions">
                  <button class="btn btn-secondary" @click="cancelEditMode">Cancel</button>
                  <button class="btn btn-primary" @click="saveProfileChanges">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Match History Section (only show in view mode) -->
      <div v-if="!isEditMode" class="match-history-section">
        <div class="section-header">
          <h2 class="fw-bold">Match History</h2>
          <div class="filter-buttons">
            <button 
              v-for="filter in ['all', 'attended', 'missed']"
              :key="filter"
              class="filter-btn"
              :class="{ active: selectedFilter === filter }"
              @click="selectedFilter = filter"
            >
              {{ capitalizeFirst(filter) }}
            </button>
          </div>
        </div>

        <div v-if="filteredMatches.length === 0" class="no-matches">
          <p class="text-muted">No match history found</p>
        </div>

        <div v-else class="matches-grid">
          <div 
            v-for="match in filteredMatches"
            :key="match.id"
            class="match-card"
            :class="getMatchStatusClass(match)"
          >
            <div class="match-header">
              <div class="match-sport">
                <span class="sport-emoji">{{ sportEmojis[match.sport] }}</span>
                <div>
                  <h4 class="fw-bold mb-1">{{ match.sport }}</h4>
                  <p class="text-muted small mb-0">{{ match.location }}</p>
                </div>
              </div>
              <div class="match-status-badge" :class="getStatusBadgeClass(match)">
                {{ getStatusLabel(match) }}
              </div>
            </div>

            <div class="match-details">
              <div class="detail-item">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">{{ formatDate(match.date) }} at {{ match.time }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Skill Level</span>
                <span class="detail-value">{{ match.skillLevel }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Players</span>
                <span class="detail-value">{{ match.playersJoined }}/{{ match.maxPlayers }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Price</span>
                <span :class="match.price === 0 ? 'text-success' : 'text-danger'" class="fw-bold">
                  {{ match.price === 0 ? 'Free' : `$${match.price}` }}
                </span>
              </div>
            </div>

            <div class="match-footer">
              <div class="attendance-status" :class="getAttendanceStatusClass(match)">
                <span class="status-icon">{{ getAttendanceIcon(match) }}</span>
                <span class="status-text">{{ getAttendanceStatus(match) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotification" class="notification-overlay">
      <div class="notification-modal" :class="notificationType">
        <div class="notification-header">
          <span class="notification-icon">
            {{ notificationType === 'success' ? '✓' : '✕' }}
          </span>
          <button class="btn-close-notification" @click="closeNotification">✕</button>
        </div>
        <div class="notification-body">
          <p>{{ notificationMessage }}</p>
        </div>
        <div class="notification-footer">
          <button class="btn btn-sm" @click="closeNotification">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      userId: this.$route.params.id || JSON.parse(localStorage.getItem('user') || '{}').id,
      isOwnProfile: !this.$route.params.id || this.$route.params.id === JSON.parse(localStorage.getItem('user') || '{}').id,
      isEditMode: false,
      selectedFilter: 'all',
      showNotification: false,
      notificationType: 'success',
      notificationMessage: '',
      notificationTimer: null,
      availableSports: ['Basketball', 'Tennis', 'Football', 'Badminton', 'Volleyball'],
      sportEmojis: {
        'Basketball': '🏀',
        'Tennis': '🎾',
        'Football': '⚽',
        'Badminton': '🏸',
        'Volleyball': '🏐'
      },
      userProfile: {
        id: 1,
        displayName: 'John Doe',
        profilePicture: 'https://i.pravatar.cc/150?img=12',
        description: 'Passionate about basketball and tennis. Always looking for friendly matches!',
        favoriteSports: ['Basketball', 'Tennis'],
        totalMatches: 24,
        matchesAttended: 23,
        createdAt: '2024-08-15'
      },
      editForm: {
        displayName: '',
        description: '',
        favoriteSports: [],
        profilePicture: ''
      },
      matchHistory: [
        {
          id: 1,
          sport: 'Basketball',
          location: 'Hougang',
          date: '2025-10-10',
          time: '6:00 PM',
          skillLevel: 'Beginner',
          maxPlayers: 8,
          playersJoined: 7,
          price: 0,
          attended: true
        },
        {
          id: 2,
          sport: 'Tennis',
          location: 'Sengkang',
          date: '2025-10-12',
          time: '7:00 PM',
          skillLevel: 'Intermediate',
          maxPlayers: 4,
          playersJoined: 2,
          price: 15,
          attended: true
        },
        {
          id: 3,
          sport: 'Football',
          location: 'Bedok',
          date: '2025-10-15',
          time: '5:00 PM',
          skillLevel: 'Advanced',
          maxPlayers: 22,
          playersJoined: 18,
          price: 0,
          attended: false
        },
        {
          id: 4,
          sport: 'Basketball',
          location: 'Punggol',
          date: '2025-09-25',
          time: '6:00 PM',
          skillLevel: 'Intermediate',
          maxPlayers: 10,
          playersJoined: 8,
          price: 0,
          attended: true
        },
        {
          id: 5,
          sport: 'Badminton',
          location: 'Tampines',
          date: '2025-09-18',
          time: '8:00 PM',
          skillLevel: 'Beginner',
          maxPlayers: 4,
          playersJoined: 3,
          price: 10,
          attended: false
        }
      ]
    }
  },
  computed: {
    attendanceRate() {
      if (this.userProfile.totalMatches === 0) return 0
      return Math.round((this.userProfile.matchesAttended / this.userProfile.totalMatches) * 100)
    },
    filteredMatches() {
      let filtered = this.matchHistory

      switch (this.selectedFilter) {
        case 'attended':
          filtered = filtered.filter(m => m.attended === true)
          break
        case 'missed':
          filtered = filtered.filter(m => m.attended === false)
          break
        default:
          break
      }

      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  methods: {
    enterEditMode() {
      this.editForm = {
        displayName: this.userProfile.displayName,
        description: this.userProfile.description,
        favoriteSports: [...this.userProfile.favoriteSports],
        profilePicture: this.userProfile.profilePicture
      }
      this.isEditMode = true
    },
    cancelEditMode() {
      this.isEditMode = false
    },
    saveProfileChanges() {
      this.userProfile.displayName = this.editForm.displayName
      this.userProfile.description = this.editForm.description
      this.userProfile.favoriteSports = this.editForm.favoriteSports
      this.userProfile.profilePicture = this.editForm.profilePicture

      this.showSuccessNotification('Profile updated successfully!')
      this.isEditMode = false
    },
    showSuccessNotification(message) {
      this.notificationMessage = message
      this.notificationType = 'success'
      this.showNotification = true
      this.startNotificationTimer()
    },
    showErrorNotification(message) {
      this.notificationMessage = message
      this.notificationType = 'error'
      this.showNotification = true
      this.startNotificationTimer()
    },
    startNotificationTimer() {
      if (this.notificationTimer) {
        clearTimeout(this.notificationTimer)
      }
      this.notificationTimer = setTimeout(() => {
        this.closeNotification()
      }, 20000)
    },
    closeNotification() {
      this.showNotification = false
      if (this.notificationTimer) {
        clearTimeout(this.notificationTimer)
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    getMatchStatusClass(match) {
      return match.attended ? 'status-attended' : 'status-missed'
    },
    getStatusBadgeClass(match) {
      return match.attended ? 'badge-success' : 'badge-danger'
    },
    getStatusLabel(match) {
      return match.attended ? 'Attended' : 'No Show'
    },
    getAttendanceStatusClass(match) {
      return match.attended ? 'attendance-attended' : 'attendance-missed'
    },
    getAttendanceIcon(match) {
      return match.attended ? '✓' : '✕'
    },
    getAttendanceStatus(match) {
      return match.attended ? 'Attended' : 'Did not attend'
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #FF6B35;
  --back-color: #F7F9FC;
  --secondary-color: #2C3E50;
}

.profile-header {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.profile-picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.2);
}

.profile-info h1 {
  color: var(--secondary-color);
}

.stats-row {
  display: flex;
  gap: 30px;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: #999;
  font-size: 0.9rem;
}

.badges-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.sport-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--primary-color), #FF5722);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.about-section {
  background: var(--back-color);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
}

.about-section p {
  margin: 0;
}

.btn-edit {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: #FF5722;
  transform: translateY(-2px);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--secondary-color);
  display: block;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.sports-checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.sport-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sport-checkbox:hover {
  border-color: var(--primary-color);
}

.sport-checkbox input[type="checkbox"] {
  cursor: pointer;
}

.sport-checkbox input[type="checkbox"]:checked ~ span {
  color: var(--primary-color);
  font-weight: 600;
}

.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  flex: 1;
}

.btn-primary:hover {
  background: #FF5722;
}

.btn-secondary {
  background: #e8ecef;
  color: var(--secondary-color);
  flex: 1;
}

.btn-secondary:hover {
  background: #dee2e6;
}

.img-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 10px;
}

.match-history-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.match-card {
  background: white;
  border: 2px solid #e8ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.match-card.status-attended {
  border-left: 4px solid #4CAF50;
}

.match-card.status-missed {
  border-left: 4px solid #f44336;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.match-sport {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.sport-emoji {
  font-size: 1.8rem;
}

.match-status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: #E8F5E9;
  color: #2E7D32;
}

.badge-danger {
  background: #FFEBEE;
  color: #C62828;
}

.match-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: #999;
  font-size: 0.8rem;
  font-weight: 600;
}

.detail-value {
  font-weight: 600;
  color: var(--secondary-color);
}

.match-footer {
  border-top: 1px solid #e8ecef;
  padding-top: 12px;
}

.attendance-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
}

.attendance-attended .status-icon {
  background: #E8F5E9;
  color: #2E7D32;
}

.attendance-missed .status-icon {
  background: #FFEBEE;
  color: #C62828;
}

.no-matches {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #999;
}

.text-success {
  color: #4CAF50;
}

.text-danger {
  color: #f44336;
}

.fw-bold {
  font-weight: 700;
}

.mb-1 {
  margin-bottom: 8px;
}

.mb-2 {
  margin-bottom: 16px;
}

.mb-3 {
  margin-bottom: 24px;
}

.mb-4 {
  margin-bottom: 32px;
}

.mt-3 {
  margin-top: 24px;
}

.align-items-center {
  align-items: center;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 20px;
  }

  .stats-row {
    flex-direction: column;
    gap: 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .matches-grid {
    grid-template-columns: 1fr;
  }

  .sports-checkbox-group {
    grid-template-columns: 1fr;
  }
}
</style>