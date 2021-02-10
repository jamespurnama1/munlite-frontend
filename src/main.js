import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import Vue2TouchEvents from 'vue2-touch-events';
import VueDragscroll from 'vue-dragscroll';
import VueNativeSock from 'vue-native-websocket';

import './registerServiceWorker';
import store from './store';
import router from './router';
import App from './App.vue';

Vue.use(Vue2TouchEvents)
  .use(require('vue-shortkey'))
  .use(VueDragscroll)
  .use(VueNativeSock, 'wss://dev.api.munlite.co/ws/:conference_id', {
    store,
    reconnection: true,
    // format: 'json',
  })
  .component('font-awesome-icon', FontAwesomeIcon);

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
  tracesSampleRate: 1,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
