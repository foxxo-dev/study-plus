<!-- Survey Popup -->
<!-- https://docs.google.com/forms/d/e/1FAIpQLSdgX9fM8A32IzqdFh2MwvUvhofpmd3F6Zb3RT_P09eSaneRaQ/viewform?usp=header -->
<template>
  <div id="surveyPopup">
    <div class="surveyPopup__content">
      <button class="surveyPopup__close" @click="closePopup">X</button>
      <h2>Help us improve!</h2>
      <p>
        We are constantly working on improving our platform. Please take a
        moment to fill out our survey.
      </p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdgX9fM8A32IzqdFh2MwvUvhofpmd3F6Zb3RT_P09eSaneRaQ/viewform?usp=header"
        target="_blank"
        >Take the survey</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SurveyPopup',
  methods: {
    closePopup() {
      // Logic to close the popup
      document.getElementById('surveyPopup').style.display = 'none';
    },
  },
};
</script>
<style scoped>
/* css */
#surveyPopup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.surveyPopup__content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: relative;
  color: black;
  width: 20rem;
}

.surveyPopup__close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: black;
}
.surveyPopup__content h2 {
  margin-top: 0;
}

.surveyPopup__content p {
  margin: 20px 0;
}
a {
  all: unset;
  background: #000000;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
