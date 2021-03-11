<template>
  <div class="gsl" v-if="delegatesData.length > 0">
    <div class="upper">
      <span>
        <h1 v-if="widthWindow > 960" class="title">General Speakers List</h1>
        <h1 v-else-if="widthWindow <= 960" class="title">GSL</h1>
        <!-- <p v-if="widthWindow > 960">Scroll or drag the cards to view the rest of the queue.</p>
        <p v-else>Swipe the cards to view the rest of the queue.</p> -->
        <p v-if="widthWindow > 960">Right click the cards for more options.</p>
        <p v-else>Long press the cards for more options.</p>
      </span>
      <div class="button" v-if="widthWindow <= 960">
        <button @click="showYield = true" >
          <h3>Yield To</h3>
        </button>
        <button @click="showQueue = true">
          <font-awesome-icon :icon="['fas', 'plus']"/>
        </button>
      </div>
    </div>
    <div class="wrapper">
      <Timer
        v-if="widthWindow <= 960
        && socket && gslList[gslCurrent]"
        class="time"
        @active="toggleActive()"
        @update="updateGSL()"
        @restart="restart()"
        @next="next"
        :time_left="gslList[gslCurrent].time_left"
      />
      <div class="cards">
        <CardStack
          :key="gslList.length"
          v-if="gslList.length > 0"
          :delegates="gslList"
          :active="socket.state === 0"
          :isActive="gslCurrent"
          :display="currentCountry"
          :actions="actions"
          :prevent="prevent"
          @move="move"
        />
        <div class="noQueue" v-else>
          <h3>No delegates in queue</h3>
          <p v-if="widthWindow <= 960">Add delegates from the plus button</p>
          <p v-else>Start by typing a country name on the right</p>
        </div>
      </div>
      <div class="options">
        <transition-group name="fade">
          <div key="1" class="top" v-if="widthWindow > 960">
            <Timer
              v-if="socket && gslList[gslCurrent]"
              class="time"
              @active="toggleActive()"
              @update="updateGSL()"
              @restart="restart()"
              @next="next"
              :time_left="gslList[gslCurrent].time_left"
            />
            <Queue
              v-if="countryList"
              class="queue"
              :items="countryList"
              @add="addQueue"
            />
          </div>
          <Queue
            key="2"
            v-else-if="widthWindow <= 960
            && countryList && showQueue"
            class="queue"
            :items="countryList"
            @add="addQueue"
            v-click-outside="config"
          />
          <div
            key="3"
            class="bottom"
            v-if="widthWindow > 960 || showYield"
            v-click-outside="config"
          >
            <h3>Yield To:</h3>
            <div class="choice">
              <span class="ChairQ">
                <button :class="{ selected: selected === 1 }" @click="select(1)">Chair</button>
                <button :class="{ selected: selected === 2 }" @click="select(2)">Questions</button>
              </span>
              <div class="yieldCountry" :class="{filled: selected === 3}">
                <Autocomplete
                  v-if="countryList"
                  :items="countryList"
                  :class="{show: showInput == true}"
                  @onchangeCountry="yieldInput"
                  placeholder="Delegate"
                  @focus="selected = null; prevent = true"
                  :country="yieldCountry"
                />
              </div>
              <transition name="fade">
                <div
                  class="selection"
                  :class="{two: selected === 2, three: selected === 3}"
                  v-show="selected"
                />
              </transition>
            </div>
            <div class="yield">
              <button @click="changeYield(selected); prevent = false" :disabled="!selected">
                Yield
              </button>
            </div>
          </div>
          <div key="4" class="overlay" v-if="widthWindow <= 960
            && countryList && (showQueue || showYield)"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  addTurn, getGSL, delTurn, yieldGSL, nextGSL, timeLeft,
} from '@/api/gsl';
import { mapState } from 'vuex';
import negara from '@/const/country';
import { getAllDelegates } from '@/api/delegates';
import Autocomplete from '@/components/Autocomplete/index.vue';
import CardStack from '@/components/CardStack/index.vue';
import Timer from '@/components/Timer/index.vue';
import Queue from '@/components/Queue/index.vue';
// eslint-disable-next-line no-unused-vars
import { delegatesType, gslType, websocketType } from '@/types/api';

