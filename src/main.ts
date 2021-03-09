import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
// import devtools from '@vue/devtools';
import Vue2TouchEvents from 'vue2-touch-events';
import VueDragscroll from 'vue-dragscroll';
import VueNativeSock from 'vue-native-websocket';
import vClickOutside from 'v-click-outside';
import IdleVue from 'idle-vue';

import './registerServiceWorker';
import store from './store';
import router from './router';
import App from './App.vue';

library.add(fas);

Sentry.init({
  dsn:
    'https://b4e9f2adf10240d2bc10acdc2abdf7f1@o447127.ingest.sentry.io/5426734',
  integrations: [
    new VueIntegration({
      Vue,
      tracing: true,
    }),
    new Integrations.BrowserTracing(),
  ],
  debug: false,
  tracesSampleRate: 0.5,
});

Vue.config.productionTip = false;

// if (process.env.NODE_ENV === 'development') {
//   devtools.connect('https://3f80b6d49225.ngrok.io', null);
// }

const vm = new Vue({
  router,
  store,
  render: (h) => h(App),
});

Vue.use(Vue2TouchEvents, {
  disableClick: true,
})
  .use(require('vue-shortkey'))
  .use(VueDragscroll)
  .use(IdleVue, {
    store,
    idleTime: 4900,
  })
  .use(vClickOutside)
  .use(VueNativeSock, 'wss://dev.api.munlite.co/ws/', {
    store,
    reconnection: true,
    connectManually: true,
  })
  .component('font-awesome-icon', FontAwesomeIcon);

router.afterEach((to) => {
  if (to.params.id && !(store as any).state.Socket.isConnected) {
    vm.$connect(`wss://dev.api.munlite.co/ws/:${to.params.id}`);
  } else if (!to.params.id) {
    vm.$disconnect();
  }
});

vm.$mount('#app');

if ((window as any).Cypress) (window as any).store = store;
