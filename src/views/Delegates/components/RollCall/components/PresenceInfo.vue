<template>
    <div id="flex">
          <h3>Present</h3>
          <span class="delegates">
            <h2>{{ $store.state.info.Present }}</h2><p>&nbsp;delegates</p>
          </span>
          <h3>Present &amp; Voting</h3>
          <span class="delegates">
            <h2>{{ $store.state.info['Present & Voting'] }}</h2><p>&nbsp;delegates</p>
          </span>
          <h3>Total Present</h3>
          <span class="delegates">
            <h2>{{ $store.state.info['Total Present'] }}</h2><p>&nbsp;delegates</p>
          </span>
        </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './PresenceInfo.scss';
</style>
