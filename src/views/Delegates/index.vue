<template>
  <div class="delegates">
    <div class="delegates-upper">
      <h1 class="title">Delegates</h1>
      <div class="delegates-button">
        <button class="button" @click="showModal">Roll Call</button>
        <div class="button">
          <input
            v-model="newCountry"
            type="text"
            placeholder="add country..."
            :class="{show: showInput == true}"
          />
          <font-awesome-icon :icon="['fas', 'plus']" @click="toggleInput"/>
        </div>
      </div>
    </div>
    <div class="delegates-table">
      <div class="table">
        <div class="title">
          <p class="title-name">Name</p>
          <p class="title-presence">Presence</p>
        </div>
        <div class="content">
          <div class="table-data">
            <div v-for="(data, index) in delegates" :key="index" class="data">
              <p class="name" @mouseover="hoverable = index" @mouseleave="hoverable = null">
                <img :src="require('@/assets/img/' + data.flag)" :alt="data.name" class="img"/>
                {{data.name}}
                <span :class="{show: hoverable == index}">
                  <font-awesome-icon :icon="['fas', 'trash-alt']" />
                </span>
              </p>
              <p class="presence">{{data.presence}}</p>
            </div>
          </div>
          <div class="info">
            <div class="info-data" v-for="(value, key) in info" :key="key">
              <p class="title emphasize">{{ key }}</p>
              <p class="data"><b class="emphasize">{{ value }}</b> Delegates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="overlay" v-if="showOverlay"></div>
    <modal v-if="showOverlay"></modal>
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
      info: {
        Present: 6,
        'Present & Voting': 2,
        'Total Present': 8,
        'DR Sponsors': 3,
      },
      showOverlay: false,
      hoverable: null,
      showInput: false,
      newCountry: '',
    };
  },
  methods: {
    showModal() {
      this.showOverlay = true;
    },
    toggleInput() {
      this.showInput = !this.showInput;
      this.newCountry = '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
