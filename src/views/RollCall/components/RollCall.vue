<template>
  <div id='rollcall'>
      <a id='close'><font-awesome-icon :icon="['fas', 'times']" size="lg" /></a>
      <h2>Roll Call</h2>
      <h3>Countries</h3>
    <div id='selection'>
    <button @click='counter'>
      <p>Present</p>
    </button>
    <button @click='counter'>
      <p>Present<br>&amp; Voting</p>
    </button>
    <button @click='counter' id='notPresent'>
      <p>Not Present</p>
    </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      voteCount: 0,
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
