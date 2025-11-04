  <template>
    <nav :class="['navbar-custom', { 'scrolled': isScrolled }]">
      <div class="navbar-container">
        <!-- Brand + Main Navigation (Left side) -->
        <div class="navbar-left">
          <div class="navbar-brand">
            <router-link to="/" class="d-flex align-items-center text-decoration-none">
              <span class="brand-icon">🏆</span>
              <strong class="brand-text">MatchUp</strong>
            </router-link>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="navbar-links">
            <!-- Browser - visible to everyone except organisers -->
            <router-link 
              v-if="userRole !== 'organiser'"
              to="/browser" 
              class="nav-link-custom"
            >
              Browser
            </router-link>

            <!-- Calendar - visible to player users and organizers -->
            <router-link 
              v-if="(userRole === 'player')"
              to="/calendar" 
              class="nav-link-custom"
            >
              Calendar
            </router-link>

            <!-- My Matches - visible to player users and organizers -->
            <router-link 
              v-if="userRole === 'player'"
              to="/my-matches" 
              class="nav-link-custom"
            >
              My Matches
            </router-link>

            <!-- Game Creation - visible to organizers only -->
            <router-link 
              v-if="userRole === 'player'"
              to="/create-game" 
              class="nav-link-custom"
            >
              Game Creation
            </router-link>

            <!-- organiser Dashboard - visible to organisers only -->
            <router-link 
              v-if="userRole === 'organiser'"
              to="/admin-dashboard" 
              class="nav-link-custom"
            >
              Admin Dashboard
            </router-link>
          </div>
        </div>

        <!-- Mobile Toggle Button -->
        <button 
          class="navbar-toggler d-lg-none" 
          type="button" 
          @click="toggleMobileMenu"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon">☰</span>
        </button>

        <!-- Mobile Menu (Right side) -->
        <div :class="['mobile-menu', { 'show': showMobileMenu }]">
          <div class="mobile-menu-content">
            <button class="btn btn-danger text-end" @click="closeMobileMenu">
              X
            </button>

            <!-- Mobile Navigation Links -->
            <router-link 
              to="/browser" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
              
            >
              Browser
            </router-link>

            <router-link 
              v-if="(userRole === 'player')"
              to="/calendar" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              Calendar
            </router-link>

            <router-link 
              v-if="(userRole === 'player')"
              to="/my-matches" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              My Matches
            </router-link>

            <router-link 
              v-if="userRole === 'player'"
              to="/create-game" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              Game Creation
            </router-link>

            <router-link 
              v-if="userRole === 'organiser'"
              to="/admin-dashboard" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              Admin Dashboard
            </router-link>

            <div class="mobile-menu-divider"></div>

            <!-- User Actions in Mobile Menu -->
            <div v-if="userRole !== 'organiser'" class="mobile-user-section">
              <router-link 
                v-if="userRole !== 'organiser'"
                to="/profile" 
                class="mobile-nav-link"
                @click="closeMobileMenu"
              >
                <img 
                  :src="userInfo?.profile_image || defaultProfileImage" 
                  alt="Profile" 
                  class="mobile-profile-pic" 
                />
                <span class="mobile-user-name px-2">
                  {{ userInfo?.name || 'User' }}
                </span>
              </router-link>
              <button @click="showLogoutConfirm = true" class="mobile-nav-link logout-link">
                Logout
              </button>
            </div>

            <div v-if="userRole === 'organiser'" class="mobile-user-section">
              <div class="mobile-profile-info">
                <img :src="userInfo?.profile_image || defaultProfileImage" alt="Profile" class="mobile-profile-pic" />
                <span class="mobile-user-name admin-badge">{{ userInfo?.name }} (Admin)</span>
              </div>
              <button @click="showLogoutConfirm = true" class="mobile-nav-link logout-link">Logout</button>
            </div>

            
          </div>
        </div>

        <!-- Desktop User Actions (Right side) -->
        <div class="navbar-actions desktop-actions">

          <div class="notification-container" ref="bellContainer">
            <!-- Bell Button -->
            <button @click="toggleNotifications" class="notification-btn">
              <i class="fas fa-bell bell-icon"></i>
              <span v-if="unreadCount" class="notification-count">
                {{ unreadCount }}
              </span>
            </button>

            <!-- Dropdown -->
            <transition name="fade-scale">
              <div v-if="showNotifications" ref="dropdownMenu" class="notification-dropdown">
                <!-- Header -->
                <div class="notification-header">
                  <h3>Notifications</h3>
                  <button @click="closeNotifications" class="close-btn">
                    <i class="fas fa-x"></i>
                  </button>
                </div>

                <!-- Body -->
                <div class="notification-body">
                  <div v-if="notifications.length === 0" class="notification-empty">
                    <i class="fas fa-bell empty-icon"></i>
                    <p class="empty-title">No new notifications</p>
                    <p class="empty-sub">We'll notify you when something arrives</p>
                  </div>

                  <ul v-else class="notification-list">
                    <li v-for="notification in notifications" :key="notification.id" class="notification-item" 
                      :class="{ 'unread': !notification.read }">
                      <div class="notification-content">
                        <div class="notification-title">
                          {{ notification.title }}
                          <span v-if="!notification.read" class="notification-dot"></span>
                        </div>
                        <p class="notification-message">{{ notification.message }}</p>
                        <p class="notification-time">{{ new Date(notification.created_at).toLocaleString() }}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <!-- mark as all read footer -->
                <div v-if="notifications.length > 0" class="notification-footer">
                  <button @click="markAllAsRead" class="mark-all-btn">
                    Mark all as read
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <!-- end of notifications -->

          <!-- User profile and logout -->
          <div v-if="userRole !== 'organiser'" class="d-flex gap-3">
            <router-link 
              v-if="userInfo && userRole !== 'organiser'" 
              to="/profile" 
              class="d-flex align-items-center gap-2 text-decoration-none profile-link"
            >
              <img 
                :src="userInfo?.profile_image || defaultProfileImage" 
                alt="Profile" 
                class="profile-pic rounded-circle border border-warning border-3"
              />
              <!-- Hide name on small/medium, show on large+ -->
              <span class="fw-semibold text-dark d-lg-inline profile-name">
                {{ userInfo?.name || 'User' }}
              </span>
            </router-link>

            <!-- Logout Button (player User) - Desktop -->
            <button 
              v-if="userInfo && userRole !== 'organiser'"
              @click="showLogoutConfirm = true"
              class="btn btn-danger btn-sm d-md-inline-block logout-btn rounded-pill"
            >
              Logout
            </button>
            
            
            <!-- Logout Button (player User) - Mobile Icon -->
            <button 
              v-if="userInfo && userRole !== 'organiser'"
              @click="showLogoutConfirm = true"
              class="btn btn-danger btn-sm d-inline-block d-md-none logout-btn-icon rounded-pill"
              aria-label="Logout"
            >

            </button>
          </div>

          <!-- organiser user - show organiser label and logout -->
          <div v-if="userRole === 'organiser'" class="admin-section">
            <span class="admin-label">Admin</span>
            <!-- <button @click="logout" class="btn btn-logout-small">Logout</button> -->
            <button @click="showLogoutConfirm = true" class="btn btn-logout-small">Logout</button>
          </div>
          
          
        </div>

        
      </div>
    </nav>

    <!-- confirm logout -->
    <div v-if="showLogoutConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>Are you sure you want to logout?</p>
        <div class="confirm-actions">
          <button @click="logout()">Yes, leave</button>
          <button @click="showLogoutConfirm = false">Cancel</button>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { supabase } from '@/lib/supabase';

  export default {
    name: 'Navbar',
    emits: ['logout'],
    data() {
      return {
        isScrolled: false,
        showDropdown: false,
        showMobileMenu: false,
        showNotifications: false,
        notifications: [],
        showLogoutConfirm: false,
        userInfo: null,
        userRole: 'player',
        isLoading: false,
        loadError: null,
        defaultProfileImage: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/default-avatar.png`,
      };
    },
    computed: {
      unreadCount() {
        return this.notifications.filter(n => !n.read).length;
      }
    },
    async mounted() {
      window.addEventListener('scroll', this.handleScroll);
      document.addEventListener('click', this.handleClickOutside);
      document.addEventListener('click', this.handleNotificationClickOutside);
      this.loadNotifications();
      await this.loadCurrentUser();
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
      document.removeEventListener('click', this.handleClickOutside);
      document.removeEventListener('click', this.handleNotificationClickOutside);
    },
    methods: {
      async loadCurrentUser() {
        this.isLoading = true;
        this.loadError = null;

        try {
          const { data: authData, error: authError } = await supabase.auth.getUser();
          if (authError) throw authError;

          if (!authData?.user) {
            // console.log('No user logged in');
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

          this.userInfo = profileData;
          this.userRole = profileData.role;

        } catch (err) {
          console.error('Error loading user:', err);
          this.loadError = 'Failed to load profile. Please try again.';
        } finally {
          this.isLoading = false;
        }
      },
      handleScroll() {
        this.isScrolled = window.scrollY > 50;
      },
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      closeDropdown() {
        this.showDropdown = false;
      },
      toggleMobileMenu() {
        this.showMobileMenu = !this.showMobileMenu;
      },
      closeMobileMenu() {
        this.showMobileMenu = false;
      },
      handleClickOutside(event) {
        if (this.$refs.profileButton && this.$refs.dropdownMenu) {
          if (!event.target.closest('.profile-dropdown')) {
            this.closeDropdown();
          }
        }
      },
      async logout() {
        // if (confirm('Are you sure you want to logout?')) {
          this.showLogoutConfirm = false;
          await supabase.auth.signOut()
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeDropdown();
          this.closeMobileMenu();
          this.closeNotifications();
          this.$router.push({ name: 'Landing', replace: true });
          this.$emit('logout');
        // }
      },
      async loadNotifications() {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('read', false)
          .order('created_at', { ascending: false });

        if (error) console.error('Error loading notifications:', error);
        else this.notifications = data;
      },
      async toggleNotifications() {
        this.showNotifications = !this.showNotifications;
      },
      async markAllAsRead() {
        const { data: { user } } = await supabase.auth.getUser();
        this.currentUser = user;

        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', this.currentUser.id)
          .eq('read', false);

        if (error) {
          console.error('Error marking notifications as read:', error);
          return;
        }

        // Update locally
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      },
      async closeNotifications() {
        this.notifications = this.notifications.filter(n => !n.read); 
        this.showNotifications = false;
      },
      async handleNotificationClickOutside(event) {
        const dropdown = this.$refs.dropdownMenu;
        const bell = this.$refs.bellContainer;

        if (this.showNotifications && dropdown && bell && !bell.contains(event.target) && !dropdown.contains(event.target)) {
          this.notifications = this.notifications.filter(n => !n.read); 
          this.showNotifications = false;
        }
      }
    }
  };
  </script>

  <style scoped>
  /* Profile Picture - Responsive sizing */
  .profile-pic {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    transition: all 0.2s ease;
  }
  .profile-link {
    padding: 0.25rem;
    border-radius: 1.5rem;
  }
  /* Profile link hover effect */
  .profile-link:hover {
    opacity: 0.8;
    background-color: #ff6b3553;
    padding: 0.25rem;
    transform: scale(1.05);
  }
  /* Profile name styling */
  .profile-name {
    font-size: 1rem;
    white-space: nowrap;
    max-width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Logout button styling */
  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    white-space: nowrap;
    min-width: 5rem;
  }

  .logout-btn-icon {
    padding: 0.5rem;
    min-width: 2.5rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Button hover effects */
  .logout-btn:hover,
  .logout-btn-icon:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 0.5rem rgba(220, 53, 69, 0.3);
  }

  .mobile-profile-pic {
    width: 2.5rem;              /* 40px */
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 0.125rem solid #FF6B35;  /* 2px */
  }

  .navbar-custom {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .navbar-custom.scrolled {
    padding: 0.75rem 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }

  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* max-width: 1400px; */
    /* margin: 0 auto; */
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 3rem;
    flex: 1;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .navbar-brand a {
    display: flex;
    align-items: center;
  }

  .brand-icon {
    background: #2C3E50;
    padding: 0.25rem;
    border-radius: 0.25rem;
    color: white;
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }

  .brand-text {
    color: #2C3E50;
    font-size: 1.25rem;
  }

  .navbar-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-link-custom {
    position: relative;
    padding: 0.5rem 0;
    color: #2C3E50;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .nav-link-custom::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: #FF6B35;
    transition: width 0.3s ease;
  }

  .nav-link-custom:hover::after,
  .nav-link-custom.router-link-active::after {
    width: 80%;
  }

  .nav-link-custom:hover,
  .nav-link-custom.router-link-active {
    color: #FF6B35;
  }

  .navbar-toggler {
    display: none;
    background: none;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-size: 1.5rem;
    color: #2C3E50;
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile-dropdown {
    position: relative;
  }

  .profile-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 2rem;
    transition: background 0.3s ease;
  }

  .profile-button:hover {
    background: rgba(255, 107, 53, 0.1);
  }

  .profile-pic-small {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #FF6B35;
  }

  .user-name {
    color: #2C3E50;
    font-weight: 500;
  }

  .dropdown-menu-custom {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    min-width: 200px;
    padding: 0.5rem;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dropdown-item-custom {
    display: block;
    padding: 0.75rem 1rem;
    color: #2C3E50;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .dropdown-item-custom:hover {
    background: rgba(255, 107, 53, 0.1);
    color: #FF6B35;
  }

  .dropdown-divider {
    margin: 0.5rem 0;
    border: none;
    border-top: 1px solid #e8ecef;
  }

  .btn-signup {
    background-color: #FF6B35;
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-signup:hover {
    background-color: #FF5722;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }

  .btn-logout {
    width: 100%;
    padding: 0.75rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-logout:hover {
    background: #c82333;
  }

  .btn-logout-small {
    padding: 0.5rem 1rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-logout-small:hover {
    background: #c82333;
  }

  .admin-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .admin-label {
    background: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .admin-badge {
    color: #007bff;
    font-weight: 600;
  }

  /* Mobile Menu */
  .mobile-menu {
    display: none;
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 250px;
    background: white;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transition: right 0.3s ease;
    z-index: 999;
    overflow-y: auto;
    padding-top: 70px;
  }

  .mobile-menu.show {
    right: 0;
  }

  .mobile-menu-content {
    padding: 1rem;
  }

  .mobile-nav-link {
    display: block;
    padding: 1rem;
    color: #2C3E50;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid #e8ecef;
    transition: all 0.2s ease;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .mobile-nav-link:hover {
    background: rgba(255, 107, 53, 0.1);
    color: #FF6B35;
  }

  .mobile-nav-link.logout-link {
    color: #dc3545;
  }

  .mobile-nav-link.logout-link:hover {
    background: rgba(220, 53, 69, 0.1);
  }

  .mobile-menu-divider {
    height: 1px;
    background: #e8ecef;
    margin: 1rem 0;
  }

  .mobile-user-section {
    margin-bottom: 1rem;
  }

  .mobile-profile-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: rgba(255, 107, 53, 0.05);
    border-radius: 0.5rem;
  }

  .mobile-profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #FF6B35;
  }

  .mobile-user-name {
    font-weight: 600;
    color: #2C3E50;
  }

  .mobile-signup {
    background: #FF6B35;
    color: white !important;
    margin-top: 0.5rem;
  }

  .mobile-signup:hover {
    background: #FF5722;
  }

  /* Desktop Responsive */
  @media (max-width: 991px) {
    .navbar-toggler {
      display: block;
    }

    .navbar-links {
      display: none;
    }

    .mobile-menu {
      display: block;
    }

    .desktop-actions {
      display: none !important;
    }
  }

  @media (max-width: 576px) {
    .navbar-custom {
      padding: 1rem;
    }

    .navbar-left {
      gap: 1rem;
    }

    .brand-text {
      font-size: 1.1rem;
    }

    .mobile-menu {
      width: 100%;
      right: -100%;
    }

    .btn-signup {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  }

  .d-none {
    display: none !important;
  }

  .d-flex {
    display: flex !important;
  }

  .notification-container {
    position: relative;
  }

  .notification-btn {
    background: transparent; 
    border: none;
    padding: 6px;
    cursor: pointer;
    transition: transform 0.15s ease, color 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notification-btn:active {
    transform: scale(0.95);
  }

  .notification-btn:hover {
    transform: scale(1.1);   
    color: #1f2937;  
  }

  .bell-icon {
    font-size: 1.4rem;
    color: #4a5568;
    transition: color 0.2s ease;
  }

  .notification-btn:hover .bell-icon {
    color: #111827;          
    }

  .notification-count {
    position: absolute;
    top: 0;
    right: 0;
    background: #ef4444;
    color: #fff;
    font-size: 0.7rem;
    font-weight: bold;
    border-radius: 999px;
    height: 18px;
    width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notification-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    min-width: 380px;
    padding: 0.5rem;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  /* --- Transition --- */
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.2s ease;
  }
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  .notification-header h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #111827;
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: #6b7280;
  }

  .notification-body {
    max-height: 400px;
    overflow-y: auto;
  }

  .notification-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .notification-item {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    cursor: pointer;
    transition: background 0.2s;
  }

  .notification-item:hover {
    background: #f8fafc;
  }

  .notification-item.unread {
    background: #eef6ff;
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: #111827;
    font-size: 0.9rem;
  }

  .notification-dot {
    width: 8px;
    height: 8px;
    background: #2563eb;
    border-radius: 50%;
    margin-left: 6px;
  }

  .notification-message {
    font-size: 0.85rem;
    color: #4b5563;
    margin-top: 4px;
  }

  .notification-time {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 6px;
  }

  .notification-empty {
    text-align: center;
    padding: 32px 16px;
    color: #6b7280;
  }

  .empty-icon {
    font-size: 2rem;
    color: #d1d5db;
    margin-bottom: 8px;
  }

  .empty-title {
    font-weight: 500;
  }

  .empty-sub {
    font-size: 0.85rem;
    color: #9ca3af;
  }

  .notification-footer {
    padding: 10px;
    border-top: 1px solid #e2e8f0;
    background: #f9fafb;
  }

  .mark-all-btn {
    width: 100%;
    background: transparent;
    border: none;
    color: #316ef1;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.15s ease; /* smooth pop effect */
    padding: 0.5rem;
    border-radius: 0.25rem;
  }

  .mark-all-btn:hover {
    color: #0641c0;
    transform: scale(1.05);
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
}

.confirm-actions button:first-child {
  background: #dc3545;
  color: white;
}

.confirm-actions button:first-child:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.confirm-actions button:last-child {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #dee2e6;
}

.confirm-actions button:last-child:hover {
  background: #e9ecef;
  border-color: #adb5bd;
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