export default Vue.extend({
  name: 'GSL',
  components: {
    CardStack,
    Timer,
    Queue,
    Autocomplete,
  },
  data() {
    return {
      delegatesData: [] as delegatesType.getAllDelegates[],
      gslData: null as gslType.getGSL | null,
      currentCountry: 0 as number, // cardstacks display
      selected: null as 0 | 1 | 2 | 3 | null,
      yieldDelegate: '' as string,
      yieldCountry: '' as string,
      showInput: false as boolean,
      gslCurrent: null as number | null, // current in GET gsl
      newArr: [] as unknown as (delegatesType.getAllDelegates & Partial<gslType.getTurn>)[],
      showYield: false as boolean,
      showQueue: false as boolean,
      prevent: false as boolean,
      config: {
        // @ts-ignore
        handler: this.outside,
        events: ['click', 'touchstart', 'touchmove'],
      },
      actions: {
        Restart: true as boolean,
        'View Notes': false as boolean,
        'Clear Yield': true as boolean,
        'Remove From Queue': true as boolean,
      },
    };
  },
  methods: {
    outside(): void {
      this.showYield = false;
      this.showQueue = false;
    },
    context([action, , , index]: any[] = []): void {
      switch (action) {
        case 'Remove From Queue':
          this.deleteTurn(index);
          break;
        case 'Clear Yield':
          this.changeYield(0);
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
    newCountryList(): void {
      const list: { name: string }[] = [];
      this.delegatesData.forEach((item) => {
        let data: { name: string } = negara.filter((e) => e.name === item.country)[0];
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
    newGSLList(l: gslType.getGSL) {
      this.newArr.length = 0;
      let data: delegatesType.getAllDelegates & Partial<gslType.getTurn>;
      for (let i = 0; i < l.queue.length; i += 1) {
        [data] = this.delegatesData.filter((e) => e._id === l.queue[i].delegate_id);
        if (data) {
          data.time_start = l.queue[i].time_start;
          data.time_left = l.queue[i].time_left;
          let y: { yield: string } = {
            yield: '',
          };
          if (!l.queue[i].yield) {
            delete data.yield;
          } else if (l.queue[i].yield
            && (l.queue[i].yield!.toLowerCase() === 'questions' || l.queue[i].yield!.toLowerCase() === 'chair')) {
            y = { yield: l.queue[i].yield as string };
          } else if (l.queue[i].yield) {
            const [delY] = this.delegatesData.filter((e) => e._id === l.queue[i].yield);
            y = { yield: delY.country };
          }
          data = { ...data, ...y };
          this.newArr.push(data);
        }
      }
      this.$store.commit('gslList', this.newArr);
    },
    async changeYield(selected: 0 | 1 | 2 | 3): Promise<void> {
      try {
        let order: number = 0;
        let data: gslType.yieldGSL = {
          order,
          yield: '',
        };
        if (this.gslCurrent !== null) order = this.gslCurrent + 1;
        // if (this.socket.order === order) {
        switch (selected) {
          case 0:
            data = {
              order,
              yield: '',
            };
            break;
          case 1:
            data = {
              order,
              yield: 'Chair',
            };
            break;
          case 2:
            data = {
              order,
              yield: 'Questions',
            };
            break;
          case 3:
            data = {
              order,
              yield: this.yieldDelegate,
              time_left: this.socket.time,
            };
            this.yieldCountry = '';
            break;
          default:
        }
        await yieldGSL(this.$route.params.id, data);
        if (selected === 1) {
          this.$socket.send(JSON.stringify({
            session: 'gsl',
            command: 'stop',
            order,
          }));
          await timeLeft(this.$route.params.id, {
            order,
            time_left: this.socket.time,
          });
          if (this.gslCurrent as number < this.gslList.length - 1) {
            await nextGSL(this.$route.params.id);
          }
        }
        if (selected === 2) {
          this.$socket.send(JSON.stringify({
            session: 'gsl',
            command: 'pause',
            order,
          }));
        }
        this.updateGSL();
      } catch (err) {
        console.error(err);
      }
      this.showYield = false;
    },
    async next(): Promise<void> {
      try {
        const next = {
          session: 'gsl',
          command: 'stop',
          order: this.gslCurrent,
        };
        this.$socket.send(JSON.stringify(next));
        if (this.gslCurrent !== null) {
          await timeLeft(this.$route.params.id, {
            order: this.gslCurrent + 1,
            time_left: this.socket.time,
          });
          if (this.gslCurrent < this.gslList.length - 1) await nextGSL(this.$route.params.id);
          this.updateGSL();
        }
      } catch (err) {
        console.error(err);
      }
    },
    restart(): void {
      const data = {
        session: 'gsl',
        command: 'stop',
        order: this.gslCurrent,
      };
      this.$socket.send(JSON.stringify(data));
      setTimeout(() => {
        if (this.gslCurrent !== null) {
          const play = {
            session: 'gsl',
            command: 'start',
            time: this.gslList[this.gslCurrent].time_start,
            order: this.gslCurrent,
          };
          this.$socket.send(JSON.stringify(play));
        }
      }, 500);
    },
    async deleteTurn(index: number): Promise<void> {
      try {
        await delTurn(this.$route.params.id, index + 1);
        this.updateGSL();
      } catch (err) {
        console.error(err);
      }
    },
    async addQueue([country, time]: [string, number]): Promise<void> {
      try {
        const [id] = this.delegatesData.filter((obj) => obj.country === country);
        const data = {
          delegate_id: id._id,
          time_start: time,
          time_left: time,
          yield: '',
        };
        if (id) {
          await addTurn(this.$route.params.id, data);
          this.updateGSL();
        }
        this.showQueue = false;
      } catch (err) {
        console.error(err);
      }
    },
    async updateGSL(): Promise<void> {
      try {
        const list = await getGSL(this.$route.params.id);
        if (list.data.data !== null) {
          this.gslData = list.data.data;
          this.newGSLList(list.data.data);
        }
        if (this.gslData && this.gslCurrent !== this.gslData.current) {
          this.currentCountry = this.gslData.current;
          this.gslCurrent = this.gslData.current;
        }
      } catch (err) {
        console.error(err);
      }
    },
    toggleActive(): void {
      const data: websocketType.send = {
        session: 'gsl',
        order: 0,
      };
      if (this.gslCurrent !== null && this.socket.state === 2) {
        data.command = 'start';
        data.time = this.gslList[this.gslCurrent].time_left;
        data.order = this.gslCurrent;
      } else if (this.gslCurrent !== null && this.socket.state === 1) {
        data.command = 'resume';
        data.order = this.gslCurrent;
      } else if (this.gslCurrent !== null) {
        data.command = 'pause';
        data.order = this.gslCurrent;
      }
      this.$socket.send(JSON.stringify(data));
    },
    select(i: 0 | 1 | 2 | 3): void {
      this.selected = i;
    },
    move(index: number): void {
      let j: number = 0;
      if (this.gslData) {
        j = Math.min(Math.max(parseInt(index.toString(), 10), 0), this.gslData.queue.length - 1);
      }
      this.currentCountry = j;
    },
    yieldInput(country: string): void {
      if (country.length > 0) {
        this.selected = 3;
      } else {
        this.selected = 0;
      }
      const [del] = this.delegatesData.filter((obj) => obj.country === country);
      this.yieldDelegate = del._id;
      this.yieldCountry = country;
    },
    getDelegatesID(name: string): string {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    sortCountry(items: delegatesType.getAllDelegates[]): delegatesType.getAllDelegates[] {
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
          this.delegatesData = this.sortCountry(delegates.data.data);
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
      this.updateGSL();
    } catch (err) {
      console.error(err);
    }
  },
  computed: {
    ...mapState({
      socket: (state: any) => state.Socket.message,
      countryList: (state: any) => state.Delegates.countryList,
      gslList: (state: any) => state.Delegates.gslList,
      widthWindow: (state: any) => state.Global.widthWindow,
    }),
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';

body {
  overflow: hidden !important;
}
</style>
