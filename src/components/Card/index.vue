<template>
  <div class="card">
    <p class="desc" v-if="dsc">{{ dsc }}</p>
    <div class="country">
      <img
        :src="`https://www.countryflags.io/${country}/flat/64.png`"
        :alt="this.cntry.name"
        class="img"
      />
      <h1>{{ this.cntry.short }}</h1>
    </div>
    <span v-if="sec" class="time">
      <p>{{ sec }}sec</p>
      <span v-if="yieldTo">
        <font-awesome-icon :icon="['fas', 'arrow-right']" size="s" />
        <p>{{ yieldTo }}</p>
      </span>
    </span>
    <div
      class="progress"
      :style="'clip-path: inset(0 ' + (-prgrs + 100) + '% 0 0); background-color:' + clr">
      <p class="desc" v-if="dsc">{{ dsc }}</p>
      <div class="country">
        <img
          :src="`https://www.countryflags.io/${country}/flat/64.png`"
          :alt="this.cntry.name"
          class="img"
        />
        <h1>{{ this.cntry.short }}</h1>
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
export default {
  name: 'card',
  props: {
    country: String,
    time: Number,
    yieldTo: String,
    desc: String,
    progress: {
      type: [String, Number],
    },
    color: String,
  },
  data() {
    return {
      sec: this.time,
      prgrs: this.progress,
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
      if (!this.minimized) {
        this.min = false;
      }

      if (this.desc === 'presence') {
        this.dsc = this.cntry.presence;
      } else {
        this.dsc = this.desc;
      }

      if (!this.color) {
        this.clr = '#5F78FF';
      } else {
        this.clr = this.color;
      }

      if (this.progress === 'presence' && this.cntry.presence === 'N/A') {
        this.prgrs = 0;
      } else if (this.progress === 'presence' && this.cntry.presence !== 'N/A' && !this.color) {
        this.prgrs = 100;
        if (this.cntry.presence === 'Not Present') {
          this.clr = '#FF5F5F';
        } else {
          this.clr = '#5F78FF';
        }
      } else if (!this.progress && !this.time) {
        this.prgrs = 0;
      }
    },
  },
  watch: {
    time() {
      this.pos();
    },
    sec() {
      this.prgrs = (this.sec / this.time) * 100;
    },
    cntry: {
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
    cntry() {
      return this.$store.state.delegates.find((obj) => obj.id === this.country);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
@import "./index.scss";
</style>
