<template v-if="user && user.email">
  <img
    :src="backgroundImage || 'https://unsplash.it/1920/1080'"
    alt="background"
    id="bg"
    @load="fadeIn" />
  <div
    class="background_loading"
    :class="{ visible: isBgLoaded }"
    :style="{ background: averageColor }"></div>
  <NavbarDash
    :photoUrl="
      user
        ? user.photoURL || 'https://unsplash.it/100'
        : 'https://unsplash.it/100'
    " />
  <SurveyPopup v-if="isSurveyPopup" />
  <main @click="closeMenu">
    <h1>
      Welcome, {{ user ? user.displayName || user.email : 'Loading...' }}!
    </h1>
    <div id="content">
      <div id="projects">
        <div id="project-list">
          <span class="title">Projects</span>
          <router-link
            class="project"
            v-for="project in projects"
            :class="{ selected: project.id == $route.params.projectId }"
            :key="project.id"
            :to="`/dashboard/${project.id}`">
            <div class="projectLink">
              <span>{{ project.name }}</span>
              <span class="projectMenu">
                <div
                  @click.stop.prevent="toggleMenu(project.id)"
                  class="projectToggle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path
                      d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z" />
                  </svg>
                </div>
              </span>
              <div v-show="menuOpen == project.id" class="editProjectDetails">
                <button @click.stop.prevent="handleDelete(project.id)">
                  Delete
                </button>
              </div>
            </div>
          </router-link>
        </div>
        <router-link to="/dashboard/new/0" id="newProject"
          >New Project</router-link
        >
      </div>
      <div class="progress">
        <span>{{ currentProject.name }}</span>
        <progress :value="progress" max="100"></progress>
      </div>
      <div class="buttons">
        <router-link :to="`/tetris/${$route.params.projectId}`" class="button"
          >Gameify!</router-link
        >
        <router-link :to="`/improve/${$route.params.projectId}`" class="button"
          >Check Your Work</router-link
        >
        <router-link
          :to="$route.params.projectId && `/flash/${$route.params.projectId}`"
          class="button"
          >Flash Cards</router-link
        >
        <router-link to="/dashboard" class="button premium"
          >-[Note Creator]-</router-link
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
  getProjectsList,
  getPercentage,
  deleteProject,
} from '@/assets/js/firebase';
import { getAverageBgColor } from '@/assets/js/cookiesHandler';
import SurveyPopup from '@/components/SurveyPopup.vue';
import EditIcon from '@/components/icons/EditIcon.vue';

