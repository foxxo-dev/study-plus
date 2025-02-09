<template>
  <img :src="backgroundImage" alt="background" id="bg" @load="fadeIn" />
  <div
    class="background_loading"
    id="bgl"
    :style="{ background: averageColor }"></div>

  <nav>
    <router-link
      :to="$route.params.projectId && `/dashboard/${$route.params.projectId}`"
      >< Back
    </router-link>
  </nav>
  <div id="spacer___"></div>

  <div class="bottom_commands" @click="generateCards">
    <button :class="{ premium: regenerations === 0 }">
      Regenerate ({{ regenerations }})
    </button>
  </div>

  <div
    v-if="flashCardData.length > 1 && currentCardIndex > 0"
    @click="decreaseIndex">
    <i class="fa-solid fa-arrow-left arrow_left"></i>
  </div>

  <div
    @click="increaseIndex"
    v-if="
      flashCardData.length > 1 && currentCardIndex < flashCardData.length - 1
    ">
    <i class="fa-solid fa-arrow-right arrow_right"></i>
  </div>

  <div id="cards_container">
    <div class="card" v-if="flashCardData.length === 0" @click="generateCards">
      <div class="card_inner">
        <p>{{ generating ? 'Please Wait...' : 'Click To Generate Cards' }}</p>
      </div>
    </div>

    <div
      class="card"
      v-for="(card, index) in flashCardData"
      v-show="index === currentCardIndex"
      :key="index"
      @click="flipCard">
      <div class="card_inner">
        <div class="card_front" v-if="!cardFlipped">
          <p>{{ card.q }}</p>
          <p class="small_hint">Question</p>
        </div>
        <div class="card_back" v-else>
          <p>{{ card.a }}</p>
          <p class="small_hint">Answer</p>
        </div>
      </div>
    </div>
  </div>

  <p id="debug">Current Card Index: {{ currentCardIndex }}</p>
</template>

<script>
import {
  getAverageColor,
  getUsersBackground,
  getUserFlashCards,
  setUserFlashCards,
  getRegenerations,
  setRegenerations,
} from '@/assets/js/firebase';
import { getChatGPTFlashcards } from '@/assets/js/openai';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      backgroundImage: null,
      averageColor: '#000000',
      cardFlipped: false,
      currentCardIndex: 0,
      flashCardData: [],
      generating: false,
      regenerations: 4,
    };
  },
  async mounted() {
    if (this.user?.uid) {
      this.averageColor = await getAverageColor(this.user.uid);
      this.flashCardData = (await getUserFlashCards(this.user.uid)) || [];
      this.regenerations = await getRegenerations(this.user.uid);
      this.backgroundImage = await getUsersBackground(this.user.uid);
      document.getElementById('bgl').style.opacity = 1;
      this.fadeIn();
    }
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    decreaseIndex() {
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
        this.cardFlipped = false;
      }
    },
    increaseIndex() {
      console.log(this.currentCardIndex < this.flashCardData.length - 1);
      if (this.currentCardIndex < this.flashCardData.length - 1) {
        this.currentCardIndex++;
        this.cardFlipped = false;
      }
    },
    flipCard() {
      this.cardFlipped = !this.cardFlipped;
    },
    fadeIn() {
      document.getElementById('bg').style.opacity = 1;
    },
    handleKeydown(event) {
      if (event.key === 'ArrowRight') this.increaseIndex();
      else if (event.key === 'ArrowLeft') this.decreaseIndex();
    },
    async generateCards() {
      if (this.regenerations === 0) {
        alert(
          'Sorry, you used up ALL of your regenerations! Upgrade to PREMIUM in order to regenerate more.',
        );
        return;
      }
      this.flashCardData = [];
      this.generating = true;
      this.regenerations--;
      await setRegenerations(this.user.uid, this.regenerations);
      const flash = await getChatGPTFlashcards(
        'work document',
        'learning about physics',
        'quantum physics',
        'quantum physics',
      );
      this.flashCardData = flash?.flashcards || [];
      this.generating = false;
      await setUserFlashCards(this.user.uid, this.flashCardData);
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
};
</script>

<style scoped>
.premium {
  background: #fccb2baa !important;
}
nav > a {
  font-family: 'League Spartan', serif;
  font-size: 1.3rem;
  color: white;
  text-decoration: none;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-image: linear-gradient(to bottom, #00000081, #0000);
  color: white;
  width: 100%;
  position: fixed;
  height: 6rem;
}

#spacer___ {
  height: 6rem;
  width: 100%;
}
.bottom_commands {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}
button {
  all: unset;
  background: #ffffff33;
  backdrop-filter: blur(1rem);
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  text-decoration: none;
  font-family: 'League Spartan', serif;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  padding: 1rem;
  color: white;
  cursor: pointer;
}
.arrow_left {
  position: fixed;
  color: white;
  font-size: 2rem;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
}
.arrow_right {
  position: fixed;
  color: white;
  font-size: 2rem;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
}
#cards_container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  user-select: none;
}
.card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  width: 40rem;
  aspect-ratio: 5/3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  padding: 1rem;
  text-align: center;
  border-radius: 2rem;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}
.small_hint {
  position: absolute;
  opacity: 0.6;
  bottom: 1rem;
  font-size: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
#bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s;
  transition-delay: 0.25s;
  /* filter: contrast(0.8); */
}
#debug {
  position: fixed;
  bottom: 0;
  right: 0;
  color: white;
  background: black;
  padding: 0.5rem;
  font-size: 1rem;
}
.background_loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s;
}
</style>
