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

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue from 'vue';
import { gsap } from 'gsap';
import { mapState } from 'vuex';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from '@/components/Card/index.vue';
// import { debounce } from 'debounce';

gsap.registerPlugin(ScrollTrigger);

export default Vue.extend({
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
      cards: [] as Array<Element>,
      spacing: 0.3 as number,
      prevLabel: '' as string,
      trigger: null as gsap.plugins.ScrollTriggerInstance | null,
      rawSequence: gsap.timeline({ paused: true }) as GSAPTimeline,
      scrub: null as GSAPTween | null,
      mount: false as boolean,
    };
  },
  methods: {
    showC(event: PointerEvent, data: any, index: number): void {
      // if (!this.showInput) {
      this.$store.dispatch('context', [
        [data.country, data._id, index],
        this.actions,
        [event.clientX, event.clientY],
      ]);
      // }
    },
    showCon(data: any, index: number) {
      return (event: TouchEvent) => {
        // if (!this.showInput) {
        this.$store.dispatch('context', [
          [data.country, data._id, index],
          this.actions,
          [event.touches[0].clientX, event.touches[0].clientY],
        ]);
        // }
      };
    },
    snap(n): number {
      const snap = gsap.utils.snap(
        this.spacing,
        gsap.utils.clamp(
          this.spacing * 2,
          (0.5 * this.spacing) + (this.spacing * (this.cards.length + 1)), n,
        ),
      );
      return snap;
    },
    // checkWidth(): void {
    //   if (this.width < 600) {
    //     this.stacks = 2;
    //     this.stackHeight = 6;
    //   } else if (this.width > 600) {
    //     this.stacks = 3;
    //     this.stackHeight = 9;
    //   }
    // },
    click(i: number): void {
      this.$emit('move', i);
    },
    move(i: number): void {
      this.scrubTo(this.rawSequence.labels[`label${i}`] + 0.1);
    },
    rightClick(del): void {
      this.$emit('context', del);
    },
    keymap(event): void {
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
    goPrev(): void {
      this.$emit('move', this.display - 1);
    },
    goNext(): void {
      this.$emit('move', this.display + 1);
    },
    scrubTo(totalTime: number): void {
      const progress = (totalTime / this.rawSequence.duration())
      * (this.cards.length * 100);
      if (this.trigger) {
        this.trigger.scroll(progress);
      }
    },
    buildSequence(items: Array<any>, spacing: number): GSAPTimeline {
      const startTime = 1;
      const l = items.length;
      let time = 0;
      let index;
      let item;
      let i;
      // gsap.set(items, { scale: 0.3 });
      for (i = 0; i < l; i += 1) {
        index = i % items.length;
        item = items[index];
        time = i * spacing;
        this.rawSequence.fromTo(item, {
          scale: 0.5,
          yPercent: '+=50',
        }, {
          scale: 1,
          zIndex: 100,
          duration: 0.5,
          yPercent: 0,
          ease: 'none',
        }, time)
          .to(item, {
            scale: 0.5,
            yPercent: '-=50',
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
    // addTween(items) {
    //   console.log('adding new items', items);
    //   let i = this.cards.length;
    //   let time = 0;
    //   let item;
    //   let index;
    //   const tl = gsap.timeline();
    //   for (i; i < items.length; i += 1) {
    //     index = i % items.length;
    //     item = items[index];
    //     time = i * this.spacing;
    //     tl.fromTo(item, {
    //       scale: 0.3,
    //       yPercent: '+=150',
    //     }, {
    //       scale: 1,
    //       zIndex: 100,
    //       duration: 0.5,
    //       yPercent: 0,
    //       ease: 'none',
    //     }, time)
    //       .to(item, {
    //         scale: 0.3,
    //         yPercent: '-=150',
    //         duration: 0.5,
    //         ease: 'none',
    //       }, time + 0.5);
    //     if (i <= items.length) {
    //       tl.addLabel(`label${i}`, time + 0.5);
    //     }
    //   }
    //   return tl;
    // },
    // addClass(item, str) {
    //   item.classList.add(str);
    // },
    // removeClass(item, str) {
    //   item.classList.remove(str);
    // },
    timer(ms: number): {start(): Promise<void>, abort(): void} {
      let id;
      const start = (): Promise<void> => new Promise((resolve) => {
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
    async init(): Promise<void> {
      if (!this.cards) return;
      this.trigger = ScrollTrigger.create({
        scroller: '.stackOverflow',
        pin: '.stack-cards',
        anticipatePin: 1,
        // pinType: 'fixed',
        start: 0,
        end: `+=${this.cards.length * 100}`,
        onUpdate: ((self) => {
          const label = this.rawSequence.currentLabel();
          const timer = this.timer(300);
          if (label && label !== this.prevLabel && this.mount) {
            timer.start().then(() => {
              if (this.rawSequence.currentLabel()) this.click(parseInt(this.rawSequence.currentLabel().replace(/label/, ''), 10));
              this.prevLabel = label;
            });
          }
          if (this.scrub) {
            this.scrub.vars.totalTime = self.progress * this.rawSequence.duration();
            this.scrub.invalidate().restart();
          }
        }),
      });
      setTimeout(() => {
        this.move(this.display);
        this.mount = true;
      }, 1000);
      ScrollTrigger.addEventListener('scrollEnd', () => {
        if (this.trigger) {
          this.scrubTo(this.snap(this.trigger.progress * this.rawSequence.duration()));
        }
      });
    },
  },
  async mounted() {
    this.cards.push(...document.querySelectorAll('.stack-cards__item'));
    this.scrub = gsap.to(this.buildSequence(this.cards, this.spacing), {
      totalTime: 0,
      duration: 0.3,
      ease: 'power3',
      paused: true,
    });
    await this.$nextTick();
    this.init();
  },
  computed: {
    ...mapState({
      width: (state: any) => state.Global.widthWindow,
      idle: (state: any) => state.idleVue.isIdle,
    }),
  },
  watch: {
    active() {
      if (this.active) {
        this.$emit('move', this.isActive);
      }
    },
    display: {
      handler() {
        if (this.rawSequence.currentLabel() !== this.display.toString()) this.move(this.display);
      },
    },
    idle() {
      if (this.idle && this.active && typeof this.isActive === 'number') this.$emit('move', this.isActive);
    },
    delegates() {
      if (this.scrub && this.trigger) {
        this.scrub.invalidate().restart();
        (this.trigger as unknown as typeof ScrollTrigger).refresh();
      }
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
    // width: {
    //   handler: 'checkWidth',
    //   immediate: true,
    // },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
