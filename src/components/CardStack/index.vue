<template>
  <div class="stackOverflow">
    <ul class="stack-cards js-stack-cards">
      <li v-for="(del, i) in $store.state.delegates" :key="i"
      class="stack-cards__item js-stack-cards__item">
        <Card
        :country="del.id"
        :desc="desc"
        :color="color"
        :yieldTo="yieldTo"
        :time="time"
        :progress="prgrs" />
      </li>
    </ul>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { debounce } from 'debounce';
import Card from '@/components/Card/index.vue';

export default {
  name: 'CardStack',
  props: {
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
      topCards: null,
      activEl: null,
      tl: gsap.timeline({ paused: true }),
    };
  },
  methods: {
    sort() {
      this.activEl = document.querySelector('.active');
      this.card.forEach((i, j) => {
        if (this.$store.state.active > j) { // cards before active
          if (this.$store.state.active - 3 < j) { // 3 cards before active
            gsap.to(this.card[j], {
              zIndex: j,
              y: `${-25 * (this.$store.state.active - j)}%`,
              scale: 1 - (0.05 * (this.$store.state.active - j)),
            });
          } else {
            gsap.to(this.card[j], {
              zIndex: j,
              y: '-75%',
              scale: 0.85,
            });
          }
          this.card[j].classList.add('top');
        } else if (this.$store.state.active < j) { // cards after active
          if (this.$store.state.active + 3 > j) { // 3 cards after active
            gsap.to(this.card[j], {
              zIndex: this.card.length - j,
              y: `${25 * (j - this.$store.state.active)}%`,
              scale: 1 - (0.05 * (j - this.$store.state.active)),
            });
          } else {
            gsap.to(this.card[j], {
              zIndex: this.card.length - j,
              y: '75%',
              scale: 0.85,
            });
          }
          this.card[j].classList.add('bottom');
        } else if (this.$store.state.active === j) { // active card
          this.card[j].classList.remove('top');
          this.card[j].classList.remove('bottom');
          gsap.to(this.activEl, {
            zIndex: this.card.length,
            y: 0,
            duration: '.5s',
            ease: 'ease',
          });
          this.activEl.style.cssText = `z-index: ${this.card.length}`;
        }
      });
    },
    move(e) {
      if (e.deltaY > 0) {
        this.$store.commit('active', 1);
      } else if (e.deltaY < 0) {
        this.$store.commit('active', -1);
      }
    },
  },
  mounted() {
    this.card = document.getElementsByClassName('stack-cards__item');
    this.card[this.$store.state.active].classList.add('active');
    this.sort();
    document.querySelector('.stackOverflow').onwheel = debounce(this.move, 100, true);
  },
  computed: {
    count() {
      return this.$store.state.active;
    },
  },
  watch: {
    count() {
      if (document.querySelector('.active') != null) {
        this.activEl = document.querySelector('.active');
        this.activEl.classList.remove('active');
      }
      this.card[this.$store.state.active].classList.add('active');
      this.sort();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
