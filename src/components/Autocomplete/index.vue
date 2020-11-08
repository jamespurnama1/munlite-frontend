<template>
  <div id="autocomplete">
    <input
      v-model="newCountry"
      type="text"
      placeholder="add country..."
      @input="fillAutocomplete"
      @keydown.enter="onEnter"
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
import { addDelegates } from '@/api/delegates';

export default {
  name: 'Autocomplete',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
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
      this.isOpen = false;
    },
    async onEnter() {
      try {
        if (this.newCountry.length > 0) {
          const data = [{
            country: this.newCountry,
            status: 'N/A',
          }];
          await addDelegates('5f96e22bdb7ee38458e581e9', data);
          this.$emit('update');

          this.newCountry = '';
          this.isOpen = false;
        }
      } catch (err) {
        console.error(err.response);
      }
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
