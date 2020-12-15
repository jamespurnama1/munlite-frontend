<template>
  <div class="stackOverflow" v-touch:swipe="swipe">
    <ul class="stack-cards js-stack-cards">
      <li v-for="(del, i) in $store.state.delegates" :key="i"
      class="stack-cards__item js-stack-cards__item">
        <Card
        @click.native="click(i)"
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
      count: 0,
      prevCount: 0,
      stacks: 3,
      stackHeight: 75,
      tl: gsap.timeline({ defaults: { duration: 0.01, ease: 'power2.out' }, paused: true }),
    };
  },
  methods: {
    sort() {
      this.activEl = document.querySelector('.active');
      this.card.forEach((i, j) => {
        if (this.$store.state.active > j) { // cards before active
          this.tl.to(this.card[j], {
            zIndex: j,
            duration: 0.1,
          }, '<-1');
          if (this.$store.state.active - this.stacks < j) { // 2 or 3 cards before active
            this.tl.to(this.card[j], {
              y: `${-3 * (this.$store.state.active - j)}rem`,
              scale: 1 - (0.05 * (this.$store.state.active - j)),
            });
          } else {
            this.tl.to(this.card[j], {
              y: `-${this.stackHeight}rem`,
              scale: 0.85,
            });
          }
          this.card[j].classList.remove('bottom');
          this.card[j].classList.add('top');
        } else if (this.$store.state.active < j) { // cards after active
          this.tl.to(this.card[j], {
            zIndex: this.card.length - j,
            duration: 0.1,
          }, '<-1');
          if (this.$store.state.active + this.stacks > j) { // 2 or 3 cards after active
            this.tl.to(this.card[j], {
              y: `${3 * (j - this.$store.state.active)}rem`,
              scale: 1 - (0.05 * (j - this.$store.state.active)),
            });
          } else {
            this.tl.to(this.card[j], {
              y: `${this.stackHeight}rem`,
              scale: 0.85,
            });
          }
          this.card[j].classList.remove('top');
          this.card[j].classList.add('bottom');
        } else if (this.$store.state.active === j) { // active card
          this.card[j].classList.remove('top');
          this.card[j].classList.remove('bottom');
          this.tl.to(this.activEl, {
            zIndex: this.card.length,
            duration: 0.1,
          }, '<-1')
            .to(this.activEl, {
              y: 0,
              ease: 'ease',
            });
        }
        // console.table(this.tl.getChildren().map((x) => x.vars));
      });
    },
    checkWidth() {
      if (this.width < 600) {
        this.stacks = 2;
        this.stackHeight = 6;
      } else if (this.width > 600) {
        this.stacks = 3;
        this.stackHeight = 9;
      }
    },
    move(e) {
      if (e.deltaY > 0) {
        this.$store.commit('active', 1);
      } else if (e.deltaY < 0) {
        this.$store.commit('active', -1);
      }
    },
    swipe(direction) {
      if (direction === 'top' && this.$store.state.active < this.$store.state.delegates.length) {
        this.$store.commit('active', 1);
      } else if (direction === 'bottom' && this.$store.state.active !== 0) {
        this.$store.commit('active', -1);
      }
    },
    click(i) {
      const j = this.$store.state.active - i;
      this.$store.commit('active', -j);
    },
  },
  mounted() {
    this.card = document.getElementsByClassName('stack-cards__item');
    this.card[this.$store.state.active].classList.add('active');
    this.checkWidth();
    this.sort();
    document.querySelector('.stackOverflow').onwheel = debounce(this.move, 100, true);
    this.tl.play();
  },
  computed: {
    countStore() {
      return this.$store.state.active;
    },
    width() {
      return this.$store.state.widthWindow;
    },
  },
  watch: {
    countStore() {
      this.prevCount = this.count;
      this.count = this.countStore;
    },
    count() {
      if (document.querySelector('.active') != null) {
        this.activEl = document.querySelector('.active');
        this.activEl.classList.remove('active');
      }
      this.card[this.$store.state.active].classList.add('active');
      this.sort();
      this.tl.play();
    },
    width() {
      this.checkWidth();
      this.sort();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
