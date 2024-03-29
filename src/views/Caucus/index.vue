<template>
  <div class="wrap">
    <div class="gsl" v-if="delegatesData.length > 0 && typeof caucusData === 'object'
      && !noTimer.includes(caucusData.motion.type)"
    >
      <div class="upper">
        <span>
          <h1 v-if="caucusData.motion.name" class="title">{{ caucusData.motion.name }}</h1>
          <h1 v-else class="title">{{ caucusData.motion.type }}</h1>
          <p v-if="widthWindow > 960 && moderated">
            Right click the cards for more options.
          </p>
          <p v-else-if="moderated">
            Long press the cards for more options.
          </p>
        </span>
        <button
          :disabled="caucusData.length
            >= (caucusData.motion.total_time / caucusData.motion.speaking_time)"
          @click="showQueue = true"
          v-if="widthWindow <= 960 && moderated"
        >
          <font-awesome-icon :icon="['fas', 'plus']"/>
        </button>
      </div>
      <div class="wrapper">
        <Timer
          v-if="widthWindow <= 960 && timerBool"
          class="time"
          :class="{solo: !moderated}"
          :next="noNext"
          @active="() => {
            if (socket.session === 'gsl' && socket.state === 1) showConfirm = true
            else toggleActive()
          }"
          @update="updateCaucus()"
          @restart="restart()"
          @next="next"
          :time_left="caucusList[caucusCurrent]
            ? caucusList[caucusCurrent].time_left : caucusData.motion.total_time"
        />
        <div class="cards" v-if="moderated">
          <CardStack
            v-if="caucusList.length > 0"
            :key="caucusList.length"
            :delegates="caucusList"
            :active="socket.state === 0"
            :isActive="caucusCurrent"
            :display="currentCountry"
            :actions="actions"
            :prevent="prevent"
            @move="move"
          />
          <div v-else>
            <h3>No delegates in queue</h3>
            <p v-if="widthWindow <= 960">Add delegates from the plus button</p>
            <p v-else>Start by typing a country name on the right</p>
          </div>
        </div>
        <div class="options">
          <transition-group name="fade">
            <div
              key="1"
              class="top"
              v-if="widthWindow > 960"
              :class="{solo: !moderated}"
            >
              <Timer
                v-if="timerBool"
                class="time"
                :next="noNext"
                @active="() => {
                  if (socket.session === 'gsl' && socket.state === 1) showConfirm = true
                  else toggleActive()
                }"
                @update="updateCaucus()"
                @restart="restart()"
                @next="next"
                :time_left="caucusList[caucusCurrent]
                  ? caucusList[caucusCurrent].time_left : caucusData.motion.total_time"
              />
            </div>
            <Queue
              key="2"
              v-else-if="widthWindow <= 960
              && countryList && showQueue"
              class="queue"
              :items="countryList"
              @add="addQueue"
              v-click-outside="{
                handler() { showQueue = false; },
                events: ['click', 'touchstart', 'touchmove'],
              }"
              :disable="caucusData.length
                >= (caucusData.motion.total_time / caucusData.motion.speaking_time)"
              :defaultTime="caucusData.motion.speaking_time"
            />
            <div
              key="3"
              class="bottom"
              v-if="widthWindow > 960"
            >
              <Queue
                v-if="countryList && moderated"
                class="queue"
                :items="countryList"
                @add="addQueue"
                :disable="caucusData.length
                  >= (caucusData.motion.total_time / caucusData.motion.speaking_time)"
                :defaultTime="caucusData.motion.speaking_time"
              />
            </div>
            <div key="4" class="overlay" v-if="widthWindow <= 960
              && countryList && showQueue"
            />
          </transition-group>
        </div>
      </div>
    </div>
    <div v-else-if="delegatesData.length === 0" class="noDelegates">
      <h1>No Present Delegates</h1>
      <p>Add delegates &amp; start a roll call from the delegates tab.</p>
    </div>
    <div v-else class="noCaucus">
      <h1>No Caucus</h1>
      <p>Start a caucus from the motions tab.</p>
    </div>
    <transition-group name="fade">
      <Confirmation
        content="GSL is in progress. Stop GSL?"
        :action="stopGSL"
        :negative="true"
        button="Stop"
        v-click-outside="{
          handler() { showConfirm = false; },
          events: ['click', 'touchstart', 'touchmove'],
        }"
        whiteButton="Cancel"
        v-if="showConfirm"
        @exit="() => { showConfirm = false; }"
        :key="`${showConfirm}Modal`"
      />
      <div class="overlay modal" :key="showConfirm" v-if="showConfirm" />
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  addTurnCaucus, currentCaucus, delTurnCaucus, nextCaucus, timeLeftCaucus,
} from '@/api/caucus';
import { mapState } from 'vuex';
import negara from '@/const/country.json';
import { getAllDelegates } from '@/api/delegates';
// eslint-disable-next-line no-unused-vars
import { delegatesType, caucusType, websocketType } from '@/types/api';
import Confirmation from '@/components/Confirmation/index.vue';
import CardStack from '@/components/CardStack/index.vue';
import Timer from '@/components/Timer/index.vue';
import Queue from '@/components/Queue/index.vue';

