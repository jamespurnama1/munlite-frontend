import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(fas);

Sentry.init({
  dsn: 'https://b4e9f2adf10240d2bc10acdc2abdf7f1@o447127.ingest.sentry.io/5426734',
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
