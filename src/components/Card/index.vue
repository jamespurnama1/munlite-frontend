<template>
  <div class="card">
    <p class="desc" v-if="dsc && progress !== 100">{{ dsc }}</p>
    <div class="country" v-if="progress !== 100">
      <img
        :src="`https://www.countryflags.io/${countryId(del.country)}/flat/64.png`"
        :alt="del.country"
        class="img"
      />
      <h1>{{ countryShort(del.country) }}</h1>
    </div>
    <span v-if="sec && progress !== 100" class="time">
      <p>{{ sec }}sec</p>
      <span v-if="yieldTo">
        <font-awesome-icon :icon="['fas', 'arrow-right']" size="s" />
        <p>{{ yieldTo }}</p>
      </span>
    </span>
    <div
      class="progress"
      :style="'clip-path: inset(0 ' + (-progress + 100) + '% 0 0); border: 1px solid' + clr +
      '; background-color:' + clr">
      <p class="desc" v-if="dsc">{{ dsc }}</p>
      <div class="country">
        <img
          :src="`https://www.countryflags.io/${countryId(del.country)}/flat/64.png`"
          :alt="del.country"
          class="img"
        />
        <h1>{{ countryShort(del.country) }}</h1>
      </div>
      <span v-if="sec" class="time">
        <p>{{ sec }}sec</p>
        <span v-if="yieldTo">
          <font-awesome-icon :icon="['fas', 'arrow-right']" size="s" />
          <p>{{ yieldTo }}</p>
        </span>
      </span>
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
    yieldTo: String,
    desc: String,
    prgrs: {
      type: [String, Number],
    },
    color: String,
  },
  data() {
    return {
      sec: this.time,
      progress: this.prgrs,
      dsc: null,
      clr: null,
      isActive: null,
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
  },
  watch: {
    time() {
      this.pos();
    },
    sec() {
      this.progress = (this.sec / this.time) * 100;
    },
    del: {
      handler: 'defaults',
      deep: true,
    },
    isActive() {
      let int;
      if (this.time && this.isActive) {
        int = setInterval(() => {
          this.sec -= 1;
        }, 1000);
      } else {
        clearInterval(int);
      }
    },
  },
  mounted() {
    this.pos();
    this.sec = this.time;
    this.$nextTick(() => {
      this.isActive = this.$el.parentElement.classList.contains('active');
    });
  },
  created() {
    this.$nextTick(() => {
      this.defaults();
    });
  },
  computed: {
    // cntry() {
    //   return this.$store.state.delegates.find((obj) => obj.id === this.country);
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
@import "./index.scss";
</style>
