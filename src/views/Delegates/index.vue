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
    <transition name="fade">
      <div class="rollcall" v-if="showOverlay">
        <transition name="fade">
          <Warning :key="0" v-if='warning'
          title="Are You Sure?"
          desc="This will discard all current roll call &amp; voting progress." />
        </transition>
        <div class="overlay" v-if="warning" />
        <RollCall :key="1" v-if="stage === 1" />
        <Vote :key="2" v-else-if="stage === 2" />
        <Pass :key="3" v-else-if='stage === 3' />
      </div>
    </transition>
    <div class="overlay" v-if="showOverlay" />
  </div>
</template>

<script>
import Warning from '@/components/Warning/index.vue';
import RollCall from './components/RollCall/index.vue';
import Vote from './components/Vote/index.vue';
import Pass from './components/Pass/index.vue';

export default {
  name: 'Delegates',
  components: {
    RollCall,
    Warning,
    Vote,
    Pass,
  },
  data() {
    return {
      showOverlay: false,
      hoverable: null,
      showInput: false,
      newCountry: '',
      warning: false,
      stage: 0,
    };
  },
  methods: {
    showModal() {
      this.$store.commit('reset');
      this.showOverlay = true;
      this.stage = 1;
    },
    toggleInput() {
      this.showInput = !this.showInput;
      this.newCountry = '';
    },
  },
  watch: {
    stage() {
      if (this.stage > 0) {
        document.querySelector('body').style.cssText = 'height: 100vh; width: 100vw; overflow: hidden;';
      } else if (this.stage === 0) {
        document.querySelector('body').removeAttributes('height', 'width', 'overflow');
      }
    },
    warning() {
      if (this.warning === 'discard') {
        this.stage = 0;
        this.showOverlay = false;
        this.warning = false;
        this.$store.commit('reset');
      }
    },
  },
  mounted() {
    this.$on('stage', (i) => {
      if (i === 0) {
        this.showOverlay = false;
      }
      this.stage = i;
    });
    this.$on('no-modal-warn', () => {
      this.warning = true;
    });
    this.$on('confirm', (i) => {
      this.warning = i;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
