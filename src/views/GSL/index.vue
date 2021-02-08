<template>
  <div class="gsl" v-if="delegatesData.length > 0">
    <h1 v-if="$store.getters.getWidthWindow > 960" class="title">General Speakers List</h1>
    <h1 v-else-if="$store.getters.getWidthWindow < 960" class="title">GSL</h1>
    <div class="wrapper">
      <Timer
        v-if="$store.getters.getWidthWindow < 961"
        class="time"
        :active="active"
        :time="90"
        :muted="muted"
        @active="active()"
        @sound="sound()" />
      <div class="cards">
      <!-- gslData.current - 1 -->
      <CardStack
        v-if="gslList.length > 0"
        :time="90"
        :delegates="gslList"
        :active="active"
        :isActive="0"
        :display="currentCountry"
        @context="context"
        @move="move" />
      </div>
      <div class="options">
        <div class="top" v-if="$store.getters.getWidthWindow > 960">
          <Timer
            class="time"
            :active="active"
            :time="90"
            :muted="muted"
            @active="toggleActive()"
            @sound="sound()" />
          <Queue
            v-if="countryList.length > 0"
            class="queue"
            :items="countryList"
            @add="addQueue" />
        </div>
        <Queue
          v-else-if="$store.getters.getWidthWindow <= 960 && countryList.length > 0"
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
                v-if="countryList.length > 0"
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
import { getConference } from '@/api/conference';
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
      active: true,
      showInput: false,
      gslList: [],
      gslCurrent: null,
    };
  },
  methods: {
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
          turn: this.currentCountry,
          yield: y,
        };
        console.log(data);
        await yieldGSL(this.$route.params.id, data);
      } catch (err) {
        console.error(err.response);
      }
    },
    async context(i) {
      try {
        // eslint-disable-next-line no-underscore-dangle
        await delTurn(this.$route.params.id, i + 1);
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
          this.updateGSL();
        }
      } catch (err) {
        console.error(err.response);
      }
    },
    async updateGSL() {
      try {
        const list = await getGSL(this.$route.params.id);
        if (list.data.data !== null) {
          this.gslData = list.data.data;
          this.gslList = await this.match(this.gslData.queue);
        }
        if (this.gslCurrent !== this.gslData.current) {
          this.currentCountry = this.gslData.current;
          this.gslCurrent = this.gslData.current;
        }
      } catch (err) {
        console.error(err.response);
      }
    },
    match(i) {
      const newArr = [];
      i.forEach((item) => {
        // eslint-disable-next-line no-underscore-dangle
        const data = this.delegatesData.filter((e) => e._id === item.delegate_id)[0];
        data.yield = item.yield;
        newArr.push(data);
      });
      return newArr;
    },
    sound() {
      this.muted = !this.muted;
    },
    toggleActive() {
      this.active = !this.active;
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
        }
      } catch (err) {
        console.error(err.response);
      }
    },
  },
  async created() {
    this.updateDelegatesData();
    this.updateGSL();
    try {
      const conference = await getConference(this.$route.params.id);
      this.rulesData = conference.data.data.rules;
      const [parse] = (conference.data.data.rules.dr_vote).split(' ');
      const num = parse.split('/');
      this.dr_vote = (num[0] / num[1]).toFixed(2);
    } catch (err) {
      console.error(err);
    }
  },
  computed: {
    countryList() {
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
      return list;
    },
    // gslList() {
    //   return this.match(this.gslData.queue);
    // },
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss';
</style>
