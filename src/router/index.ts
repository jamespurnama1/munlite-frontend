import Vue, { VueConstructor } from 'vue';
import NProgress from 'nprogress'; // loading progress bar
import 'nprogress/nprogress.css'; // loading progress bar style
import VueRouter, { RouteConfig } from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/conferences',
    name: 'Conferences',
    component: () => import('@/views/Conferences/index.vue'),
  },
  {
    path: '/connections',
    name: 'Connections',
    redirect: '/',
  },
  {
    path: '/files',
    name: 'Files',
    redirect: '/',
  },
  {
    path: '/account',
    name: 'Account',
    redirect: '/',
  },
  {
    path: '/overview/:id',
    name: 'Overview',
    component: () => import('@/views/Overview/index.vue'),
  },
  {
    path: '/delegates/:id',
    name: 'Delegates',
    component: () => import('@/views/Delegates/index.vue'),
  },
  {
    path: '/gsl/:id',
    name: 'GSL',
    component: () => import('@/views/GSL/index.vue'),
  },
  {
    path: '/motions/:id',
    name: 'Motions',
    component: () => import('@/views/Motions/index.vue'),
  },
  {
    path: '/caucus/:id',
    name: 'Caucus',
    component: () => import('@/views/Caucus/index.vue'),
  },
  {
    path: '/crisis/:id',
    name: 'Crisis',
    redirect: '/',
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: () => import('@/views/RegisterLogin/index.vue'),
  },
  {
    path: '/login',
    name: 'Log In',
    component: () => import('@/views/RegisterLogin/index.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const publicPages = ['Log In', 'Sign Up'];

NProgress.configure({ easing: 'ease-out', speed: 1700, showSpinner: false });

router.beforeEach((to, from, next) => {
  NProgress.start();
  const authRequired = !publicPages.includes(to.name as string);
  const status = store.getters.loggedIn;

  if (authRequired && !status) {
    // store.dispatch('fetchJWT').then(
    //   () => {
    //     next();
    //   },
    //   (error) => {
    //     console.error(error);
    //     const loginpath = window.location.pathname;
    //     next({ name: 'Log In', query: { from: loginpath } });
    //     // next('/login');
    //   },
    // );
    next();
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (!publicPages.includes(to.name as string)) store.dispatch('updateMe');
  // finish progress bar
  NProgress.done();
});

export default router;
