/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowDown, faArrowUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

library.add(faTimes, faArrowUp, faArrowDown);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
