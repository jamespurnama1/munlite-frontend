<template>
  <div class="card">
    <p class="desc" v-if="dsc && progress !== 100">{{ dsc }}</p>
    <div class="country" v-if="progress !== 100">
      <span :class="`flag-icon img flag-icon-${countryId(del.country).toLowerCase()}`" />
      <h1>{{ countryShort(del.country) }}</h1>
    </div>
    <div
      class="progress"
      :style="`clip-path: inset(0 ${-progress + 100}% 0 0);
                border: 1px solid ${clr};
                background-color: ${clr}`">
      <p class="desc" v-if="dsc">{{ dsc }}</p>
      <div class="country">
        <span :class="`flag-icon img flag-icon-${countryId(del.country).toLowerCase()}`" />
        <h1>{{ countryShort(del.country) }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { negara } from '@/const/country';

export default {
  name: 'card',
  props: {
    del: Object,
    time: Number,
    desc: String,
    prgrs: {
      type: [String, Number],
    },
    color: String,
    active: Boolean,
    isActive: Boolean,
  },
  data() {
    return {
      sec: this.time,
      progress: this.prgrs,
      dsc: null,
      clr: null,
      int: null,
    };
  },
  methods: {
    pos() {
      if (!this.time) {
        const country = document.querySelectorAll('.max.card .country');
        for (let i = 0; i < country.length; i += 1) {
          country[i].style.cssText = 'right: -35%; transform: translate(0, 0) scale(0.3)';
        }
      }
    },
    defaults() {
      if (this.desc === 'presence') {
        this.dsc = this.del.status;
      } else if (this.time) {
        if (this.del.yield) {
          this.dsc = `${this.sec} sec → ${this.del.yield}`;
        } else {
          this.dsc = `${this.sec} sec`;
        }
      } else {
        this.dsc = this.desc;
      }

      if (!this.color) {
        this.clr = '#5F78FF';
      } else {
        this.clr = this.color;
      }
      if (this.prgrs === 'presence' && this.del.status.toLowerCase() === 'n/a') {
        this.progress = 0;
      } else if (this.prgrs === 'presence' && this.del.status.toLowerCase() !== 'n/a') {
        this.progress = 100;
        if (this.del.status.toLowerCase() === 'not present' && !this.color) {
          this.clr = '#FF5F5F';
        } else {
          this.clr = '#5F78FF';
        }
      } else if (!this.prgrs && !this.time) {
        this.progress = 0;
      }
    },
    countryId(name) {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    countryShort(name) {
      const short = name.substring(0, 3).toUpperCase();
      return short;
    },
    async timer() {
      await this.$nextTick();
      if (this.time && this.isActive && this.sec > 0 && this.active) {
        if (!this.int) {
          this.int = setInterval(() => {
            this.sec -= 1;
          }, 1000);
        }
      } else {
        clearInterval(this.int);
        this.int = null;
      }
    },
  },
  watch: {
    time() {
      this.pos();
    },
    sec() {
      this.progress = Math.min(Math.max((this.sec / this.time) * 100, 0), 125);
    },
    del: {
      handler: 'defaults',
      deep: true,
    },
    isActive() {
      this.timer();
    },
    active() {
      this.timer();
    },
  },
  mounted() {
    this.pos();
    this.sec = this.time;
    this.timer();
  },
  created() {
    this.$nextTick(() => {
      this.defaults();
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
@import "./index.scss";
</style>
