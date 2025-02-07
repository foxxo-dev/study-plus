<template>
  <div id="background_color"></div>
  <NavbarDefault />
  <main>
    <img src="@/assets/img/moutains.png" alt="mountains" class="bg" />
    <div class="landing">
      <h1 class="right">
        TAKE YOUR <br />
        LEARNING TO THE <br />
        PEAKS
      </h1>
      <div class="landing_bottom">
        <p>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here.
        </p>
        <button @click="navigateToLogin">Get Started</button>
      </div>
    </div>
    <h1 class="seperator">LEARN MORE, EASIER</h1>
    <img src="@/assets/img/sand.png" alt="sand" class="sand_bg" />
  </main>
</template>

<script>
import NavbarDefault from '@/components/NavbarDefault.vue';

export default {
  methods: {
    navigateToLogin() {
      this.$router.push('/login');
    },
  },
  components: {
    NavbarDefault,
  },
};
</script>

<style scoped>
.seperator {
  height: 10rem;
  background: #4e43bb;
  width: 101vw;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-4rem) rotate(4.12deg) translateX(-0.5rem);
}
#background_color {
  width: 100%;
  height: 100%;
  background: #3f1487;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -999999;
  right: 0;
  bottom: 0;
}
.landing_bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.landing_bottom button {
  height: 90%;
  width: 30rem;
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
  cursor: pointer;
}
p {
  opacity: 0.8;
  line-height: 1.6;
  max-width: 30rem;
}
.landing {
  height: 100vh;
  width: 90vw;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
h1 {
  color: white;
  font-size: 5rem;
  font-family: 'EquitanSans', 'League Spartan', sans-serif;
  filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.25));
}
.right {
  text-align: right;
}
.bg {
  width: 100vw;
  height: calc(100vh + 10rem);
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.sand_bg {
  width: 100vw;
  height: calc(100vh + 10rem);
  object-fit: cover;
  position: absolute;
  top: 100vh;
  left: 0;
  z-index: -2;
}
a {
  width: 100vw;
  height: 100vh;
  background: #3f1487;
  color: white;
  text-decoration: none;
  display: grid;
  place-items: center;
  font-size: 2rem;
}
</style>
