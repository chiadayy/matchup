
<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Navbar
      v-if="showNavbar"
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
      v-if="showFooter"
      :isLoggedIn="true"
      :userRole="regular"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },

  setup() {
    const route = useRoute()

    // Hide navbar/footer on landing, login, and register pages
    const guestPages = ['Landing', 'Login', 'Register']

    const showNavbar = computed(() => {
      return !guestPages.includes(route.name)
    })

    const showFooter = computed(() => {
      return !guestPages.includes(route.name)
    })

    return {
      showNavbar,
      showFooter
    }
  },

  methods: {
    handleLogout() {
      // Dispatch logout action to store
      this.$store.dispatch('auth/logout');
    }
  }
};
</script>