<template>
  <img src="@/assets/img/sand.png" alt="background" id="bg" />
  <main>
    <div class="steps_container">
      <span class="step" :class="$route.params.step >= 0 && 'selected'"></span>
      <span class="step" :class="$route.params.step >= 1 && 'selected'"></span>
      <span class="step" :class="$route.params.step >= 2 && 'selected'"></span>
    </div>

    <StepOne v-if="$route.params.step == 0" />
    <StepTwo v-if="$route.params.step == 1" />
    <StepThree v-if="$route.params.step == 2" />
  </main>
  <span>Debug: {{ $route.params.step }}</span>
</template>

<script>
import StepOne from '@/components/steps/StepOne.vue';
import StepThree from '@/components/steps/StepThree.vue';
import StepTwo from '@/components/steps/StepTwo.vue';

export default {
  data() {
    return {};
  },
  components: {
    StepOne,
    StepTwo,
    StepThree,
  },
};
</script>

<style scoped>
.steps_container {
  width: 90%;
  height: 0.2rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.step {
  height: 100%;
  width: 5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1vw;
}
.selected {
  background: white;
}
#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
  object-position: center;
}
main {
  width: 26rem;
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}
</style>
