<script setup>
import { RouterLink, RouterView } from 'vue-router';
import PomodoroTimer from './components/PomodoroTimer.vue';
import './assets/fonts/font.css';
</script>

<template>
  <RouterView />
  <PomodoroTimer v-if="showPomodoroTimer" />
</template>

<script>
export default {
  name: 'App',
  components: {
    PomodoroTimer,
  },
  computed: {
    showPomodoroTimer() {
      return this.$route.meta.showPomodoro === true;
    },
  },
};
</script>

<style>
@import url('./assets/fonts/font.css');
</style>