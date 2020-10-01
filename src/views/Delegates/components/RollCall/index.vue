<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('no-modal-warn')" id='close'>
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <h3>Countries</h3>
    <div id='call'>
      <CardStack :voteCount="voteCount" prgrs="presence" />
      <div id='selection'>
        <button @click="presence('Present')">
          <p>Present</p>
        </button>
        <button @click="presence('Present & Voting')">
          <p>Present<br>&amp; Voting</p>
        </button>
        <button @click="presence('Not Present')" id="notPresent">
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
  data() {
    return {
      voteCount: 0,
    };
  },
  methods: {
    presence(j) {
      const i = this.voteCount;
      this.$store.commit('presence', { i, j });
      this.voteCount += 1;
      if (j === 'Present') {
        this.$store.commit('present');
      } else if (j === 'Present & Voting') {
        this.$store.commit('presentVoting');
      }
    },
  },
  watch: {
    voteCount() {
      if (this.voteCount === this.$store.state.delegates.length) {
        setTimeout(() => {
          this.$parent.$emit('stage', 2);
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
