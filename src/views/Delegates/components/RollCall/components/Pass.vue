<template>
  <div id='rollcall'>
    <a @click="$emit('no-modal')" id='close'>
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h1>The Motion Passes!</h1>
    <h3>The debate is now open.</h3>
    <router-link to="/gsl">
      <button>
        Speakers List ({{ countdown }})
      </button>
    </router-link>
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
  beforeDestroyed() {
    this.$emit('clear');
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
