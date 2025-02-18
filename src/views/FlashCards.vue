<template>
  <img :src="backgroundImage" alt="background" id="bg" @load="fadeIn" />
  <div
    class="background_loading"
    id="bgl"
    :style="{ background: averageColor }"></div>

  <nav>
    <router-link
      :to="$route.params.projectId && `/dashboard/${$route.params.projectId}`">
      < Back
    </router-link>
    <div id="printer" @click="_print" style="cursor: pointer">
      <i class="fa-solid fa-print"></i>
    </div>
  </nav>
  <div id="spacer___"></div>

  <div class="bottom_commands" @click="generateCards" v-if="regenerations != 4">
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
    v-if="
      flashCardData.length > 1 && currentCardIndex < flashCardData.length - 1
    "
    @click="increaseIndex">
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

  <!-- Hidden div for printing all cards -->
  <div id="all_cards" style="display: none">
    <template v-for="(card, index) in flashCardData">
      <div class="card">
        <div class="card_inner">
          <div class="card_front">
            <p>{{ card.q }}</p>
            <p class="small_hint">Question</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card_inner">
          <div class="card_front">
            <p>{{ card.a }}</p>
            <p class="small_hint">Answer</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
@media print {
  #pomodoro {
    display: none;
  }
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  #bgl {
    background: white !important;
    display: none;
  }
  body {
    display: grid !important;
    background: white !important;
  }
  body::after {
    display: none;
  }
  #bg,
  nav,
  .bottom_commands,
  .arrow_left,
  .arrow_right,
  #cards_container {
    display: none !important;
    opacity: 0 !important;
    width: 0;
    height: 0;
  }

  #all_cards {
    display: grid !important;
    page-break-inside: avoid;
    grid-template-columns: 1fr 1fr;
    gap: 1cm;
    width: 100% !important;
  }
  .card {
    background: white !important;
    color: black !important;
    border: 0.1cm solid black !important;
    font-size: 1.1rem;
    text-align: center;
    box-shadow: none !important;
    padding: 1cm;
    width: 100% !important;
    /* aspect-ratio: 5 / 3; */
    page-break-inside: avoid;
    display: flex !important;
  }
  .small_hint {
    display: block !important;
  }
  #__vue-devtools-container__ {
    display: none;
  }
}
</style>

<script>
import {
  getAverageColor,
  getUsersBackground,
  getUserFlashCards,
  setUserFlashCards,
  getRegenerations,
  setRegenerations,
  getProject,
  getPercentage,
  updatePercentage,
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
      percentageViewed: 0,
    };
  },
  async mounted() {
    if (this.user?.uid) {
      this.averageColor = await getAverageColor(this.user.uid);
      this.flashCardData =
        (await getUserFlashCards(
          this.user.uid,
          this.$route.params.projectId,
        )) || [];
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
    _print() {
      window.print();
    },
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
      this.percentageViewed = Math.round(
        (this.currentCardIndex / this.flashCardData.length) * 25,
      );

      console.log(this.percentageViewed);
      this._updatePercentage().then(() => {
        console.log('Updated Percentage');
      });
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
    async _updatePercentage() {
      const percentage = this.percentageViewed + 2;

      const previousPercentage = await getPercentage(
        this.user.uid,
        this.$route.params.projectId,
      );

      console.log(this.percentageViewed + 2);

      console.log(previousPercentage);

      if (isNaN(previousPercentage)) {
        await updatePercentage(
          this.user.uid,
          this.$route.params.projectId,
          this.percentageViewed + 2,
        );
        return;
      }

      if (previousPercentage >= this.percentageViewed) {
        return;
      }
      await updatePercentage(
        this.user.uid,
        this.$route.params.projectId,
        this.percentageViewed + 2,
      );
    },
    async generateCards() {
      if (this.generating) {
        alert(
          'What do you want me to do? It aint me taking up the time, its Openai. Blame them, ' +
            this.user.displayName,
        );
        return;
      }
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
      const project = await getProject(
        this.user.uid,
        this.$route.params.projectId,
      );
      console.log(project);
      const flash = await getChatGPTFlashcards(
        project.fileData || 'No Data',
        project.documentType || 'unkown',
        project.title || 'Untitled',
        project.description || '',
        `Have this mood: ${
          project.AI_Theme || 'Be a helpful AI assistant'
        }, and this is what the user wrote: ${
          project.extraPrompt || '(no extra prompt)'
        }`,
      );
      this.flashCardData = flash?.flashcards || [];
      this.generating = false;
      this.percentageViewed = 0;

      await this._updatePercentage();

      await setUserFlashCards(
        this.user.uid,
        this.$route.params.projectId,
        this.flashCardData,
      );
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
};
</script>

<style scoped>
.fa-print {
  font-size: 1.5rem;
  cursor: pointer;
}
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
