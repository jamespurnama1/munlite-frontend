<template>
  <hooper id="sliderCard" @slide="move" ref="carousel">
    <slide
      class="card"
      v-for="(del, i) in delegatesData"
      :key="i"
      :class="{white : del.status !== 'N/A'}"
    >
      <p class="desc">{{ countryDesc(del.status) }}</p>
      <div class="country">
        <span :class="`flag-icon img flag-icon-${countryId(del.country).toLowerCase()}`" />
        <h1>{{ countryShort(del.country) }}</h1>
      </div>
      <div class="progress" :class="color(del.status)"></div>
    </slide>

    <hooper-navigation slot="hooper-addons"></hooper-navigation>
    <hooper-pagination slot="hooper-addons" mode="fraction"></hooper-pagination>
  </hooper>
</template>

<script>
import { negara } from '@/const/country';
import {
  Hooper,
  Slide,
  Pagination as HooperPagination,
  Navigation as HooperNavigation,
} from 'hooper';
import 'hooper/dist/hooper.css';

export default {
  components: {
    Hooper,
    Slide,
    HooperPagination,
    HooperNavigation,
  },
  props: {
    active: {
      type: Number,
      required: true,
    },
    current: Number,
    delegatesData: Array,
  },
  methods: {
    move(payload) {
      this.$emit('move', payload.currentSlide);
    },
    countryDesc(presence) {
      return presence === 'N/A' ? '' : presence;
    },
    countryShort(name) {
      const short = name.substring(0, 3).toUpperCase();
      return short;
    },
    countryId(name) {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    color(presence) {
      if (presence.toLowerCase() === 'present' || presence.toLowerCase() === 'present & voting') {
        return 'blue';
      }

      if (presence.toLowerCase() === 'not present') {
        return 'red';
      }

      return '';
    },
    nextSlide() {
      setTimeout(() => { this.$refs.carousel.slideNext(); }, 850);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
