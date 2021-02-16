<template>
  <div class="gsl" v-if="delegatesData">
    <h1 v-if="widthWindow > 960" class="title">General Speakers List</h1>
    <h1 v-else-if="widthWindow <= 960" class="title">GSL</h1>
    <!-- <p v-if="widthWindow > 960">Scroll or drag the cards to view the rest of the queue.</p>
    <p v-else>Swipe the cards to view the rest of the queue.</p> -->
    <p v-if="widthWindow > 960">Right click the cards for more options.</p>
    <p v-else>Long press the cards for more options.</p>
    <div class="wrapper">
      <Timer
        v-if="widthWindow <= 960
        && socket"
        class="time"
        @active="toggleActive()" />
      <div class="cards">
      <CardStack
        :key="gslList.length"
        v-if="gslList.length > 0"
        :delegates="gslList"
        :active="socket.state === 0"
        :isActive="socket.order"
        :display="currentCountry"
        :actions="['Clear Yield', 'Restart', 'View Notes', 'Remove From Queue']"
        @context="context"
        @move="move" />
      </div>
      <div class="options">
        <div class="top" v-if="widthWindow > 960">
          <Timer
            v-if="socket"
            class="time"
            @active="toggleActive()" />
          <Queue
            v-if="countryList"
            class="queue"
            :items="countryList"
            @add="addQueue" />
        </div>
        <Queue
          v-else-if="widthWindow <= 960
          && countryList"
          class="queue"
          :items="countryList"
          @add="addQueue" />
        <div class="bottom">
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
                @focus="selected = null"
              />
            </div>
            <transition name="fade">
              <div
                class="selection"
                :class="{two: selected === 2, three: selected === 3}"
                v-show="selected" />
            </transition>
          </div>
          <div class="yield">
            <button @click="changeYield()" :disabled="!selected">Yield</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addTurn, getGSL, delTurn, yieldGSL,
} from '@/api/gsl';
import { mapState } from 'vuex';
import { negara } from '@/const/country';
import { getAllDelegates } from '@/api/delegates';
import Autocomplete from '@/components/Autocomplete/index.vue';
import CardStack from '@/components/CardStack/index.vue';
import Timer from '@/components/Timer/index.vue';
import Queue from '@/components/Queue/index.vue';

export default {
  name: 'GSL',
  components: {
    CardStack,
    Timer,
    Queue,
    Autocomplete,
  },
  data() {
    return {
      delegatesData: [],
      gslData: null,
      currentCountry: 0,
      curr: 0,
      selected: null,
      yieldDelegate: '',
      showInput: false,
      gslCurrent: null,
      newArr: [],
    };
  },
  methods: {
    context([i, d], index) {
      console.log(i, d, index);
      switch (i) {
        case 'Remove From Queue':
          this.deleteTurn(index);
          break;
        case 'Clear Yield':
          this.changeYield(index);
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
      console.log('Matched Delegates with Country List', list);
      this.$store.commit('countryList', list);
    },
    newGSLList(l) {
      this.newArr.length = 0;
      let data;
      for (let i = 0; i < l.queue.length; i += 1) {
        // eslint-disable-next-line no-underscore-dangle
        [data] = this.delegatesData.filter((e) => e._id === l.queue[i].delegate_id);
        data.time_start = l.queue[i].time_start;
        data.time_left = l.queue[i].time_left;
        let y;
        if (!l.queue[i].yield) {
          delete data.yield;
        } else if (l.queue[i].yield.toLowerCase() === 'questions' || l.queue[i].yield.toLowerCase() === 'chair') {
          y = { yield: l.queue[i].yield };
        } else if (l.queue[i].yield) {
          // eslint-disable-next-line no-underscore-dangle
          const [delY] = this.delegatesData.filter((e) => e._id === l.queue[i].yield);
          y = { yield: delY.country };
        }
        data = { ...data, ...y };
        this.newArr.push(data);
      }
      this.$store.commit('gslList', this.newArr);
      this.currentCountry = this.current;
    },
    async changeYield(r) {
      let data;
      try {
        let y = '';
        let o = this.current;
        console.log('test', r);
        if (!r) {
          switch (this.selected) {
            case 1:
              y = 'Chair';
              break;
            case 2:
              y = 'Questions';
              break;
            case 3:
              y = this.yieldDelegate;
              break;
            default:
              y = '';
          }
        } else {
          y = '';
          o = r;
        }
        data = {
          order: o + 1,
          yield: y,
        };
        await yieldGSL(this.$route.params.id, data);
        this.updateGSL();
      } catch (err) {
        console.error(err.response);
      }
      console.log('Yield!', data);
    },
    async deleteTurn(i) {
      try {
        // eslint-disable-next-line no-underscore-dangle
        await delTurn(this.$route.params.id, i + 1);
        console.log('Deleted Turn', i + 1);
        this.updateGSL();
      } catch (err) {
        console.error(err.response);
      }
    },
    async addQueue(i) {
      try {
        const [id] = this.delegatesData.filter((obj) => obj.country === i);
        const data = {
          // eslint-disable-next-line no-underscore-dangle
          delegate_id: id._id,
          time_start: 90,
          time_left: 90,
          yield: '',
        };
        if (id) {
          await addTurn(this.$route.params.id, data);
          console.log('Added to Queue', data);
          this.updateGSL();
        }
      } catch (err) {
        console.error(err.response);
      }
    },
    async updateGSL() {
      try {
        const list = await getGSL(this.$route.params.id);
        // eslint-disable-next-line no-underscore-dangle
        console.log('Got new GSL', list.data.data.queue[0].yield, list.data.data.queue[0].delegate_id);
        if (list.data.data !== null) {
          this.gslData = list.data.data;
          this.newGSLList(list.data.data);
        }
        if (this.gslCurrent !== this.gslData.current) {
          this.currentCountry = this.gslData.current;
          this.gslCurrent = this.gslData.current;
        }
      } catch (err) {
        console.error(err.response);
      }
    },
    toggleActive() {
      const data = {
        session: 'gsl',
      };
      if (this.socket.state === 2) {
        data.command = 'start';
        data.time = 90;
        data.order = 1;
      } else if (this.socket.state === 1) {
        data.command = 'resume';
      } else {
        data.command = 'pause';
      }
      console.log('Send WebSocket Data!', JSON.stringify(data));
      this.$socket.send(JSON.stringify(data));
    },
    select(i) {
      this.selected = i;
    },
    move(index) {
      const j = Math.min(Math.max(parseInt(index, 10), 0), this.gslData.queue.length - 1);
      this.currentCountry = j;
    },
    yieldInput(country) {
      if (country.length > 0) {
        this.selected = 3;
      } else {
        this.selected = 0;
      }
      const [del] = this.delegatesData.filter((obj) => obj.country === country);
      // eslint-disable-next-line no-underscore-dangle
      this.yieldDelegate = del._id;
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
          this.delegatesData = this.sortCountry(delegates.data.data);
          this.newCountryList();
        }
        console.log('Got new Delegates', delegates.data.data);
      } catch (err) {
        console.error(err.response);
      }
    },
  },
  async created() {
    try {
      await this.updateDelegatesData();
      this.updateGSL();
    } catch (err) {
      console.error(err);
    }
  },
  computed: {
    ...mapState({
      socket: (state) => state.Socket.message,
      countryList: (state) => state.Delegates.countryList,
      gslList: (state) => state.Delegates.gslList,
      widthWindow: (state) => state.Global.widthWindow,
      current: (state) => state.Global.current,
    }),
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss';
</style>
