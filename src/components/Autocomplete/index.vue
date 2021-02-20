<template>
  <div id="autocomplete">
    <div class="input">
      <input
        ref="input"
        v-model="newCountry"
        :data-value="newCountry ? newCountry : ''"
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
          v-for="(result, i) in results"
          :key="i"
          class="autocomplete-result"
          @mouseover="sel = i"
          @click="setResult(result)"
          :class="{sel: sel === i}"
        >
          {{ result.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Autocomplete',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: () => 'Name',
    },
  },
  watch: {
    newCountry() {
      this.emitData();
    },
  },
  data() {
    return {
      newCountry: '',
      results: [],
      isOpen: false,
      arrowCounter: 0,
      focus: false,
      sel: 0,
    };
  },
  methods: {
    keymap(event) {
      switch (event.srcKey) {
        case 'up':
          this.sel -= 1;
          break;
        case 'down':
          this.sel += 1;
          break;
        case 'enter':
          this.setResult(this.results[this.sel]);
          break;
        default:
          console.error(event);
          break;
      }
    },
    fillAutocomplete() {
      this.isOpen = true;
      this.filterResults();
    },
    filterResults() {
      if (this.newCountry) {
        this.results = this.items.filter(
          (item) => item.name.toLowerCase().indexOf(this.newCountry.toLowerCase()) > -1,
        );
      } else {
        this.results = this.items;
      }
    },
    setResult(result) {
      console.log(1, result);
      this.newCountry = result.name;
      this.$emit('onchangeCountry', this.newCountry);
      this.focus = false;
      // this.isOpen = false;
    },
    emitData() {
      this.$emit('onchangeCountry', this.newCountry);
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.focus = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
