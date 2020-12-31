<template>
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
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './OtherInfo.scss';
</style>
