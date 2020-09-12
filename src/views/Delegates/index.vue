<template>
  <div class="delegates">
    <div class="delegates-upper">
      <h1 class="title">Delegates</h1>
      <div class="delegates-button">
        <button @click="showModal">Role Call</button>
        <button><font-awesome-icon :icon="['fas', 'plus']" /></button>
      </div>
    </div>
    <div class="delegates-table">
      <table class="table">
        <tr class="title">
          <td class="title-name">Name
            <font-awesome-icon class="dropdown-icon" :icon="['fas', 'chevron-down']" />
          </td>
          <td>Presence</td>
        </tr>
        <tr v-for="(data, index) in delegates" :key="index" class="data">
          <td class="name">
            <img :src="require('@/assets/img/' + data.flag)" :alt="data.name" class="img"/>
            {{data.name}}
          </td>
          <td style="width:60%" class="presence">{{data.presence}}</td>
        </tr>
      </table>
    </div>
    <div class="overlay" v-if="showOverlay"></div>
    <modal></modal>
  </div>
</template>

<script>
import Modal from './components/Modal.vue';

export default {
  name: 'Delegates',
  components: {
    Modal,
  },
  data() {
    return {
      delegates: [
        {
          flag: 'flag.png',
          name: 'Australia',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Belgium',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'China',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Egypt',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Hong Kong',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'India',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Japan',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Liberia',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'New Zealand',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Thailand',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'United States of America',
          presence: 'Not Present',
        },
      ],
      showOverlay: false,
    };
  },
  methods: {
    showModal() {
      this.showOverlay = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
