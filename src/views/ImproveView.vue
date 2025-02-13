<template>
  <img :src="backgroundImage" alt="background" id="bg" />
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
  <main>
    <div>
      <span class="rating">
        Rating: <strong class="accent">{{ rating }}</strong>
      </span>
      <p class="bigger">Improvements:</p>
      <li v-if="!improving || improving.length == 0">
        Please Include your Files First.
      </li>
      <ol>
        <template v-for="improvement in improving">
          <li>{{ improvement }}</li>
        </template>
      </ol>
    </div>
    <hr />
    <div>
      <div class="input-wrapper">
        <input
          type="file"
          accept="application/pdf"
          id="working"
          ref="fileInput"
          @change="handleFileUpload" />
        <label for="working" class="forFile">
          <span>{{ fileName || 'Working Document' }}</span>
          <span class="arrow">></span>
        </label>
      </div>
      <div class="input-wrapper">
        <input
          type="file"
          accept="application/pdf"
          id="rubric"
          ref="fileInput"
          @change="handleFileUpload2" />
        <label for="rubric" class="forFile">
          <span>{{ fileName2 || 'Rubric PDF' }}</span>
          <span class="arrow">></span>
        </label>
      </div>
      <button @click.prevent="submit" :disabled="loading">
        {{ loading ? 'Please Wait' : `Submit (${regenerations})` }}
      </button>
      <hr />
      <div v-if="workingPreviewURL">
        <embed
          :src="workingPreviewURL"
          type="application/pdf"
          width="100%"
          height="500" />
      </div>
    </div>
  </main>
</template>
<style scoped>
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

ol {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  opacity: 0.8;
}
.bigger {
  font-size: 1.75rem;
  font-family: 'League Spartan', sans-serif;
}
.rating {
  font-family: 'League Spartan', sans-serif;
  font-size: 3rem;
}
.accent {
  color: #bf98eb;
}
button {
  border: none;
  background: #bf98eb;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'League Spartan', sans-serif;
  font-size: 1.25rem;
  cursor: pointer;
}
button:disabled {
  background: #bf98eb;
  color: black;
  opacity: 0.6;
  cursor: not-allowed;
}
input[type='file'] {
  display: none;
}
label {
  background: #bf98eb;
  color: black;
  padding: 0.5rem;
  padding-inline: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 20rem;
  font-weight: 300;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
label span {
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
hr {
  border-color: black;
  opacity: 0.6;
}
div {
  display: flex;
  flex-direction: column;
}
main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 80vw;
  height: 80vh;
  border-radius: 2rem;
  gap: 1rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 2rem;
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
<script>
import {
  createProjectRating,
  getPDFURL,
  getProjectRating,
  setPDFURL,
  getAverageColor,
  getUsersBackground,
  getRegenerations,
  setRegenerations,
} from '@/assets/js/firebase';
import { getRatingAndImproving } from '@/assets/js/openai';
import { initializeRecaptchaConfig } from 'firebase/auth';
import { mapGetters } from 'vuex';
import bookBg from '@/assets/img/book-bg.png';
export default {
  data() {
    return {
      working: '',
      workingPreviewURL: '',
      rubric: '',
      rating: 'N/A',
      improving: [],
      loading: false,
      fileName: '',
      fileName2: '',
      backgroundImage: bookBg,
      averageColor: 'rgba(0, 0, 0, 0.0)',
      regenerations: 4,
    };
  },
  async mounted() {
    this.averageColor = await getAverageColor(this.user.uid);
    document.getElementById('bgl').style.opacity = 1;
    this.fadeIn();
    document.getElementById('bgl').style.opacity = 1;

    this.backgroundImage = (await getUsersBackground(this.user.uid)) || bookBg;

    getPDFURL(this.user.uid, this.$route.params.projectId).then((url) => {
      if (!url) return;
      this.workingPreviewURL = url; // Use the Blob URL directly
    });

    getProjectRating(this.user.uid, this.$route.params.projectId).then(
      (obj) => {
        if (!obj) return;
        this.rating = obj.rating;
        this.improving = obj.improvements;
      },
    );

    this.regenerations = await getRegenerations(this.uid);
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    fadeIn() {
      document.getElementById('bg').style.opacity = 1;
      document.getElementById('bgl').style.opacity = 1;
    },
    goBack() {
      this.$router.push('/dashboard/' + this.$route.params.projectId);
    },
    async handleFileUpload(e) {
      this.working = e.target.files[0];
      this.fileName = e.target.files[0].name;
      this.workingPreviewURL = URL.createObjectURL(e.target.files[0]);
      //   Save PDF url ot firebase
      await setPDFURL(
        this.user.uid,
        this.$route.params.projectId,
        this.workingPreviewURL,
      );
    },
    handleFileUpload2(e) {
      this.rubric = e.target.files[0];
      this.fileName2 = e.target.files[0].name;
    },
    async submit() {
      this.loading = true;
      const working = document.getElementById('working').files[0];
      const rubric = document.getElementById('rubric').files[0];

      if (this.regenerations == 0) {
        alert(
          'You have no more regenerations left. Upgrade to Premium to access more.',
        );
        this.loading = false;
        return;
      }

      const { rating, improvements } = await getRatingAndImproving(
        working,
        rubric,
      );
      if (rating == undefined || improvements == undefined) {
        alert('Please provide both a working document and a rubric.');
        this.loading = false;
      }

      await createProjectRating(
        this.user.uid,
        this.$route.params.projectId,
        rating,
        improvements,
      );
      this.rating = rating;
      this.improving = improvements;
      this.regenerations--;
      await setRegenerations(this.user.uid, this.regenerations);
      this.loading = false;
    },
  },
};
</script>
