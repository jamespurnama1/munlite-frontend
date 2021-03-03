<template>
  <div class="time">
    <div class="module">
      <h3 id="timer">Timer</h3>
      <h1 class="read">{{ timerReadable }}</h1>
      <div class="controls">
        <button :class="{blue: status !== 0}" @click="debounce(toggleActive(), 1000, true)">
          <font-awesome-icon v-if="status === 0" :icon="['fas', 'pause']" />
          <font-awesome-icon v-else-if="status !== 0" :icon="['fas', 'play']" />
        </button>
        <button @click="debounce(redo(), 1000, true)">
          <font-awesome-icon class="redo" :icon="['fas', 'redo']" />
        </button>
        <button @click="debounce(skip(), 1000, true)">
          <font-awesome-icon class="skip" :icon="['fas', 'step-forward']" />
        </button>
        <button :class="{red: muted}" @click="toggleSound()">
          <font-awesome-icon v-if="!muted" :icon="['fas', 'volume-up']" />
          <font-awesome-icon v-else-if="muted" :icon="['fas', 'volume-mute']" />
        </button>
      </div>
    </div>
    <audio id="ding" :src="require('@/assets/ding.mp3')" />
    <audio id="warn" :src="require('@/assets/warn.mp3')" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'debounce';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'Timer',
  computed: {
    ...mapState({
      timer: (state) => state.Socket.message.time,
      status: (state) => state.Socket.message.state,
      order: (state) => state.Socket.message.order,
      muted: (state) => state.Global.muted,
    }),
    timerReadable() {
      let mins;
      let seconds;
      if (this.timer >= 0 && this.status !== 2) {
        mins = Math.floor(this.timer / 60);
        seconds = String(this.timer - mins * 60).padStart(2, '0');
      } else {
        mins = 0;
        seconds = '00';
      }
      return `${mins}:${seconds}`;
    },
  },
  watch: {
    timer() {
      if (!this.muted && this.status === 0) {
        if (this.timer === 5) {
          document.getElementById('warn').play();
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
        }
      } else if (!this.muted && this.timer === 0) {
        document.getElementById('ding').play();
      }
    },
  },
  data() {
    return {
      interval: null,
      tl: null,
      debounce,
    };
  },
  async mounted() {
    this.scroll();
  },
  methods: {
    // timeout(ms) {
    //   let id;
    //   const start = () => new Promise((resolve) => {
    //     if (id === -1) {
    //       throw new Error('Timer already aborted');
    //     }
    //     id = setTimeout(resolve, ms);
    //   });
    //   const abort = () => {
    //     if (id !== -1 || id === undefined) {
    //       clearTimeout(id);
    //       id = -1;
    //     }
    //   };

    //   return { start, abort };
    // },
    redo() {
      gsap.to('.redo', {
        rotate: '-=360deg',
        color: '#5f78ff',
        repeat: 1,
        yoyo: true,
        ease: 'power2',
        duration: 1,
      });
      this.$emit('restart');
    },
    async skip() {
      gsap.to('.skip', {
        color: '#5f78ff',
        repeat: 3,
        yoyo: true,
        duration: 0.2,
      });
      this.$emit('next');
    },
    toggleActive() {
      this.$emit('active');
    },
    toggleSound() {
      this.$store.commit('toggleMute');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
@import "./index.scss";
</style>
