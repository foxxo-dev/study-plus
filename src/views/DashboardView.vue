<template>
  <NavbarDash />
  <h1 v-if="user && user.email">
    Welcome, {{ user.displayName || user.email }}!
  </h1>
</template>

<script>
import { mapGetters } from 'vuex';
import NavbarDash from '@/components/NavbarDash.vue'; // Import it normally

export default {
  computed: {
    ...mapGetters(['user']),
  },
  components: {
    NavbarDash, // Register the component normally
  },
  methods: {
    checkIfSignedIn() {
      if (!this.user || !this.user.email) {
        this.$router.push('/login');
      }
    },
  },
  watch: {
    user: 'checkIfSignedIn',
  },
  mounted() {
    this.checkIfSignedIn();
  },
};
</script>
