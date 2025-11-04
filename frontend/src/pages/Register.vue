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
          role: 'player'
        }
      }
    })

    if (signUpError) {
      throw signUpError
    }

    // The trigger function will auto-create profile
    // User is automatically logged in after signup

    // Redirect to home
    router.push('/home')
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
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
}

.register-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

@media (min-width: 768px) {
  .register-card {
    padding: 4rem;
  }
}

.register-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.register-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1F2937;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (min-width: 768px) {
  .register-title {
    font-size: 3rem;
  }
}

.register-subtitle {
  color: #6B7280;
  font-size: 1.1rem;
  margin: 0;
}

.form-label {
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  text-align: left;
  font-size: 0.95rem;
}

.form-control,
.form-select {
  background: #F9FAFB;
  border: 2px solid #E5E7EB;
  color: #1F2937;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  display: block;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  background: #FFFFFF;
  border-color: #FF6B35;
  color: #1F2937;
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
  outline: none;
}

.form-control::placeholder {
  color: #9CA3AF;
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #EF4444;
}

.form-select option {
  background: #FFFFFF;
  color: #1F2937;
}

.form-text {
  color: #6B7280;
  font-size: 0.875rem;
  margin-top: 0.375rem;
  display: block;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%);
  border: none;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
  font-size: 1.05rem;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  color: #FFFFFF;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #D94E1F 0%, #D97706 100%);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert-danger {
  background: #FEE2E2;
  border: 1px solid #FECACA;
  color: #DC2626;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
}

.text-muted {
  color: #6B7280 !important;
  font-size: 0.95rem;
}

a {
  color: #FF6B35;
  font-weight: 600;
  transition: color 0.2s;
  text-decoration: none;
}

a:hover {
  color: #D94E1F;
  text-decoration: underline;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15rem;
}

/* Mobile phones (768px) */
@media (max-width: 768px) {
  .register-page {
    padding: 1.5rem 0;
  }

  .register-container {
    padding: 0 1rem;
  }

  .register-card {
    padding: 2.5rem 2rem;
  }

  .register-title {
    font-size: 2rem;
  }

  .register-subtitle {
    font-size: 1rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-control,
  .form-select {
    font-size: 0.95rem;
    padding: 0.75rem 0.875rem;
  }

  .btn-primary {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

/* Small phones (576px) */
@media (max-width: 576px) {
  .register-page {
    padding: 1rem 0;
  }

  .register-container {
    padding: 0 0.75rem;
  }

  .register-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }

  .register-title {
    font-size: 1.75rem;
  }

  .register-subtitle {
    font-size: 0.9rem;
  }

  .register-header {
    margin-bottom: 2rem;
  }

  .form-label {
    font-size: 0.85rem;
  }

  .form-control,
  .form-select {
    font-size: 0.9rem;
    padding: 0.7rem 0.8rem;
  }

  .btn-primary {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }

  .text-muted {
    font-size: 0.85rem;
  }

  .form-text {
    font-size: 0.8rem;
  }
}

/* Extra small phones (375px) */
@media (max-width: 375px) {
  .register-card {
    padding: 1.5rem 1rem;
  }

  .register-title {
    font-size: 1.5rem;
  }

  .form-control,
  .form-select {
    font-size: 0.85rem;
  }
}
</style>
