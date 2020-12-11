import Vue from 'vue';
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
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
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

export default router;
