import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard_redirect',
      redirect: '/dashboard/0',
    },
    {
      path: '/dashboard/:projectId',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { showPomodoro: true },
    },
    {
      path: '/dashboard/new/:step',
      name: 'new-project',
      component: () => import('@/views/newView.vue'),
      meta: { showPomodoro: true },
    },
    {
      path: '/settings/:projectId',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { showPomodoro: true },
    },
    {
      path: '/flash/:projectId',
      name: 'flashcards',
      component: () => import('@/views/FlashCards.vue'),
      meta: { showPomodoro: true },
    },
  ],
});

export default router;
