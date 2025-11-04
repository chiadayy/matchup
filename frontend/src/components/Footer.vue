<template>
  <footer class="footer-custom">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-brand">
          <div class="brand-header">
            <router-link to="/" class="d-flex align-items-center text-decoration-none text-light">
              <span class="footer-icon">🏆</span>
              <h3 class="footer-title">MatchUp</h3>
            </router-link>
          </div>
          <p class="footer-description">
            Connect with local players and find your perfect sports match. Join the community today!
          </p>
        </div>

        <!-- Quick Links Section -->
        <div class="footer-links">
          <h5 class="footer-section-title">Quick Links</h5>
          <div class="links-grid">
            <!-- Browser - visible to everyone except admins -->
            <router-link 
              v-if="userRole !== 'organiser'"
              to="/browser" 
              class="footer-link"
            >
              Browser
            </router-link>

            <!-- Calendar - visible to player users -->
            <router-link 
              v-if="userRole === 'player'"
              to="/calendar" 
              class="footer-link"
            >
              Calendar
            </router-link>

            <!-- My Matches - visible to player users -->
            <router-link 
              v-if="userRole === 'player'"
              to="/my-matches" 
              class="footer-link"
            >
              My Matches
            </router-link>

            <!-- Game Creation - visible to player users -->
            <router-link 
              v-if="userRole === 'player'"
              to="/create-game" 
              class="footer-link"
            >
              Game Creation
            </router-link>

            <!-- Admin Dashboard - visible to admins only -->
            <router-link 
              v-if="userRole === 'organiser'"
              to="/admin-dashboard" 
              class="footer-link"
            >
              Admin Dashboard
            </router-link>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <small class="copyright">© {{ currentYear }} MatchUp. All rights reserved.</small>
      </div>
    </div>
  </footer>
</template>

<script>
import { supabase } from '@/lib/supabase';

export default {
  name: 'Footer',
  data() {
    return {
      userRole: 'player',
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  async mounted() {
    await this.loadCurrentUser();
  },
  methods: {
      async loadCurrentUser() {
        this.isLoading = true;
        this.loadError = null;

        try {
          const { data: authData, error: authError } = await supabase.auth.getUser();
          if (authError) throw authError;

          if (!authData?.user) {
            console.log('No user logged in');
            this.userInfo = null;
            this.userRole = 'player';
            return;  // ← Early return prevents errors
          }

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileError) throw profileError;

          this.userRole = profileData.role;

        } catch (err) {
          console.error('Error loading user:', err);
          this.loadError = 'Failed to load profile. Please try again.';
        } finally {
          this.isLoading = false;
        }
      },
    }
};
</script>

<style scoped>
.footer-custom {
  background: linear-gradient(135deg, #2C3E50 0%, #1a237e 100%);
  color: white;
  padding: 3rem 2rem 2rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand {
  max-width: 500px;
}

.brand-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.footer-icon {
  background: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-right: 0.75rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-title {
  font-weight: bold;
  margin: 0;
  font-size: 1.75rem;
}

.footer-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
}

.footer-section-title {
  font-weight: bold;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 2px;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #FF6B35;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #FF6B35;
  transform: translateX(5px);
}

.footer-link:hover::after {
  width: 100%;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-custom {
    padding: 2rem 1.5rem 1.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-brand {
    max-width: 100%;
  }

  .links-grid {
    gap: 1rem;
  }

  .footer-section-title {
    font-size: 1.1rem;
  }

  .footer-title {
    font-size: 1.5rem;
  }

  .footer-bottom {
    padding-top: 1.5rem;
  }
}

@media (max-width: 576px) {
  .footer-custom {
    padding: 1.5rem 1rem 1rem;
  }

  .footer-content {
    gap: 1.5rem;
  }

  .links-grid {
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-link {
    display: block;
  }

  .brand-header {
    margin-bottom: 0.75rem;
  }

  .footer-icon {
    font-size: 1.25rem;
    padding: 0.4rem;
  }

  .footer-title {
    font-size: 1.25rem;
  }
}
</style>