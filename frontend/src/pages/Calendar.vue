<template>
  <div style="background-color: #F7F9FC; min-height: 100vh;">

    <div class="container-fluid px-5 py-4">
      <div class="row">
        <!-- Calendar Section -->
        <div class="col-lg-8 mb-4">
          <div class="calendar-container">
            <div class="calendar-header">
              <button @click="previousMonth" class="btn btn-sm btn-secondary">←</button>
              <h3 class="fw-bold">{{ monthYear }}</h3>
              <button @click="nextMonth" class="btn btn-sm btn-secondary">→</button>
            </div>

            <table class="calendar-table">
              <thead>
                <tr>
                  <th v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, index) in calendarDays" :key="index">
                  <td 
                    v-for="day in week" 
                    :key="`${day.date}-${day.month}`"
                    :class="{ 
                      'other-month': day.month !== currentMonth,
                      'today': isToday(day),
                      'has-event': hasEvent(day)
                    }"
                    @click="selectDate(day)"
                  >
                    <div class="day-number">{{ day.date }}</div>
                    <div class="day-events">
                      <div 
                        v-for="match in getMatchesForDate(day)"
                        :key="match.id"
                        class="event-dot"
                        :class="match.status"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="legend">
              <div class="legend-item">
                <div class="legend-dot" style="background-color: var(--primary-color);"></div>
                <span>Today</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot" style="background-color: #4CAF50;"></div>
                <span>Confirmed Match</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot" style="background-color: #FFC107;"></div>
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

export default {
  name: 'Calendar',
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
      currentDate: new Date(2025, 9, 9),
      selectedMatch: null,
      sportEmojis: {
        'Basketball': '🏀',
        'Tennis': '🎾',
        'Football': '⚽',
        'Badminton': '🏸',
        'Volleyball': '🏐'
      }
    }
  },
  computed: {
    currentMonth() {
      return this.currentDate.getMonth()
    },
    currentYear() {
      return this.currentDate.getFullYear()
    },
    monthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return `${months[this.currentMonth]} ${this.currentYear}`
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()
      
      const days = []
      let week = []
      
      // Previous month's days
      const prevMonth = new Date(this.currentYear, this.currentMonth, 0)
      const daysInPrevMonth = prevMonth.getDate()
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        week.push({
          date: daysInPrevMonth - i,
          month: this.currentMonth - 1
        })
      }
      
      // Current month's days
      for (let i = 1; i <= daysInMonth; i++) {
        week.push({
          date: i,
          month: this.currentMonth
        })
        if (week.length === 7) {
          days.push(week)
          week = []
        }
      }
      
      // Next month's days
      const remainingDays = 7 - week.length
      for (let i = 1; i <= remainingDays; i++) {
        week.push({
          date: i,
          month: this.currentMonth + 1
        })
      }
      if (week.length > 0) {
        days.push(week)
      }
      
      return days
    },
    upcomingMatches() {
      const today = new Date(2025, 9, 9)
      return this.userMatches
        .filter(match => {
          const matchDate = new Date(match.date)
          return matchDate >= today
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1)
    },
    isToday(day) {
      if (day.month !== this.currentMonth) return false
      const today = new Date(2025, 9, 9)
      return day.date === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear()
    },
    hasEvent(day) {
      return this.getMatchesForDate(day).length > 0
    },
    getMatchesForDate(day) {
      if (day.month !== this.currentMonth) return []
      const dateStr = `2025-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
      return this.userMatches.filter(m => m.date === dateStr)
    },
    selectDate(day) {
      const matches = this.getMatchesForDate(day)
      if (matches.length > 0) {
        this.selectedMatch = matches[0]
      }
    },
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

.calendar-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.calendar-header h3 {
  margin: 0;
  min-width: 200px;
  text-align: center;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.calendar-table thead th {
  background-color: var(--back-color);
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: var(--secondary-color);
}

.calendar-table tbody td {
  height: 80px;
  padding: 8px;
  border: 1px solid #e8ecef;
  vertical-align: top;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: white;
}

.calendar-table tbody td:hover {
  background-color: var(--back-color);
}

.calendar-table tbody td.other-month {
  color: #ccc;
  background-color: #f9f9f9;
}

.calendar-table tbody td.today .day-number {
  background: linear-gradient(135deg, var(--primary-color), #FF5722);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.calendar-table tbody td.has-event {
  background-color: rgba(255, 107, 53, 0.05);
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.day-events {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.event-dot.confirmed {
  background-color: #4CAF50;
}

.event-dot.pending {
  background-color: #FFC107;
}

.legend {
  display: flex;
  gap: 24px;
  padding: 16px;
  background-color: var(--back-color);
  border-radius: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.upcoming-matches-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  max-height: 700px;
  overflow-y: auto;
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