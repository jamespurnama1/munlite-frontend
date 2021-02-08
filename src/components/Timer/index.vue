<template>
  <div class="time">
    <div class="module">
      <h3 id="timer">Timer</h3>
      <h1>{{ timer() }}</h1>
      <div class="controls">
        <button :class="{blue: !active || timeLeft < 1}" @click="toggleActive()">
          <font-awesome-icon v-if="active && timeLeft > 0" :icon="['fas', 'pause']" />
          <font-awesome-icon v-else-if="!active" :icon="['fas', 'play']" />
        </button>
        <button @click="redo()">
          <font-awesome-icon class="redo" :icon="['fas', 'redo']" />
        </button>
        <button @click="skip()">
          <font-awesome-icon class="skip" :icon="['fas', 'step-forward']" />
        </button>
        <button :class="{red: muted}" @click="toggleSound()">
          <font-awesome-icon v-if="!muted" :icon="['fas', 'volume-up']" />
          <font-awesome-icon v-else-if="muted" :icon="['fas', 'volume-mute']" />
        </button>
      </div>
    </div>
    <button :class="{blue: !active || timeLeft < 1}" class="main" @click="toggleActive()">
      <font-awesome-icon v-if="active && timeLeft > 0" :icon="['fas', 'pause']" size="2x" />
      <font-awesome-icon v-else-if="!active" :icon="['fas', 'play']" size="2x" />
    </button>
    <audio id="ding" :src="require('@/assets/ding.mp3')" />
    <audio id="warn" :src="require('@/assets/warn.mp3')" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'Timer',
  props: {
    time: Number,
    active: Boolean,
    muted: Boolean,
  },
  data() {
    return {
      timeLeft: this.time,
      interval: null,
      tl: null,
    };
  },
  async mounted() {
    this.interval = await setInterval(() => {
      this.timeLeft -= 1;
    }, 1000);
    this.scroll();
  },
  methods: {
    redo() {
      gsap.to('.redo', {
        rotate: '-=360deg',
        color: '#5f78ff',
        repeat: 1,
        yoyo: true,
        ease: 'power2',
      });
    },
    skip() {
      gsap.to('.skip', {
        color: '#5f78ff',
        repeat: 1,
        yoyo: true,
        duration: 0.3,
      });
    },
    scroll() {
      ScrollTrigger.matchMedia({
        '(max-width: 960px)': () => {
          this.tl = gsap.timeline({
            scrollTrigger: {
              trigger: '#app',
              start: 0,
              end: '+=100px',
              id: 'trigger1',
              scrub: true,
              snap: {
                snapTo: [0, 1],
                duration: { min: 0.3, max: 0.5 },
                delay: 0.3,
              },
            },
          });
          this.tl.fromTo('.module, .main', {
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.15)',
            border: '1px solid white',
          }, {
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0)',
            border: '1px solid #d1d1d1',
          })
            .to('#timer', {
              autoAlpha: 0,
            }, 0)
            .fromTo('.module', {
              width: '100%',
            }, {
              minHeight: '70px',
              padding: '10px',
              width: 'calc(100% - 80px)',
            }, 0)
            .to('.main', {
              x: '-100px',
              autoAlpha: 1,
            }, 0)
            .to('.controls button', {
              autoAlpha: 0,
            }, 0)
            .to('.controls', {
              display: 'none',
            });
        },
      });
    },
    toggleActive() {
      this.$emit('active');
    },
    toggleSound() {
      this.$emit('sound');
    },
    timer() {
      const mins = Math.floor(this.timeLeft / 60);
      const seconds = String(this.timeLeft - mins * 60).padStart(2, '0');

      return `${mins}:${seconds}`;
    },
  },
  watch: {
    async timeLeft() {
      if (this.timeLeft < 1) {
        clearInterval(this.interval);
        this.interval = null;
        this.$emit('active');
        if (this.muted === false) {
          document.getElementById('ding').play();
        }
      } else if (!this.interval) {
        this.interval = await setInterval(() => {
          this.timeLeft -= 1;
        }, 1000);
      }
      if (this.timeLeft === 5 && this.muted === false) {
        document.getElementById('warn').play();
      }
    },
    async active() {
      if (!this.active) {
        clearInterval(this.interval);
        this.interval = null;
      } else if (!this.interval) {
        this.interval = await setInterval(() => {
          this.timeLeft -= 1;
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
@import "./index.scss";
</style>
