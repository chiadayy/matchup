<template>
  <div style="background-color: #F7F9FC; min-height: 100vh; padding: 40px 20px;">
    <div class="container-fluid px-5 py-4">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="row align-items-center">
          <div class="col-md-3 text-center">
            <!-- View Mode -->
            <div v-if="!isEditMode">
              <div v-if="profileData.profile_image != null">
                <img
                  :src="profileData.profile_image"
                  alt="Profile"
                  class="profile-picture"
                >
              </div>
              <div v-else>
                <!-- Default profile icon -->
                <div class="profile-picture bg-secondary">
                  <svg>...</svg>
                </div>
              </div>
            </div>
            <!-- Edit Mode -->
            <div v-else class="col-md">
              <div class="form-group mb-3">
                <label class="form-label fw-bold">Profile Picture</label>
                
                <!-- File Input -->
                <input 
                  type="file" 
                  class="form-control" 
                  @change="handleFileSelect"
                  accept="image/*"
                  ref="fileInput"
                >
                <small class="text-muted">Max size: 5MB. Accepts: JPG, PNG, GIF, WebP</small>
              </div>

              <!-- Loading Indicator -->
              <div v-if="uploadingImage" class="text-center my-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Uploading...</span>
                </div>
                <p class="mt-2 text-muted">Uploading image...</p>
              </div>

              <!-- Preview -->
              <div v-else-if="editFormData.profile_image" class="text-center">
                <img 
                  :src="editFormData.profile_image" 
                  alt="Preview" 
                  class="img-preview"
                >
                <button 
                  type="button" 
                  class="btn btn-sm btn-outline-danger mt-2"
                  @click="removeProfileImage"
                >
                  Remove Image
                </button>
              </div>
              
              <div v-else class="text-center">
                <div class="border border-3 py-5 rounded" style="background: #f0f0f0;">
                  <span style="color: #999;">📷 No image selected</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-9">
            <div class="profile-info">
              <!-- View Mode -->
              <div v-if="!isEditMode">
                <h1 class="fw-bold mb-2">{{ profileData.name }}</h1>
                <p class="text-muted mb-3">Member since {{ formatDate(profileData.created_at) }}</p>
                
                <div class="stats-row mb-4">
                  <div class="stat-item">
                    <div class="stat-value">{{ profileData.totalMatches}}</div> <!--NOT DONE-->
                    <div class="stat-label">Matches Played</div>
                  </div>
                  <!-- <div class="stat-item">
                    <div class="stat-value">{{ attendanceRate }}%</div>
                    <div class="stat-label">Attendance Rate</div>
                  </div> -->
                </div>

                <div class="badges-row mb-4">
                  <span 
                    v-for="sport in profileData.favourites" 
                    :key="sport"
                    class="sport-badge"
                  >
                    {{ sportEmojis[sport] }} {{ sport }}
                  </span>
                </div>

                <div class="about-section mb-4">
                  <h4 class="fw-bold mb-2">About</h4>
                  <p class="text-muted">{{ profileData.description || 'No description added yet.' }}</p>
                </div>

                <button v-if="isOwnProfile" class="btn btn-edit" @click="enterEditMode">
                  Edit Profile
                </button>
              </div>
              <!-- Edit Mode -->
              <div v-else>
                <div class="form-group mb-3">
                  <label class="form-label">Display Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="editFormData.name"
                    placeholder="Your display name"
                  >
                </div>

                <div class="form-group mb-4">
                  <label class="form-label">Personal Description</label>
                  <textarea 
                    class="form-control" 
                    v-model="editFormData.description"
                    placeholder="Tell us about yourself..."
                    rows="4"
                  ></textarea>
                </div>

                <div class="form-group mb-4">
                  <label class="form-label">Favorite Sports</label>
                  <div class="sports-checkbox-group">
                    <label v-for="sport in availableSports" :key="sport" class="sport-checkbox">
                      <input 
                        type="checkbox" 
                        :value="sport"
                        v-model="editFormData.favourites"
                      >
                      <span>{{ sportEmojis[sport] }} {{ sport }}</span>
                    </label>
                  </div>
                </div>
                <div class="edit-actions">
                  <button class="btn btn-secondary" @click="cancelEditMode">Cancel</button>
                  <button class="btn btn-primary" @click="saveProfileChanges">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotification" class="notification-overlay">
      <div class="notification-modal" :class="notificationType">
        <div class="notification-header">
          <span class="notification-icon">
            {{ notificationType === 'success' ? '✓' : '✕' }}
          </span>
          <button class="btn-close-notification" @click="closeNotification">✕</button>
        </div>
        <div class="notification-body">
          <p>{{ notificationMessage }}</p>
        </div>
        <div class="notification-footer">
          <button class="btn btn-sm" @click="closeNotification">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase';

