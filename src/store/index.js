import Vue from 'vue';
import Vuex from 'vuex';
import UserModule from './modules/auth';
import Delegates from './modules/delegates';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    UserModule,
    Delegates,
  },
});

export default store;
