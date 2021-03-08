<template>
  <div class="autocomplete">
    <div class="input">
      <input
        ref="input"
        v-model="newCountry"
        type="text"
        @focusin="focus = true; fillAutocomplete(); $emit('focus')"
        @input="fillAutocomplete"
        v-shortkey="{up: ['arrowup'], down: ['arrowdown'], enter: ['enter']}"
        @shortkey="keymap"
        @change="emitData"
        placeholder=" ">
      <label>{{ placeholder }}</label>
    </div>
    <div class="results" v-if="focus">
      <ul
        v-show="isOpen"
        class="autocomplete-results"
      >
        <li
          v-for="(result, index) in results"
          :key="index"
          class="autocomplete-result"
          @mouseover="sel = index"
          @click="setResult(result)"
          :class="{sel: sel === index}"
        >
          {{ result.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Autocomplete',
  props: {
    items: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: () => 'Name',
    },
    prefilled: {
      type: String,
      default: () => '',
    },
    country: String,
  },
  watch: {
    newCountry() {
      this.emitData();
    },
    country() {
      this.newCountry = this.country;
    },
  },
  data() {
    return {
      newCountry: '' as string,
      results: [] as Array<any>,
      isOpen: false as boolean,
      arrowCounter: 0 as number,
      focus: false as boolean,
      sel: 0 as number,
    };
  },
  methods: {
    keymap(event): void {
      switch (event.srcKey) {
        case 'up':
          this.sel = Math.max(this.sel - 1, 0);
          break;
        case 'down':
          this.sel = Math.min(this.sel + 1, this.items.length - 1);
          break;
        case 'enter':
          this.setResult(this.results[this.sel]);
          break;
        default:
          console.error(event);
          break;
      }
    },
    fillAutocomplete(): void {
      this.isOpen = true;
      this.filterResults();
    },
    filterResults(): void {
      if (this.newCountry) {
        this.results = this.items.filter(
          (item: any) => item.name.toLowerCase().indexOf(this.newCountry.toLowerCase()) > -1,
        );
      } else {
        this.results = this.items;
      }
    },
    setResult(result): void {
      this.newCountry = result.name;
      this.$emit('onchangeCountry', this.newCountry);
      this.focus = false;
    },
    emitData(): void {
      this.$emit('onchangeCountry', this.newCountry);
    },
    handleClickOutside(evt): void {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.focus = false;
      }
    },
  },
  created() {
    this.newCountry = this.prefilled;
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
