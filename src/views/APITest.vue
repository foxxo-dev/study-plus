<template>
  <button @click="getFlashcards">Get Flashcards</button>
  Response:
  <code>{{ response }}</code>
</template>

<script>
import {
  generate4AnswerQuestion,
  getChatGPTFlashcards,
} from '@/assets/js/openai';

export default {
  data() {
    return {
      response: null,
    };
  },
  methods: {
    async getFlashcards() {
      const response = await generate4AnswerQuestion(
        'No Document Provided',
        'Unknown',
        'Capitals of the World',
        'We want to learn more about less known capitals of the world',
        'None Provided',
      );
      this.response = JSON.stringify(response, null, 2);
    },
  },
};
</script>