export default {
  name: 'Profile',
  
  data() {
    return {
      userId: null,
      isOwnProfile: true,
      isEditMode: false,
      uploadingImage: false,
      selectedFile: null,
      oldImagePath: null,
      showNotification: false,
      notificationType: 'success',
      notificationMessage: '',
      notificationTimer: null,
      availableSports: ['Basketball', 'Tennis', 'Football', 'Badminton', 'Volleyball'],
      sportEmojis: {
        'Basketball': '🏀',
        'Tennis': '🎾',
        'Football': '⚽',
        'Badminton': '🏸',
        'Volleyball': '🏐'
      },
      profileData: {
        name: '',
        favourites: [],
        profile_image: null,
        description: '',
        created_at: '',
        totalMatches: 0
      },
      editFormData: {
        name: '',
        description: '',
        favourites: [],
        profile_image: null
      },
      isLoading: true,
      loadError: null,
      
    }
  },
  computed: {
    attendanceRate() {
      
      return 0
    },
    
  },
  async mounted() {
    this.userId = this.$route.params.id;
    await this.loadCurrentUser();
  },
  watch: {
    '$route.params.id': {
      async handler(newId) {
        this.userId = newId;
        await this.loadCurrentUser();
      }
    }
  },
  methods: {
    async loadCurrentUser() {
      this.isLoading = true;
      this.loadError = null;

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        const profileIdToLoad = this.userId || authData.user.id;
        this.isOwnProfile = profileIdToLoad === authData.user.id;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileIdToLoad)
          .single();

        if (profileError) throw profileError;

        const { count, error: matchCountError } = await supabase
          .from('users_matches')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profileIdToLoad)
          .eq('payment_success', true);

        if (matchCountError) console.error(matchCountError);

        this.profileData = {
          ...profileData,
          totalMatches: count || 0
        };

      } catch (err) {
        console.error('Error loading user:', err);
        this.loadError = 'Failed to load profile. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showErrorNotification('Image must be smaller than 5MB');
      this.$refs.fileInput.value = ''; // Clear input
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showErrorNotification('Please select an image file');
      this.$refs.fileInput.value = '';
      return;
    }

    this.selectedFile = file;
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editFormData.profile_image = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  removeProfileImage() {
    this.selectedFile = null;
    this.editFormData.profile_image = null;
    if (this.$refs.fileInput) {
      this.$refs.fileInput.value = '';
    }
  },

  async uploadProfileImage(userId) {
    if (!this.selectedFile) return this.profileData.profile_image;

    try {
      this.uploadingImage = true;

      // Delete old image if it exists
      if (this.oldImagePath) {
        await this.deleteOldProfileImage(this.oldImagePath);
      }

      // Create unique filename
      const fileExt = this.selectedFile.name.split('.').pop();
      const timestamp = Date.now();
      const filePath = `${userId}/${timestamp}.${fileExt}`;

      console.log('Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile_images')
        .upload(filePath, this.selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;

    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      this.uploadingImage = false;
    }
  },

  async deleteOldProfileImage(imageUrl) {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/profile_images/');
      if (urlParts.length < 2) return;

      const filePath = urlParts[1];

      // Delete from storage
      const { error } = await supabase.storage
        .from('profile_images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting old image:', error);
      } else {
        console.log('Old image deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteOldProfileImage:', error);
    }
  },

  enterEditMode() {
    const favouritesArray = Array.isArray(this.profileData.favourites) 
      ? this.profileData.favourites 
      : [];

    this.editFormData = {
      name: this.profileData.name || '',
      description: this.profileData.description || '',
      favourites: [...favouritesArray],
      profile_image: this.profileData.profile_image || null
    };
    
    // Store old image path for deletion later
    this.oldImagePath = this.profileData.profile_image;
    
    this.isEditMode = true;
  },

  cancelEditMode() {
    this.isEditMode = false;
    this.selectedFile = null;
    this.oldImagePath = null;
    this.editFormData = {
      name: '',
      description: '',
      favourites: [],
      profile_image: null
    };
    if (this.$refs.fileInput) {
      this.$refs.fileInput.value = '';
    }
  },

  async saveProfileChanges() {
    try {

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('Not authenticated');

          console.log('Auth data:', authData); // Debug
    console.log('Auth error:', authError); // Debug

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication error: ' + authError.message);
    }
    
    if (!authData.user) {
      throw new Error('Not authenticated - no user found');
    }

    console.log('✅ User authenticated:', authData.user.id);
    console.log('User role:', authData.user.role);
      // Upload new image if selected
      let imageUrl = this.profileData.profile_image;
      
      if (this.selectedFile) {
        imageUrl = await this.uploadProfileImage(authData.user.id);
      } else if (this.editFormData.profile_image === null && this.oldImagePath) {
        // User removed the image
        await this.deleteOldProfileImage(this.oldImagePath);
        imageUrl = null;
      }

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: this.editFormData.name,
          description: this.editFormData.description,
          favourites: this.editFormData.favourites,
          profile_image: imageUrl
        })
        .eq('id', authData.user.id);

      if (error) throw error;

      // Update local data
      this.profileData = {
        ...this.profileData,
        name: this.editFormData.name,
        description: this.editFormData.description,
        favourites: [...this.editFormData.favourites],
        profile_image: imageUrl
      };

      // Reset form state
      this.selectedFile = null;
      this.oldImagePath = null;

      this.showSuccessNotification('Profile updated successfully!');
      this.isEditMode = false;

      } catch (err) {
        console.error('Error saving profile:', err);
        this.showErrorNotification('Failed to update profile. Please try again.');
      }
    },


    //Notification
    // showSuccessNotification(message) {
    //   this.notificationMessage = message
    //   this.notificationType = 'success'
    //   this.showNotification = true
    //   this.startNotificationTimer()
    // },
    // showErrorNotification(message) {
    //   this.notificationMessage = message
    //   this.notificationType = 'error'
    //   this.showNotification = true
    //   this.startNotificationTimer()
    // },
    // startNotificationTimer() {
    //   if (this.notificationTimer) {
    //     clearTimeout(this.notificationTimer)
    //   }
    //   this.notificationTimer = setTimeout(() => {
    //     this.closeNotification()
    //   }, 20000)
    // },
    // closeNotification() {
    //   this.showNotification = false
    //   if (this.notificationTimer) {
    //     clearTimeout(this.notificationTimer)
    //   }
    // },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    
  }
}
</script>

