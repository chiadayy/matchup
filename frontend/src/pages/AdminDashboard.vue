<template>
  <div class="admin-browser-page">
    <div class="container mt-4">
      <div class="page-header">
        <h1 class="fw-bold">Admin - Manage Matches</h1>
        <p class="results-count">
          Showing <span>{{ filteredMatches.length }}</span> matches
        </p>
      </div>

      <!-- Smart Suggestion Shortcuts -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="smart-shortcuts">
            <h6 class="shortcuts-label">Quick Filter</h6>
            <div class="shortcuts-container">
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'all' }"
                @click="applyShortcut('all')"
              >
                <span class="shortcut-icon">📋</span>
                <span class="shortcut-text">All Matches</span>
              </button>
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'upcoming' }"
                @click="applyShortcut('upcoming')"
              >
                <span class="shortcut-icon">⏰</span>
                <span class="shortcut-text">Upcoming</span>
              </button>
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'full' }"
                @click="applyShortcut('full')"
              >
                <span class="shortcut-icon">🔒</span>
                <span class="shortcut-text">Full Matches</span>
              </button>
              <button
                class="shortcut-btn"
                :class="{ active: activeShortcut === 'paid' }"
                @click="applyShortcut('paid')"
              >
                <span class="shortcut-icon">💰</span>
                <span class="shortcut-text">Paid Matches</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filter Tags -->
      <div v-if="hasActiveFilters" class="row mb-3">
        <div class="col-12">
          <div class="active-filters">
            <span class="active-filters-label">Filters:</span>
            <div class="filter-tags">
              <span
                v-for="sport in selectedSports"
                :key="'sport-' + sport"
                class="filter-tag"
                @click="removeSportFilter(sport)"
              >
                {{ getSportIcon(sport) }} {{ sport }}
                <span class="tag-remove">×</span>
              </span>
              <span
                v-if="skillLevel"
                class="filter-tag"
                @click="skillLevel = ''; filterMatches();"
              >
                {{ skillLevel }} <span class="tag-remove">×</span>
              </span>
              <span
                v-if="location"
                class="filter-tag"
                @click="location = ''; filterMatches();"
              >
                📍 {{ location }} <span class="tag-remove">×</span>
              </span>
              <span
                v-for="price in priceFilter"
                :key="'price-' + price"
                class="filter-tag"
                @click="removePriceFilter(price)"
              >
                {{ price === "Free" ? "💸" : "💰" }} {{ price }}
                <span class="tag-remove">×</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-lg-3 col-md-4">
          <div class="sidebar">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Filters</h5>
              <a class="clear-filters" @click="clearFilters">Clear All</a>
            </div>

            <!-- Sport Type Filter -->
            <div class="filter-section">
              <label class="fw-600">Sport Type</label>
              <div class="sport-pills">
                <button
                  v-for="sport in sportsWithIcons"
                  :key="sport.name"
                  class="sport-pill"
                  :class="{ active: selectedSports.includes(sport.name) }"
                  @click="toggleSport(sport.name)"
                >
                  <span class="sport-pill-icon">{{ sport.icon }}</span>
                  <span class="sport-pill-text">{{ sport.name }}</span>
                </button>
              </div>
            </div>

            <!-- Skill Level Filter -->
            <div class="filter-section">
              <label class="fw-600">Skill Level</label>
              <div class="pill-group">
                <button
                  v-for="level in skillLevels"
                  :key="level"
                  class="filter-pill"
                  :class="{ active: skillLevel === level }"
                  @click="skillLevel = level; filterMatches();"
                >
                  {{ level }}
                </button>
                <button
                  class="filter-pill"
                  :class="{ active: skillLevel === '' }"
                  @click="skillLevel = ''; filterMatches();"
                >
                  All Levels
                </button>
              </div>
            </div>

            <!-- Location Filter -->
            <div class="filter-section">
              <label class="fw-600">Location</label>
              <div class="pill-group">
                <button
                  v-for="loc in locations"
                  :key="loc"
                  class="filter-pill"
                  :class="{ active: location === loc }"
                  @click="location = loc; filterMatches();"
                >
                  {{ loc }}
                </button>
                <button
                  class="filter-pill"
                  :class="{ active: location === '' }"
                  @click="location = ''; filterMatches();"
                >
                  All
                </button>
              </div>
            </div>

            <!-- Price Filter -->
            <div class="filter-section">
              <label class="fw-600">Price</label>
              <div class="pill-group">
                <button
                  class="filter-pill"
                  :class="{ active: priceFilter.includes('Free') }"
                  @click="togglePrice('Free')"
                >
                  💸 Free
                </button>
                <button
                  class="filter-pill"
                  :class="{ active: priceFilter.includes('Paid') }"
                  @click="togglePrice('Paid')"
                >
                  💰 Paid
                </button>
              </div>
            </div>

            <!-- Sort By -->
            <div class="filter-section">
              <label class="fw-600">Sort By</label>
              <select
                class="form-select"
                v-model="sortBy"
                @change="filterMatches"
              >
                <option value="date">Date (Nearest First)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="spots">Available Spots</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Match Cards -->
        <div class="col-lg-9 col-md-8">
          <div class="match-container">
            <div
              v-for="match in paginatedMatches"
              :key="match.id"
              class="match-card"
              @click="openMatchDetail(match)"
            >
              <!-- Sport Icon Badge -->
              <div
                class="sport-icon-badge"
                :style="{ backgroundColor: getSportColor(match.sport_type) }"
              >
                {{ getSportIcon(match.sport_type) }}
              </div>

              <div class="match-header">
                <div>
                  <h3 class="match-title">
                    {{ match.sport_type }} @ {{ match.location }}
                  </h3>
                  <p class="sport-type">{{ match.skill_level }}</p>
                </div>
                <span
                  :class="[
                    'match-price',
                    match.total_price === 0 ? 'price-free' : 'price-paid',
                  ]"
                >
                  {{
                    match.total_price === 0 ? "Free" : `$${match.total_price}`
                  }}
                </span>
              </div>

              <div class="match-details">
                <p><strong>Skill level:</strong> {{ match.skill_level }}</p>
                <p>
                  <strong>Date and Time:</strong> {{ match.date }}
                  {{ match.time }}
                </p>
                <div class="player-progress">
                  <span class="player-count"
                    >{{ match.current_player_count }}/{{
                      match.total_player_count
                    }}
                    players</span
                  >
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{
                        width: getPlayerPercentage(match) + '%',
                        backgroundColor: getSportColor(match.sport_type),
                      }"
                    ></div>
                  </div>
                </div>
              </div>
              <button
                class="btn-manage-match"
                @click.stop="openMatchDetail(match)"
              >
                Manage Match
              </button>
            </div>
          </div>

          <div v-if="filteredMatches.length === 0" class="text-center py-5">
            <h3 class="text-muted">No matches found</h3>
            <p class="text-muted">Try adjusting your filters</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredMatches.length > 0" class="pagination-container">
            <nav>
              <ul class="pagination">
                <li :class="['page-item', currentPage === 1 ? 'disabled' : '']">
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="changePage(currentPage - 1)"
                    >Previous</a
                  >
                </li>
                <li
                  v-for="page in totalPages"
                  :key="page"
                  :class="['page-item', currentPage === page ? 'active' : '']"
                >
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="changePage(page)"
                    >{{ page }}</a
                  >
                </li>
                <li
                  :class="[
                    'page-item',
                    currentPage === totalPages ? 'disabled' : '',
                  ]"
                >
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="changePage(currentPage + 1)"
                    >Next</a
                  >
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Match Detail Modal -->
    <div v-if="showMatchDetail" class="modal-overlay" @click.self="closeMatchDetail">
      <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <span class="sport-icon">{{ getSportIcon(selectedMatch.sport_type) }}</span>
            <div>
              <h2 class="modal-title">{{ selectedMatch.name }}</h2>
              <p class="modal-subtitle">Match #{{ selectedMatch.id }}</p>
            </div>
          </div>
          <button class="close-btn" @click="closeMatchDetail">×</button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Match Info Card -->
          <div class="info-card">
            <h3 class="section-title">Match Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">📍 Location</span>
                <span class="info-value">{{ selectedMatch.location }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📅 Date & Time</span>
                <span class="info-value"
                  >{{ selectedMatch.date }} at {{ selectedMatch.time }}</span
                >
              </div>
              <div class="info-item">
                <span class="info-label">🎯 Skill Level</span>
                <span class="info-value">{{ selectedMatch.skill_level }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">💰 Entry Fee</span>
                <span
                  :class="[
                    'info-value',
                    selectedMatch.total_price === 0 ? 'text-success' : 'text-danger',
                  ]"
                >
                  {{ selectedMatch.total_price === 0 ? "Free" : `$${selectedMatch.total_price}` }}
                </span>
              </div>
            </div>

            <!-- Player Count -->
            <div class="player-status">
              <div class="progress-bar-container">
                <div
                  class="progress-bar-fill"
                  :style="{ width: playerPercentage + '%' }"
                ></div>
              </div>
              <p class="player-count-text">
                <strong>{{ selectedMatch.current_player_count }}</strong> out of
                <strong>{{ selectedMatch.total_player_count }}</strong> players joined
                <span v-if="spotsRemaining > 0" class="spots-remaining">
                  ({{ spotsRemaining }} spot{{ spotsRemaining > 1 ? "s" : "" }} remaining)
                </span>
                <span v-else class="match-full">Match Full!</span>
              </p>
            </div>
          </div>

          <!-- Match Description -->
          <div v-if="selectedMatch.description" class="description-card">
            <h3 class="section-title">Description</h3>
            <p class="match-description">{{ selectedMatch.description }}</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button class="btn-remove-match" @click="confirmRemoveMatch">
            <span class="btn-icon">🗑️</span> Remove Match
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Confirmation Modal -->
    <div v-if="showRemoveConfirm" class="modal-overlay" @click="cancelRemove">
      <div class="modal-content" @click.stop>
        <div class="modal-header-confirm">
          <h3>⚠️ Remove Match?</h3>
        </div>
        <div class="modal-body-confirm">
          <p>Are you sure you want to remove this match?</p>
          <div class="warning-box">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <strong>This action cannot be undone!</strong>
              <p>All players will be notified and any payments will be refunded.</p>
            </div>
          </div>
          <div class="match-info-box">
            <p><strong>Match:</strong> {{ selectedMatch.name }}</p>
            <p><strong>Players:</strong> {{ selectedMatch.current_player_count }}</p>
            <p v-if="selectedMatch.total_price > 0">
              <strong>Total Refunds:</strong> ${{ selectedMatch.total_price * selectedMatch.current_player_count }}
            </p>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="cancelRemove" class="modal-button cancel">Cancel</button>
          <button @click="executeRemoveMatch" class="modal-button confirm-remove" :disabled="removingMatch">
            <span v-if="removingMatch">Removing...</span>
            <span v-else>Yes, Remove Match</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showRemoveSuccess" class="modal-overlay" @click="handleSuccessOk">
      <div class="confirm-box">
        <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
        <p style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px;">Match removed successfully!</p>
        <div class="success-info">
          <p>All players have been notified.</p>
          <p v-if="selectedMatch.total_price > 0">Refunds will be processed within 3-5 business days.</p>
        </div>
        <div class="confirm-actions">
          <button @click="handleSuccessOk">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabase";

export default {
  name: "AdminDashboard",
  data() {
    return {
      matches: [],
      filteredMatches: [],
      currentPage: 1,
      itemsPerPage: 8,
      sportsWithIcons: [
        { name: "Basketball", icon: "🏀" },
        { name: "Tennis", icon: "🎾" },
        { name: "Football", icon: "⚽" },
        { name: "Badminton", icon: "🏸" },
      ],
      skillLevels: ["Any Level", "Beginner", "Intermediate", "Advanced"],
      locations: ["Hougang", "Sengkang", "Punggol", "Tampines", "Bedok"],
      selectedSports: [],
      skillLevel: "",
      location: "",
      priceFilter: [],
      sortBy: "date",
      activeShortcut: 'all',
      showMatchDetail: false,
      selectedMatch: null,
      showRemoveConfirm: false,
      removingMatch: false,
      showRemoveSuccess: false,
    };
  },
  computed: {
    hasActiveFilters() {
      const hasSkillFilter = this.skillLevel && this.skillLevel !== "" && this.skillLevel !== "Any Level";
      const hasLocationFilter = this.location !== "";
      return (
        this.selectedSports.length > 0 ||
        hasSkillFilter ||
        hasLocationFilter ||
        this.priceFilter.length > 0
      );
    },
    totalPages() {
      return Math.ceil(this.filteredMatches.length / this.itemsPerPage);
    },
    paginatedMatches() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredMatches.slice(startIndex, endIndex);
    },
    playerPercentage() {
      if (!this.selectedMatch) return 0;
      return (this.selectedMatch.current_player_count / this.selectedMatch.total_player_count) * 100;
    },
    spotsRemaining() {
      if (!this.selectedMatch) return 0;
      return this.selectedMatch.total_player_count - this.selectedMatch.current_player_count;
    },
  },
  async mounted() {
    await this.getAllMatches();
    this.filterMatches();
  },
  methods: {
    async getAllMatches() {
      try {
        const { data, error } = await supabase.from("matches").select("*");
        if (error) {
          console.error("Error fetching matches:", error);
          return;
        }
        this.matches = data;
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    },
    filterMatches() {
      this.filteredMatches = [...this.matches];

      if (this.selectedSports.length > 0) {
        this.filteredMatches = this.filteredMatches.filter((m) =>
          this.selectedSports.includes(m.sport_type)
        );
      }

      if (this.skillLevel && this.skillLevel !== "Any Level") {
        this.filteredMatches = this.filteredMatches.filter(
          (m) => m.skill_level === this.skillLevel
        );
      }

      if (this.location) {
        this.filteredMatches = this.filteredMatches.filter(
          (m) => m.location === this.location
        );
      }

      if (this.priceFilter.length > 0) {
        if (this.priceFilter.includes("Free") && !this.priceFilter.includes("Paid")) {
          this.filteredMatches = this.filteredMatches.filter((m) => m.total_price === 0);
        } else if (this.priceFilter.includes("Paid") && !this.priceFilter.includes("Free")) {
          this.filteredMatches = this.filteredMatches.filter((m) => m.total_price > 0);
        }
      }

      if (this.sortBy === "price-low") {
        this.filteredMatches.sort((a, b) => a.total_price - b.total_price);
      } else if (this.sortBy === "price-high") {
        this.filteredMatches.sort((a, b) => b.total_price - a.total_price);
      }

      this.currentPage = 1;
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    clearFilters() {
      this.selectedSports = [];
      this.skillLevel = "";
      this.location = "";
      this.priceFilter = [];
      this.sortBy = "date";
      this.activeShortcut = 'all';
      this.filterMatches();
    },
    toggleSport(sport) {
      const index = this.selectedSports.indexOf(sport);
      if (index > -1) {
        this.selectedSports.splice(index, 1);
      } else {
        this.selectedSports.push(sport);
      }
      this.activeShortcut = null;
      this.filterMatches();
    },
    togglePrice(price) {
      const index = this.priceFilter.indexOf(price);
      if (index > -1) {
        this.priceFilter.splice(index, 1);
      } else {
        this.priceFilter.push(price);
      }
      this.activeShortcut = null;
      this.filterMatches();
    },
    removeSportFilter(sport) {
      this.selectedSports = this.selectedSports.filter((s) => s !== sport);
      this.filterMatches();
    },
    removePriceFilter(price) {
      this.priceFilter = this.priceFilter.filter((p) => p !== price);
      this.filterMatches();
    },
    getSportIcon(sport) {
      const sportObj = this.sportsWithIcons.find((s) => s.name === sport);
      return sportObj ? sportObj.icon : "🏃";
    },
    getSportColor(sport) {
      const colors = {
        Basketball: "#f97316",
        Tennis: "#84cc16",
        Football: "#10b981",
        Badminton: "#ec4899",
      };
      return colors[sport] || "#3b82f6";
    },
    getPlayerPercentage(match) {
      const joined = match.current_player_count;
      const capacity = match.total_player_count;
      if (!capacity || capacity === 0) return 0;
      return (joined / capacity) * 100;
    },
    applyShortcut(type) {
      if (this.activeShortcut === type) {
        this.activeShortcut = 'all';
        this.clearFilters();
        return;
      }

      this.activeShortcut = type;
      this.selectedSports = [];
      this.skillLevel = "";
      this.location = "";
      this.priceFilter = [];

      switch (type) {
        case 'all':
          this.filterMatches();
          break;
        case 'upcoming':
          this.filteredMatches = [...this.matches];
          const now = new Date();
          this.filteredMatches = this.filteredMatches.filter(m => {
            const matchDateTime = new Date(`${m.date}T${m.time}`);
            return matchDateTime > now;
          });
          this.currentPage = 1;
          return;
        case 'full':
          this.filteredMatches = [...this.matches].filter(m => 
            m.current_player_count >= m.total_player_count
          );
          this.currentPage = 1;
          return;
        case 'paid':
          this.priceFilter = ['Paid'];
          break;
      }

      this.filterMatches();
    },
    openMatchDetail(match) {
      this.selectedMatch = match;
      this.showMatchDetail = true;
      document.body.style.overflow = "hidden";
    },
    closeMatchDetail() {
      this.showMatchDetail = false;
      this.selectedMatch = null;
      document.body.style.overflow = "auto";
    },
    confirmRemoveMatch() {
      this.showRemoveConfirm = true;
    },
    cancelRemove() {
      this.showRemoveConfirm = false;
    },
    async executeRemoveMatch() {
      this.removingMatch = true;
      try {
        // Delete the match from Supabase
        const { error } = await supabase
          .from('matches')
          .delete()
          .eq('id', this.selectedMatch.id);

        if (error) {
          console.error('Error removing match:', error);
          alert('Failed to remove match. Please try again.');
          return;
        }

        // Remove from local array
        this.matches = this.matches.filter(m => m.id !== this.selectedMatch.id);
        this.filterMatches();

        // Show success modal
        this.showRemoveConfirm = false;
        this.showRemoveSuccess = true;
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('An error occurred while removing the match.');
      } finally {
        this.removingMatch = false;
      }
    },
    handleSuccessOk() {
      this.showRemoveSuccess = false;
      this.closeMatchDetail();
    },
  },
  beforeUnmount() {
    document.body.style.overflow = "auto";
  },
};
</script>

<style scoped>
:root {
  --primary-orange: #ff6b35;
  --dark-bg: #2b2d42;
}

.admin-browser-page {
  min-height: 100vh;
  background: #f7f9fc;
}

.container {
  position: relative;
}

.sidebar {
  background: #f9f9f9;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  transition: box-shadow 0.3s ease;
}

.sidebar:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.sidebar h5 {
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--dark-bg);
}

.filter-section {
  margin-bottom: 25px;
}

.filter-section label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  display: block;
}

