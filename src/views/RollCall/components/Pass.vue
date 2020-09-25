<template>
  <div id='rollcall'>
      <a id='close'><font-awesome-icon :icon="['fas', 'times']" size="lg" /></a>
      <h1>The Motion Passes!</h1>
      <h3>The debate is now open.</h3>
    <button>
      Speakers List ({{ countdown }})
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countdown: 5,
    };
  },
  methods: {
    countdownTimer() {
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown -= 1;
          this.countdownTimer();
        }, 1000);
      }
    },
  },
  created() {
    this.countdownTimer();
  },
  watch: {
    countdown() {
      if (this.countdown === 0) {
        this.$router.push('/gsl');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './Pass.scss'
</style>
