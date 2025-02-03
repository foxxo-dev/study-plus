<template>
  <img :src="backgroundImage" alt="background" id="bg" />
  <nav>
    <router-link to="/dashboard">< Back </router-link>
  </nav>
  <div id="spacer___"></div>
  <h1>Settings</h1>
  <main>
    <h3>Custom Background</h3>
    <input
      type="file"
      accept="image/*"
      id="background"
      @change="updateBackground" />
    <label for="background">
      <span> {{ bgName }}</span>
      <img
        v-if="updatedBackground"
        :src="backgroundImage"
        class="smol_preview" />
      <span v-else class="arrow">></span>
    </label>
    <div class="image_selector">
      <img
        :src="selectedImageUnChanged"
        alt="background"
        v-if="isCustom"
        id="custom"
        @click="selectedCustom" />
      <img :src="bookImage" alt="background" id="book" @click="defaultBg" />
      <img :src="sandImage" alt="sand" id="sand" @click="sandBg" />
    </div>
    <h3>Change PfP</h3>
    <input type="file" accept="image/*" id="profile" @change="updatePfp" />
    <label for="profile">
      <span>{{ pfpName }}</span>
      <img v-if="updatedPfp" :src="userPfp" class="smol_preview" />
      <span v-else class="arrow">></span>
    </label>
    <h3>Change Name</h3>
    <input
      type="text"
      placeholder="Display Name"
      :value="userDisplayName"
      @input="updateUserDisplayName" />
  </main>
</template>

<script>
import bookBg from '@/assets/img/book-bg.png';
import sand from '@/assets/img/sand.png';
import city_bg from '@/assets/img/city-bg.png';
import {
  changeUserBackground,
  changeUserBackgroundPath,
  updateUserProfileName,
  changeUserPfP,
  getUsersBackground,
} from '@/assets/js/firebase';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      backgroundImage: bookBg, // Initialize with default
      selectedImageUnChanged: city_bg,
      sandImage: sand,
      bookImage: bookBg,
      bgName: 'Background Image',
      pfpName: 'User Image',
      userDisplayName: '',
      userPfp: '',
      updatedBackground: false,
      updatedPfp: false,
      isCustom: false,
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  async mounted() {
    if (this.user?.uid) {
      this.backgroundImage =
        (await getUsersBackground(this.user.uid)) || bookBg;
      this.userDisplayName = this.user.displayName;

      // Check if background is neither book nor sand (custom)
      this.isCustom = !(
        this.backgroundImage === bookBg || this.backgroundImage === sand
      );

      // Set the correct selected image
      if (this.isCustom) {
        this.selectedImageUnChanged = this.backgroundImage;
      }

      // Add the selected border to the selected background
      this.updateSelectedBackground();
    }
  },
  methods: {
    selectedCustom() {
      this.isCustom = true;
      this.backgroundImage = this.selectedImageUnChanged;
      this.updateSelectedBackground();
    },
    async updateUserDisplayName(event) {
      const name = event.target.value;
      await updateUserProfileName(name);
      // this.userDisplayName = name;
    },
    async updatePfp(event) {
      const file = event.target.files[0];
      if (!file) return;
      const fileName = file.name;
      const url = await changeUserPfP(this.user.uid, file);
      console.log('changedUserPfP');
      this.userPfp = url;
      this.pfpName = fileName;
      this.updatedPfp = true;
    },
    async updateBackground(event) {
      const file = event.target.files[0];
      if (!file) return;
      const fileName = file.name;
      const url = await changeUserBackground(this.user.uid, file);
      this.backgroundImage = url;
      this.updatedBackground = true;
      this.isCustom = true;
      this.bgName = fileName;
      this.selectedImageUnChanged = url;
      this.updateSelectedBackground();
    },
    async defaultBg() {
      this.backgroundImage = bookBg;
      await changeUserBackgroundPath(
        this.user.uid,
        'scr/assets/img/book-bg.png',
      );
      this.updateSelectedBackground();
    },
    async sandBg() {
      this.backgroundImage = sand;
      await changeUserBackgroundPath(this.user.uid, '/scr/assets/img/sand.png');
      this.updateSelectedBackground();
    },
    updateSelectedBackground() {
      // Reset all selected backgrounds
      document.getElementById('custom').classList.remove('selected');
      document.getElementById('book').classList.remove('selected');
      document.getElementById('sand').classList.remove('selected');

      // Add the selected class to the correct one
      if (this.backgroundImage === bookBg) {
        document.getElementById('book').classList.add('selected');
      } else if (this.backgroundImage === sand) {
        document.getElementById('sand').classList.add('selected');
      } else {
        document.getElementById('custom').classList.add('selected');
      }
    },
  },
};
</script>

<style scoped>
main {
  background: rgba(255, 255, 255, 0.3);
  width: 80%;
  margin: 0 auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 70vh;
  border-radius: 2rem;
  backdrop-filter: blur(20px);
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}
input[type='file'] {
  display: none;
}
label {
  background: #bf98eb;
  color: black;
  padding: 0.5rem;
  padding-inline: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 15rem;
  font-weight: 300;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
label > span:not(.arrow) {
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.smol_preview {
  width: 1rem;
  height: 1rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
}
.image_selector {
  display: flex;
  gap: 1rem;
}
.image_selector img {
  width: 20rem;
  height: 8rem;
  object-fit: cover;
  border-radius: 0.5rem;
  cursor: pointer;
}
img.selected {
  border: 4px solid #bf98eb;
}
h1 {
  font-family: 'EquitanSans', sans-serif;
  font-size: 4rem;
  margin-left: 2rem;
  color: white;
}

h3 {
  font-family: 'League Spartan', serif;
  font-size: 2rem;
  color: white;
  font-weight: 450;
  margin: 0;
  padding: 0;
}

#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
}
nav > a {
  font-family: 'League Spartan', serif;
  font-size: 1.3rem;
  color: white;
  text-decoration: none;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-image: linear-gradient(to bottom, #00000081, #0000);
  color: white;
  width: 100%;
  position: fixed;
  height: 6rem;
}

#spacer___ {
  height: 6rem;
  width: 100%;
}
input {
  width: 20rem;
  border: none;
  outline: none;
  background: rgba(0, 0, 0, 0.1);
  padding-inline: 0.5rem;
  padding-block: 0.5rem;
  /* padding-left: 3rem; */
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
</style>
