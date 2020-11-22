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
    path: '/overview',
    name: 'Overview',
    component: () => import('@/views/Overview'),
  },
  {
    path: '/delegates',
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
  const publicPages = ['/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);
  const { loggedIn } = store.getters;

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
