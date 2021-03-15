<template>
  <div class="time">
    <div class="module">
      <h1 @click="push" class="read">{{ timerReadable }}
          <span v-if="sess === 'caucus'">Caucus</span>
          <span v-else>GSL</span></h1>
      <div class="progress" :style="`clip-path: inset(0 ${progress}% 0 0);`">
          <h1 @click="push" class="read">{{ timerReadable }}
          <span v-if="sess === 'caucus'">Caucus</span>
          <span v-else>GSL</span></h1>
      </div>
      <div class="controls">
        <button :class="{blue: status !== 0}" @click="toggleActive()">
          <font-awesome-icon v-if="status === 0" :icon="['fas', 'pause']" />
          <font-awesome-icon v-else-if="status !== 0" :icon="['fas', 'play']" />
        </button>
        <button @click="redo()" v-if="width > 960">
          <font-awesome-icon class="redo" :icon="['fas', 'redo']" />
        </button>
        <button @click="skip()" v-if="width > 960 && next">
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

<script lang="ts">
import {
  Vue,
  Watch,
  Component,
} from 'vue-property-decorator';
import { State } from 'vuex-class';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getGSL, nextGSL, timeLeftGSL } from '@/api/gsl';
import { currentCaucus, nextCaucus, timeLeftCaucus } from '@/api/caucus';
// eslint-disable-next-line no-unused-vars
import { caucusType, delegatesType, gslType } from '@/types/api';

gsap.registerPlugin(ScrollTrigger);

@Component
export default class GlobalTimer extends Vue {
  get next() {
    if (this.sess === 'caucus' && this.caucusList.motion.type.toLowerCase() !== 'moderated caucus') return false;
    if (this.gslList.current === this.gslList.length - 1) return false;
    if (this.caucusList.current === this.caucusList.length - 1) return false;
    return true;
  }

  @State((state) => state.Socket.message.time) timer!: number

  @State((state) => state.Socket.message.session) sess!: string

  @State((state) => state.Socket.message.state) status!: number

  @State((state) => state.Socket.message.order) order!: number

  @State((state: any) => state.Global.widthWindow) width!: number

  @State((state: any) => state.Global.muted) muted!: boolean

  get timerReadable() {
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
  }

  mounted() {
    setTimeout(() => {
      this.delay = true;
    }, 1200);
    this.update();
  }

  @Watch('status')
  onStatus() {
    this.update();
  }

  @Watch('sess')
  onSess() {
    this.update();
  }

  @Watch('timer', { immediate: true })
  onTimer() {
    if (!this.muted && this.status === 0 && this.delay && this.timer === 5) {
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
    } else if (!this.muted && this.timer === 0 && this.delay) {
      (document.getElementById('ding') as HTMLAudioElement).play();
    }
  }

  // TODO: max to 100 not 125 with rounding
  get progress() {
    return 100 - Math.min(Math.max((this.timer / this.sessTime) * 100, 0), 125);
  }

  delay: boolean = false

  caucusCurrent: number = 0

  gslCurrent: number = 0

  sessTime: number = 0

  sessOrder: number = 0

  updateSessOrder(): void {
    this.sessOrder = this.sess === 'gsl' ? this.gslCurrent : this.caucusCurrent;
  }

  updateSessTime(): void {
    if (this.gslList.queue.length - 1 >= this.gslCurrent
    && this.caucusList.queue.length - 1 >= this.caucusCurrent) {
      this.sessTime = this.sess === 'gsl'
        ? this.gslList.queue[this.gslCurrent].time_start
        : this.caucusList.queue[this.caucusCurrent].time_start;
    }
  }

  async update() {
    await this.updateCaucus();
    await this.updateGSL();
    this.updateSessTime();
    this.updateSessOrder();
  }

  push(): void {
    if (this.sess.toLowerCase() === 'caucus') this.$router.push(`/caucus/${this.$route.params.id}`);
    else this.$router.push(`/gsl/${this.$route.params.id}`);
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
    const data = {
      session: this.sess,
      command: 'stop',
    };
    this.$socket.send(JSON.stringify(data));
    setTimeout(() => {
      const play = {
        session: this.sess,
        command: 'start',
        time: this.sessTime,
        order: this.sessOrder,
      };
      this.$socket.send(JSON.stringify(play));
    }, 1000);
  }

  skip(): void {
    gsap.to('.skip', {
      color: '#5f78ff',
      repeat: 3,
      yoyo: true,
      duration: 0.2,
    });
    const data = {
      session: this.sess,
      command: 'stop',
      order: this.sessOrder,
    };
    this.$socket.send(JSON.stringify(data));
    try {
      this.update().then(async () => {
        if (this.gslCurrent !== null && this.sess === 'gsl') {
          await timeLeftGSL(this.$route.params.id, {
            order: this.gslCurrent + 1,
            time_left: this.timer,
          });
          if (this.gslCurrent < this.gslList.queue.length - 1) {
            await nextGSL(this.$route.params.id);
          }
        } else if (this.caucusCurrent !== null) {
          await timeLeftCaucus(this.$route.params.id, {
            order: this.caucusCurrent + 1,
            time_left: this.timer,
          });
        }
        if (this.caucusCurrent < this.caucusList.queue.length - 1) {
          await nextCaucus(this.$route.params.id);
        }
      });
      this.update();
    } catch (err) {
      console.error(err);
    }
  }

  gslList: gslType.getGSL | {[key:string]: any} = {}

  async updateGSL(): Promise<void> {
    try {
      const list = await getGSL(this.$route.params.id);
      if (list.data.data !== null) {
        this.gslCurrent = list.data.data.current;
        this.gslList = list.data.data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  caucusList: caucusType.currentCaucus | {[key:string]: any} = {}

  async updateCaucus(): Promise<void> {
    try {
      const list = await currentCaucus(this.$route.params.id);
      if (list.data.data !== null) {
        this.caucusCurrent = list.data.data.current;
        this.caucusList = list.data.data;
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  async toggleActive(): Promise<void> {
    const data: {[key: string]: any} = {
      session: this.sess,
    };
    if (this.status === 2) {
      data.command = 'start';
      data.time = this.sessTime;
      data.order = this.sessOrder;
    } else if (this.status === 1) {
      data.command = 'resume';
    } else {
      data.command = 'pause';
    }
    this.$socket.send(JSON.stringify(data));
  }

  toggleSound(): void {
    this.$store.commit('toggleMute');
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
