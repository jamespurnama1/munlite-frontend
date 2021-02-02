<template>
  <div class="stackOverflow"
  v-shortkey="{up: ['arrowup'], down: ['arrowdown']}"
  @shortkey="keymap"
  v-touch:swipe="swipe">
    <ul class="stack-cards js-stack-cards">
      <li v-for="(delegate, i) in delegates" :key="i"
      class="stack-cards__item js-stack-cards__item" :class="{active: i === active}">
        <Card
        @click.native="click(i)"
        :del="delegates[i]"
        :desc="desc"
        :color="color"
        :yieldTo="yieldTo"
        :time="time"
        :prgrs="progress"
        :active="isActive" />
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
    progress: {
      type: [String, Number],
    },
    desc: String,
    yieldTo: String,
    time: Number,
    delegates: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
    },
  },
  components: {
    Card,
  },
  data() {
    return {
      card: null,
      stacks: 3,
      stackHeight: 75,
      tl: gsap.timeline({ defaults: { duration: 0.01, ease: 'power2.out' } }),
    };
  },
  methods: {
    sort() {
      this.card.forEach((i, j) => {
        if (this.active > j) { // cards before active
          this.tl.to(this.card[j], {
            zIndex: j,
            duration: 0.1,
          }, '<-1');
          if (this.active - this.stacks < j) { // 2 or 3 cards before active
            this.tl.to(this.card[j], {
              y: `-${3 * (this.active - j)}em`,
              x: 0,
              scale: 1 - (0.05 * (this.active - j)),
            });
          } else {
            this.tl.to(this.card[j], {
              y: `-${this.stackHeight}em`,
              x: 0,
              scale: 0.85,
            });
          }
          this.card[j].classList.remove('bottom');
          this.card[j].classList.add('top');
        } else if (this.active < j) { // cards after active
          this.tl.to(this.card[j], {
            zIndex: this.card.length - j,
            duration: 0.1,
          }, '<-1');
          if (this.active + this.stacks > j) { // 2 or 3 cards after active
            this.tl.to(this.card[j], {
              y: `${3 * (j - this.active)}em`,
              x: 0,
              scale: 1 - (0.05 * (j - this.active)),
            });
          } else {
            this.tl.to(this.card[j], {
              y: `${this.stackHeight}em`,
              x: 0,
              scale: 0.85,
            });
          }
          this.card[j].classList.remove('top');
          this.card[j].classList.add('bottom');
        } else if (this.active === j) { // active card
          this.card[j].classList.remove('top');
          this.card[j].classList.remove('bottom');
          this.tl.to(this.card[this.active], {
            zIndex: this.card.length,
            duration: 0.1,
          }, '<-1')
            .to(this.card[this.active], {
              y: 0,
              ease: 'ease',
            });
        }
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
    scroll(e) {
      if (e.deltaY > 0) {
        this.goNext();
      } else if (e.deltaY < 0) {
        this.goPrev();
      }
    },
    swipe(direction) {
      if (direction === 'top' && this.active < this.delegates.length) {
        this.goNext();
      } else if (direction === 'bottom' && this.active !== 0) {
        this.goPrev();
      }
    },
    click(i) {
      this.$emit('move', i);
    },
    keymap(event) {
      switch (event.srcKey) {
        case 'up':
          this.goPrev();
          break;
        case 'down':
          this.goNext();
          break;
        default:
          console.error(event);
          break;
      }
    },
    goPrev() {
      this.$emit('move', this.active - 1);
    },
    goNext() {
      this.$emit('move', this.active + 1);
    },
  },
  mounted() {
    this.card = document.getElementsByClassName('stack-cards__item');
    this.checkWidth();
    this.sort();
    document.querySelector('.stackOverflow').onwheel = debounce(this.scroll, 50, true);
  },
  computed: {
    width() {
      return this.$store.state.widthWindow;
    },
  },
  watch: {
    active() {
      this.sort();
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