export default {
  data() {
    return {
      backgroundImage: null,
      currentProject: { id: 0, name: 'Loading...' },
      projects: [{ id: 0, name: 'Loading...' }],
      averageColor: '#3f1487',
      progress: 0,
      janWodospad: false,
      isSurveyPopup: false,
      isBgLoaded: false,
      menuOpen: null,
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  components: {
    NavbarDash,
    SurveyPopup,
  },
  async mounted() {
    this.averageColor = await getAverageBgColor();
    this.isBgLoaded = true;
    // Wrap all DOM modifications in the guard:
    const bgl = document.getElementById('bgl');
    if (bgl) {
      bgl.style.opacity = 1;
      bgl.style.transition = 'opacity 0.5s';
    }

    // Czekamy na załadowanie użytkownika w Vuex (jeśli fetchUser zwraca Promise)
    await this.$store.dispatch('fetchUser');

    this.checkIfSignedIn();

    if (!this.$route.params.projectId) {
      document.cookie = '_survey_popup=true; max-age=1814400';
      this.$router.push('/dashboard/new/0');
      return;
    }

    this.setupSurveyPopup();

    // Jeśli użytkownik jest już w Vuex, aktualizujemy dane
    if (this.user) {
      await this.updateUser();
    }

    this.setupIntersectionObserver();
    this.setupProximityCheck();
  },
  methods: {
    async handleDelete(projectId) {
      try {
        await deleteProject(this.user.uid, projectId);
        this.menuOpen = null;

        // If the currently active project was deleted, route back to new/dashboard
        if (this.$route.params.projectId === projectId) {
          this.$router.push('/dashboard/new/0');
        } else {
          await this.updateUser();
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    },
    closeMenu(event) {
      if (
        event.target.closest('.editProjectDetails button') ||
        event.target.closest('.projectToggle')
      ) {
        return;
      }
      this.menuOpen = null;
    },
    toggleMenu(id) {
      if (this.menuOpen != null) {
        this.menuOpen = null;
      } else {
        this.menuOpen = id;
      }
    },
    setupSurveyPopup() {
      if (document.cookie.indexOf('_survey_popup') === -1) {
        document.cookie = '_survey_popup=true; max-age=1814400';
        this.isSurveyPopup = true;
      } else {
        this.isSurveyPopup = false;
      }
    },
    fadeIn() {
      const bg = document.getElementById('bg');
      if (bg) bg.style.opacity = 1;
    },
    async updateUser() {
      if (!this.user?.uid) return;

      try {
        console.log('User:', this.user, 'UID:', this.user.uid);

        // Fetch profile picture and projects concurrently to speed up loading
        const [userPfp, projectsList] = await Promise.all([
          getUserPfp(this.user.uid),
          getProjectsList(this.user.uid),
        ]);

        // Commit a mutation instead of directly mutating Vuex state
        if (userPfp) {
          this.$store.commit('setUserPhoto', userPfp);
        }

        this.projects = projectsList || [];

        // Redirect immediately if no projects exist before calculating route details
        if (this.projects.length === 0) {
          this.progress = 0;
          this.$router.push('/dashboard/new/0');
          return;
        }

        // Match route project ID safely
        const foundProject = this.projects.find(
          (project) => project.id === this.$route.params.projectId,
        );

        if (foundProject) {
          this.currentProject = foundProject;
          this.progress = await getPercentage(
            this.user.uid,
            this.currentProject.id,
          );
        } else {
          this.currentProject = { id: 0, name: 'Project not found' };
          this.progress = 0;
        }

        this.janWodospad = this.user.displayName === 'Jan Wodospad';
      } catch (error) {
        console.error('Error updating user data:', error);
      }
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
        console.log('No user found!', this.user);
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
      if (target) observer.observe(target);
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
      this.checkProximity();
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
      async handler(newUser) {
        if (newUser && newUser.uid) {
          await this.fetchBackground();
          await this.updateUser(); // Bezpieczne odpalenie po wykryciu usera
        }
      },
    },
    $route: {
      handler() {
        this.updateUser();
      },
    },
  },
  beforeDestroy() {
    // Czyszczenie event listenerów zapobiegające wyciekom pamięci
    window.removeEventListener('scroll', this.checkProximity);
    window.removeEventListener('mousemove', this.checkProximity);
  },
};
</script>

<style scoped>
@import url('../assets/fonts/font.css');
* {
  color: white;
}
#janwodospad {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #00000049;
  display: grid;
  color: white;
  place-items: center;
  font-size: 3rem;
  z-index: 9999;
  padding-inline: 2rem;
  text-align: center;
  pointer-events: none;
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
  width: 100%;
  height: 100vh; /* Added height */
  z-index: -2;
  opacity: 0;
  transition: opacity 0.5s;
}

.background_loading.visible {
  opacity: 1;
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
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}
#project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  width: 12rem;
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
  text-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.projectLink {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.projectMenu {
  height: 100%;
  aspect-ratio: 1;
  filter: invert(1);
  opacity: 0.6;
}

.editProjectDetails {
  position: absolute;
  background: rgba(255, 0, 0, 0.556);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  color: #111;
  z-index: 99999;
  right: 1rem;
  top: 1rem;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: 5rem;
  max-height: 3rem;
}

.editProjectDetails button {
  all: unset;
  color: white;
  text-decoration: none;
  display: block;
  text-align: center;
  cursor: pointer;
}

.project span {
  display: block;
  max-width: 7rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.project.selected {
  background: rgba(91, 8, 226, 0.3) !important;
  outline: 1px solid white;
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
  width: 100%;
  opacity: 0.7;
  font-size: 1.4rem;
}
.progress progress {
  --color: rgba(91, 8, 226, 0.6); /* the progress color */
  --background: rgba(255, 255, 255, 0.2); /* the background color */
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
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
  transition: 300ms;
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
