<template>
  <div class="time">
    <div class="module">
      <h3 id="timer">Timer</h3>
      <h1>{{ timerReadable }}</h1>
      <div class="controls">
        <button :class="{blue: status !== 0}" @click="toggleActive()">
          <font-awesome-icon v-if="status === 0" :icon="['fas', 'pause']" />
          <font-awesome-icon v-else-if="status !== 0" :icon="['fas', 'play']" />
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
    <button :class="{blue: status !== 0}" class="main" @click="toggleActive()">
      <font-awesome-icon v-if="status === 0" :icon="['fas', 'pause']" size="2x" />
      <font-awesome-icon v-else-if="status !== 0" :icon="['fas', 'play']" size="2x" />
    </button>
    <audio id="ding" :src="require('@/assets/ding.mp3')" />
    <audio id="warn" :src="require('@/assets/warn.mp3')" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'Timer',
  props: {
    muted: Boolean,
  },
  computed: {
    ...mapState({
      timer: (state) => state.Socket.message.time,
      status: (state) => state.Socket.message.state,
      order: (state) => state.Socket.message.order,
    }),
    timerReadable() {
      let mins;
      let seconds;
      if (this.time_left >= 0) {
        mins = Math.floor(this.time_left / 60);
        seconds = String(this.time_left - mins * 60).padStart(2, '0');
      } else {
        mins = 0;
        seconds = '00';
      }
      return `${mins}:${seconds}`;
    },
  },
  data() {
    return {
      interval: null,
      tl: null,
    };
  },
  async mounted() {
    this.scroll();
    this.interval = await setInterval(() => {
      console.log(this.timer);
    }, 1000);
  },
  methods: {
    redo() {
      const data = {
        session: 'gsl',
        command: 'stop',
      };
      this.$socket.send(JSON.stringify(data));
      gsap.to('.redo', {
        rotate: '-=360deg',
        color: '#5f78ff',
        repeat: 1,
        yoyo: true,
        ease: 'power2',
      });
    },
    skip() {
      const data = {
        session: 'gsl',
        command: 'pause',
        order: this.order,
      };
      this.$socket.send(JSON.stringify(data));
      const next = {
        session: 'gsl',
        command: 'pause',
        order: this.order + 1,
      };
      this.$socket.send(JSON.stringify(next));
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
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
@import "./index.scss";
</style>
