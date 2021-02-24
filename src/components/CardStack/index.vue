<template>
  <div class="stackOverflow"
  v-dragscroll.y="true"
  v-shortkey="{up: ['arrowup'], down: ['arrowdown']}"
  @shortkey="keymap">
    <ul class="stack-cards">
      <li v-for="(delegate, index) in delegates"
      :key="index"
      @click="click(index)"
      @contextmenu.prevent="showC($event, delegate, index)"
      v-touch:touchhold.prevent="showCon(delegate, index)"
      :class="{
        active: index === display,
        top: index < display,
        bottom: index > display,
        }"
      class="stack-cards__item">
        <Card
        :del="delegate"
        :desc="desc"
        :color="color"
        :prgrs="progress"
        :number='index'
        :active="active"
        :isActive="index === isActive" />
      </li>
    </ul>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapState } from 'vuex';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
    actions: {
      type: Object,
      default() {
        return {};
      },
    },
    prevent: Boolean,
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
      // snap: null,
      trigger: null,
      rawSequence: gsap.timeline({ paused: true }),
      scrub: null,
      mount: false,
    };
  },
  methods: {
    showC(event, data, index) {
      if (!this.showInput) {
        this.$store.dispatch('context', [
          [data.country, data._id, index],
          this.actions,
          [event.clientX, event.clientY],
        ]);
      }
    },
    showCon(data, index) {
      return (event) => {
        if (!this.showInput) {
          this.$store.dispatch('context', [
            [data.country, data._id, index],
            this.actions,
            [event.touches[0].clientX, event.touches[0].clientY],
          ]);
        }
      };
    },
    // snap({ children, duration = 2000 }) {
    //   const countTo = parseInt(children, 10);
    //   const [count, setCount] = useState(0);

    //   let frame = 0;
    //   const totalFrames = Math.round(duration / frameDuration);
    //   const counter = setInterval(() => {
    //     frame += 1;
    //     const progress = easeOutQuad(frame / totalFrames);
    //     setCount(countTo * progress);

    //     if (frame === totalFrames) {
    //       clearInterval(counter);
    //     }
    //   }, frameDuration);

    //   return Math.floor(count);
    // },
    snap(n) {
      return gsap.utils.snap(this.spacing, n);
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
    click(i) {
      this.$emit('move', i);
    },
    move(i) {
      this.scrubTo(this.rawSequence.labels[`label${i}`]);
      const timer = this.timer(5000);
      // TODO: fix & add user idle
      timer.start().then(() => {
        this.$emit('move', this.isActive);
      });
      if (i === this.isActive || !this.active || this.prevent) {
        timer.abort();
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
    async init() {
      this.trigger = await ScrollTrigger.create({
        scroller: '.stackOverflow',
        pin: '.stack-cards',
        // anticipatePin: 1,
        pinType: 'fixed',
        start: 0,
        end: `+=${this.cards.length * 100}`,
        onUpdate: ((self) => {
          console.time('animation script');
          const timer = this.timer(500);
          if (this.mount && self.scroller.scrollTop < this.minMax[0]) {
            // eslint-disable-next-line no-param-reassign
            timer.start().then(() => { [self.scroller.scrollTop] = this.minMax; });
          } else if (this.mount && self.scroller.scrollTop > this.minMax[1]) {
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
              if (this.mount) {
                this.$store.commit('changeCurrent', c);
                this.$emit('move', c);
                // console.log('scrolltrigger', c);
              }
              // }, 100, true);
            } catch (err) {
              // console.error(err); // ignore error as it is expected
            }
          }
          this.scrub.vars.totalTime = this.snap(self.progress * this.rawSequence.duration());
          this.scrub.invalidate().restart();
          // eslint-disable-next-line no-param-reassign
          self.wrapping = false;
          console.timeEnd('teanimation scriptst');
        }),
      });
      await setTimeout(() => {
        this.move(this.display);
        // console.log('init', this.display);
        this.mount = true;
      }, 1000);
    },
  },
  async mounted() {
    this.cards = document.querySelectorAll('.stack-cards__item');
    this.scrub = gsap.to(this.buildSeamlessLoop(this.cards, this.spacing), {
      totalTime: 0,
      duration: 0.5,
      ease: 'power3',
      paused: true,
    });
    this.init();
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
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
    active() {
      if (this.active) {
        this.$emit('move', this.isActive);
        // console.log('isActive', this.isActive);
      }
    },
    display: {
      // eslint-disable-next-line object-shorthand, func-names
      handler: function () {
        this.move(this.display);
        // console.log('display', this.display);
      },
    },
    delegates() {
      // console.log(this.delegates);
      // if (this.delegates) {
      //   const newItems = this.delegates;
      //   newItems.length = this.delegates.length - this.card.length;
      //   this.rawSequence.add(this.addTween(newItems));
      // }
      // // eslint-disable-next-line object-shorthand, func-names
      // // console.log(this.scrub);
      // this.$nextTick();
      // this.rawSequence.clear();
      // // this.scrub.invalidate().restart();
      // console.log(this.rawSequence.getChildren());
      // this.trigger.kill();
      // this.scrub.kill();
      // this.$nextTick();
      // this.cards = gsap.utils.toArray('.stack-cards__item');
      // this.scrub = gsap.to(this.buildSeamlessLoop(this.cards, this.spacing), {
      //   totalTime: 0,
      //   duration: 0.5,
      //   ease: 'power3',
      //   paused: true,
      // });
      // this.init();
      // this.$forceUpdate();
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
