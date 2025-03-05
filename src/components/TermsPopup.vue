<template>
  <div class="background_blur">
    <main>
      <div>
        <input type="checkbox" v-model="agreed" value="normal" />
        <a href="/terms" target="_blank">Do you agree to the terms?</a>
      </div>
      <span class="tiny">{{ remaining }} ms</span>
    </main>
  </div>
</template>

<script>
export default {
  name: 'TermsPopup',
  data() {
    return {
      agreed: false,
      remaining: 'Once you click, a 3 second timer will start.',
    };
  },
  props: {
    normal: {
      type: Function,
      required: true,
    },
    google: {
      type: Function,
      required: true,
    },
    selectedType: {
      type: String,
      required: true,
    },
    no: {
      type: Function,
      required: true,
    },
  },
  watch: {
    selectedType(newVal) {
      this.proceed();
    },
    agreed(newVal) {
      console.log('updated');
      if (newVal == true) {
        console.log('true');
        this.proceed();
      }
    },
  },
  methods: {
    proceed() {
      console.log('Proceeding');
      this.remaining = 3000;
      const interval = setInterval(() => {
        this.remaining -= 15;
        if (!this.agreed) {
          console.log('not agreed');
          clearInterval(interval);
          this.no();
          return;
        }
      }, 15);
      console.log('interval ended');
      setTimeout(() => {
        if (!this.agreed) {
          console.log('not agreed');
          clearInterval(interval);
          return;
        }
        clearInterval(interval);
        console.log('Agreed');
        if (this.selectedType == 'normal') {
          this.normal();
        } else if (this.selectedType == 'google') {
          this.google();
        } else {
          console.error('No selected type');
        }
      }, 3000);
    },
  },
};
</script>

<style scoped>
.tiny {
  font-size: 0.9rem;
  opacity: 0.6;
}
input[type='checkbox'] {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0.5rem;
}
main > div {
  display: flex;
  align-items: center;
}
a {
  color: white;
  text-decoration: underline;
  font-size: 1.1rem;
  margin: 0.5rem;
}
.background_blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s all;
}
main {
  width: 25rem;
  position: absolute;
  top: 1rem;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  border-radius: 2rem;
}
button {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  cursor: pointer;
}

strong {
  font-size: 1.5rem;
  margin-top: 1rem;
  font-family: 'League Spartan', sans-serif;
  font-weight: 500;
}
</style>
