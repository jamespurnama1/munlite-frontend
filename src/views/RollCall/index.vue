<template>
  <div id='modal'>
    <transition-group tag="tbody" name='fade'>
      <RollCall :key="1" v-if="stage === 1" />
      <Vote :key="2" v-else-if="stage === 2" />
      <Pass :key="3" v-else-if='stage === 3' />
    </transition-group>
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
