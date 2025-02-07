<template>
  <nav>
    <h3>Study+</h3>
    <div class="nav_links">
      <router-link to="/dashboard">Home</router-link>
      <div class="dot"></div>
      <router-link to="/dashboard">About</router-link>
      <div class="dot"></div>
      <router-link to="/dashboard">Contact</router-link>
      <div class="dot"></div>
      <router-link to="/dashboard">Learn More</router-link>
    </div>
    <div>
      <router-link to="/login">Sign Up</router-link>
      <button>Join Premium</button>
    </div>
  </nav>
  <div id="spacer___"></div>
</template>

<script>
export default {
  props: {
    photoUrl: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped>
.nav_links {
  font-size: 1.25rem;
  gap: 1rem;
}
.popover_toggle {
  all: unset !important;
  anchor-name: --profile_anchor !important;
}
h3 {
  font-family: 'League Spartan', serif;
  font-size: 1.3rem;
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
  z-index: 9999;
}
nav div {
  display: flex;
  gap: 2rem;
  height: 2.75rem;
  justify-content: center;
  align-items: center;
}

img {
  height: 3rem;
  border-radius: 50%;
  aspect-ratio: 1;
  cursor: pointer;
}

button {
  all: unset;
  background: #e2af08;
  padding-inline: 2rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 10vw;
  height: 2.75rem;
  font-size: 1.3rem;
  cursor: pointer;
}

a {
  color: white;
  text-decoration: none;
  position: relative;
}

a::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.3s;
  position: absolute;
  bottom: -0.25rem;
}
a:hover::after {
  width: 100%;
}

.dot {
  height: 0.5rem;
  width: 0.5rem;
  background: white;
  border-radius: 50%;
}

#spacer___ {
  height: 6rem;
  width: 100%;
}
</style>
