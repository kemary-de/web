import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/feature-flags',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/FeatureFlags.vue') }],
  },
  {
    path: '/token',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/TokenPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
