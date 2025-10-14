<template>
  <div class="register-wrapper">
    <div class="register-container">
      <!-- Left Side - Registration Form -->
      <div class="register-left">
        <div class="brand-logo">
          <span>🏆</span>
          <h2>MatchUp</h2>
        </div>

        <h3 class="fw-bold mb-2">Create Account</h3>
        <p class="text-muted mb-4">Join the community and start playing today</p>

        <form @submit.prevent="handleRegister">
          <!-- Basic Information -->
          <div class="mb-3">
            <label for="name" class="form-label">Full Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              v-model="form.name"
              placeholder="John Doe" 
              required
            >
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="form.email"
              placeholder="your@email.com" 
              required
            >
          </div>

          <div class="mb-3 position-relative">
            <label for="password" class="form-label">Password</label>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              class="form-control" 
              id="password" 
              v-model="form.password"
              placeholder="Create a strong password" 
              required
              @input="checkPasswordStrength"
            >
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
            <div class="password-strength">
              <div class="password-strength-bar" :class="strengthClass" :style="{ width: strengthWidth }"></div>
            </div>
            <small class="text-muted" :style="{ color: strengthColor }">{{ strengthText }}</small>
          </div>

          <div class="mb-4 position-relative">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              class="form-control" 
              id="confirmPassword" 
              v-model="form.confirmPassword"
              placeholder="Re-enter your password" 
              required
            >
            <span class="password-toggle" @click="toggleConfirmPasswordVisibility">
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </span>
          </div>

          <!-- Plan Selection -->
          <div class="mb-4">
            <label class="form-label">Select Plan</label>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="plan-card" :class="{ selected: form.plan === 'free' }">
                  <input 
                    type="radio" 
                    name="plan" 
                    value="free" 
                    v-model="form.plan"
                    @change="handlePlanChange"
                  >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="fw-bold mb-0">Free</h5>
                    <span class="plan-badge" style="background: #4CAF50;">Popular</span>
                  </div>
                  <p class="text-muted mb-3">Perfect for casual players</p>
                  <ul class="list-unstyled small">
                    <li class="mb-2">✓ Browse all matches</li>
                    <li class="mb-2">✓ Join free matches</li>
                    <li class="mb-2">✓ Basic calendar</li>
                    <li class="mb-2">✓ Community access</li>
                  </ul>
                </label>
              </div>
              <div class="col-md-6">
                <label class="plan-card" :class="{ selected: form.plan === 'paid' }">
                  <input 
                    type="radio" 
                    name="plan" 
                    value="paid" 
                    v-model="form.plan"
                    @change="handlePlanChange"
                  >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="fw-bold mb-0">Premium</h5>
                    <span class="plan-badge">$9.99/mo</span>
                  </div>
                  <p class="text-muted mb-3">For serious competitors</p>
                  <ul class="list-unstyled small">
                    <li class="mb-2">✓ Everything in Free</li>
                    <li class="mb-2">✓ Join paid matches</li>
                    <li class="mb-2">✓ Priority booking</li>
                    <li class="mb-2">✓ Advanced analytics</li>
                    <li class="mb-2">✓ Ad-free experience</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <div v-if="form.plan === 'paid'" class="payment-form active">
            <h5 class="fw-bold mb-3">Payment Details</h5>
            
            <div class="mb-3">
              <label for="cardNumber" class="form-label">Card Number</label>
              <input 
                type="text" 
                class="form-control" 
                id="cardNumber" 
                v-model="payment.cardNumber"
                placeholder="1234 5678 9012 3456" 
                maxlength="19"
                @input="formatCardNumber"
                :required="form.plan === 'paid'"
              >
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label for="expiryDate" class="form-label">Expiry Date</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="expiryDate" 
                  v-model="payment.expiryDate"
                  placeholder="MM/YY" 
                  maxlength="5"
                  @input="formatExpiryDate"
                  :required="form.plan === 'paid'"
                >
              </div>
              <div class="col-md-6">
                <label for="cvv" class="form-label">CVV</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="cvv" 
                  v-model="payment.cvv"
                  placeholder="123" 
                  maxlength="3"
                  @input="formatCVV"
                  :required="form.plan === 'paid'"
                >
              </div>
            </div>

            <div class="mb-3">
              <label for="cardName" class="form-label">Name on Card</label>
              <input 
                type="text" 
                class="form-control" 
                id="cardName" 
                v-model="payment.cardName"
                placeholder="John Doe"
                :required="form.plan === 'paid'"
              >
            </div>

            <div class="alert alert-info">
              <small><strong>🔐 Secure Payment:</strong> Your payment information is encrypted and secure. We never store your card details.</small>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="form-check mb-4">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="terms"
              v-model="form.terms"
              required
            >
            <label class="form-check-label" for="terms">
              I agree to the <a href="#" class="link-primary">Terms of Service</a> and <a href="#" class="link-primary">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" class="btn btn-register">Create Account</button>
        </form>

        <p class="text-center mt-4 mb-0">
          Already have an account? <router-link to="/login" class="link-primary">Sign In</router-link>
        </p>
      </div>

      <!-- Right Side - Marketing -->
      <div class="register-right">
        <h3 class="fw-bold mb-3">Join MatchUp Today</h3>
        
        <ul class="feature-list">
          <li>🎯 Find matches that fit your schedule</li>
          <li>👥 Build your sports network</li>
          <li>📍 Discover venues near you</li>
          <li>💬 Chat with other players</li>
        </ul>

        <div style="position: relative; z-index: 1; margin-top: 40px;">
          <p class="fw-semibold mb-2">Join over 10,000+ active players</p>
          <div class="d-flex align-items-center gap-2">
            <div style="display: flex; margin-left: -8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.3); border: 2px solid white; margin-left: -8px;"></div>
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.3); border: 2px solid white; margin-left: -8px;"></div>
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.3); border: 2px solid white; margin-left: -8px;"></div>
            </div>
            <span class="small">and counting...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        plan: 'free',
        terms: false
      },
      payment: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      passwordStrength: 0,
      strengthText: '',
      strengthClass: '',
      strengthWidth: '0%',
      strengthColor: ''
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    checkPasswordStrength() {
      const password = this.form.password
      let strength = 0
      
      if (password.length >= 8) strength++
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
      if (password.match(/[0-9]/)) strength++
      if (password.match(/[^a-zA-Z0-9]/)) strength++
      
      this.passwordStrength = strength
      
      if (password.length === 0) {
        this.strengthWidth = '0%'
        this.strengthText = ''
        this.strengthColor = ''
      } else if (strength <= 2) {
        this.strengthClass = 'weak'
        this.strengthWidth = '33%'
        this.strengthText = 'Weak password'
        this.strengthColor = '#f44336'
      } else if (strength === 3) {
        this.strengthClass = 'medium'
        this.strengthWidth = '66%'
        this.strengthText = 'Medium strength'
        this.strengthColor = '#FFC107'
      } else {
        this.strengthClass = 'strong'
        this.strengthWidth = '100%'
        this.strengthText = 'Strong password'
        this.strengthColor = '#4CAF50'
      }
    },
    handlePlanChange() {
      // Plan change is handled by v-model
    },
    formatCardNumber(event) {
      let value = this.payment.cardNumber.replace(/\s/g, '')
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
      this.payment.cardNumber = formattedValue
    },
    formatExpiryDate(event) {
      let value = this.payment.expiryDate.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4)
      }
      this.payment.expiryDate = value
    },
    formatCVV(event) {
      this.payment.cvv = this.payment.cvv.replace(/\D/g, '')
    },
    handleRegister() {
      // Validate passwords match
      if (this.form.password !== this.form.confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      
      // Check password strength
      if (this.form.password.length < 8) {
        alert('Password must be at least 8 characters long!')
        return
      }
      
      const userData = {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        plan: this.form.plan
      }
      
      // If paid plan, get payment details
      if (this.form.plan === 'paid') {
        userData.payment = {
          cardNumber: this.payment.cardNumber.replace(/\s/g, ''),
          expiryDate: this.payment.expiryDate,
          cvv: this.payment.cvv,
          cardName: this.payment.cardName
        }
      }
      
      // TODO: Make API call to backend
      console.log('Registration data:', userData)
      alert(`Account created successfully! Welcome to MatchUp, ${this.form.name}!`)
      this.$router.push('/')
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

.register-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 76px);
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  max-width: 1100px;
  width: 100%;
  display: flex;
  animation: slideUp 0.6s ease;
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

.register-left {
  flex: 1;
  padding: 50px 40px;
  background: white;
  max-height: 90vh;
  overflow-y: auto;
}

.register-right {
  flex: 1;
  background: linear-gradient(135deg, var(--primary-color) 0%, #FF5722 100%);
  padding: 60px 50px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-right::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.brand-logo span {
  font-size: 2rem;
  background: var(--secondary-color);
  padding: 8px 12px;
  border-radius: 12px;
}

.brand-logo h2 {
  font-weight: 700;
  color: var(--secondary-color);
  margin: 0;
}

.form-control {
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid #e8ecef;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
}

.form-label {
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 8px;
}

.btn-register {
  background: linear-gradient(135deg, var(--primary-color) 0%, #FF5722 100%);
  color: white;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  cursor: pointer;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
}

.link-primary {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.link-primary:hover {
  color: #FF5722;
  text-decoration: underline;
}

.password-toggle {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  user-select: none;
  font-size: 1.2rem;
}

.password-toggle:hover {
  color: var(--primary-color);
}

.plan-card {
  border: 3px solid #e8ecef;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: block;
  background: white;
}

.plan-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
}

.plan-card.selected {
  border-color: var(--primary-color);
  background-color: rgba(255, 107, 53, 0.05);
}

.plan-card input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.plan-badge {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.payment-form {
  display: none;
  animation: slideDown 0.3s ease;
  margin-top: 24px;
  padding: 24px;
  background: var(--back-color);
  border-radius: 12px;
}

.payment-form.active {
  display: block;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 24px 0;
  position: relative;
  z-index: 1;
}

.feature-list li {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-list li::before {
  content: '✓';
  background: rgba(255,255,255,0.2);
  padding: 4px 8px;
  border-radius: 50%;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.password-strength {
  height: 4px;
  border-radius: 2px;
  background: #e8ecef;
  margin-top: 8px;
  overflow: hidden;
}

.password-strength-bar {
  height: 100%;
  transition: all 0.3s ease;
}

.password-strength-bar.weak {
  background: #f44336;
}

.password-strength-bar.medium {
  background: #FFC107;
}

.password-strength-bar.strong {
  background: #4CAF50;
}

.position-relative {
  position: relative;
}

.form-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.form-check-input {
  cursor: pointer;
  margin-top: 4px;
}

.form-check-label {
  cursor: pointer;
  margin: 0;
}

.alert {
  border-radius: 12px;
  border: none;
  padding: 12px 16px;
}

.alert-info {
  background-color: #e3f2fd;
  color: #1565c0;
}

.d-flex {
  display: flex;
}

.align-items-start {
  align-items: flex-start;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 16px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 16px;
}

.mb-4 {
  margin-bottom: 24px;
}

.mt-4 {
  margin-top: 24px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-md-6 {
  flex: 0 0 50%;
  padding: 8px;
}

.g-3 > * {
  padding: 8px;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #999;
}

.fw-bold {
  font-weight: 700;
}

.fw-semibold {
  font-weight: 600;
}

.small {
  font-size: 0.875rem;
}

.list-unstyled {
  list-style: none;
  padding: 0;
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .register-left,
  .register-right {
    padding: 40px 30px;
  }

  .register-right {
    order: -1;
  }

  .col-md-6 {
    flex: 0 0 100%;
  }
}

</style>