.form-select {
  border-radius: 8px;
  border: 2px solid #dee2e6;
  padding: 10px 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
}

.form-select:hover {
  border-color: var(--primary-orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-select:focus {
  border-color: var(--primary-orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  outline: none;
}

.match-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

@media (max-width: 991px) {
  .match-container {
    grid-template-columns: 1fr;
  }
}

.match-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-height: 340px;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  word-break: break-word;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background: #fafafa;
}

.sport-icon-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

.match-card:hover .sport-icon-badge {
  transform: scale(1.15) rotate(-5deg);
}

.match-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
  gap: 12px;
  margin-left: 52px;
}

.match-header > div:first-child {
  flex: 1;
  min-width: 0;
}

.match-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--dark-bg);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.match-price {
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
  white-space: nowrap;
}

.price-free {
  color: #28a745;
}

.price-paid {
  color: #dc3545;
}

.sport-type {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 10px;
}

.match-details {
  color: #495057;
  line-height: 1.8;
  flex-grow: 1;
}

.match-details p {
  margin: 5px 0;
}

.player-progress {
  margin-top: 15px;
}

.player-count {
  display: inline-block;
  background: #e9ecef;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--primary-orange);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.6);
}

.btn-manage-match {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 12px 20px;
  width: 100%;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
}

