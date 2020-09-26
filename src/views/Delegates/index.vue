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
            <div v-for="(data, index) in $store.state.delegates" :key="index" class="data">
              <p class="name" @mouseover="hoverable = index" @mouseleave="hoverable = null">
                <img :src="`https://www.countryflags.io/${data.id}/flat/64.png`" :alt="data.name" class="img"/>
                {{ data.name }}
                <span :class="{show: hoverable == index}">
                  <font-awesome-icon :icon="['fas', 'trash-alt']" />
                </span>
              </p>
              <p class="presence">{{ data.presence }}</p>
            </div>
          </div>
          <div class="info">
            <div class="info-data" v-for="(value, key) in $store.state.info" :key="key">
              <p class="title emphasize">{{ key }}</p>
              <p class="data"><b class="emphasize">{{ value }}</b> Delegates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="scale">
      <RollCall @no-modal="hideModal" v-if="showOverlay"></RollCall>
    </transition>
    <div class="overlay" v-if="showOverlay" />
  </div>
</template>

<script>
import RollCall from './components/RollCall/index.vue';

export default {
  name: 'Delegates',
  components: {
    RollCall,
  },
  data() {
    return {
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
    hideModal() {
      this.showOverlay = false;
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
