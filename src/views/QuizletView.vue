<template>
  <div class="video-container">
    <video autoplay loop muted>
      <source src="@/assets/video/quizlet-to-pdf.mov" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh; /* Full height for proper centering */
}

video {
  max-width: 100%;
  height: auto;
}
</style>
