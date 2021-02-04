import Vue from 'vue';
import NProgress from 'nprogress'; // loading progress bar
import 'nprogress/nprogress.css'; // loading progress bar style
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
  },
  {
    path: '/overview/:id',
    name: 'Overview',
    component: () => import('@/views/Overview'),
  },
  {
    path: '/conferences',
    name: 'Conferences',
    component: () => import('@/views/Conferences'),
  },
  {
    path: '/delegates/:id',
    name: 'Delegates',
    component: () => import('@/views/Delegates'),
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: () => import('@/views/RegisterLogin'),
  },
  {
    path: '/login',
    name: 'Log In',
    component: () => import('@/views/RegisterLogin'),
  },
  {
    path: '/gsl/:id',
    name: 'GSL',
    component: () => import('@/views/GSL'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

NProgress.configure({ easing: 'ease-out', speed: 1700, showSpinner: false });

router.beforeEach((to, from, next) => {
  NProgress.start();
  const publicPages = ['Log In', 'Sign Up'];
  const authRequired = !publicPages.includes(to.name);
  const status = store.getters.loggedIn;

  if (authRequired && !status) {
    store.dispatch('fetchJWT').then(
      () => {
        next();
      },
      (error) => {
        console.log(error);
        const loginpath = window.location.pathname;
        next({ name: 'Log In', query: { from: loginpath } });
        // next('/login');
      },
    );
  } else {
    next();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

export default router;
