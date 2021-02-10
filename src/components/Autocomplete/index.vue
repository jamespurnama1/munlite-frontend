<template>
  <div id="autocomplete">
    <input
      v-model="newCountry"
      type="text"
      :placeholder="placeholder"
      @input="fillAutocomplete"
      @change="emitData"
    />
    <div class="results" v-if="results.length > 0">
      <ul
        v-show="isOpen"
        class="autocomplete-results"
      >
        <li
          v-for="(result, i) in results"
          :key="i"
          class="autocomplete-result"
          @click="setResult(result)"
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
    new: String,
    placeholder: {
      type: String,
      default: () => 'Name',
    },
  },
  watch: {
    newCountry() {
      this.emitData();
    },
    new() {
      if (this.new === '') {
        this.newCountry = '';
      }
    },
  },
  data() {
    return {
      newCountry: '',
      results: [],
      isOpen: false,
      arrowCounter: 0,
    };
  },
  methods: {
    fillAutocomplete() {
      this.isOpen = true;
      this.filterResults();
    },
    filterResults() {
      this.results = this.items.filter(
        (item) => item.name.toLowerCase().indexOf(this.newCountry.toLowerCase()) > -1,
      );
    },
    setResult(result) {
      this.newCountry = result.name;
      this.$emit('onchangeCountry', this.newCountry);
      this.isOpen = false;
    },
    emitData() {
      this.$emit('onchangeCountry', this.newCountry);
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
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
