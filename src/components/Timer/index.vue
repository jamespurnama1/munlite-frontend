<template>
  <div class="time">
    <div class="module">
      <h3 id="timer">Timer</h3>
      <h1 class="read">{{ timerReadable }}</h1>
      <div class="controls">
        <button
          :disabled="otherSession"
          :class="{blue: status !== 0, large: !next}"
          @click="debounce(toggleActive(), 1000, true)"
        >
          <font-awesome-icon v-if="status === 0" :icon="['fas', 'pause']" />
          <font-awesome-icon v-else-if="status !== 0" :icon="['fas', 'play']" />
        </button>
        <button :disabled="otherSession" @click="debounce(redo(), 1000, true)">
          <font-awesome-icon class="redo" :icon="['fas', 'redo']" />
        </button>
        <button :disabled="otherSession" v-if="next" @click="debounce(skip(), 1000, true)">
          <font-awesome-icon class="skip" :icon="['fas', 'step-forward']" />
        </button>
        <button :disabled="otherSession" :class="{red: muted}" @click="toggleSound()">
          <font-awesome-icon v-if="!muted" :icon="['fas', 'volume-up']" />
          <font-awesome-icon v-else-if="muted" :icon="['fas', 'volume-mute']" />
        </button>
      </div>
    </div>
    <audio id="ding" :src="require('@/assets/ding.mp3')" />
    <audio id="warn" :src="require('@/assets/warn.mp3')" />
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
import { debounce } from 'debounce';

@Component
export default class Timer extends Vue {
  @Prop({ type: Boolean, default: true }) next!: boolean

  @Prop({ type: Number, default: 0 }) time_left!: number

  @State((state) => state.Socket.message.time) timer!: number

  @State((state) => state.Socket.message.session) session!: string

  @State((state) => state.Socket.message.state) status!: number

  @State((state) => state.Socket.message.order) order!: number

  @State((state) => state.Global.muted) muted!: boolean

  delay = false as boolean

  tl = null as GSAPTimeline | null

  debounce = debounce

  get otherSession(): boolean {
    return this.status === 0 && this.session !== this.$route.name?.toLowerCase();
  }

  get timerReadable(): string {
    let mins;
    let seconds;
    if (this.timer >= 0 && this.status !== 2
    && this.session === this.$route.name?.toLowerCase()) {
      mins = Math.floor(this.timer / 60);
      seconds = String(this.timer - mins * 60).padStart(2, '0');
    } else if (this.time_left
    && (this.status === 2 || this.session !== this.$route.name?.toLowerCase())) {
      mins = Math.floor(this.time_left / 60);
      seconds = String(this.time_left - mins * 60).padStart(2, '0');
    } else {
      mins = 0;
      seconds = '00';
    }
    return `${mins}:${seconds}`;
  }

  mounted() {
    setTimeout(() => {
      this.delay = true;
    }, 1200);
  }

  @Watch('timer')
  onTimer() {
    if (!this.muted && this.delay && this.status === 0 && this.timer === 5) {
      (document.getElementById('warn') as HTMLAudioElement).play();
      gsap.to('.read', {
        rotate: '+=20deg',
        color: '#FF5F5F',
        yoyo: true,
        repeat: 5,
        duration: 0.1,
      });
      gsap.to('.read', {
        rotate: '-=20deg',
        yoyo: true,
        repeat: 5,
        duration: 0.1,
      });
      gsap.to('.read', {
        clearProps: 'all',
        delay: 0.4,
      });
    } else if (!this.muted && this.delay && this.timer === 0) {
      (document.getElementById('ding') as HTMLAudioElement).play();
    }
  }

  redo(): void {
    gsap.to('.redo', {
      rotate: '-=360deg',
      color: '#5f78ff',
      repeat: 1,
      yoyo: true,
      ease: 'power2',
      duration: 1,
    });
    this.$emit('restart');
  }

  skip(): void {
    gsap.to('.skip', {
      color: '#5f78ff',
      repeat: 3,
      yoyo: true,
      duration: 0.2,
    });
    this.$emit('next');
  }

  toggleActive(): void {
    this.$emit('active');
  }

  toggleSound(): void {
    this.$store.commit('toggleMute');
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
