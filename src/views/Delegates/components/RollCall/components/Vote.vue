<template>
  <div id="rollcall">
      <a @click="$emit('no-modal')" id="close">
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </a>
      <h2>Roll Call</h2>
      <h3>Voting</h3>
      <div id='info'>
        <div id="flex">
          <h3>Present</h3>
          <div class="delegates">
            <h2>{{ $store.state.info.Present }}</h2><p>&nbsp;delegates</p>
          </div>
          <h3>Present &amp; Voting</h3>
          <div class="delegates">
            <h2>{{ $store.state.info['Present & Voting'] }}</h2><p>&nbsp;delegates</p>
          </div>
          <h3>Total Present</h3>
          <div class="delegates">
            <h2>{{ $store.state.info['Total Present'] }}</h2><p>&nbsp;delegates</p>
          </div>
        </div>
        <div class="line" />
        <div id="grid">
          <div>
            <h3>Majority</h3>
            <div class="delegates">
              <h2>4</h2><p>&nbsp;delegates</p>
            </div>
          </div>
          <div>
            <h3>Quorum</h3>
            <div class="delegates">
              <h2>4</h2><p>&nbsp;delegates</p>
            </div>
          </div>
          <div>
            <h3>DR Sponsors</h3>
            <div class="delegates">
              <h2>{{ $store.state.info['DR Sponsors'] }}</h2><p>&nbsp;delegates</p>
            </div>
          </div>
          <div class="center">
            <h3>Rounding</h3>
            <font-awesome-icon :icon="['fas', 'arrow-up']" size="lg" />
          </div>
        </div>
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
export default {
  data() {
    return {
      yes: 0,
      no: 0,
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
      if (this.vote) {
        this.$refs.indicator.style.cssText = 'opacity: 1; transform: translate(53%); background-color: rgba(255,95,95,0.2);';
      } else if (!this.vote) {
        this.$refs.indicator.style.cssText = 'opacity: 1; transform: translate(-53%); background-color: rgba(95,120,255,0.2);';
      } else if (this.no === 0 && this.yes === 0) {
        this.$refs.indicator.style.cssText = 'opacity: 0; transform: translate(0); background-color: rgba(255,255,255,0.2);';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './Vote.scss'
</style>
