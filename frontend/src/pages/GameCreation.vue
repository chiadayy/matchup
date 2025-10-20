<template>
  <div style="background-color: #F7F9FC; min-height: 100vh; padding: 40px 20px;">
    <div class="container-fluid px-5 py-4">
      <div class="page-header">
        <h1 class="fw-bold">Create a Match</h1>
        <p class="subtitle">Start organizing your next game and connect with players</p>
      </div>

      <div class="creation-container">
        <form @submit.prevent="createMatch">
          <!-- Step Indicator -->
          <div class="steps-indicator">
            <div v-for="step in 4" :key="step" class="step" :class="{ active: currentStep === step, completed: currentStep > step }">
              <span class="step-number">{{ step }}</span>
              <span class="step-label">{{ getStepLabel(step) }}</span>
            </div>
          </div>

          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="form-section">
            <h2 class="section-title">Match Details</h2>
            
            <div class="form-group">
              <label class="form-label">Match Name</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formData.matchName"
                placeholder="e.g., Weekly Basketball Game, Doubles Badminton"
                required
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Sport Type</label>
                <input 
                      type="text" 
                      class="form-control" 
                      v-model="formData.sport"
                      placeholder="e.g., Basketball, Tennis, Football, Badminton"
                      required
                    >              
              </div>
              <div class="form-group">
                <label class="form-label">Skill Level</label>
                <select class="form-control" v-model="formData.skillLevel" required>
                  <option value="">Select skill level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Any Level">Any Level</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Location</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.location"
                  placeholder="e.g., Hougang Sports Complex"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label">Maximum Players</label>
                <input 
                  type="number" 
                  class="form-control" 
                  v-model.number="formData.maxPlayers"
                  min="2"
                  max="100"
                  required
                >
              </div>
            </div>
          </div>

          <!-- Step 2: Date & Time -->
          <div v-if="currentStep === 2" class="form-section">
            <h2 class="section-title">Schedule</h2>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="formData.date"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label">Time</label>
                <input 
                  type="time" 
                  class="form-control" 
                  v-model="formData.time"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Duration (minutes)</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="formData.duration"
                placeholder="e.g., 60, 90"
                min="15"
                required
              >
            </div>
          </div>

          <!-- Step 3: Pricing -->
          <div v-if="currentStep === 3" class="form-section">
            <h2 class="section-title">Entry Fee</h2>

            <div class="pricing-options">
              <div class="option-card" :class="{ selected: formData.isPaid === false }" @click="formData.isPaid = false">
                <div class="option-icon">🎁</div>
                <h3>Free Match</h3>
                <p>No entry fee</p>
              </div>

              <div class="option-card" :class="{ selected: formData.isPaid === true }" @click="formData.isPaid = true">
                <div class="option-icon">💰</div>
                <h3>Paid Match</h3>
                <p>Players pay to join</p>
              </div>
            </div>

            <div v-if="formData.isPaid" class="paid-details">
                  <div class="form-group">
                        <label class="form-label">Total Match Price ($)</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model.number="formData.totalPrice"
                          placeholder="e.g., 50"
                          min="0"
                          step="0.01"
                          required
                        >
                  </div>

                  <div class="price-info">
                    <p class="info-text">
                      <strong>Total Price:</strong> ${{ formData.totalPrice.toFixed(2) }}
                    </p>
                  </div>
            </div>
          </div>

          <!-- Step 4: Description -->
          <div v-if="currentStep === 4" class="form-section">
            <h2 class="section-title">Match Description</h2>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea 
                class="form-control" 
                v-model="formData.description"
                placeholder="Describe what you'll be playing. E.g., 'We'll be playing doubles in badminton. Bring your own rackets. Beginner-friendly!'"
                rows="5"
                required
              ></textarea>
              <p class="char-count">{{ formData.description.length }}/500</p>
            </div>

            <!-- Match Summary -->
            <div class="summary-card">
              <h3 class="summary-title">Match Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Sport</span>
                  <span class="value">{{ formData.sport }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Date & Time</span>
                  <span class="value">{{ formatDateDisplay(formData.date) }} at {{ formData.time }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Location</span>
                  <span class="value">{{ formData.location }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Players</span>
                  <span class="value">{{ formData.maxPlayers }} max</span>
                </div>
                <div class="summary-item">
                  <span class="label">Skill Level</span>
                  <span class="value">{{ formData.skillLevel }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Entry Fee</span>
                  <span class="value" :class="formData.isPaid ? 'text-danger' : 'text-success'">
                    {{ formData.isPaid ? `$${formData.totalPrice}` : 'Free' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-navigation">
            <button 
              v-if="currentStep > 1"
              type="button" 
              class="btn btn-secondary"
              @click="previousStep"
              :disabled="isSubmitting"
            >
              Back
            </button>

            <button 
              v-if="currentStep < 4"
              type="button" 
              class="btn btn-primary"
              @click="nextStep"
              :disabled="isSubmitting"
            >
              Next
            </button>

            <button 
              v-if="currentStep === 4"
              type="submit" 
              class="btn btn-success"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">Creating Match...</span>
              <span v-else>Create Match</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSuccessMessage" class="success-notification">
      <div class="notification-content">
        <span class="icon">✓</span>
        <div class="message-text">
          <p class="title">Match Created Successfully!</p>
          <p class="subtitle">Your match is now live and players can join</p>
        </div>
        <button class="btn-close-notification" @click="closeSuccessMessage">✕</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'

export default {
  name: 'GameCreation',
  data() {
    return {
      currentStep: 1,
      showSuccessMessage: false,
      isSubmitting: false,    
      submitError: null,
      
      formData: {
        matchName: '',
        sport: '',
        skillLevel: '',
        location: '',
        maxPlayers: 8,
        date: '',
        time: '',
        duration: 60,
        isPaid: false,
        totalPrice: 0,
        description: ''
      },
    }
  },
  methods: {
    getStepLabel(step) {
      const labels = ['Details', 'Schedule', 'Pricing', 'Description'];
      return labels[step - 1];
    },
    
    nextStep() {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    },
    
    previousStep() {
      this.currentStep--;
    },
    
    validateCurrentStep() {
      switch (this.currentStep) {
        case 1:
          return this.formData.matchName && this.formData.sport && this.formData.skillLevel && this.formData.location;
        case 2:
          return this.formData.date && this.formData.time && this.formData.duration;
        case 3:
          if (this.formData.isPaid) {
            return this.formData.totalPrice > 0;
          }
          return true;
        case 4:
          return this.formData.description;
        default:
          return true;
      }
    },

    async createMatch() {
      if (!this.validateCurrentStep()) {
        return;
      }

      this.isSubmitting = true;
      this.submitError = null;

      try {
        // Get current user for authentication
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('You must be logged in to create a match');
        }

        // send this to backend
        const matchData = {
          name: this.formData.matchName,
          sport_type: this.formData.sport,
          skill_level: this.formData.skillLevel,
          location: this.formData.location,
          total_player_count: this.formData.maxPlayers,
          date: this.formData.date,
          time: this.formData.time,
          duration: this.formData.duration,
          total_price: this.formData.isPaid ? this.formData.totalPrice : 0,
          description: this.formData.description,
          host: user.id,
          current_player_count: 0,
          conversation_id: 0,
          latitude: 1.3811339716891793,
          longitude: 103.75191378557123
        };

        const response = await fetch('http://localhost:3000/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify(matchData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create match');
        }

        const data = await response.json();

        // Show success message
        this.showSuccessMessage = true;
        
        // Reset form and redirect after delay
        setTimeout(() => {
          this.resetForm();
          this.$router.push('/home');
        }, 2000);

      } catch (error) {
        this.submitError = error.message || 'Failed to create match. Please try again.';
        alert(`Error: ${error.message}`);
      } finally {
        this.isSubmitting = false;
      }
    },    
    
    resetForm() {
      this.currentStep = 1;
      this.formData = {
        matchName: '',
        sport: '',
        skillLevel: '',
        location: '',
        maxPlayers: 8,
        date: '',
        time: '',
        duration: 60,
        isPaid: false,
        totalPrice: 0,
        description: ''
      };
    },
    
    closeSuccessMessage() {
      this.showSuccessMessage = false;
    },
        
    formatDateDisplay(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #FF6B35;
  --secondary-color: #2C3E50;
  --back-color: #F7F9FC;
  --success-color: #28a745;
  --danger-color: #dc3545;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h1 {
  color: var(--secondary-color);
  margin-bottom: 8px;
}

.subtitle {
  color: #999;
  font-size: 1.05rem;
}

.creation-container {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.steps-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e8ecef;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e8ecef;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.step.completed .step-number {
  background: var(--success-color);
  color: white;
}

.step-label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}

.step.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}

.form-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.section-title {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 30px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--secondary-color);
}

.form-control {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.char-count {
  font-size: 0.85rem;
  color: #999;
  margin-top: 4px;
}

.pricing-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.option-card {
  padding: 24px;
  border: 2px solid #e8ecef;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.1);
}

.option-card.selected {
  border-color: var(--primary-color);
  background: rgba(255, 107, 53, 0.05);
}

.option-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.option-card h3 {
  color: var(--secondary-color);
  margin: 0 0 4px 0;
  font-weight: 600;
}

.option-card p {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.paid-details {
  background: var(--back-color);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.price-info {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
}

.info-text {
  margin: 0;
  color: var(--secondary-color);
  font-weight: 500;
}

.info-text.small {
  font-size: 0.9rem;
  color: #999;
  font-weight: normal;
}

.payment-title {
  font-size: 1.1rem;
  color: var(--secondary-color);
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  border-top: 2px solid #e8ecef;
  padding-top: 16px;
}

.security-notice {
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
}

.security-notice p {
  margin: 0;
  font-weight: 500;
}

.summary-card {
  background: var(--back-color);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.summary-title {
  font-size: 1.1rem;
  color: var(--secondary-color);
  margin: 0 0 16px 0;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.summary-item .label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}

.summary-item .value {
  color: var(--secondary-color);
  font-weight: 600;
}

.text-success {
  color: var(--success-color);
}

.text-danger {
  color: var(--danger-color);
}

.form-navigation {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e8ecef;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #FF5722;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e8ecef;
  color: var(--secondary-color);
}

.btn-secondary:hover {
  background: #dee2e6;
}

.btn-success {
  background: var(--success-color);
  color: white;
  min-width: 150px;
}

.btn-success:hover {
  background: #218838;
  transform: translateY(-2px);
}

.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3000;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-content {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-content .icon {
  width: 40px;
  height: 40px;
  background: var(--success-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.message-text {
  flex: 1;
}

.message-text .title {
  margin: 0;
  color: var(--secondary-color);
  font-weight: 600;
}

.message-text .subtitle {
  margin: 0;
  color: #999;
  font-size: 0.85rem;
}

.btn-close-notification {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
}

.btn-close-notification:hover {
  color: var(--secondary-color);
  transform: rotate(90deg);
}

.btn-success {
  background: #28a745 !important;
  color: white !important;
  min-width: 150px;
}

.btn-success:hover {
  background: #28a745 !important;
  color: white !important;
  transform: none !important;
}

.btn-success:disabled {
  background: #28a745 !important;
  color: white !important;
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success:disabled:hover {
  background: #28a745 !important;
  color: white !important;
  transform: none !important;
}

.btn:disabled {
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .creation-container {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .pricing-options {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .steps-indicator {
    flex-direction: column;
    gap: 16px;
  }

  .steps-indicator::before {
    display: none;
  }

  .form-navigation {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .success-notification {
    left: 20px;
    right: 20px;
  }
}
</style>