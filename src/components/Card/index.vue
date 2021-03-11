<template>
  <div class="card" :class="{isActive: isActive}">
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
import negara from '@/const/country';
import { mapState } from 'vuex';

export default {
  name: 'card',
  props: {
    del: Object,
    desc: String,
    prgrs: {
      type: [String, Number],
    },
    color: {
      type: String,
      default: '#5F78FF',
    },
    active: Boolean, // timer
    isActive: Boolean, // current
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
        if (this.del.yield && this.$route.name === 'GSL') {
          this.dsc = `${this.cardTime} sec → ${this.delYield}`;
        } else {
          this.dsc = `${this.cardTime} sec`;
        }
      } else {
        this.dsc = this.desc;
      }

      this.clr = this.color;

      if (this.prgrs === 'presence' && this.del.status.toLowerCase() === 'n/a') {
        this.progress = 0;
      } else if (this.prgrs === 'presence' && this.del.status.toLowerCase() !== 'n/a') {
        this.progress = 100;
        if (this.del.status.toLowerCase() === 'not present') {
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
    cardTime: {
      handler() {
        // TODO: max to 100 not 125 with rounding
        this.progress = Math.min(Math.max((this.cardTime / this.time_start) * 100, 0), 125);
        if (this.delYield && this.$route.name === 'GSL') {
          this.dsc = `${this.cardTime} sec → ${this.delYield}`;
        } else {
          this.dsc = `${this.cardTime} sec`;
        }
        this.pos();
      },
      immediate: true,
    },
    delYield() {
      if (this.delYield && this.$route.name === 'GSL') {
        this.dsc = `${this.cardTime} sec → ${this.delYield}`;
      } else {
        this.dsc = `${this.cardTime} sec`;
      }
    },
    del: {
      handler() {
        this.defaults();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      gslList: (state) => state.Delegates.gslList,
      caucusList: (state) => state.Delegates.caucusList,
      timer: (state) => state.Socket.message.time,
      session: (state) => state.Socket.message.session,
      status: (state) => state.Socket.message.state,
      order: (state) => state.Socket.message.order,
    }),
    cardTime() {
      if (this.isActive && this.session === this.$route.name?.toLowerCase()
      && this.order === this.number) {
        return this.timer;
      }
      return this.time_left;
    },
    time_start() {
      if (this.$route.name === 'GSL') return this.gslList[this.number].time_start;
      return this.caucusList[this.number].time_start;
    },
    time_left() {
      if (this.$route.name === 'GSL') return this.gslList[this.number].time_left;
      return this.caucusList[this.number].time_left;
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
@import './index.scss';
</style>
