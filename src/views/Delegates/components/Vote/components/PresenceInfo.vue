<template>
  <div id="flex">
    <div class="row">
      <h3>Present</h3>
      <span class="delegates-row">
        <h2>{{ info.Present }}</h2><p>&nbsp;delegates</p>
      </span>
    </div>
    <div class="row">
      <h3>Present &amp; Voting</h3>
      <span class="delegates-row">
        <h2>{{ info['Present & Voting'] }}</h2><p>&nbsp;delegates</p>
      </span>
    </div>
    <div class="row">
      <h3>Total Present</h3>
      <span class="delegates-row">
        <h2>{{ info['Total Present'] }}</h2><p>&nbsp;delegates</p>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    info: Object,
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './PresenceInfo.scss';
</style>
