
<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Navbar 
      :isLoggedIn="true"
      userRole="regular"
      :user="{ name: 'John Doe', profilePic: '...' }"
      @logout="handleLogout"
    />
    
    <!-- Main content area that grows to push footer down -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Footer stays at bottom -->
    <Footer 
      :isLoggedIn="true"
      :userRole="regular"
    />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  
  methods: {
    handleLogout() {
      // Dispatch logout action to store
      this.$store.dispatch('auth/logout');
    }
  }
};
</script>