<template>
  <img :src="backgroundImage" alt="background" id="bg" @load="fadeIn" />
  <div
    class="background_loading"
    id="bgl"
    :style="{ background: averageColor }"></div>

  <nav>
    <router-link to="/dashboard">< Back </router-link>
  </nav>
  <div id="spacer___"></div>

  <div
    class="bottom_commands"
    
    @click="generateCards">
    <button :class="regenerations == 0 && 'premium'">Regenerate ({{ regenerations }})</button>
  </div>
  <div @click="decreaseIndex">
    <i
      class="fa-solid fa-arrow-left arrow_left"
      v-if="currentCardIndex != 0"></i>
  </div>
  <div @click="increaseIndex">
    <i
      class="fa-solid fa-arrow-right arrow_right"
      v-if="currentCardIndex < flashCardData.length - 1"></i>
  </div>
  <div id="cards_container">
    <div class="card" v-if="flashCardData.length === 0" @click="generateCards">
      <div class="card_inner">
        <p>{{ !generating ? 'Click To Generate Cards' : 'Please Wait...' }}</p>
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
      regenerations: Infinity,
    };
  },
  async mounted() {
    if (this.user?.uid) {
      this.averageColor = await getAverageColor(this.user.uid);
      this.flashCardData = await getUserFlashCards(this.user.uid);
      if (this.flashCardData == undefined || this.flashCardData == null) {
        this.flashCardData = [];
      }
      this.regenerations = await getRegenerations(this.user.uid);

      this.backgroundImage = await getUsersBackground(this.user.uid);
      document.getElementById('bgl').style.opacity = 1;
      this.fadeIn();
    }
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    decreaseIndex() {
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
        console.log(this.currentCardIndex);
        this.cardFlipped = false;
      }
    },
    increaseIndex() {
      if (this.currentCardIndex < this.flashCardData.length - 1) {
        this.currentCardIndex++;
        console.log(this.currentCardIndex);
        this.cardFlipped = false;
      }
    },
    flipCard() {
      this.cardFlipped = !this.cardFlipped;
    },
    fadeIn() {
      const bg = document.getElementById('bg');
      bg.style.opacity = 1;
    },
    handleKeydown(event) {
      if (event.key === 'ArrowRight') {
        this.nextCard();
      } else if (event.key === 'ArrowLeft') {
        this.prevCard();
      }
    },
    async generateCards() {
      this.flashCardsData = [];
      if (this.regenerations == 0) {
        alert(
          'Sorry, you used up ALL of your regenerations! Upgrade to PREMIUM in order to regenerate more.',
        );
        return;
      }
      this.generating = true;
      this.regenerations -= 1;
      await setRegenerations(this.user.uid, this.regenerations);
      this.flashCardData = [
        {
          q: 'What does OPVL stand for in source analysis?',
          a: 'Origin, Purpose, Value, and Limitations.',
        },
        {
          q: 'Why is understanding bias important in OPVL analysis?',
          a: 'It helps determine the reliability and trustworthiness of a source.',
        },
        {
          q: 'What type of source is the Forbes article analyzed in the document?',
          a: 'It is an article written by an oil and gas expert, published in a business magazine.',
        },
        {
          q: 'Who wrote the Forbes article on gas stoves?',
          a: 'David Blackmon, an oil and gas public policy analyst/consultant with 40 years of experience.',
        },
        {
          q: 'How does the purpose of a source affect its reliability?',
          a: 'If a source aims to inform rather than persuade, it is generally more reliable.',
        },
        {
          q: 'What is a potential strength of the Forbes article regarding gas stoves?',
          a: 'It presents both sides of the argument, making it more balanced and informative.',
        },
        {
          q: 'What is a potential limitation of the Forbes article on gas stoves?',
          a: 'It does not specify the level of the gas stove ban or future government steps.',
        },
        {
          q: 'Why is the date of publication important in OPVL analysis?',
          a: 'Laws and policies may change over time, affecting the relevance of the information.',
        },
        {
          q: 'How does the structure of an article contribute to its reliability?',
          a: 'Clear headings and organized paragraphs make information easier to understand and navigate.',
        },
        {
          q: 'What does it mean when a source uses ‘logos’?',
          a: 'It relies on logic, facts, and data rather than emotions or personal opinions.',
        },
        {
          q: 'Why is knowing the publisher of a source important?',
          a: 'It helps assess potential biases and credibility of the information.',
        },
        {
          q: 'How can the audience of a source affect its reliability?',
          a: 'A source targeting a general audience may strive for neutrality, while one targeting a specific group may be biased.',
        },
        {
          q: "What role does the creator's expertise play in OPVL analysis?",
          a: 'An expert in the field is more likely to provide accurate and well-informed content.',
        },
        {
          q: 'Why might missing information be a limitation of a source?',
          a: 'It can leave out key context or data needed to fully understand the topic.',
        },
        {
          q: "What does it mean when a source is described as 'balanced'?",
          a: 'It presents multiple perspectives without favoring one side.',
        },
        {
          q: 'How does the use of bolded headlines in an article help readers?',
          a: 'It highlights key points, making the article easier to skim and understand.',
        },
        {
          q: 'Why is the gas stove debate a relevant topic for source analysis?',
          a: 'It involves policy changes, public opinion, and industry perspectives, making it a good case study for bias and reliability.',
        },
        {
          q: 'How does comparing multiple sources improve source analysis?',
          a: 'It helps identify inconsistencies, biases, and missing information.',
        },
        {
          q: 'What is one way a source can unintentionally mislead readers?',
          a: 'By omitting key details or presenting information out of context.',
        },
        {
          q: 'What is the best way to determine if a source is trustworthy?',
          a: 'Cross-check information with other reliable sources and assess for bias, expertise, and intent.',
        },
      ];
      await setUserFlashCards(this.user.uid, this.flashCardData);
    },
    nextCard() {
      if (this.currentCardIndex < this.flashCardData.length - 1) {
        this.currentCardIndex++;
        this.cardFlipped = false;
      }
    },
    prevCard() {
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
        this.cardFlipped = false;
      }
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
