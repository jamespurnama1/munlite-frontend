import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// Make sure routes is in order to nav bar list
// for correct left/right transition.
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
  },
  {
    path: '/delegates',
    name: 'Delegates',
    component: () => import('@/views/Delegates'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
