<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('stage', 0)" id='close'>
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h1>The Motion Passes!</h1>
    <h3>The debate is now open.</h3>
    <router-link :to="`/gsl/${$route.params.id}`">
      <button>
        Speakers List ({{ countdown }})
      </button>
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Pass',
  data() {
    return {
      countdown: 5 as number,
    };
  },
  methods: {
    countdownTimer(): void {
      if (this.countdown > 0) {
        const cd = setTimeout(() => {
          this.countdown -= 1;
          this.countdownTimer();
        }, 1000);
        this.$on('clear', () => {
          clearTimeout(cd);
        });
      }
    },
  },
  created() {
    this.countdownTimer();
  },
  beforeDestroy() {
    this.$emit('clear');
  },
  watch: {
    countdown() {
      if (this.countdown === 0) {
        (document.querySelector('body') as HTMLElement).style.removeProperty('height');
        (document.querySelector('body') as HTMLElement).style.removeProperty('width');
        (document.querySelector('body') as HTMLElement).style.removeProperty('overflow');
        this.$router.push(`/gsl/${this.$route.params.id}`).catch(() => {});
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
