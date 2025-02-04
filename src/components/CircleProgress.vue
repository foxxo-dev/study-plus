<template>
  <div class="ui-widgets">
    <div class="progress-ring" :style="progressStyle"></div>
    <div class="ui-values">{{ valueText }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    valueText: {
      type: String,
      required: true,
    },
  },
  computed: {
    progressStyle() {
      const percentage = Math.max(0, Math.min(this.value, 100));
      return {
        background: `conic-gradient(#BF98EB ${percentage}%, #ffffff33 ${percentage}% 100%)`,
        mask: 'radial-gradient(circle, transparent 52%, black 53%)',
        WebkitMask: 'radial-gradient(circle, transparent 52%, black 53%)',
      };
    },
  },
};
</script>

<style scoped>
.ui-widgets {
  height: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}

.progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2rem);
}

.ui-values {
  position: absolute;
  z-index: 1;
  color: white;
  font-size: 1.75rem;
  font-family: 'League Spartan', serif;
  font-weight: 400;
}
</style>
