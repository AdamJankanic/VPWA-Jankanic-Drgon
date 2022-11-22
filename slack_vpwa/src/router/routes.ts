import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: { requiresAuth: true },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '/:id', component: () => import('pages/MainScreen.vue') },
      { path: '/welcome', component: () => import('pages/WelcomeScreen.vue') },
      {
        path: '',
        component: () => import('pages/ChannelPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/LoginRegister.vue') },
      {
        path: 'register',
        name: 'register',
        meta: { guestOnly: true },
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'login',
        name: 'login',
        meta: { guestOnly: true },
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },

  {
    path: '/channels',
    // channels requires auth
    meta: { requiresAuth: true },
    // component: () => import('layouts/MainLayout.vue'),
    component: () => import('layouts/ChatLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/ChannelPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
