/<!-- eslint-disable vue/valid-v-on -->
<template>
  <div class="motionModal"
    v-shortkey="{enter: ['enter']}"
    @shortkey.propagate="onEnter"
  >
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
        @shortkey.propagate="keymap"
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
      <button class="blue" @click="addMotion(motionData)">
        <p v-if="!data || Object.keys(data).length === 0">Create</p>
        <p v-else>Edit</p>
      </button>
    </span>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropType } from 'vue';
import Autocomplete from '@/components/Autocomplete/index.vue';
import { addMotion } from '@/api/motions';
import { mapState } from 'vuex';
// eslint-disable-next-line no-unused-vars
import { motionsType } from '@/types/api';

export default Vue.extend({
  name: 'AddMotion',
  components: {
    Autocomplete,
  },
  data() {
    return {
      proposer: '' as string,
      motionData: {
        name: '',
        proposer: '',
        speaking_time: 0,
        total_time: 0,
        type: '',
        yes_vote: 0,
        no_vote: 0,
      } as motionsType.addMotion,
      total_time: null as null | number,
      speaking_time: null as null | number,
      warn: {
        name: false,
        proposer: false,
        speaking_time: false,
        total_time: false,
        type: false,
      } as {[key: string]: boolean},
      options: [
        'Moderated Caucus',
        'Unmoderated Caucus',
        'Suspension of The Debate',
        'Resumption of The Debate',
        'Adjournment of The Meeting',
        'Consultation of The Whole',
      ] as string[],
      focus: false as boolean,
      config: {
        // @ts-ignore
        handler: this.outside,
        events: ['click', 'touchstart', 'touchmove'],
      },
      sel: 0 as number,
    };
  },
  props: {
    data: Object as PropType<motionsType.getMotions>,
    editMotion: Function,
  },
  created() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.motionData = this.data;
      this.total_time = this.data.total_time / 60;
      this.speaking_time = this.data.speaking_time;
      this.proposer = this.data.proposer;
    }
    window.onbeforeunload = () => 'Are you sure?';
  },
  beforeDestroy() {
    window.onbeforeunload = () => {};
  },
  methods: {
    onEnter(event): void {
      if (!this.focus && event.srcKey === 'enter') this.addMotion(this.motionData);
    },
    keymap(event): void {
      if (this.focus) {
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
      }
    },
    outside(): void {
      this.focus = false;
    },
    exit(): void {
      this.$emit('exit');
    },
    async addMotion(data: motionsType.addMotion): Promise<void> {
      if (!this.data) {
        try {
          this.checkForm(data);
          await addMotion(this.$route.params.id, data);
          this.$emit('exitSafe');
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          this.checkForm(data);
          await this.editMotion(data);
          this.$emit('exitSafe');
        } catch (err) {
          console.error(err);
        }
      }
    },
    checkForm(data: motionsType.addMotion): void {
      const reset = Object.keys(this.warn).map((warn) => ({ [warn]: false }));
      this.warn = Object.assign(this.warn, ...reset);
      if (!data.type || data.type === '') {
        this.warn.type = true;
      }
      if (!data.proposer || data.proposer === '') {
        this.warn.proposer = true;
      }
      if (data.type && data.type.toLowerCase() === 'moderated caucus' && (!data.name || data.name === '')) {
        this.warn.name = true;
      }
      if (data.type && data.type.toLowerCase() === 'moderated caucus' && !data.speaking_time) {
        this.warn.speaking_time = true;
      }
      if (data.type && (data.type.toLowerCase() === 'moderated caucus' || data.type.toLowerCase() === 'consultation of the whole' || data.type.toLowerCase() === 'unmoderated caucus')
      && !data.total_time) {
        this.warn.total_time = true;
      }
      if (Object.values(this.warn).filter((f) => f === true).length > 0) {
        throw new Error('Form field not satisfied');
      }
    },
  },
  computed: {
    ...mapState({
      countryList: (state: any) => state.Delegates.countryList,
      width: (state: any) => state.Global.widthWindow as number,
    }),
    type(): string {
      return this.motionData.type;
    },
    name(): string {
      return this.motionData.name;
    },
    proposerData(): string {
      return this.motionData.proposer;
    },
  },
  watch: {
    total_time() {
      this.warn.total_time = false;
      if (this.total_time !== null) this.motionData.total_time = this.total_time * 60;
    },
    speaking_time() {
      this.warn.speaking_time = false;
      if (this.speaking_time !== null) this.motionData.speaking_time = this.speaking_time;
    },
    type() {
      this.warn.type = false;
      if (this.type !== 'Moderated Caucus') {
        this.motionData.name = '';
        this.speaking_time = null;
      }
      if (this.type === 'Suspension of The Debate'
      || this.type === 'Resumption of The Debate'
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
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
