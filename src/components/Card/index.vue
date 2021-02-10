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
import { mapState } from 'vuex';

export default {
  name: 'card',
  props: {
    del: Object,
    desc: String,
    prgrs: {
      type: [String, Number],
      default: 100,
    },
    color: {
      type: String,
      default: '#5F78FF',
    },
    active: Boolean,
    isActive: Boolean,
    number: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      progress: this.prgrs,
      dsc: null,
      clr: null,
      int: null,
    };
  },
  methods: {
    pos() {
      if (!this.time_left) {
        const country = document.querySelectorAll('.max.card .country');
        for (let i = 0; i < country.length; i += 1) {
          country[i].style.cssText = 'right: -35%; transform: translate(0, 0) scale(0.3)';
        }
      }
    },
    defaults() {
      if (this.desc === 'presence') {
        this.dsc = this.del.status;
      } else if (this.time_left) {
        if (this.del.yield) {
          this.dsc = `${this.time_left} sec → ${this.delYield}`;
        } else {
          this.dsc = `${this.time_left} sec`;
        }
      } else {
        this.dsc = this.desc;
      }

      this.clr = this.color;

      if (this.prgrs === 'presence' && this.del.status.toLowerCase() === 'n/a') {
        this.progress = 0;
      } else if (this.prgrs === 'presence' && this.del.status.toLowerCase() !== 'n/a') {
        this.progress = 100;
        if (this.del.status.toLowerCase() === 'not present' && !this.color) {
          this.clr = '#FF5F5F';
        }
      } else if (!this.prgrs && !this.time_left) {
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
  },
  watch: {
    time_left: {
      // eslint-disable-next-line object-shorthand
      handler() {
        this.progress = Math.min(Math.max((this.time_left / this.time_start) * 100, 0), 125);
        this.pos();
      },
      immediate: true,
    },
    delYield() {
      this.dsc = `${this.time_left} sec → ${this.delYield}`;
    },
  },
  computed: {
    ...mapState({
      gslList: (state) => state.Delegates.gslList,
    }),
    time_start() {
      return this.gslList[this.number].time_start;
    },
    time_left() {
      return this.gslList[this.number].time_left;
    },
    delYield() {
      return this.gslList[this.number].yield;
    },
  },
  mounted() {
    this.pos();
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
