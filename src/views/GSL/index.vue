<template>
  <div class="gsl" v-if="delegatesData">
    <h1 v-if="$store.getters.getWidthWindow > 960" class="title">General Speakers List</h1>
    <h1 v-else-if="$store.getters.getWidthWindow < 960" class="title">GSL</h1>
    <div class="wrapper">
      <Timer
        v-if="$store.getters.getWidthWindow <= 960
        && socket"
        class="time"
        :muted="muted"
        @active="active()"
        @sound="sound()" />
      <div class="cards">
      <CardStack
        v-if="gslList.length > 0"
        :delegates="gslList"
        :active="this.socket.state === 0"
        :isActive="gslData.current - 1"
        :display="currentCountry"
        @context="context"
        @move="move" />
      </div>
      <div class="options">
        <div class="top" v-if="$store.getters.getWidthWindow > 960">
          <Timer
            v-if="socket"
            class="time"
            :muted="muted"
            @active="toggleActive()"
            @sound="sound()" />
          <Queue
            v-if="countryList"
            class="queue"
            :items="countryList"
            @add="addQueue" />
        </div>
        <Queue
          v-else-if="$store.getters.getWidthWindow <= 960
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
            <button @click="changeYield" :disabled="!selected">Yield</button>
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
      selected: null,
      yieldDelegate: '',
      muted: false,
      showInput: false,
      gslCurrent: null,
      newArr: [],
    };
  },
  methods: {
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
      l.queue.forEach((item) => {
        // eslint-disable-next-line no-underscore-dangle
        const data = this.delegatesData.filter((e) => e._id === item.delegate_id)[0];
        data.time_start = item.time_start;
        data.time_left = item.time_left;
        if (item.yield) {
          data.yield = item.yield;
        }
        console.log(data.yield);
        // this.$set(this.newArr, i, data);
        this.newArr.push(data);
      });
      // eslint-disable-next-line no-underscore-dangle
      console.log('Matched GSL with Delegates', ...this.newArr);
      this.$store.commit('gslList', this.newArr);
    },
    async changeYield() {
      try {
        let y = '';
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
        const data = {
          order: this.$store.state.Global.current + 1,
          yield: y,
        };
        await yieldGSL(this.$route.params.id, data);
        console.log('Yield!', data);
        this.updateGSL();
      } catch (err) {
        console.error(err.response);
      }
    },
    async context(i) {
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
    sound() {
      this.muted = !this.muted;
    },
    toggleActive() {
      const data = {
        session: 'gsl',
        order: 1,
      };
      if (this.socket.state !== 0) {
        data.command = 'start';
      } else {
        data.command = 'pause';
      }
      if (this.socket.time_left <= 0) {
        data.time = 90;
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
      this.yieldDelegate = country;
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
    }),
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss';
</style>
