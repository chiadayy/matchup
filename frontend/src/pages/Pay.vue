<template>
  <div style="background-color: #F7F9FC; min-height: 100vh; padding: 40px 20px;">
    <div class="container-fluid px-5 py-4">
      <div class="page-header">
        <h1 class="fw-bold">Match Details</h1>
        <p class="subtitle">Key in your card details to make payment to participate in the match!</p>
      </div>

      <div class="creation-container">
        <!-- Step Indicator -->
        <div class="steps-indicator">
          <div v-for="step in 2" :key="step" class="step" :class="{ active: currentStep === step, completed: currentStep > step }">
            <span class="step-number">{{ step }}</span>
            <span class="step-label">{{ getStepLabel(step) }}</span>
          </div>
        </div>

        <!-- Step 1: Match info -->
        <div v-if="currentStep === 1 && match"  class="info-grid">
          <h2 class="section-title">Match Details</h2>

          <!-- Match details -->
          <div class="info-section full-width">
            <div class="section-header">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <h3>Match Information</h3>
            </div>
            <div class="info-item">
              <span class="label">Match Name</span>
              <span class="value">{{ match.name }}</span>
            </div>
          </div>

          <!-- Schedule Section -->
          <div class="info-section">
            <div class="section-header">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3>Schedule</h3>
            </div>
            <div class="info-item">
              <span class="label">Date</span>
              <span class="value">{{ match.date }}</span>
            </div>
            <div class="info-item">
              <span class="label">Time</span>
              <span class="value">{{ match.time }}</span>
            </div>
          </div>

          <!-- Location & Players Section -->
          <div class="info-section">
            <div class="section-header">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <h3>Venue & Capacity</h3>
            </div>
            <div class="info-item">
              <span class="label">Location</span>
              <span class="value">{{ match.location }}</span>
            </div>
            <div class="info-item">
              <span class="label">Number of Players</span>
              <span class="value">{{ match.total_player_count }} players</span>
            </div>
          </div>
        </div>

        <!-- Step 2: Payment -->
        <div v-if="currentStep === 2 && match" class="payment-grid">
          <h2 class="section-title">Payment</h2>

          <!-- Payment Summary -->
          <div class="info-section full-width">
            <div class="section-header">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9c0-2.5 2-4.5 6-4.5s6 2 6 4.5v1c2 1 3 3 3 5.5 0 4-3.6 7-9 7s-9-3-9-7c0-2.5 1-4.5 3-5.5V9z"/>
                <path d="M8 9h8"/>
                <path d="M12 12v5"/>
                <path d="M12 11c-1 0-1.5.4-1.5 1s.5 1 1.5 1 1.5.4 1.5 1-.5 1-1.5 1"/>
              </svg>
              <h3>Payment Summary</h3>
            </div>
          
            <div class="summary-items">
              <div class="summary-row">
                <span class="summary-label">Court Rental</span>
                <span class="summary-value">800</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Number of Players</span>
                <span class="summary-value">5</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Amount Per Pax (SGD)</span>
                <span class="summary-value">160.00</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-row subtotal">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">$160.00</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Processing fees</span>
                <span class="summary-value">$0.00</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-row total">
                <span class="summary-label">Total</span>
                <span class="summary-value">$160.00</span>
              </div>
            </div>
          </div>

          <!-- Card Details -->
          <div class="info-section full-width">
            <div class="section-header">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <h3>Card Details</h3>
            </div>
            
            <div class="form-group">
              <label for="cardholderName">Cardholder Name</label>
              <input 
                type="text" 
                id="cardholderName" 
                v-model="cardName"
                placeholder="Sally Lim"
                required
              />
            </div>

            <div class="form-group">
              <label for="cardNumber">Card Number</label>
              <div id="card-element" class="form-control mb-3"></div>
            </div>

            <button class="pay-button" @click="handlePayment" :disabled="loading">
              {{ loading ? 'Processing...' : 'Pay' }}
            </button>
            
            <p v-if="message" class="payment-message">{{ message }}</p>

            <div v-if="showSuccessModal" class="confirm-overlay">
              <div class="confirm-box">
                <h3>Payment Successful!</h3><br></br>
                <p>You’ve been successfully added to the match.</p>
                <div class="confirm-actions">
                  <button @click="handleSuccessOk" class="modal-btn">OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-navigation">
          <button 
            v-if="currentStep === 2"
            type="button" 
            class="btn btn-secondary"
            @click="previousStep"
          >
            Back
          </button>

          <button 
            v-if="currentStep === 1"
            type="button" 
            class="btn btn-primary"
            @click="nextStep"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { loadStripe } from "@stripe/stripe-js";
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';

