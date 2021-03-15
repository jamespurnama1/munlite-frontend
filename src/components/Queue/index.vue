<template>
  <div>
    <div class="add">
      <h3>Add to Queue</h3>
      <div class="input">
        <Autocomplete
          :items="items"
          :class="{show: showInput === true, error: warn.country}"
          @onchangeCountry="(n) => newCountry = n"
          placeholder="Delegate"
          :country="newCountry"
          @enter="toggleInput()"
        />
        <p class="err" v-if="warn.country">Please select a delegate</p>
      </div>
      <div class="input">
          <input
            :class="{error: warn.time}"
            placeholder=" "
            v-model.number="time"
            type="number"
            min="0"
            @shortkey.stop="toggleInput"
          >
          <label>Time (seconds)</label>
        <p class="err" v-if="warn.time">Please enter speaking time</p>
      </div>
      <span class="container">
        <button :disabled="disable" class="button" @click="toggleInput">Add</button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Autocomplete from '@/components/Autocomplete/index.vue';

export default Vue.extend({
  name: 'Queue',
  components: {
    Autocomplete,
  },
  data() {
    return {
      showInput: false as boolean,
      newCountry: '' as string,
      time: null as number | null,
      warn: {
        time: false as boolean,
        country: false as boolean,
      },
    };
  },
  props: {
    items: Array,
    defaultTime: Number,
    disable: Boolean,
  },
  methods: {
    toggleInput(): void {
      if (!this.time && typeof this.time !== 'number') {
        this.warn.time = true;
      }
      if (this.newCountry === '') {
        this.warn.country = true;
      }
      if (Object.values(this.warn).every((val) => val === false)) {
        this.showInput = !this.showInput;
        this.$emit('add', [this.newCountry, this.time]);
        this.newCountry = '';
        this.time = null;
        if (this.defaultTime) this.time = this.defaultTime;
      }
    },
  },
  watch: {
    time() {
      this.warn.time = false;
    },
    newCountry() {
      this.warn.country = false;
    },
  },
  created() {
    this.time = this.defaultTime;
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
