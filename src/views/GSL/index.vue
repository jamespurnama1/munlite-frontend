<template>
  <div class="gsl">
    <h1 v-if="$store.getters.getWidthWindow > 960" class="title">General Speakers List</h1>
    <h1 v-else-if="$store.getters.getWidthWindow < 960" class="title">GSL</h1>
    <div class="wrapper">
      <div class="cards">
      <CardStack
        :time="90"
        :desc="`presence`"
        :delegates="delegatesData"
        :active="currentCountry"
        @update="updateDelegatesData"
        @move="move" />
      </div>
      <div class="options">
        <h3>Add to Queue</h3>
        <div class="add">
          <Autocomplete
            :items="countryList"
            :class="{show: showInput == true}"
            class="input"
            @update="updateDelegatesData"
          />
          <button @click="toggleInput">Add</button>
        </div>
        <hr>
        <h3>Yield To:</h3>
        <div class="choice">
          <button :class="{ selected: selected === 0 }" @click="select(0)">Chair</button>
          <button :class="{ selected: selected === 1 }" @click="select(1)">Questions</button>
          <button :class="{ selected: selected === 2 }" @click="select(2)">Country</button>
        </div>
        <div class="autoplay">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
          </label>
          <p>autoplay</p>
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

export default {
  name: 'GSL',
  components: {
    CardStack,
    Autocomplete,
  },
  data() {
    return {
      delegatesData: [],
      showInput: false,
      countryList: negara,
      currentCountry: 0,
      newCountry: '',
      selected: 1,
    };
  },
  methods: {
    select(i) {
      this.selected = i;
    },
    move(index) {
      const j = Math.min(Math.max(parseInt(index, 10), 0), this.delegatesData.length - 1);
      this.currentCountry = j;
    },
    toggleInput() {
      this.showInput = !this.showInput;
      this.newCountry = '';
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
