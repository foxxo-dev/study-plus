<template>
  <div class="background_blur">
    <main>
      <p>
        By logging in, you agree to 3rd party software's terms and conditions,
        and agree to the following:
      </p>
      <ul>
        <li>
          You understand that AI may generate incorrect or false information.
        </li>
        <li>
          You understand that this is a free service and may not be available at
          all times.
        </li>
        <li>
          You understand that this service is not responsible for any data loss
          or corruption.
        </li>
      </ul>
      <strong>Do you agree to these terms?</strong>
      <div class="button_container">
        <button @click="proceed">Yes</button>
        <button @click="no">No</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'TermsPopup',
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
  },
  methods: {
    proceed() {
      console.log('Proceeding');
      if (this.selectedType == 'normal') {
        this.normal();
      } else if (this.selectedType == 'google') {
        this.google();
      } else {
        console.error('No selected type');
      }
    },
  },
};
</script>

<style scoped>
.background_blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
main {
  width: 25rem;
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
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