.btn-manage-match:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
  background: linear-gradient(135deg, #5568d3 0%, #6a3d91 100%) !important;
}

.btn-manage-match:active {
  transform: translateY(0);
}

.page-header {
  margin: 0 0 24px 0;
  padding: 28px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  border: none;
  position: relative;
  overflow: hidden;
}

.page-header h1 {
  font-weight: 700;
  color: white;
  font-size: 2rem;
  margin: 0;
}

.results-count {
  color: rgba(255, 255, 255, 0.9);
  margin-top: 6px;
  font-weight: 500;
  font-size: 0.95rem;
}

.results-count span {
  color: white;
  font-weight: 600;
}

.clear-filters {
  color: var(--primary-orange);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.clear-filters:hover {
  text-decoration: underline;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.pagination {
  margin: 0;
}

.page-link {
  color: var(--dark-bg);
  border: 1px solid #dee2e6;
  padding: 10px 15px;
  margin: 0 3px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.page-link:hover {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.page-item.active .page-link {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #f8f9fa;
}

/* Smart Shortcuts */
.smart-shortcuts {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
}

.shortcuts-label {
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.95;
}

.shortcuts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.shortcut-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.shortcut-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shortcut-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
  transform: translateY(-2px) scale(1.05);
}

.shortcut-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.shortcut-text {
  line-height: 1;
}

/* Active Filters */
.active-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 16px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 12px;
  margin-bottom: 20px;
  animation: slideInFromTop 0.4s ease;
}

.active-filters-label {
  font-weight: 700;
  color: #856404;
  font-size: 0.9rem;
  white-space: nowrap;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: white;
  border: 1px solid #ffc107;
  border-radius: 20px;
  color: #856404;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: bounceIn 0.3s ease;
}

.filter-tag:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
  transform: scale(1.05);
}

.tag-remove {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
  opacity: 0.7;
}

/* Sport Pills */
.sport-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sport-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.sport-pill:hover {
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.sport-pill.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
  transform: translateY(-2px) scale(1.05);
  animation: bounceIn 0.3s ease;
}

.sport-pill-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.sport-pill-text {
  line-height: 1;
}

/* Filter Pills */
.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-pill:hover {
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.filter-pill.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
  animation: bounceIn 0.3s ease;
}

/* Modal Styles */
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
  from { opacity: 0; }
  to { opacity: 1; }
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

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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

.btn-remove-match {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-remove-match:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Confirmation Modal */
.modal-content {
  background: white;
  border-radius: 16px;
  padding: 20px 32px 32px 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header-confirm h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.modal-body-confirm p {
  margin: 0 0 16px 0;
  color: #4a5568;
  font-size: 15px;
  line-height: 1.6;
}

.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid #dc3545;
  border-radius: 12px;
  margin: 20px 0;
}

.warning-icon {
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
}

.warning-text strong {
  display: block;
  font-size: 1.1rem;
  color: #991b1b;
  margin-bottom: 8px;
}

.warning-text p {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
  line-height: 1.4;
}

.match-info-box {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.match-info-box p {
  margin: 8px 0;
  color: #2c3e50;
  font-size: 0.95rem;
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

.modal-button.confirm-remove {
  background: #e53e3e;
  color: white;
}

.modal-button.confirm-remove:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.modal-button.confirm-remove:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success Modal */
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

.success-info {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 2px solid #10b981;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
}

.success-info p {
  margin: 4px 0;
  color: #065f46;
  font-size: 0.9rem;
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
  background: #667eea;
  color: white;
}

.confirm-actions button:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Animations */
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
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

  .modal-content {
    padding: 16px 24px 24px 24px;
  }
}
</style>