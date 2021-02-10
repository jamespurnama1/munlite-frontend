<template>
  <div class="stackOverflow"
  v-dragscroll.y="true"
  v-shortkey="{up: ['arrowup'], down: ['arrowdown']}"
  @shortkey="keymap">
    <ul class="stack-cards">
      <li v-for="(delegate, i) in delegates"
      :key="i"
      @click="click(i)"
      :class="{
        active: i === display,
        top: i < display,
        bottom: i > display,
        }"
      v-on:contextmenu.prevent="rightClick(i)"
      class="stack-cards__item">
        <Card
        :del="delegate"
        :desc="desc"
        :color="color"
        :prgrs="progress"
        :number='i'
        :active="active"
        :isActive="i === isActive" />
      </li>
    </ul>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapState } from 'vuex';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'debounce';
import Card from '@/components/Card/index.vue';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'CardStack',
  props: {
    color: String,
    progress: {
      type: [String, Number],
    },
    desc: String,
    delegates: {
      type: Array,
      required: true,
    },
    isActive: {
      type: Number,
    },
    active: {
      type: Boolean,
    },
    display: {
      type: Number,
      required: true,
    },
  },
  components: {
    Card,
  },
  data() {
    return {
      // stacks: 3,
      // stackHeight: 75,
      cards: null,
      spacing: 0.1,
      snap: null,
      trigger: null,
      rawSequence: gsap.timeline({ paused: true }),
      scrub: null,
    };
  },
  methods: {
    checkWidth() {
      if (this.width < 600) {
        this.stacks = 2;
        this.stackHeight = 6;
      } else if (this.width > 600) {
        this.stacks = 3;
        this.stackHeight = 9;
      }
    },
    click(i) {
      this.$emit('move', i);
    },
    move(i) {
      if (this.current !== this.display) {
        this.scrubTo(this.rawSequence.labels[`label${i}`]);
      }
    },
    rightClick(del) {
      this.$emit('context', del);
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
      this.$emit('move', this.display - 1);
    },
    goNext() {
      this.$emit('move', this.display + 1);
    },
    scrubTo(totalTime) {
      const progress = (totalTime / this.rawSequence.duration()) * (this.cards.length * 100);
      this.trigger.scroll(progress);
    },
    buildSeamlessLoop(items, spacing) {
      const startTime = 1;
      const l = items.length;
      let time = 0;
      let index;
      let item;
      let i;
      gsap.set(items, { scale: 0.3 });
      for (i = 0; i < l; i += 1) {
        index = i % items.length;
        item = items[index];
        time = i * spacing;
        this.rawSequence.fromTo(item, {
          scale: 0.3,
          yPercent: '+=150',
        }, {
          scale: 1,
          zIndex: 100,
          duration: 0.5,
          yPercent: 0,
          ease: 'none',
        }, time)
          .to(item, {
            scale: 0.3,
            yPercent: '-=150',
            duration: 0.5,
            ease: 'none',
          }, time + 0.5);
        if (i <= items.length) {
          this.rawSequence.addLabel(`label${i}`, time + 0.5);
        }
      }
      this.rawSequence.time(startTime);
      return this.rawSequence;
    },
    addTween(items) {
      console.log('adding new items', items);
      let i = this.cards.length;
      let time = 0;
      let item;
      let index;
      const tl = gsap.timeline();
      for (i; i < items.length; i += 1) {
        index = i % items.length;
        item = items[index];
        time = i * this.spacing;
        tl.fromTo(item, {
          scale: 0.3,
          yPercent: '+=150',
        }, {
          scale: 1,
          zIndex: 100,
          duration: 0.5,
          yPercent: 0,
          ease: 'none',
        }, time)
          .to(item, {
            scale: 0.3,
            yPercent: '-=150',
            duration: 0.5,
            ease: 'none',
          }, time + 0.5);
        if (i <= items.length) {
          tl.addLabel(`label${i}`, time + 0.5);
        }
      }
      return tl;
    },
    addClass(item, str) {
      item.classList.add(str);
    },
    removeClass(item, str) {
      item.classList.remove(str);
    },
    timer(ms) {
      let id;
      const start = () => new Promise((resolve) => {
        if (id === -1) {
          throw new Error('Timer already aborted');
        }
        id = setTimeout(resolve, ms);
      });
      const abort = () => {
        if (id !== -1 || id === undefined) {
          clearTimeout(id);
          id = -1;
        }
      };

      return { start, abort };
    },
  },
  mounted() {
    this.cards = document.querySelectorAll('.stack-cards__item');
    this.snap = gsap.utils.snap(this.spacing);
    this.scrub = gsap.to(this.buildSeamlessLoop(this.cards, this.spacing), {
      totalTime: 0,
      duration: 0.5,
      ease: 'power3',
      paused: true,
    });
    this.trigger = ScrollTrigger.create({
      scroller: '.stackOverflow',
      pin: '.stack-cards',
      start: 0,
      end: `+=${this.cards.length * 100}`,
      onUpdate: ((self) => {
        const timer = this.timer(500);
        if (self.scroller.scrollTop < this.minMax[0]) {
          // eslint-disable-next-line no-param-reassign
          timer.start().then(() => { [self.scroller.scrollTop] = this.minMax; });
        } else if (self.scroller.scrollTop > this.minMax[1]) {
          // eslint-disable-next-line no-param-reassign
          timer.start().then(() => { [, self.scroller.scrollTop] = this.minMax; });
        } else {
          timer.abort();
          try {
            const v = (self.scroller.scrollTop * this.rawSequence.duration())
          / (this.cards.length * 100);
            const c = parseInt(Object.keys(this.rawSequence.labels)
              .find((key) => this.rawSequence.labels[key].toString() === v.toFixed(1))
              .replace(/\D/g, ''), 10);
            debounce(this.$store.commit('changeCurrent', c), 200, true);
            this.$emit('move', c);
          } catch (err) {
            // console.error(err); // ignore error as it is expected
          }
        }
        this.scrub.vars.totalTime = this.snap(self.progress * this.rawSequence.duration());
        this.scrub.invalidate().restart();
        // eslint-disable-next-line no-param-reassign
        self.wrapping = false;
      }),
    });
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      current: (state) => state.Global.current,
    }),
    minMax() {
      return [
        ((this.rawSequence.labels.label0 / this.rawSequence.duration())
        * (this.cards.length * 100)),
        ((this.rawSequence.labels[`label${this.cards.length - 1}`] / this.rawSequence.duration()) * (this.cards.length * 100)),
      ];
    },
  },
  watch: {
    display: {
      // eslint-disable-next-line object-shorthand, func-names
      handler: function () {
        this.move(this.display);
      },
      immediate: true,
    },
    delegates() {
      // console.log(this.delegates);
      // if (this.delegates) {
      //   const newItems = this.delegates;
      //   newItems.length = this.delegates.length - this.card.length;
      //   this.rawSequence.add(this.addTween(newItems));
      // }
      this.scrub.clear();
      console.log(this.cards);
      this.scrub = gsap.to(this.buildSeamlessLoop(this.cards, this.spacing), {
        totalTime: 0,
        duration: 0.5,
        ease: 'power3',
        paused: true,
      });
    },
    width: {
      handler: 'checkWidth',
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
