<template>
  <div
    ref="pomodoro"
    class="container"
    id="pomodoro"
    :class="{ minimized: isMinimized }"
    :style="
      isMinimized && { left: `${position.left}px`, top: `${position.top}px` }
    "
    @mousedown="startDrag"
    @mouseup="endDrag"
    @mousemove="onDrag">
    <CircleProgress :value="28.25" valueText="05:39" />
    <div class="button_container">
      <button class="green">Start</button>
      <button class="red">Stop</button>
    </div>
  </div>
</template>

<script>
import CircleProgress from './CircleProgress.vue';

export default {
  data() {
    return {
      isMinimized: false,
      position: { left: 352.219, top: 672.75 }, // Initial position
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
    };
  },
  mounted() {
    this.updateAnchorPosition();
    window.addEventListener('resize', this.updateAnchorPosition);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateAnchorPosition);
  },
  methods: {
    updateAnchorPosition() {
      const anchor = document.getElementById('position_pomodoro');
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        this.anchor = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      }
    },
    startDrag(event) {
      this.isDragging = true;
      this.dragOffset.x = event.clientX - this.position.left;
      this.dragOffset.y = event.clientY - this.position.top;
      this.isMinimized = true; // Always minimized while dragging
    },
    onDrag(event) {
      if (!this.isDragging) return;
      this.position.left = event.clientX - this.dragOffset.x;
      this.position.top = event.clientY - this.dragOffset.y;
    },
    endDrag() {
      this.isDragging = false;
      this.updateAnchorPosition();

      if (this.isOverAnchor()) {
        // Snap and expand
        this.position.left = this.anchor.left;
        this.position.top = this.anchor.top;
        this.isMinimized = false;
      } else {
        // Stay minimized
        this.isMinimized = true;
      }
    },
    isOverAnchor() {
      return (
        this.position.left >= this.anchor.left &&
        this.position.left <= this.anchor.left + this.anchor.width &&
        this.position.top >= this.anchor.top &&
        this.position.top <= this.anchor.top + this.anchor.height
      );
    },
  },
  components: {
    CircleProgress,
  },
};
</script>

<style scoped>
.container {
  position: fixed;
  padding: 0.5rem;
  border-radius: 1rem;
  display: flex;
  gap: 2rem;
  transition: background 200ms ease-in-out;
}
.minimized {
  width: 15rem;
  height: 15rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

* {
  color: white;
}
.button_container {
  width: 100%;
  display: flex;
  gap: 1rem;
}
.minimized .button_container {
  height: 4rem;
}
button {
  all: unset;
  width: 100%;
  height: 100%;
  background: #ffffff33;
  backdrop-filter: blur(1rem);
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  font-family: 'League Spartan', serif;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}
.minimized button {
  font-size: 1rem;
}
.green {
  background: hsla(122, 100%, 50%, 0.4);
}
.red {
  background: hsla(4, 90%, 58%, 0.4);
}

.container:not(.minimized) {
  position-anchor: --pomodoro-anchor !important;
  left: anchor(left);
  top: anchor(top);
  right: anchor(right);
  bottom: anchor(bottom);
}
div * {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
.container::after {
  content: '⠿';
  display: block;
  font-size: 1.25rem;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  color: black;
  opacity: 0.3;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  transition: top 200ms ease-in-out background 200ms ease-in-out;
}
.container:not(.minimized)::after {
  background: white;
  border-radius: 0.5rem;
  padding: 0.15rem;
  top: 0;
}
</style>
