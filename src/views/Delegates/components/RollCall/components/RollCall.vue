<template>
  <div id='rollcall'>
      <a @click="$emit('no-modal')" id='close'>
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </a>
      <h2>Roll Call</h2>
      <h3>Countries</h3>
      <div id='call'>
      <vue-card-stack
      :cards="cards"
      :card-height="250"
      :card-width="360">
      <template v-slot:card="{ card }" >
        <div
        style="width: 100%; height: 100%; border-radius: 20px"
        :style="{ background: card.background }">
        <!-- {{ $store.state.delegates.name }} -->
        </div>
      </template>
    </vue-card-stack>
      <div id='selection'>
        <button @click="counter(); $store.commit('present')">
          <p>Present</p>
        </button>
        <button @click="counter(); $store.commit('presentVoting')">
          <p>Present<br>&amp; Voting</p>
        </button>
        <button @click="counter" id="notPresent">
          <p>Not Present</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCardStack from 'vue-card-stack';

export default {
  components: {
    VueCardStack,
  },
  data() {
    return {
      voteCount: 0,
      cards: [
        { background: '#00659d' },
        { background: '#00abbc' },
        { background: '#e2c58a' },
        { background: '#fc8890' },
        { background: '#b35d7f' },
      ],
    };
  },
  methods: {
    counter() {
      this.voteCount += 1;
    },
  },
  watch: {
    voteCount() {
      if (this.voteCount === this.$store.state.delegates.length) {
        this.$parent.$emit('stage', 2);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './RollCall.scss'
</style>
