import Vue from 'vue';
import Vuex from 'vuex';
import Global from './modules/global';
import UserModule from './modules/auth';
import Delegates from './modules/delegates';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Global,
    UserModule,
    Delegates,
  },
});

export default store;
