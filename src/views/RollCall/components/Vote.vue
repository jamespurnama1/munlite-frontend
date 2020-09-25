<template>
  <div id='rollcall'>
      <a id='close'><font-awesome-icon :icon="['fas', 'times']" /></a>
      <h2>Roll Call</h2>
      <h3>Voting</h3>
      <div>
        <input type="number" v-model='yes'>
        <h3>Yes</h3>
        <input type="number" v-model='no'>
        <h3>No</h3>
      </div>
    <button v-if="vote">
      <p>Re-run</p>
    </button>
    <button v-else>
      <p>Pass</p>
    </button>
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './RollCall.scss'
</style>
