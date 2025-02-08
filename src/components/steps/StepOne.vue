<template>
  <div class="icon_container">
    <i class="fa-solid fa-signature"></i>
  </div>
  <h1>Start With a name</h1>
  <p>Give a quick name and description of what you are planning to study.</p>
  <form>
    <div class="input-wrapper">
      <input type="text" placeholder="Title" id="t" required />
    </div>
    <div class="input-wrapper">
      <textarea
        type="text"
        placeholder="Description"
        id="t"
        required
        class="big_text"></textarea>
    </div>
    <span class="smol" :style="{ color: 'black' }"
      >You can always change this name later.</span
    >
    <button @click.prevent="this.$router.push('/dashboard/new/1')">
      Continue
    </button>
  </form>
</template>
<style scoped>
textarea {
  resize: none;
}
.big_text {
  height: 5rem;
}
.smol {
  text-align: right;
  padding: 0;
  margin: 0;
  font-size: 0.7rem;
  opacity: 0.6;
}
.icon_container {
  width: 5rem;
  aspect-ratio: 1;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: 1rem;
}
.seperator span {
  width: 100%;
  font-size: 0.75rem;
  opacity: 0.6;
  margin-bottom: 0.75rem;
}
svg {
  height: 2.5rem !important;
  color: black;
}
p {
  opacity: 0.6;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  margin-top: 0;
  padding-top: 0;
  width: 80%;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.seperator {
  display: flex;
  width: 100%;
}
hr {
  border: none;
  width: 100%;
  height: 2px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.8) 33%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom;
  background-size: 5px 1px;
  background-repeat: repeat-x;
  opacity: 0.6;
}
h1 {
  padding: 0;
  margin: 0;
  font-family: 'League Spartan', sans-serif;
  font-weight: 450;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

input,
textarea {
  border: none;
  outline: none;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  padding-inline: 0.5rem;
  padding-block: 0.5rem;
  padding-left: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  height: 2.5rem;
  font-family: 'GlacialIndifference', sans-serif;
  color: white;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  position: relative;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-background-clip: text;
  -webkit-text-fill-color: #ffffff;
  transition: background-color 99999999999s ease-in-out 0s;
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.1);
}
input::placeholder,
textarea::placeholder {
  opacity: 0.6;
  color: white;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper svg:not(.icon-right) {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  opacity: 0.6;
  font-size: 1rem;
  height: 1.5rem !important;
  width: 1.5rem !important;
}

.input-wrapper .icon-right {
  position: absolute;
  right: 0.75rem !important;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  opacity: 1; /* Make it fully visible */
  font-size: 1rem;
  height: 1.5rem !important;
  width: 1.5rem !important;
  cursor: pointer;
  pointer-events: auto; /* Ensure it's clickable */
  z-index: 100;
}

.password-toggle {
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 10;
  pointer-events: auto; /* Ensure clicks register */
}

button {
  border: none;
  outline: none;
  width: 100%;
  background: rgba(92, 8, 226, 0.3);
  cursor: pointer;
  padding-inline: 0.5rem;
  padding-block: 0.5rem;
  border-radius: 0.5rem;
  height: 2.25rem;
  font-family: 'GlacialIndifference', sans-serif;
  font-size: 1rem;
  color: white;
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: 1rem;
}
.special_container {
  width: 100%;
  display: flex;
  gap: 1rem;
}
.special {
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(214, 175, 255, 0.7);
}
.special * {
  color: black;
  height: 100% !important;
}
</style>
