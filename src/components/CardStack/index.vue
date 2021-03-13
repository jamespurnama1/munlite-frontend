<template>
  <div
    class="stackOverflow"
    v-dragscroll.y="true"
    v-shortkey="{up: ['arrowup'], down: ['arrowdown']}"
    @shortkey="keymap"
  >
    <ul
      class="stack-cards"
      @mousewheel="(event) => {
        event.preventDefault();
        scroller.scrollTop += event.deltaY;
      }"
    >
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
import {
  Vue,
  Watch,
  Component,
  Prop,
} from 'vue-property-decorator';
import { State } from 'vuex-class';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from '@/components/Card/index.vue';
// import { debounce } from 'debounce';

gsap.registerPlugin(ScrollTrigger);

@Component({
  components: {
    Card,
  },
})
export default class CardStack extends Vue {
  @Prop({ type: String }) color!: string

  @Prop([String, Number]) progress!: string | number

  @Prop(String) desc!: string

  @Prop({ type: Array, required: true }) delegates!: any[]

  @Prop(Number) isActive!: number

  @Prop(Boolean) active!: boolean

  @Prop({ type: Number, required: true }) display!: number

  @Prop({ type: Object, default() { return {}; } }) actions!: {[key: string]: any}

  @Prop(Boolean) prevent!: boolean

  cards = [] as NodeListOf<Element> | any[]

  scroller = null as Element | null

  disable = false as boolean

  spacing = 0.3 as number

  prevLabel = '' as string

  trigger = null as gsap.plugins.ScrollTriggerInstance | null

  rawSequence = gsap.timeline({ paused: true }) as GSAPTimeline

  scrub = null as GSAPTween | null

  mount = false as boolean

  showC(event: PointerEvent, data: any, index: number): void {
    this.$store.dispatch('context', [
      [data.country, data._id, index],
      this.actions,
      [event.clientX, event.clientY],
    ]);
  }

  showCon(data: any, index: number) {
    return (event: TouchEvent) => {
      this.$store.dispatch('context', [
        [data.country, data._id, index],
        this.actions,
        [event.touches[0].clientX, event.touches[0].clientY],
      ]);
    };
  }

  snap(n: number): number {
    const snap = gsap.utils.snap(
      [...Object.values(this.rawSequence.labels).map((values) => values + (this.spacing * 0.05))],
      n,
    );
    return snap;
  }

  click(index: number, disable: boolean = false): void {
    this.$emit('move', index);
    if (disable) this.disable = true;
  }

  move(index: number): void {
    this.scrubTo(this.rawSequence.labels[`label${index}`]);
  }

  rightClick(del): void {
    this.$emit('context', del);
  }

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
  }

  goPrev(): void {
    this.$emit('move', this.display - 1);
  }

  goNext(): void {
    this.$emit('move', this.display + 1);
  }

  scrubTo(totalTime: number): void {
    const progress = (totalTime / this.rawSequence.duration())
    * (this.cards.length * 100);
    if (this.trigger) {
      this.trigger.scroll(progress);
    }
  }

  buildSequence(items: NodeListOf<Element>, spacing: number): GSAPTimeline {
    const startTime = 1;
    const l = items.length;
    let time = 0;
    let index;
    let item;
    let i;
    for (i = 0; i < l; i += 1) {
      index = i % l;
      item = items[index];
      time = i * spacing;
      this.rawSequence.fromTo(item, {
        scale: 0.5,
        yPercent: '+=50',
        zIndex: l - i,
      }, {
        scale: 1,
        zIndex: l * 2,
        duration: 0.5,
        yPercent: 0,
        ease: 'none',
      }, time)
        .to(item, {
          scale: 0.5,
          yPercent: '-=50',
          duration: 0.5,
          zIndex: i,
          ease: 'none',
        }, time + 0.5);
      if (i <= l) {
        this.rawSequence.addLabel(`label${i}`, time + 0.5);
      }
    }
    this.rawSequence.time(startTime);
    return this.rawSequence;
  }

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
  // }

  timer = (ms: number): {start(): Promise<void>, abort(): void} => {
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
  }

  async init(): Promise<void> {
    if (!this.cards && !this.scrub) return;
    this.trigger = ScrollTrigger.create({
      scroller: '.stackOverflow',
      pin: '.stack-cards',
      pinType: 'fixed',
      start: 0,
      end: `+=${this.cards.length * 100}`,
      onUpdate: ((self) => {
        this.scrub!.vars.totalTime = this.snap(self.progress * this.rawSequence.duration());
        this.scrub!.invalidate().restart();
      }),
    });
    ScrollTrigger.addEventListener('scrollEnd', async () => {
      const label = this.rawSequence.currentLabel();
      if (this.trigger && label && label !== this.prevLabel && this.mount) {
        this.click(parseInt(label.replace(/label/, ''), 10));
        this.prevLabel = label;
      }
    });
    setTimeout(() => {
      this.move(this.display);
      this.mount = true;
    }, 500);
  }

  async mounted() {
    this.scroller = document.querySelector('.stackOverflow');
    this.cards = document.querySelectorAll('.stack-cards__item');
    this.scrub = gsap.to(this.buildSequence(this.cards, this.spacing), {
      totalTime: 0,
      duration: 0.3,
      ease: 'power3',
      paused: true,
    });
    await this.$nextTick();
    this.init();
  }

  // created() {
  //   console.log(this.rawSequence.currentLabel());
  // }

  @State((state) => state.Global.widthWindow) width!: number

  @State((state) => state.idleVue.isIdle) idle!: boolean

  @Watch('active')
  onActive() {
    if (this.active) {
      this.$emit('move', this.isActive);
    }
  }

  @Watch('display')
  onDisplay() {
    if (!this.disable) this.move(this.display);
    else console.log('deflected'); this.disable = false;
  }

  @Watch('idle')
  onIdle() {
    if (this.idle && this.active && typeof this.isActive === 'number') this.$emit('move', this.isActive);
  }

  @Watch('delegates')
  onDelegates() {
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
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
