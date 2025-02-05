<template v-if="user && user.email">
  <img :src="backgroundImage" alt="background" id="bg" @load="fadeIn" />
  <div
    class="background_loading"
    id="bgl"
    :style="{ background: averageColor }"></div>
  <NavbarDash :photoUrl="user.photoURL ? user.photoURL : null" />
  <main>
    <h1>Welcome, {{ user.displayName || user.email }}!</h1>
    <div id="content">
      <div id="projects">
        <div id="project-list">
          <span class="title">Projects</span>
          <router-link
            class="project"
            v-for="project in projects"
            :key="project.id"
            :to="`/dashboard/${project.id}`">
            <div class="projectLink">
              <span>{{ project.name }}</span>
            </div>
          </router-link>
        </div>
        <router-link to="/dashboard/new" id="newProject"
          >New Project</router-link
        >
      </div>
      <div class="progress">
        <span>{{ currentProject.name }}</span>
        <progress value="72" max="100"></progress>
      </div>
      <div class="buttons">
        <router-link to="/dashboard" class="button">Gameify!</router-link>
        <router-link to="/dashboard" class="button"
          >Check Your Work</router-link
        >
        <router-link to="/dashboard" class="button">Flash Cards</router-link>
        <router-link to="/dashboard" class="button premium"
          >Take a Quiz</router-link
        >
      </div>
      <hr id="seperator" />
      <div
        class="positioner"
        id="position_pomodoro"
        ref="positionPomodoro"
        style="border-radius: 1rem"></div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import NavbarDash from '@/components/NavbarDash.vue';
import '@/assets/fonts/font.css';
import defaultBackground from '@/assets/img/book-bg.png';
import {
  getUsersBackground,
  getUserPfp,
  getAverageColor,
} from '@/assets/js/firebase';

export default {
  data() {
    return {
      backgroundImage: null,
      currentProject: { id: 0, name: 'Science Cells Project' },
      projects: [
        { id: 0, name: 'Science Cells Project' },
        { id: 1, name: 'English One Pager Essay' },
        { id: 2, name: 'I&S Source Analyses' },
      ],
      averageColor: '3f1487',
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  components: {
    NavbarDash,
  },
  mounted() {
    this.updateUser();
    this.setupIntersectionObserver();
    this.setupProximityCheck();
  },
  methods: {
    fadeIn() {
      const bg = document.getElementById('bg');
      bg.style.opacity = 1;
    },
    async updateUser() {
      if (!this.user) return;
      const userPfp = await getUserPfp(this.user.uid);
      this.user.photoURL = userPfp || null;
      this.averageColor = await getAverageColor(this.user.uid);
      console.log(this.averageColor);
      document.getElementById('bgl').style.opacity = 1;
      console.log('fetched users pfp with the return of', userPfp);
    },
    async fetchBackground() {
      if (!this.user || !this.user.uid) return;
      try {
        const url = await getUsersBackground(this.user.uid);
        this.backgroundImage = url || defaultBackground;
      } catch (error) {
        console.error('Error fetching background image:', error);
        this.backgroundImage = defaultBackground;
      }
    },
    checkIfSignedIn() {
      if (!this.user || !this.user.email) {
        this.$router.push('/login');
      }
    },
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '1px',
        threshold: 0,
      };
      const observer = new IntersectionObserver(
        this.handleIntersection,
        options,
      );
      const target = this.$refs.positionPomodoro;
      observer.observe(target);
    },
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.outline = '5px solid #ffffffaa';
        } else {
          entry.target.style.outline = 'none';
        }
      });
    },
    setupProximityCheck() {
      this.checkProximity(); // Initial check
      window.addEventListener('scroll', this.checkProximity);
      window.addEventListener('mousemove', this.checkProximity);
    },
    checkProximity() {
      const pomodoro = document.getElementById('pomodoro');
      const positionPomodoro = document.getElementById('position_pomodoro');

      if (!pomodoro || !positionPomodoro) return;

      const rect1 = pomodoro.getBoundingClientRect();
      const rect2 = positionPomodoro.getBoundingClientRect();

      const distance = Math.hypot(
        rect1.left - rect2.left,
        rect1.top - rect2.top,
      );

      const distanceX = Math.abs(rect1.left - rect2.left);
      const distanceY = Math.abs(rect1.top - rect2.top);

      if (distanceX <= 1000 && distance >= 1 && distanceY <= 300) {
        positionPomodoro.style.outline = '5px solid #ffffffaa';
      } else {
        positionPomodoro.style.outline = 'none';
      }
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser && newUser.uid) {
          this.fetchBackground();
        }
      },
    },
  },
  beforeMount() {
    this.checkIfSignedIn();
  },
};
</script>

<style scoped>
@import url('../assets/fonts/font.css');
* {
  color: white;
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
.premium {
  background: #fccb2baa !important;
  position: relative;
}
.premium::after {
  /* star on top left */
  content: '★';
  position: absolute;
  top: -2rem;
  left: -1rem;
  font-size: 3rem;
  transform: rotate(45deg);
  color: #fccb2b;
}
.premium::before {
  /* star on top left */
  content: '★';
  position: absolute;
  bottom: -2rem;
  right: -1rem;
  font-size: 3rem;

  color: #fccb2b;
  transform: rotate(-45deg);
}
main {
  width: max(50rem, 80vw);
  margin-inline: auto;
}

h1 {
  font-family: 'EquitanSans', sans-serif;
  font-size: 4rem;
}

#content {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto 0.6fr;
  grid-template-areas:
    'p pgs'
    'p btns'
    'p seperator'
    'p pomodoro';
  height: 60vh;
  gap: 2rem;
}

.positioner {
  grid-area: pomodoro;
  anchor-name: --pomodoro-anchor !important;
}

#projects {
  grid-area: p;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  gap: 1rem;
  background: #ffffff33;
  backdrop-filter: blur(1rem);
  border-radius: 1rem;
}
#project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

#project-list .title {
  font-size: 1.3rem;
}

#project-list .project {
  height: 2.25rem;
  background: #00000033;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  text-decoration: none;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}

.project.selected {
  background: rgba(91, 8, 226, 0.3);
  outline: 3px solid white;
}

#newProject {
  width: 100%;
  height: 3rem;
  border-top: 2px solid #00000033;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.progress {
  grid-area: pgs;
  font-size: 1.2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.progress span {
  width: 26%;
  opacity: 0.7;
  font-size: 1.4rem;
}
.progress progress {
  --color: rgba(91, 8, 226, 0.6); /* the progress color */
  --background: rgba(255, 255, 255, 0.2); /* the background color */
  width: 100%;
  height: 1.6rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 10em;
  background: var(--background);
  backdrop-filter: blur(1rem);
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}
.progress progress::-moz-progress-bar {
  background: var(--color);
  border-radius: 10em;
}
.progress progress::-webkit-progress-bar {
  border-radius: 10em;
  background: var(--background);
}
.progress progress::-webkit-progress-value {
  border-radius: 10em;
  background: var(--color);
}
.buttons {
  grid-area: btns;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
hr {
  all: unset;
  width: 100%;
  height: 0.23rem;
  background: white;
  opacity: 0.2;
  border-radius: 5rem;
}
.buttons a {
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
}
</style>
