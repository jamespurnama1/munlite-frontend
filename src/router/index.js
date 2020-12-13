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

function navbarTab(path) {
  const tab = path.split('/')[1] === '' ? document.getElementById('home') : document.getElementById(path.split('/')[1]);
  console.log(tab);
  if (tab) {
    const styles = {
      left: tab.offsetLeft,
      width: tab.offsetWidth,
      height: tab.offsetHeight,
    };
    console.log(styles);
    document.getElementById('border').style.left = `${styles.left + 8}px`;
    document.getElementById('border').style.width = `${styles.width}px`;
    document.getElementById('border').style.height = `${styles.height}px`;
  }
}

router.beforeEach((to, from, next) => {
  if (store.getters.getWidthWindow > 960) {
    navbarTab(to.path);
  }
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
