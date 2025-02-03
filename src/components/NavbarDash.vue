<template>
  <nav>
    <h3>Study+</h3>
    <div>
      <button>Join Premium</button>
      <button popovertarget="profile_selector" class="popover_toggle">
        <img
          :src="
            photoUrl == null
              ? 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
              : photoUrl
          "
          alt="profile"
          id="profile_anchor" />
      </button>
    </div>
  </nav>

  <div id="profile_selector" popover anchor="profile_anchor" class="dropdown">
    <router-link to="/settings">Settings</router-link>
    <router-link to="/">Log Out</router-link>
  </div>

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
}
nav div {
  display: flex;
  gap: 2rem;
  height: 2.75rem;
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
  font-size: 1.3rem;
  cursor: pointer;
}

.dropdown {
  width: 7rem;
  background: rgba(255, 255, 255, 0.101);
  color: white;
  flex-direction: column;
  border-radius: 0.5rem;
  position: absolute;
  margin: 0;
  margin-top: 0.5rem;
  inset: auto;
  position-anchor: --profile_anchor;
  top: anchor(bottom);
  right: anchor(right);
  backdrop-filter: blur(1rem);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown:popover-open {
  display: flex;
}

.dropdown a {
  color: white;
  text-decoration: none;
  padding: 1rem;
  display: block;
  text-align: center;
}

.dropdown a:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#spacer___ {
  height: 6rem;
  width: 100%;
}
</style>