export default {
  name: 'GameCreation',
  data() {
    return {
      userMatch: null,
      stripe: null,
      elements: null,
      card: null,
      loading: false,
      message: "",
      amountPerPax: 0,
      cardName: "",
      currentStep: 1,
      currentUser: null
    }
  },
  computed: {
    match() {
      return this.userMatch || null;
    }
  },
  async mounted() {
    const matchId = this.$route.params.matchid;
    console.log(this.$route.params.matchid);

    const { data: { user } } = await supabase.auth.getUser();
    this.currentUser = user;

    await this.retrieveMatchDetails(matchId);
  },
  methods: {
    async retrieveMatchDetails(matchid) {
      try {
        const { data, error } = await supabase
          .from('matches')       
          .select('*')
          .eq('id', matchid)
          .single();

        if (error) throw error;
        if (!data) throw new Error("No match found");

        this.userMatch = data;
        console.log("Match data:", data);

         this.amountPerPax = Math.round((data.total_price / data.total_player_count) * 100);
      } catch (err) {
        console.error("Error fetching match:", err.message);
      }
    },
    async setupStripe() {
      this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      this.elements = this.stripe.elements();
      this.card = this.elements.create("card", {
        style: {
          base: {
            fontSize: "16px",
            color: "#32325d",
            "::placeholder": { color: "#a0aec0" },
          },
        },
      });
      this.card.mount("#card-element");
    },
    async handlePayment() {
      this.loading = true;
      this.message = "";

      try {
        const res = await fetch("http://localhost:3000/payments/create-payment-intent", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ amount: this.amountPerPax, currency: "sgd" })
        });

        const { clientSecret } = await res.json();

        const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: { name: this.cardName },
          },
        });

        if (error) this.message = error.message;
        else if (paymentIntent.status === "succeeded") {
          this.showSuccessModal = true;

          try {
            const res = await fetch(`http://localhost:3000/matches/${this.match.id}/join`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: this.currentUser.id,
                payment_success: true
              })
            });
            const result = await res.json();

            if (!result.success) {
              console.error("Failed to join match in DB:", result.error);
            }
          } catch (err) {
            console.error("Error joining match in DB:", err);
          }
        } 
      } catch (err) {
        this.message = "Error: " + err.message;
      } finally {
        this.loading = false;
      }
    },
    async handleSuccessOk() {
      this.showSuccessModal = false;
      
      const { error } = await supabase
      .from('notifications')
      .insert([
        { 
          user_id: this.currentUser.id,
          title: "Payment",
          message: `Payment for match "${this.match.name}" successful`,
          read: false
        }
      ])

      if (error) {
        console.error('Error inserting notification:', error)
      } else {
        console.log('Inserted data:')
      }

      // redirect back to browser page 
      this.$router.push({ name: 'Browser' }); 
    },
    getStepLabel(step) {
      const labels = ['Match Details', 'Payment'];
      return labels[step - 1];
    },
    
    nextStep() {
      this.currentStep++;
      if (this.currentStep === 2) {
        this.$nextTick(() => this.setupStripe()); 
      }
    },
    
    previousStep() {
      this.currentStep--;
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
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
  background: #e8ecef;
  color: #999;
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

.review-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.info-section.full-width {
  grid-column: 1 / -1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.section-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.info-item:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

.info-item.highlight {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #ff6b35;
  margin-top: 0.5rem;
}

.label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

.info-item.highlight .value {
  color: #ff6b35;
  font-size: 1.25rem;
  text-transform: capitalize;
}

/* Summary Box */
.summary-box {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: white;
  font-size: 1.125rem;
  font-weight: 500;
}

.summary-value {
  color: white;
  font-size: 2rem;
  font-weight: 700;
}


/* Responsive Design */
/* @media (max-width: 768px) {
  .review-container {
    padding: 1rem;
  }

  .stepper {
    padding: 0;
  }

  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-line {
    max-width: 60px;
    margin: 0 0.5rem;
  }

  .review-card {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
} */
.payment-card {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 2rem;
}

/* Section Styles */
.section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.icon {
  width: 24px;
  height: 24px;
  color: #f97316;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

/* Payment Grid */
.payment-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.info-row.highlight {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #f97316;
}

/* Breakdown */
.breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.breakdown-label {
  color: #475569;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fee-note {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 400;
}

.breakdown-value {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Final Total */
.final-total {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.total-label {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

.total-amount {
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

.total-note {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  text-align: center;
}
.summary-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 0.9375rem;
  color: #6b7280;
  font-weight: 400;
}

.summary-value {
  font-size: 0.9375rem;
  color: #2c3e50;
  font-weight: 500;
}

.summary-row.subtotal .summary-label,
.summary-row.subtotal .summary-value {
  font-weight: 600;
}

.summary-row.total {
  padding-top: 0.5rem;
}

.summary-row.total .summary-label {
  font-size: 1.125rem;
  color: #2c3e50;
  font-weight: 700;
}

.summary-row.total .summary-value {
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 700;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c3e50;
  margin-top:  1rem;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #2c3e50;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.pay-button {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 1rem 2rem;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pay-button:hover {
  background: #ff5722;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transform: translateY(-1px);
}

.pay-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.payment-message {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.card-input-wrapper {
  width: 100%;
}

.card-input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #2c3e50;
  transition: all 0.2s ease;
}

.card-input-wrapper input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.card-input-wrapper input::placeholder {
  color: #9ca3af;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5); /* semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* make sure it’s on top of everything */
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
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
  color: #2C3E50;
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
  background: #FF6B35;
  color: white;
}

.confirm-actions button:hover {
  background: #FF6B35;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.confirm-actions button:first-child {
  background: #FF6B35;
  color: white;
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
</style>
