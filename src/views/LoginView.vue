<template>
  <main>
    <h1>Login</h1>
    <form>
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button @click.prevent="login">Login</button>
    </form>
    <button @click="loginGoogle">Sign in with Google</button>
  </main>
</template>

<script>
import { signInWithEmail, signInWithGoogle } from '@/assets/js/firebase.js';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['loginUser']),

    async succesedLogin(user) {
      this.loginUser(user); // Store user in Vuex
      this.$router.push('/dashboard');
    },

    async loginGoogle() {
      try {
        const user = await signInWithGoogle(
          (user) => this.succesedLogin(user),
          (error) => console.error('Failed to login:', error),
        );
      } catch (error) {
        console.error('Failed to login:', error);
      }
    },

    async login() {
      try {
        const user = await signInWithEmail(
          this.email,
          this.password,
          (user) => this.succesedLogin(user),
          (error) => console.error('Failed to login:', error),
        );
      } catch (error) {
        console.error('Failed to login:', error);
      }
    },
  },
};
</script>
