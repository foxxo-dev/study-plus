<template>
  <main>
    <button @click="redirectToLogin">Login</button>
  </main>
</template>

<script>
export default {
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>
