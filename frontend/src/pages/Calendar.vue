<template>
  <div style="background-color: #F7F9FC; min-height: 100vh;">

    <div class="container-fluid px-5 py-4">
      <div class="row">
        <!-- Calendar Section -->
        <div class="col-lg-8 mb-4">
          <div class="calendar-container">
            <FullCalendar :options="calendarOptions" />
            <div class="legend">
              <div class="legend-item">
                <div class="legend-dot-confirmed"></div>
                <span>Confirmed Match</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot-pending"></div>
                <span>Pending Match</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Matches Panel -->
        <div class="col-lg-4">
          <div class="upcoming-matches-panel">
            <h4 class="fw-bold mb-4">Upcoming Matches</h4>
            <div v-if="upcomingMatches.length === 0" class="no-matches">
              <div style="font-size: 64px; margin-bottom: 16px;">📅</div>
              <p class="fw-semibold">No upcoming matches</p>
              <p class="small">Browse available matches to join!</p>
            </div>
            <div v-else>
              <div 
                v-for="match in upcomingMatches" 
                :key="match.id"
                class="match-item"
                :class="match.status"
                @click="showMatchModal(match)"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="fw-bold mb-0">{{ sportEmojis[match.sport] }} {{ match.sport }}</h6>
                  <span class="status-badge" :class="match.status">{{ match.status }}</span>
                </div>
                <div class="small mb-1">
                  <strong>📍</strong> {{ match.location }}
                </div>
                <div class="small mb-1">
                  <strong>📅</strong> {{ formatDate(match.date) }} at {{ match.time }}
                </div>
                <div class="small mb-1">
                  <strong>👥</strong> {{ match.players }}
                </div>
                <div class="small">
                  <strong :class="match.price === 'Free' ? 'text-success' : 'text-danger'">{{ match.price }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <div v-if="selectedMatch" class="modal-overlay" @click="selectedMatch = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="fw-bold">{{ sportEmojis[selectedMatch.sport] }} {{ selectedMatch.sport }}</h5>
          <button class="btn-close" @click="selectedMatch = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <span class="status-badge" :class="selectedMatch.status">{{ selectedMatch.status }}</span>
          </div>
          <div class="mb-2">
            <strong>📍 Location:</strong> {{ selectedMatch.location }}
          </div>
          <div class="mb-2">
            <strong>🕐 Time:</strong> {{ selectedMatch.time }}
          </div>
          <div class="mb-2">
            <strong>👥 Players:</strong> {{ selectedMatch.players }}
          </div>
          <div class="mb-2">
            <strong>💰 Price:</strong> <span :class="selectedMatch.price === 'Free' ? 'text-success' : 'text-danger'" class="fw-bold">{{ selectedMatch.price }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-dark" @click="selectedMatch = null">Close</button>
          <button class="btn btn-dark" @click="joinMatch(selectedMatch.id)">Join Match</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'

export default {
  name: 'Calendar',
  components: {
    FullCalendar
  },
  data() {
    return {
      userMatches: [
        { id: 1, sport: 'Basketball', location: 'Hougang', date: '2025-10-10', time: '6:00 PM', status: 'confirmed', players: '7/8', price: 'Free' },
        { id: 2, sport: 'Tennis', location: 'Sengkang', date: '2025-10-12', time: '7:00 PM', status: 'pending', players: '2/4', price: '$15' },
        { id: 3, sport: 'Football', location: 'Bedok', date: '2025-10-15', time: '5:00 PM', status: 'confirmed', players: '18/22', price: 'Free' },
        { id: 4, sport: 'Badminton', location: 'Tampines', date: '2025-10-18', time: '8:00 PM', status: 'pending', players: '6/8', price: '$10' },
        { id: 5, sport: 'Basketball', location: 'Punggol', date: '2025-10-22', time: '6:00 PM', status: 'confirmed', players: '8/10', price: 'Free' },
        { id: 6, sport: 'Volleyball', location: 'Pasir Ris', date: '2025-10-25', time: '7:00 PM', status: 'pending', players: '10/12', price: '$12' },
        { id: 7, sport: 'Tennis', location: 'Simei', date: '2025-10-28', time: '5:00 PM', status: 'confirmed', players: '3/4', price: 'Free' }
      ],
      selectedMatch: null,
      sportEmojis: {
        'Basketball': '🏀',
        'Tennis': '🎾',
        'Football': '⚽',
        'Badminton': '🏸',
        'Volleyball': '🏐'
      },
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        },
        themeSystem: 'bootstrap5',
        events: [],
        eventClick: this.handleEventClick,
        height: 'auto',
        eventColor: '#FF6B35'
      }
    }
  },
  computed: {
    
    upcomingMatches() {
      const today = new Date()
      return this.userMatches
        .filter(match => {
          const matchDate = new Date(match.date)
          return matchDate >= today
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    
  },
  mounted() {
    this.loadMatchesIntoCalendar()
  },
  watch: {
    userMatches: {
      handler() {
        this.loadMatchesIntoCalendar()
      },
      deep: true
    }
  },
  methods: {
    
    showMatchModal(match) {
      this.selectedMatch = match
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    joinMatch(matchId) {
      alert(`Joining Match ${matchId}!`)
      this.selectedMatch = null
    },
    loadMatchesIntoCalendar() {
      this.calendarOptions.events = this.userMatches.map(match => ({
        id: match.id,
        title: `${this.sportEmojis[match.sport]} ${match.sport} - ${match.location}`,
        start: `${match.date}T${this.convertTo24Hour(match.time)}`,
        extendedProps: {
          ...match
        },
        backgroundColor: match.status === 'confirmed' ? '#4CAF50' : '#FFC107',
        borderColor: match.status === 'confirmed' ? '#4CAF50' : '#FFC107'
      })
      )
    },
    convertTo24Hour(time) {
      const [timeStr, period] = time.split(' ')
      let [hours, minutes] = timeStr.split(':')
      hours = parseInt(hours)
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      return `${String(hours).padStart(2, '0')}:${minutes}:00`
    },
    handleEventClick(info) {
      this.selectedMatch = info.event.extendedProps
    },
  }
}
</script>

<style>
.fc-prev-button,
.fc-next-button,
.fc-today-button,
.fc-dayGridMonth-button,
.fc-dayGridWeek-button {
  background-color: #2C3E50 !important;
  color: #fff !important;
  border: 0 !important;
}

.fc-prev-button:hover,
.fc-next-button:hover,
.fc-today-button:hover,
.fc-dayGridMonth-button:hover,
.fc-dayGridWeek-button:hover {
  background-color: #FF6B35 !important;
  color: #fff !important;
  border: 0 !important;
  transition: all 0.3s ease-in-out;
}

.fc-dayGridMonth-button[aria-pressed="true"],
.fc-dayGridWeek-button[aria-pressed="true"]{
  background-color: #FF6B35 !important;
  color: #fff !important;
  border: 0 !important;
}
</style>

<style scoped>
:root {
  --primary-color: #FF6B35;
  --back-color: #F7F9FC;
  --secondary-color: #2C3E50;
}

.calendar-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.legend {
  display: flex;
  gap: 24px;
  padding: 16px;
  background-color: var(--back-color);
  /* border-radius: 12px; */
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.legend-dot-confirmed,
.legend-dot-pending {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot-confirmed {
  background-color: #4CAF50;
}

.legend-dot-pending{
    background-color: #FFC107;

}

.upcoming-matches-panel {
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  max-height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
}

.match-item {
  background: var(--back-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: slideInRight 0.5s ease forwards;
}

.match-item.confirmed {
  border-left-color: #4CAF50;
}

.match-item.pending {
  border-left-color: #FFC107;
}

.match-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.confirmed {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.status-badge.pending {
  background-color: #FFF3E0;
  color: #E65100;
}

.no-matches {
  text-align: center;
  padding: 48px 24px;
  color: #999;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8ecef;
}

.modal-header h5 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e8ecef;
}

.modal-footer button {
  flex: 1;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-dark {
  background-color: var(--secondary-color);
  color: white;
}

.btn-dark:hover {
  background-color: #1a252f;
}

.btn-outline-dark {
  background-color: transparent;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
}

.btn-outline-dark:hover {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary {
  background-color: #e9ecef;
  color: var(--secondary-color);
}

.btn-secondary:hover {
  background-color: #dee2e6;
}
</style>