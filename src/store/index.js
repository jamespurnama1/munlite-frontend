import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    delegates: [
      {
        id: 'au',
        name: 'Australia',
        presence: 'Not Present',
      },
      {
        id: 'be',
        name: 'Belgium',
        presence: 'Not Present',
      },
      {
        id: 'cn',
        name: 'China',
        presence: 'Not Present',
      },
      {
        id: 'eg',
        name: 'Egypt',
        presence: 'Not Present',
      },
      {
        id: 'hk',
        name: 'Hong Kong',
        presence: 'Not Present',
      },
      {
        id: 'in',
        name: 'India',
        presence: 'Not Present',
      },
      {
        id: 'jp',
        name: 'Japan',
        presence: 'Not Present',
      },
      {
        id: 'lr',
        name: 'Liberia',
        presence: 'Not Present',
      },
      {
        id: 'nz',
        name: 'New Zealand',
        presence: 'Not Present',
      },
      {
        id: 'th',
        name: 'Thailand',
        presence: 'Not Present',
      },
      {
        id: 'us',
        name: 'United States of America',
        presence: 'Not Present',
      },
    ],
    info: {
      Present: 0,
      'Present & Voting': 0,
      'Total Present': 0,
      'DR Sponsors': 3,
    },
    widthWindow: 0,
  },
  mutations: {
    present(state) {
      state.info.Present += 1;
      state.info['Total Present'] += 1;
    },
    presentVoting(state) {
      state.info['Present & Voting'] += 1;
      state.info['Total Present'] += 1;
    },
    getWidth(state, i) {
      state.widthWindow = i;
    },
  },
  actions: {},
  modules: {},
});
