<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
            <div class="register-header">
              <h1 class="register-title">Join MatchUp</h1>
              <p class="register-subtitle">Create your account</p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
              <!-- Name -->
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  placeholder="Your name"
                  autocomplete="name"
                />
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': error }"
                  placeholder="you@example.com"
                  required
                  autocomplete="email"
                />
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': error }"
                  placeholder="••••••••"
                  required
                  autocomplete="new-password"
                  minlength="8"
                />
                <div class="form-text">Minimum 8 characters</div>
              </div>

              <!-- Error message -->
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <!-- Submit button -->
              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Creating account...' : 'Create Account' }}
              </button>

              <!-- Login link -->
              <div class="text-center">
                <p class="mb-0 text-muted">
                  Already have an account?
                  <RouterLink to="/login" class="text-decoration-none">
                    Sign in
                  </RouterLink>
                </p>
              </div>
            </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    // Register user with Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value || null,
          role: 'user'
        }
      }
    })

    if (signUpError) {
      throw signUpError
    }

    // The trigger function will auto-create profile
    // User is automatically logged in after signup

    // Redirect to app
    router.push('/location-weather')
  } catch (err: any) {
    console.error('Register error:', err)
    error.value = err.message || 'Failed to create account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.register-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
}

@media (min-width: 768px) {
  .register-card {
    padding: 4rem;
  }
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .register-title {
    font-size: 3rem;
  }
}

.register-subtitle {
  color: #CBD5E1;
  margin: 0;
}

.form-label {
  color: #E5E7EB;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  text-align: left;
}

.form-control,
.form-select {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  color: #F1F5F9;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  font-size: 1.1rem;
  width: 100%;
  display: block;
}

.form-control:focus,
.form-select:focus {
  background: rgba(15, 23, 42, 0.7);
  border-color: #10B981;
  color: #F1F5F9;
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25);
}

.form-control::placeholder {
  color: #64748B;
}

.form-select option {
  background: #1E293B;
  color: #F1F5F9;
}

.form-text {
  color: #94A3B8;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #D94E1F 0%, #D97706 100%);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert-danger {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #FCA5A5;
  border-radius: 8px;
}

.text-muted {
  color: #94A3B8 !important;
}

a {
  color: #10B981;
  transition: color 0.2s;
}

a:hover {
  color: #34D399;
}
</style>
