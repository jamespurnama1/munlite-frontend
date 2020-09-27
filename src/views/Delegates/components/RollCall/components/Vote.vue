<template>
  <div id="rollcall">
      <a @click="$emit('no-modal')" id="close">
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </a>
      <h2>Roll Call</h2>
      <h3>Voting</h3>
      <p v-if="$store.state.widthWindow < 600">Swipe to view more</p>
      <div class='info' v-if="$store.state.widthWindow > 600">
        <PresenceInfo />
        <div class="line" />
        <OtherInfo />
      </div>
      <div class='info' v-else>
        <carousel :data="infoSlide" :controls="false" indicators="hover" />
      </div>
      <p>Votes to open the debate</p>
      <div id="select">
        <div class="selection">
          <input class="input blue" type="number" min="0"
          :max="this.$store.state.delegates.length - this.no"
          v-model.number="yes">
          <h2 class="blue">Yes</h2>
        </div>
        <div class="selection">
          <input class="input red" type="number" min="0"
          :max="this.$store.state.delegates.length - this.yes"
          v-model.number="no">
          <h2 class="red">No</h2>
        </div>
        <div id="indicator" ref="indicator" />
      </div>
      <div id="verdict">
      <p v-if="left">{{ left }} countries left</p>
      <p v-else-if="!left">no countries left</p>
    <button id="rerun"
    :disabled="this.left !== 0"
    v-if="vote"
    @click="$parent.$emit('stage', 1);">
      Re-run
    </button>
    <button :disabled="this.left !== 0"
    v-else
    @click="$parent.$emit('stage', 3);">
      Pass
    </button>
      </div>
  </div>
</template>

<script>
import PresenceInfo from './PresenceInfo.vue';
import OtherInfo from './OtherInfo.vue';

export default {
  components: {
    PresenceInfo,
    OtherInfo,
  },
  data() {
    return {
      yes: 0,
      no: 0,
      infoSlide: [
        PresenceInfo,
        OtherInfo,
      ],
    };
  },
  computed: {
    vote() {
      if (this.no > this.yes) {
        return true;
      }
      return false;
    },
    left() {
      return this.$store.state.delegates.length - (this.yes + this.no);
    },
  },
  watch: {
    left() {
      if (this.vote && this.no !== this.yes) {
        this.$refs.indicator.style.cssText = 'opacity: 1; left: 55%; background-color: rgba(255,95,95,0.2);';
      } else if (!this.vote && this.no !== this.yes) {
        this.$refs.indicator.style.cssText = 'opacity: 1; left: 5%; background-color: rgba(95,120,255,0.2);';
      } else if (this.no === this.yes) {
        this.$refs.indicator.style.cssText = 'opacity: 0; left: 30%; background-color: rgba(255,255,255,0.2);';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './Vote.scss'
</style>
