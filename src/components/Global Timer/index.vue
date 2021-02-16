<template>
  <div class="time">
    <div class="module">
      <h1 class="read">{{ timerReadable }}</h1>
      <div class="progress" :style="`clip-path: inset(0 ${progress}% 0 0);`">
        <h1 class="read">{{ timerReadable }}</h1>
      </div>
      <div class="controls">
        <button :class="{blue: status !== 0}" @click="toggleActive()">
          <font-awesome-icon v-if="status === 0" :icon="['fas', 'pause']" />
          <font-awesome-icon v-else-if="status !== 0" :icon="['fas', 'play']" />
        </button>
        <button @click="redo()" v-if="width > 960">
          <font-awesome-icon class="redo" :icon="['fas', 'redo']" />
        </button>
        <button @click="skip()" v-if="width > 960">
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
  name: 'GlobalTimer',
  computed: {
    ...mapState({
      timer: (state) => state.Socket.message.time,
      status: (state) => state.Socket.message.state,
      order: (state) => state.Socket.message.order,
      width: (state) => state.Global.widthWindow,
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
      this.progress = 100 - (this.timer / 0.9);
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
      progress: 0,
    };
  },
  async mounted() {
    this.scroll();
  },
  methods: {
    async redo() {
      gsap.to('.redo', {
        rotate: '-=360deg',
        color: '#5f78ff',
        repeat: 1,
        yoyo: true,
        ease: 'power2',
      });
      const data = {
        session: 'gsl',
        command: 'stop',
      };
      this.$socket.send(JSON.stringify(data));
      await this.$nextTick();
      const play = {
        session: 'gsl',
        command: 'play',
        time: 90,
        order: 1,
      };
      this.$socket.send(JSON.stringify(play));
    },
    async skip() {
      gsap.to('.skip', {
        color: '#5f78ff',
        repeat: 3,
        yoyo: true,
        duration: 0.2,
      });
      const data = {
        session: 'gsl',
        command: 'pause',
        order: this.order,
      };
      this.$socket.send(JSON.stringify(data));
      await this.$nextTick();
      const next = {
        session: 'gsl',
        command: 'pause',
        order: this.order + 1,
      };
      this.$socket.send(JSON.stringify(next));
    },
    scroll() {
      // ScrollTrigger.matchMedia({
      //   '(max-width: 960px)': () => {
      //     this.tl = gsap.timeline({
      //       scrollTrigger: {
      //         trigger: '#app',
      //         start: 0,
      //         end: '+=100px',
      //         id: 'trigger1',
      //         scrub: true,
      //         snap: {
      //           snapTo: [0, 1],
      //           duration: { min: 0.3, max: 0.5 },
      //           delay: 0.3,
      //         },
      //       },
      //     });
      //     this.tl.fromTo('.module, .main', {
      //       boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.15)',
      //       border: '1px solid white',
      //     }, {
      //       boxShadow: '0px 0px 20px 0px rgba(0,0,0,0)',
      //       border: '1px solid #d1d1d1',
      //     })
      //       .to('#timer', {
      //         autoAlpha: 0,
      //       }, 0)
      //       .fromTo('.module', {
      //         width: '100%',
      //       }, {
      //         minHeight: '70px',
      //         padding: '10px',
      //         width: 'calc(100% - 80px)',
      //       }, 0)
      //       .to('.main', {
      //         x: '-100px',
      //         autoAlpha: 1,
      //       }, 0)
      //       .to('.controls button', {
      //         autoAlpha: 0,
      //       }, 0)
      //       .to('.controls', {
      //         display: 'none',
      //       });
      //   },
      // });
    },
    toggleActive() {
      const data = {
        session: 'gsl',
      };
      if (this.status === 2) {
        data.command = 'start';
        data.time = 90;
        data.order = 1;
      } else if (this.status === 1) {
        data.command = 'resume';
      } else {
        data.command = 'pause';
      }
      console.log('Send WebSocket Data!', JSON.stringify(data));
      this.$socket.send(JSON.stringify(data));
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
