<template>
  <div id='modal'>
      <RollCall v-on="$listeners" :key="1" v-if="stage === 1" />
      <Vote v-on="$listeners" :key="2" v-else-if="stage === 2" />
      <Pass v-on="$listeners" :key="3" v-else-if='stage === 3' />
  </div>
</template>

<script>
import RollCall from './components/RollCall.vue';
import Vote from './components/Vote.vue';
import Pass from './components/Pass.vue';

export default {
  name: 'RollCallModal',
  components: {
    RollCall,
    Vote,
    Pass,
  },
  data() {
    return {
      stage: 1,
    };
  },
  mounted() {
    this.$on('stage', (i) => {
      this.stage = i;
    });
    document.querySelector('body').style.cssText = 'height: 100vh; width: 100vw; overflow: hidden;';
  },
  destroyed() {
    document.querySelector('body').removeAttributes('height', 'width', 'overflow');
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
