<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('no-modal-warn')" id='close'>
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <h3>Countries</h3>
    <div id='call'>
      <!-- <div class="cardList">
        <div v-for="(del, i) in $store.state.delegates" :key="i" class="cardWrapper">
          <Card
          :country="del.id"
          :desc="del.presence"
          :minimized="true"
          :progress="100"
          :time='60' />
        </div>
      </div> -->
      <CardStack :voteCount="voteCount" />
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
import CardStack from '@/components/CardStack/index.vue';

export default {
  components: {
    CardStack,
  },
  mixins: [
    // CardAnim,
  ],
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
@import './index.scss'
</style>
