<template>
  <div class="motionModal">
    <span class="upper">
      <h1 v-if="!data || Object.keys(data).length === 0">New Motion</h1>
      <h1 v-else>Edit Motion</h1>
      <font-awesome-icon @click="exit()" :icon="['fas', 'times']" />
    </span>
    <div class="type">
      <div @click="focus = true" :class="{error: warn.type, focus: focus}" class="select">
        <p v-if="motionData.type" :class="{black: motionData.type}">{{ motionData.type }}</p>
        <p v-else>Type</p>
        <font-awesome-icon :class="{rotate: focus}" :icon="['fas', 'chevron-down']" />
      </div>
      <div
        class="options"
        v-if="focus"
        v-shortkey="{up: ['arrowup'], down: ['arrowdown'], enter: ['enter']}"
        @shortkey="keymap"
        v-click-outside="config">
        <ul>
          <li
            v-for="(types, index) in options"
            :key="index"
            @click="motionData.type = types; focus = false"
            @mouseover="sel = index"
            :class="{sel: sel === index}"
          >
          {{ types }}
          </li>
        </ul>
      </div>
      <p class="err" v-if="warn.type">
        Please select motion type
      </p>
    </div>
    <div class="info">
      <h3>Info</h3>
      <div
        :class="{disabled: !motionData.type || motionData.type !== 'Moderated Caucus'}"
          class="input"
        >
        <input
          :class="{error: warn.name}"
          placeholder=" "
          v-model="motionData.name">
        <label>Name</label>
      <p class="err" v-if="warn.name">
        Please enter motion name
      </p>
      </div>
      <Autocomplete
        :class="{error: warn.proposer}"
        :items="countryList"
        :prefilled="proposer"
        @onchangeCountry="(country) => {
          motionData.proposer = country
        }"
        placeholder="Proposer"
      />
      <p class="err" v-if="warn.proposer">
        Please select motion proposer
      </p>
    </div>
    <span class="time">
      <div
        class="input"
        :class="{disabled: !motionData.type || motionData.type !== 'Moderated Caucus'}"
      >
        <input
          :class="{error: warn.speaking_time}"
          placeholder=" "
          type="number"
          v-model.number="speaking_time">
        <label>Speaking Time (seconds)</label>
        <p class="err" v-if="warn.speaking_time">Please enter speaking time</p>
      </div>
      <div
        class="input"
        :class="{disabled: !motionData.type || (motionData.type !== 'Consultation of The Whole'
        && motionData.type !== 'Unmoderated Caucus' && motionData.type !== 'Moderated Caucus')}"
      >
        <input
          :class="{error: warn.total_time}"
          placeholder=" "
          type="number"
          v-model.number="total_time">
        <label>Total Time (minutes)</label>
        <p class="err" v-if="warn.total_time">Please enter total time</p>
      </div>
    </span>
    <span class="buttons">
      <button @click="exit()">
        Cancel
      </button>
      <button
        class="blue"
        @click="addMotion(motionData)"
        v-if="!data || Object.keys(data).length === 0"
      >
        Create
      </button>
      <button
        class="blue"
        @click="edit(motionData)"
        v-else
      >
        Save
      </button>
    </span>
  </div>
</template>

<script>
import Autocomplete from '@/components/Autocomplete/index.vue';
import { addMotion } from '@/api/motions';
import { mapState } from 'vuex';

export default {
  name: 'AddMotion',
  components: {
    Autocomplete,
  },
  data() {
    return {
      proposer: '',
      motionData: {
        name: null,
        proposer: null,
        speaking_time: null,
        total_time: null,
        type: null,
        yes_vote: 0,
        no_vote: 0,
      },
      total_time: null,
      speaking_time: null,
      warn: {
        name: false,
        proposer: false,
        speaking_time: false,
        total_time: false,
        type: false,
      },
      options: [
        'Moderated Caucus',
        'Unmoderated Caucus',
        'Suspension of The Debate',
        'Continuation of The Debate',
        'Adjournment of The Meeting',
        'Consultation of The Whole',
      ],
      focus: false,
      config: {
        handler: this.outside,
        events: ['click'],
      },
      sel: 0,
    };
  },
  props: {
    data: Object,
    editMotion: Function,
  },
  created() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.motionData = this.data;
      this.total_time = this.data.total_time / 60;
      this.speaking_time = this.data.speaking_time;
      this.proposer = this.data.proposer;
    }
  },
  methods: {
    keymap(event) {
      switch (event.srcKey) {
        case 'up':
          this.sel = Math.max(this.sel - 1, 0);
          break;
        case 'down':
          this.sel = Math.min(this.sel + 1, this.options.length - 1);
          break;
        case 'enter':
          this.motionData.type = this.options[this.sel];
          this.outside();
          break;
        default:
          console.error(event);
          break;
      }
    },
    outside() {
      this.focus = false;
    },
    exit() {
      this.$emit('exit');
    },
    async addMotion(data) {
      try {
        this.checkForm(data);
        await addMotion(this.$route.params.id, JSON.stringify(data));
        this.$emit('exitSafe');
      } catch (err) {
        console.error(err);
      }
    },
    edit(data) {
      try {
        this.checkForm(data);
        this.editMotion(data);
        this.$emit('exitSafe');
      } catch (err) {
        console.error(err);
      }
    },
    checkForm(data) {
      this.warn = Object.assign(...Object.keys(this.warn).map((warn) => ({ [warn]: false })));
      if (!data.type || data.type === '') {
        this.warn.type = true;
      }
      if (!data.proposer || data.proposer === '') {
        this.warn.proposer = true;
      }
      if (data.type && data.type.toLowerCase() === 'moderated caucus' && (!data.name || data.name === '')) {
        this.warn.name = true;
      }
      if (data.type && data.type.toLowerCase() === 'moderated caucus' && (data.speaking_time === null || data.speaking_time === '')) {
        this.warn.speaking_time = true;
      }
      if (data.type && (data.type.toLowerCase() === 'moderated caucus' || data.type.toLowerCase() === 'consultation of the whole' || data.type.toLowerCase() === 'unmoderated caucus')
      && (data.total_time === null || data.total_time === '')) {
        this.warn.total_time = true;
      }
      if (Object.values(this.warn).filter((f) => f === true).length > 0) {
        throw new Error('Form field not satisfied');
      }
    },
  },
  computed: {
    ...mapState({
      countryList: (state) => state.Delegates.countryList,
      width: (state) => state.Global.widthWindow,
    }),
    type() {
      return this.motionData.type;
    },
    name() {
      return this.motionData.name;
    },
    proposerData() {
      return this.motionData.proposer;
    },
  },
  watch: {
    total_time() {
      this.warn.total_time = false;
      this.motionData.total_time = this.total_time * 60;
    },
    speaking_time() {
      this.warn.speaking_time = false;
      this.motionData.speaking_time = this.speaking_time;
    },
    type() {
      this.warn.type = false;
      if (this.type !== 'Moderated Caucus') {
        this.motionData.name = null;
        this.speaking_time = null;
      }
      if (this.type === 'Suspension of The Debate'
      || this.type === 'Continuation of The Debate'
      || this.type === 'Adjournment of The Meeting') {
        this.total_time = null;
      }
    },
    proposerData() {
      this.warn.proposer = false;
    },
    name() {
      this.warn.name = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
