<template>
  <div class="warning">
    <h2>{{ title }}</h2>
    <p>{{ desc }}</p>
    <span>
      <button @click="$parent.$emit('confirm', 'discard')">discard</button>
      <button @click="$parent.$emit('confirm', false)">cancel</button>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'warning',
  props: {
    title: {
      type: String,
      required: true,
    },
    desc: String,
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
