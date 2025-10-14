<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Left Side - Login Form -->
      <div class="login-left">
        <div class="brand-logo">
          <span>🏆</span>
          <h2>MatchUp</h2>
        </div>

        <h3 class="fw-bold mb-2">Welcome Back!</h3>
        <p class="text-muted mb-4">Sign in to continue to your account</p>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="email"
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
              v-model="password"
              placeholder="Enter your password" 
              required
            >
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="rememberMe"
                v-model="rememberMe"
              >
              <label class="form-check-label" for="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" class="link-primary" @click.prevent="openForgotPasswordModal">
              Forgot Password?
            </a>
          </div>

          <button type="submit" class="btn btn-login">Sign In</button>
        </form>

        <div class="divider">
          <span>OR</span>
        </div>

        <p class="text-center mb-0">
          Don't have an account? <router-link to="/register" class="link-primary">Create Account</router-link>
        </p>
      </div>

      <!-- Right Side - Marketing -->
      <div class="login-right">
        <h3 class="fw-bold mb-3">Find Your Perfect Match</h3>
        <p class="mb-4">Join thousands of players connecting and competing in local sports matches.</p>
        
        <ul class="feature-list">
          <li>🏀 Browse matches near you</li>
          <li>📅 Easy scheduling and calendar</li>
          <li>👥 Connect with local players</li>
          <li>🎯 Find your skill level</li>
        </ul>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPasswordModal" class="modal-overlay" @click="showForgotPasswordModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title fw-bold">Reset Password</h5>
          <button class="btn-close" @click="showForgotPasswordModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="text-muted mb-4">Enter your email address and we'll send you a link to reset your password.</p>
          <form @submit.prevent="handleForgotPassword">
            <div class="mb-3">
              <label for="resetEmail" class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-control" 
                id="resetEmail" 
                v-model="resetEmail"
                placeholder="your@email.com" 
                required
              >
            </div>
            <button type="submit" class="btn btn-login">Send Reset Link</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      showForgotPasswordModal: false,
      resetEmail: ''
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    openForgotPasswordModal() {
      this.showForgotPasswordModal = true
    },
    handleLogin() {
      const loginData = {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe
      }
      
      console.log('Login attempt:', loginData)
      alert('Login successful! Redirecting to dashboard...')
      
      // TODO: Make API call to backend
      this.$router.push('/')
    },
    handleForgotPassword() {
      console.log('Password reset for:', this.resetEmail)
      alert('Password reset link sent to ' + this.resetEmail)
      this.showForgotPasswordModal = false
      this.resetEmail = ''
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

body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 76px);
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  max-width: 1000px;
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

.login-left {
  flex: 1;
  padding: 60px 50px;
  background: white;
}

.login-right {
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

.login-right::before {
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

.btn-login {
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

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #999;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e8ecef;
}

.divider span {
  padding: 0 16px;
  font-size: 0.875rem;
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
  border-radius: 16px;
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

.position-relative {
  position: relative;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-check-input {
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  margin: 0;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-left,
  .login-right {
    padding: 40px 30px;
  }

  .login-right {
    order: -1;
  }
}
</style>