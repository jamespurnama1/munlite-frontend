<template>
  <div class="gsl">
    <h1 v-if="$store.getters.getWidthWindow > 960" class="title">General Speakers List</h1>
    <h1 v-else-if="$store.getters.getWidthWindow < 960" class="title">GSL</h1>
    <div class="wrapper">
      <Timer
        v-if="$store.getters.getWidthWindow < 961"
        class="time"
        :active="isActive"
        :time="90"
        :muted="muted"
        @active="active()"
        @sound="sound()" />
      <div class="cards">
      <CardStack
        v-if="delegatesData.length > 0"
        :time="90"
        yieldTo="USA"
        :delegates="delegatesData"
        :active="currentCountry"
        :isActive="isActive"
        @update="updateDelegatesData"
        @move="move" />
      </div>
      <div class="options">
        <div class="top" v-if="$store.getters.getWidthWindow > 960">
          <Timer
            class="time"
            :active="isActive"
            :time="90"
            :muted="muted"
            @active="active()"
            @sound="sound()" />
          <Queue
            class="queue"
            :items="countryList"
            @update="updateDelegatesData" />
        </div>
        <Queue
          v-else-if="$store.getters.getWidthWindow < 961"
          class="queue"
          :items="countryList"
          @update="updateDelegatesData" />
        <div class="bottom">
          <h3>Yield To:</h3>
          <div class="choice">
            <span class="ChairQ">
              <button :class="{ selected: selected === 1 }" @click="select(1)">Chair</button>
              <button :class="{ selected: selected === 2 }" @click="select(2)">Questions</button>
            </span>
            <div class="yieldCountry" :class="{filled: selected === 3}">
              <Autocomplete
                :items="countryList"
                :class="{show: showInput == true}"
                @onchangeCountry="yieldInput"
                placeholder="Delegate"
              />
            </div>
          </div>
          <div class="yield">
            <button :disabled="!selected">Yield</button>
          </div>
          <div class="selection" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      countryList: negara,
      currentCountry: 1,
      selected: null,
      yieldDelegate: '',
      muted: false,
      isActive: true,
      showInput: false,
    };
  },
  methods: {
    sound() {
      this.muted = !this.muted;
    },
    active() {
      this.isActive = !this.isActive;
    },
    select(i) {
      this.selected = i;
    },
    move(index) {
      const j = Math.min(Math.max(parseInt(index, 10), 0), this.delegatesData.length - 1);
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
        console.error(err);
      }
    },
  },
  async created() {
    this.updateDelegatesData();
    try {
      const conference = await getConference(this.$route.params.id);
      this.rulesData = conference.data.data.rules;
      console.log(conference);
      const [parse] = (conference.data.data.rules.dr_vote).split(' ');
      const num = parse.split('/');
      this.dr_vote = (num[0] / num[1]).toFixed(2);
    } catch (err) {
      console.error(err);
    }
  },
  mounted() {
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss';
</style>
