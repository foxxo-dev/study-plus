<template>
  <main>
    <label for="working">Working Document PDF</label>
    <input type="file" accept="pdf" id="working" />
    <label for="rubric">Rubric Document PDF</label>
    <input type="file" accept="pdf" id="rubric" />
    <button @click.prevent="submit" :disabled="loading">
      {{ loading ? 'Please Wait' : 'Submit' }}
    </button>
    <template v-if="rating && improving.length > 0">
      <hr />
      <h2>Results</h2>
      <p>
        Rating: <strong>{{ rating }}</strong>
      </p>
      <p>Improving:</p>
      <template v-for="improvement in improving">
        <p>{{ improvement }}</p>
      </template>
    </template>
  </main>
</template>
<style>
main {
  display: flex;
  flex-direction: column;
  width: 20rem;
  gap: 1rem;
}
</style>
<script>
import { getRatingAndImproving } from '@/assets/js/openai';
export default {
  data() {
    return {
      working: '',
      rubric: '',
      rating: 0,
      improving: [],
      loading: false,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      const working = document.getElementById('working').files[0];
      const rubric = document.getElementById('rubric').files[0];
      const { rating, improvements } = await getRatingAndImproving(
        working,
        rubric,
      );
      this.rating = rating;
      this.improving = improvements;
      this.loading = false;
    },
  },
};
</script>
