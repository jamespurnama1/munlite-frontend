<template>
<div class="wrap">
  <div class="gsl" v-if="delegatesData.length > 0 && caucusData">
    <div class="upper">
      <span>
        <h1 v-if="caucusData.motion.name" class="title">{{ caucusData.motion.name }}</h1>
        <h1 v-else class="title">{{ caucusData.motion.type }}</h1>
        <!-- <p v-if="widthWindow > 960">Scroll or drag the cards to view the rest of the queue.</p>
        <p v-else>Swipe the cards to view the rest of the queue.</p> -->
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
        v-if="widthWindow <= 960
        && socket"
        class="time"
        :class="{solo: !moderated}"
        :next="noNext"
        @active="toggleActive()"
        @update="updateCaucus()"
        @restart="restart()"
        @next="next"
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
              v-if="socket"
              class="time"
              :next="noNext"
              @active="toggleActive()"
              @update="updateCaucus()"
              @restart="restart()"
              @next="next"
            />
          </div>
          <Queue
            key="2"
            v-else-if="widthWindow <= 960
            && countryList && showQueue"
            class="queue"
            :items="countryList"
            @add="addQueue"
            :disable="caucusData.length
              >= (caucusData.motion.total_time / caucusData.motion.speaking_time)"
            v-click-outside="config"
            :defaultTime="caucusData.motion.speaking_time"
          />
          <div
            key="3"
            class="bottom"
            v-if="widthWindow > 960"
            v-click-outside="config"
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
  <div v-else-if="!caucusData" class="noCaucus">
    <h1>No Caucus</h1>
    <p>Start a caucus from the motions tab.</p>
  </div>
</div>
</template>

<script>
import {
  addTurn, currentCaucus, delTurn, nextCaucus, timeLeft,
} from '@/api/caucus';
import { mapState } from 'vuex';
import { negara } from '@/const/country';
import { getAllDelegates } from '@/api/delegates';
import CardStack from '@/components/CardStack/index.vue';
import Timer from '@/components/Timer/index.vue';
import Queue from '@/components/Queue/index.vue';

