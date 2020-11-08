<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('stage', 0)" id='close'>
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>The Motion Passes!</h2>
    <p>The debate is now open.</p>
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
        document.querySelector('body').style.removeProperty('height');
        document.querySelector('body').style.removeProperty('width');
        document.querySelector('body').style.removeProperty('overflow');
        this.$router.push('/gsl');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
