<template>
  <img src="@/assets/img/sand.png" alt="background" id="bg" />
  <main>
    <div class="icon_container">
      <i class="fa-solid fa-lock-open"></i>
    </div>
    <h1>
      {{
        isSuccess
          ? 'You have successfully reset your password!'
          : 'Reset your Passowrd.'
      }}
    </h1>
    <p>Check here to reset your passowrd.</p>
    <form>
      <div class="input-wrapper" v-if="!isSuccess">
        <i class="fa-solid fa-lock"></i>
        <input
          :type="isPasswordHidden ? 'password' : 'text'"
          v-model="password"
          placeholder="Password"
          id="p" />

        <span @click="togglePassword" class="password-toggle">
          <EyeClosed v-if="isPasswordHidden" />
          <EyeOpen v-else-if="!isPasswordHidden" />
        </span>
      </div>
      <hr />
      <div class="input-wrapper" v-if="!isSuccess">
        <i class="fa-solid fa-lock"></i>
        <input
          :type="isRepeatPasswordHidden ? 'password' : 'text'"
          v-model="confirmedPassword"
          placeholder="Repeat Password"
          id="p" />

        <span @click="togglePassword2" class="password-toggle">
          <EyeClosed v-if="isPasswordHidden2" />
          <EyeOpen v-else-if="!isPasswordHidden2" />
        </span>
      </div>

      <span class="smol">{{
        'You may receive multiple emails or confirmations during this process.'
      }}</span>
      <button @click.prevent="promptNormal" :disabled="isSuccess">
        Update Password
      </button>
    </form>
  </main>
  <AiDisclamer />
  <TermsPopup
    v-if="popup"
    :normal="login"
    :google="loginGoogle"
    :selectedType="selectedType"
    :no="popupOff" />
</template>

<script>
import { resetPassword } from '@/assets/js/firebase';
import EyeClosed from '@/components/icons/EyeClosed.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';
export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmedPassword: '',
      isPasswordHidden: true,
      isRepeatPasswordHidden: true,
      isPasswordHidden2: true,
      isSuccess: false,
    };
  },
  components: {
    EyeClosed,
    EyeOpen,
  },
  methods: {
    togglePassword() {
      this.isPasswordHidden = !this.isPasswordHidden;
    },
    togglePassword2() {
      this.isPasswordHidden2 = !this.isPasswordHidden2;
    },
    getParameterByName(name) {
      const url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      const results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    async promptNormal() {
      if (this.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
      if (this.password === this.confirmedPassword) {
        console.log('Passwords match.');
        const code = await resetPassword(
          this.getParameterByName('oobCode'),
          this.password,
        );
        if (code == true) {
          this.isSuccess = true;
          setTimeout(() => {
            this.$router.push('/login');
          }, 10000);
        } else {
          alert('An error occured. Please try again. You may close this tab.');
        }
      } else {
        alert('Passwords do not match.');
      }
    },
  },
};
</script>

<style scoped>
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
  width: 25rem;
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
  margin-block: 0.2rem;
}
h1 {
  padding: 0;
  margin: 0;
  font-family: 'League Spartan', sans-serif;
  font-weight: 450;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

input {
  border: none;
  outline: none;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  padding-inline: 0.5rem;
  padding-block: 0.5rem;
  padding-left: 3rem;
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
input::placeholder {
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
