<template>
  <div>
    <div class="add">
      <h3>Add to Queue</h3>
      <div class="input">
        <Autocomplete
          :items="items"
          :class="{show: showInput === true}"
          :new="newCountry"
          @onchangeCountry="(n) => newCountry = n"
          placeholder="Delegate"
        />
      </div>
      <span class="container">
        <button class="button" @click="toggleInput">Add</button>
      </span>
    </div>
  </div>
</template>

<script>
import Autocomplete from '@/components/Autocomplete/index.vue';

export default {
  name: 'Queue',
  components: {
    Autocomplete,
  },
  data() {
    return {
      showInput: false,
      newCountry: '',
    };
  },
  props: {
    items: Array,
  },
  methods: {
    toggleInput() {
      this.showInput = !this.showInput;
      this.$emit('add', this.newCountry);
      this.newCountry = '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
