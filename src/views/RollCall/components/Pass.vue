<template>
  <div id='rollcall'>
      <a id='close'><font-awesome-icon :icon="['fas', 'times']" /></a>
      <h2>Roll Call</h2>
      <h3>Countries</h3>
    <div id='selection'>
    <button>
      <p>Present</p>
    </button>
    <button>
      <p>Present<br>&amp; Voting</p>
    </button>
    <button id='notPresent'>
      <p>Not Present</p>
    </button>
    </div>
    <div id='vote'>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './RollCall.scss'
</style>