export default Vue.extend({
  name: 'Caucus',
  components: {
    CardStack,
    Timer,
    Queue,
    Confirmation,
  },
  data() {
    return {
      delegatesData: [] as delegatesType.getAllDelegates[],
      caucusData: null as caucusType.currentCaucus | null,
      currentCountry: 0 as number, // cardstacks display
      selected: null as number | null,
      showConfirm: false as boolean,
      showInput: false as boolean,
      caucusCurrent: null as number | null, // current in GET caucus
      newArr: [] as {}[],
      showQueue: false as boolean,
      prevent: false as boolean,
      actions: {
        Restart: true as boolean,
        'View Notes': false as boolean,
        'Remove From Queue': true as boolean,
      },
      nextButton: [
        'consultation of the whole',
        'unmoderated caucus',
      ] as string[],
      noTimer: [
        'Suspension of The Debate',
        'Resumption of The Debate',
        'Adjournment of The Meeting',
      ] as string[],
    };
  },
  methods: {
    stopGSL(): void {
      const stop = {
        session: 'gsl',
        command: 'stop',
      };
      const vue = this;
      this.$socket.send(JSON.stringify(stop));
      vue.$socket.addEventListener('message', function onmessage() {
        vue.$socket.removeEventListener('message', onmessage);
        setTimeout(() => {
          vue.toggleActive();
        }, 1000);
      });
    },
    context(): void {
      switch (this.contextData.action) {
        case 'Remove From Queue':
          this.deleteTurn(this.contextData.index);
          break;
        case 'View Notes':
          // TODO: view notes
          break;
        case 'Restart':
          this.restart();
          break;
        default:
      }
    },
    newCountryList(): void {
      const list: any[] = [];
      this.delegatesData.forEach((item) => {
        let data: any = negara.find((e) => e.name === item.country);
        if (data) {
          list.push(data);
        } else {
          data = {
            name: item.country,
            id: '',
          };
          list.push(data);
        }
      });

      this.$store.commit('countryList', list);
    },
    newCaucusList(caucus: caucusType.currentCaucus): void {
      this.newArr.length = 0;
      let data;
      for (let i = 0; i < caucus.queue.length; i += 1) {
        [data] = this.delegatesData.filter((e) => e._id === caucus.queue[i].delegate_id);
        if (data) {
          data.time_start = caucus.queue[i].time_start;
          data.time_left = caucus.queue[i].time_left;
          data = { ...data };
          this.newArr.push(data);
        }
      }
      this.$store.commit('caucusList', this.newArr);
      this.currentCountry = this.caucusCurrent as number;
    },
    async next(): Promise<void> {
      try {
        const next = {
          session: 'caucus',
          command: 'stop',
          order: this.caucusCurrent,
        };
        this.$socket.send(JSON.stringify(next));
        if (this.caucusCurrent !== null) {
          await timeLeftCaucus(this.$route.params.id, {
            order: this.caucusCurrent + 1,
            time_left: this.socket.time,
          });
        }
        if (this.caucusCurrent as number < this.caucusList.length - 1) {
          await nextCaucus(this.$route.params.id);
        }
        this.updateCaucus();
      } catch (err) {
        console.error(err);
      }
    },
    async restart(): Promise<void> {
      const data = {
        session: 'caucus',
        command: 'stop',
        order: this.caucusCurrent,
      };
      this.$socket.send(JSON.stringify(data));
      let time: number;
      if (this.caucusData) time = this.caucusData.motion.total_time;
      if (this.caucusData && this.caucusCurrent !== null && this.caucusData.motion.type.toLowerCase() === 'moderated caucus') {
        time = this.caucusList[this.caucusCurrent].time_start;
      }
      setTimeout(() => {
        const play = {
          session: 'caucus',
          command: 'start',
          time,
          order: this.caucusCurrent,
        };
        this.$socket.send(JSON.stringify(play));
      }, 1000);
    },
    async deleteTurn(index: number): Promise<void> {
      console.log('deleting turn');
      try {
        await delTurnCaucus(this.$route.params.id, index + 1);
        this.updateCaucus();
      } catch (err) {
        console.error(err.response);
      }
    },
    async addQueue([country, time]: [string, number]): Promise<void> {
      try {
        const [id] = this.delegatesData.filter((obj) => obj.country === country);
        const data = {
          delegate_id: id._id,
          time_start: time,
          time_left: time,
        };
        if (id
        && this.caucusData
        && this.caucusData.length
        < (this.caucusData.motion.total_time / this.caucusData.motion.speaking_time)) {
          await addTurnCaucus(this.$route.params.id, data);
          this.updateCaucus();
        }
        this.showQueue = false;
      } catch (err) {
        console.error(err.response);
      }
    },
    async updateCaucus(): Promise<void> {
      try {
        const list = await currentCaucus(this.$route.params.id);
        if (list.data.data !== null) {
          this.caucusData = list.data.data;
          this.newCaucusList(list.data.data);
        }
        if (this.caucusData && this.caucusCurrent !== this.caucusData.current) {
          this.currentCountry = this.caucusData.current;
          this.caucusCurrent = this.caucusData.current;
        }
      } catch (err) {
        console.error(err.response);
      }
    },
    toggleActive(): void {
      let time: number = 0;
      if (this.caucusData && this.caucusData.motion.type.toLowerCase() !== 'moderated caucus') time = this.caucusData.motion.total_time;
      if (this.caucusCurrent !== null && this.caucusData && this.caucusData.motion.type.toLowerCase() === 'moderated caucus') {
        time = this.caucusList[this.caucusCurrent].time_start;
      }
      const data: websocketType.send = {
        session: 'caucus',
        order: 0,
      };
      if ((this.socket.session === 'gsl' || this.socket.state === 2) && this.caucusCurrent !== null && this.socket.state !== 0) {
        data.command = 'start';
        data.time = time;
        data.order = this.caucusCurrent;
      } else if (this.socket.state === 1 && this.caucusCurrent !== null) {
        data.command = 'resume';
        data.order = this.caucusCurrent;
      } else if (this.caucusCurrent !== null) {
        data.command = 'pause';
        data.order = this.caucusCurrent;
      }
      this.$socket.send(JSON.stringify(data));
    },
    select(index: number): void {
      this.selected = index;
    },
    move(index: number): void {
      if (this.caucusData) {
        const j = Math.min(Math.max(parseInt(index.toString(), 10), 0),
          this.caucusData.queue.length - 1);
        this.currentCountry = j;
      }
    },
    getDelegatesID(name: string): string {
      const data = negara.find((obj) => obj.name === name);
      if (data) return data['alpha-2'];
      return 'ad';
    },
    sortCountry(items: any[]): any[] {
      items.sort((a, b) => {
        const nameA = a.country.toUpperCase();
        const nameB = b.country.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return items;
    },
    async updateDelegatesData(): Promise<void> {
      try {
        const delegates = await getAllDelegates(this.$route.params.id);
        if (delegates.data.data !== null) {
          this.delegatesData = this.sortCountry(delegates.data.data.filter((f) => f.status.toLowerCase() === 'present' || f.status.toLowerCase() === 'present & voting'));
          this.newCountryList();
          this.$forceUpdate();
        }
      } catch (err) {
        console.error(err.response);
      }
    },
  },
  async created() {
    this.$root.$on('context', this.context);
    try {
      await this.updateDelegatesData();
      await this.updateCaucus();
    } catch (err) {
      console.error(err);
    }
  },
  computed: {
    ...mapState({
      socket: (state: any) => state.Socket.message,
      countryList: (state: any) => state.Delegates.countryList,
      caucusList: (state: any) => state.Delegates.caucusList,
      widthWindow: (state: any) => state.Global.widthWindow,
      order: (state: any) => state.Socket.message.order,
      contextData: (state: any) => state.Global.contextData,
    }),
    noNext(): boolean {
      if (this.caucusData
      && this.nextButton.includes(this.caucusData.motion.type.toLowerCase())) return false;
      return true;
    },
    moderated(): boolean {
      if (this.caucusData && this.caucusData.motion.type.toLowerCase() === 'moderated caucus') return true;
      return false;
    },
    timerBool(): boolean {
      if (typeof this.socket === 'object' && typeof this.caucusList === 'object' && typeof this.caucusData === 'object') {
        if (this.caucusData!.motion.type === 'moderated caucus' && !this.caucusList[this.caucusCurrent as number]) return false;
        return true;
      }
      return true;
    },
  },
  watch: {
    async order() {
      await this.updateDelegatesData();
      await this.updateCaucus();
    },
  },
  beforeCreate() {
    document.body.style.overflow = 'hidden';
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto';
    this.$root.$off('context', this.context);
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';

body {
  overflow: hidden !important;
}
</style>
