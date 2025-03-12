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
    {
      path: '/auth/emailverified',
      name: 'emailverified',
      component: () => import('@/views/auth/VerifiedEmail.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/quizlet',
      name: 'quizlet',
      component: () => import('@/views/QuizletView.vue'),
      meta: { showPomodoro: true },
    },
    {
      path: '/auth/verifyingemail',
      name: 'verifyingemail',
      component: () => import('@/views/auth/Verifying.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/auth/resetpassword',
      name: 'resetpassword',
      component: () => import('@/views/auth/ResetPassword.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/auth/resetpasswordemail',
      name: 'resetpasswordemail',
      component: () => import('@/views/auth/ResetPasswordEmail.vue'),
    },
    {
      path: '/auth/verificationRedirect',
      name: 'verificationRedirect',
      component: () => import('@/views/auth/VerificationRedirect.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsAndConditions.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/Tetris/:projectId',
      name: 'Tetris',
      component: () => import('@/views/Tetris.vue'),
      meta: { showPomodoro: true },
    },
    {
      path: '/improve',
      name: 'improve_redirect',
      redirect: '/improve/0',
    },
    {
      path: '/improve/:projectId',
      name: 'improve',
      component: () => import('@/views/ImproveView.vue'),
      meta: { showPomodoro: true },
    },
    {
      path: '/apitest',
      name: 'apitest',
      component: () => import('@/views/APITest.vue'),
      meta: { showPomodoro: false },
    },
    {
      path: '/privacypolicy',
      name: 'privacypolicy',
      component: () => import('@/views/PrivacyPolicy.vue'),
    },
  ],
});

export default router;
