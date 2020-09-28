<template>
  <div class="card" :class="{min: min}">
    <p class='desc' v-if="dsc">{{ dsc }}</p>
    <div class="country">
      <img :src="`https://www.countryflags.io/${country}/flat/64.png`" :alt="this.cntry.name" class="img" />
      <h1>{{ this.cntry.short }}</h1>
    </div>
    <span v-if="sec" class="time">
      <p>{{ sec }}sec</p>
      <span v-if="yieldTo">
        <font-awesome-icon :icon="['fas', 'arrow-right']" size="s" />
        <p>{{ yieldTo }}</p>
      </span>
    </span>
    <div class="progress" :style="{ width: prgrs + '%' }" />
  </div>
</template>

<script>
export default {
  name: 'card',
  props: {
    country: String,
    minimized: Boolean,
    time: Number,
    yieldTo: String,
    desc: String,
    progress: Number,
  },
  data() {
    return {
      min: this.minimized,
      sec: this.time,
      prgrs: this.progress,
      dsc: this.desc,
    };
  },
  methods: {
    pos() {
      if (!this.sec) {
        const country = document.querySelectorAll('.min.card .country');
        for (let i = 0; i < country.length; i += 1) {
          country[i].style.cssText = 'right: -35%; transform: translate(0, 0) scale(0.3)';
        }
      }
    },
  },
  watch: {
    sec() {
      this.pos();
    },
  },
  mounted() {
    this.pos();
  },
  created() {
    this.$nextTick(() => {
      if (!this.minimized) {
        this.min = false;
      }
      if (!this.progress) {
        this.prgrs = 0;
      }
      if (this.desc === 'presence') {
        this.dsc = this.cntry.presence;
      }
    });
  },
  computed: {
    cntry() {
      return this.$store.state.delegates.find((obj) => obj.id === this.country);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
