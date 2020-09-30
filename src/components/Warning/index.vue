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

<script>
export default {
  name: 'warning',
  props: {
    title: String,
    desc: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
