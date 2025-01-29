<template>
  <img :src="backgroundImage" alt="background" id="bg" />
  <NavbarDash />
  <main>
    <h1>Welcome, {{ user.displayName || user.email }}!</h1>
    <div id="content">
      <div id="projects">
        <div id="project-list">
          <router-link
            class="project"
            v-for="project in projects"
            :key="project.id"
            :to="`/projects/${project.id}`">
            <div class="projectLink">
              <span>{{ project.name }}</span>
            </div>
          </router-link>
        </div>
        <router-link to="/projects/new">New Project</router-link>
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
        <router-link to="/dashboard" class="button">Take a Quiz</router-link>
      </div>
      <hr id="seperator" />
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import NavbarDash from '@/components/NavbarDash.vue'; // Import it normally
import '@/assets/fonts/font.css';

export default {
  data() {
    return {
      currentProject: { id: 0, name: 'Science Cells Project' },
      projects: [
        { id: 0, name: 'Science Cells Project' },
        { id: 1, name: 'English One Pager Essay' },
        { id: 2, name: 'I&S Source Analyses' },
      ],
    };
  },
  computed: {
    ...mapGetters(['user']),
    backgroundImage() {
      return 'https://unsplash.it/1920/1080';
    },
  },
  components: {
    NavbarDash, // Register the component normally
  },
  methods: {
    checkIfSignedIn() {
      if (!this.user || !this.user.email) {
        this.$router.push('/login');
      }
    },
  },
  watch: {
    user: 'checkIfSignedIn',
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
  filter: contrast(0.8);
}
main {
  width: max(50rem, 80vw);
  margin-inline: auto;
}

h1 {
  font-family: 'EquitanSans', sans-serif;
  font-size: 3.5rem;
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
  gap: 0.75rem;
  padding: 1rem;
}

#project-list .project {
  height: 2.25rem;
  background: #00000033;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.4rem;
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
}
.progress progress {
  width: 100%;
  height: 1.6rem;
}
.buttons {
  grid-area: btns;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
hr {
  all: unset;
  width: 100%;
  height: 0.23rem;
  background: black;
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
}
</style>
