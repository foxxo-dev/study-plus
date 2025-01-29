import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store'; // Correct the import path if necessary
import '@/assets/fonts/font.css'

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