export default {
  name: 'Caucus',
  components: {
    CardStack,
    Timer,
    Queue,
  },
  data() {
    return {
      delegatesData: [],
      caucusData: null,
      currentCountry: 0, // cardstacks display
      selected: null,
      showInput: false,
      caucusCurrent: null, // current in GET caucus
      newArr: [],
      showQueue: false,
      prevent: false,
      config: {
        handler: this.outside,
        events: ['click'],
      },
      nextButton: [
        'consultation of the whole',
        'unmoderated caucus',
      ],
    };
  },
  methods: {
    outside() {
      this.showQueue = false;
    },
    context([action, , , index]) {
      switch (action) {
        case 'Remove From Queue':
          this.deleteTurn(index);
          break;
        case 'View Notes':
          // TODO:view notes
          break;
        case 'Restart':
          this.restart();
          break;
        default:
      }
    },
    newCountryList() {
      const list = [];
      this.delegatesData.forEach((item) => {
        let data = negara.filter((e) => e.name === item.country)[0];
        if (data) {
          list.push(data);
        } else {
          data = {
            name: item.country,
          };
          list.push(data);
        }
      });

      this.$store.commit('countryList', list);
    },
    newCaucusList(l) {
      this.newArr.length = 0;
      let data;
      for (let i = 0; i < l.queue.length; i += 1) {
        [data] = this.delegatesData.filter((e) => e._id === l.queue[i].delegate_id);
        if (data) {
          data.time_start = l.queue[i].time_start;
          data.time_left = l.queue[i].time_left;
          data = { ...data };
          this.newArr.push(data);
        }
      }
      this.$store.commit('caucusList', this.newArr);
      this.currentCountry = this.caucusCurrent;
    },
    async next() {
      try {
        const next = {
          session: 'caucus',
          command: 'stop',
          order: this.caucusCurrent,
        };
        this.$socket.send(JSON.stringify(next));
        await timeLeft(this.$route.params.id, JSON.stringify({
          order: this.caucusCurrent + 1,
          time_left: this.socket.time,
        }));
        await nextCaucus(this.$route.params.id);
        this.updateCaucus();
      } catch (err) {
        console.error(err);
      }
    },
    async restart() {
      const data = {
        session: 'caucus',
        command: 'stop',
        order: this.caucusCurrent,
      };
      this.$socket.send(JSON.stringify(data));
      let time = this.caucusData.motion.total_time;
      if (this.caucusData.motion.type.toLowerCase() === 'moderated caucus') {
        time = this.caucusList[this.caucusCurrent].time_start;
      }
      await setTimeout(() => {
        const play = {
          session: 'caucus',
          command: 'start',
          time,
          order: this.caucusCurrent,
        };
        this.$socket.send(JSON.stringify(play));
      }, 1000);
    },
    async deleteTurn(i) {
      try {
        await delTurn(this.$route.params.id, i + 1);
        this.updateCaucus();
      } catch (err) {
        console.error(err.response);
      }
    },
    async addQueue([country, time]) {
      try {
        const [id] = this.delegatesData.filter((obj) => obj.country === country);
        const data = {
          delegate_id: id._id,
          time_start: time,
          time_left: time,
        };
        if (id
        && this.caucusData.length
        < (this.caucusData.motion.total_time / this.caucusData.motion.speaking_time)) {
          await addTurn(this.$route.params.id, data);
          this.updateCaucus();
        }
        this.showQueue = false;
      } catch (err) {
        console.error(err.response);
      }
    },
    async updateCaucus() {
      try {
        const list = await currentCaucus(this.$route.params.id);
        if (list.data.data !== null) {
          this.caucusData = list.data.data;
          this.newCaucusList(list.data.data);
        }
        if (this.caucusCurrent !== this.caucusData.current) {
          this.currentCountry = this.caucusData.current;
          this.caucusCurrent = this.caucusData.current;
        }
      } catch (err) {
        console.error(err.response);
      }
    },
    toggleActive() {
      let time = this.caucusData.motion.total_time;
      if (this.caucusData.motion.type.toLowerCase() === 'moderated caucus') {
        time = this.caucusList[this.caucusCurrent].time_start;
      }
      const data = {
        session: 'caucus',
      };
      if (this.socket.state === 2) {
        data.command = 'start';
        data.time = time;
        data.order = this.caucusCurrent;
      } else if (this.socket.state === 1) {
        data.command = 'resume';
        data.order = this.caucusCurrent;
      } else {
        data.command = 'pause';
        data.order = this.caucusCurrent;
      }
      this.$socket.send(JSON.stringify(data));
    },
    select(i) {
      this.selected = i;
    },
    move(index) {
      const j = Math.min(Math.max(parseInt(index, 10), 0), this.caucusData.queue.length - 1);
      this.currentCountry = j;
    },
    getDelegatesID(name) {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    sortCountry(items) {
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
    async updateDelegatesData() {
      try {
        const delegates = await getAllDelegates(this.$route.params.id);
        if (delegates.data.data !== null) {
          this.delegatesData = this.sortCountry(delegates.data.data.filter((f) => f.status.toLowerCase() === 'present' || f.status.toLowerCase() === 'present & voting'));
          this.newCountryList();
        }
      } catch (err) {
        console.error(err.response);
      }
    },
  },
  async created() {
    this.$root.$on('context', (...args) => this.context(...args));
    try {
      await this.updateDelegatesData();
      this.updateCaucus();
    } catch (err) {
      console.error(err);
    }
  },
  computed: {
    ...mapState({
      socket: (state) => state.Socket.message,
      countryList: (state) => state.Delegates.countryList,
      caucusList: (state) => state.Delegates.caucusList,
      widthWindow: (state) => state.Global.widthWindow,
    }),
    noNext() {
      if (this.nextButton.includes(this.caucusData.motion.type.toLowerCase())) return true;
      return false;
    },
    actions() {
      const action = {
        Restart: true,
        'View Notes': false,
        'Remove From Queue': true,
      };
      return action;
    },
    moderated() {
      if (this.caucusData.motion.type.toLowerCase() === 'moderated caucus') return true;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>

<style lang="scss">
body {
  overflow: hidden !important;
}
</style>