<style scoped>
:root {
  --primary-color: #FF6B35;
  --back-color: #F7F9FC;
  --secondary-color: #2C3E50;
}

.profile-header {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.profile-picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.2);
}

.profile-info h1 {
  color: var(--secondary-color);
}

.stats-row {
  display: flex;
  gap: 30px;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: #999;
  font-size: 0.9rem;
}

.badges-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.sport-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--primary-color), #FF5722);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.about-section {
  background: var(--back-color);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
}

.about-section p {
  margin: 0;
}

.btn-edit {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: #FF5722;
  transform: translateY(-2px);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--secondary-color);
  display: block;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.sports-checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.sport-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sport-checkbox:hover {
  border-color: var(--primary-color);
}

.sport-checkbox input[type="checkbox"] {
  cursor: pointer;
}

.sport-checkbox input[type="checkbox"]:checked ~ span {
  color: var(--primary-color);
  font-weight: 600;
}

.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  flex: 1;
}

.btn-primary:hover {
  background: #FF5722;
}

.btn-secondary {
  background: #e8ecef;
  color: var(--secondary-color);
  flex: 1;
}

.btn-secondary:hover {
  background: #dee2e6;
}

.img-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 10px;
}

.match-history-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e8ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.match-card {
  background: white;
  border: 2px solid #e8ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.match-card.status-attended {
  border-left: 4px solid #4CAF50;
}

.match-card.status-missed {
  border-left: 4px solid #f44336;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.match-sport {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.sport-emoji {
  font-size: 1.8rem;
}

.match-status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: #E8F5E9;
  color: #2E7D32;
}

.badge-danger {
  background: #FFEBEE;
  color: #C62828;
}

.match-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: #999;
  font-size: 0.8rem;
  font-weight: 600;
}

.detail-value {
  font-weight: 600;
  color: var(--secondary-color);
}

.match-footer {
  border-top: 1px solid #e8ecef;
  padding-top: 12px;
}

.attendance-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
}

.attendance-attended .status-icon {
  background: #E8F5E9;
  color: #2E7D32;
}

.attendance-missed .status-icon {
  background: #FFEBEE;
  color: #C62828;
}

.no-matches {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #999;
}

.text-success {
  color: #4CAF50;
}

.text-danger {
  color: #f44336;
}

.fw-bold {
  font-weight: 700;
}

.mb-1 {
  margin-bottom: 8px;
}

.mb-2 {
  margin-bottom: 16px;
}

.mb-3 {
  margin-bottom: 24px;
}

.mb-4 {
  margin-bottom: 32px;
}

.mt-3 {
  margin-top: 24px;
}

.align-items-center {
  align-items: center;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 20px;
  }

  .stats-row {
    flex-direction: column;
    gap: 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .matches-grid {
    grid-template-columns: 1fr;
  }

  .sports-checkbox-group {
    grid-template-columns: 1fr;
  }
}
</style>