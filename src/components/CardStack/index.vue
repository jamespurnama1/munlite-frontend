<template>
<div class="stackOverflow">
  <ul class="stack-cards js-stack-cards">
    <li v-for="(del, i) in $store.state.delegates" :key="i"
    class="stack-cards__item js-stack-cards__item">
      <Card
      :country="del.id"
      :desc="desc"
      :color="color"
      :yieldTo='yieldTo'
      :time="time"
      :progress="prgrs" />
    </li>
  </ul>
</div>
</template>

<script>
import { ScrollScene } from 'scrollscene';
import { gsap } from 'gsap';
import Card from '@/components/Card/index.vue';

export default {
  name: 'CardStack',
  props: {
    active: {
      type: Number,
      required: true,
    },
    color: String,
    prgrs: {
      type: [String, Number],
    },
    desc: String,
    yieldTo: String,
    time: Number,
  },
  components: {
    Card,
  },
  data() {
    return {
      card: null,
      topPos: null,
      topCards: null,
      activ: null,
      prevActive: 0,
      tl: gsap.timeline({ paused: true }),
    };
  },
  mounted() {
    this.card = document.getElementsByClassName('stack-cards__item');
    this.card[this.active].classList.add('active');
    this.activ = document.querySelector('.active');
    this.topPos = 0;

    this.card.forEach((i, j) => {
      this.card[j].style.cssText = `top: ${-25 + (5 * j)}%`;
    });

    const wrap = document.querySelector('.stackOverflow');
    // eslint-disable-next-line no-unused-vars
    const scrollScene = new ScrollScene({
      triggerElement: this.card[0],
      gsap: {
        timeline: this.tl,
      },
      triggerHook: 0,
      duration: 500,
      useGlobalController: false,
      controller: {
        container: wrap,
      },
    });

    this.topCards = Array.from(this.card).slice(3, this.card.length);
    this.tl.to(this.topCards, {
      top: '-=25%',
    });
  },
  watch: {
    active() {
      this.activ = document.querySelector('.active');
      if (this.active !== this.card.length) {
        this.activ.classList.remove('active');
        // this.card[this.active - 1].classList.remove('active');
        // this.card[this.active + 1].classList.remove('active');
      }
      if (this.active > this.prevActive) {
        this.topPos += this.activ.offsetHeight;
      } else if (this.active < this.prevActive) {
        this.topPos -= this.activ.offsetHeight;
      }
      this.prevActive = this.active;
      this.card[this.active].classList.add('active');
      document.querySelector('.stackOverflow').scrollTop = this.topPos;
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss'
</style>
