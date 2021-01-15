<template>
  <div>
    <h3>{{ content }}</h3>
    <div class="buttons">
      <button @click="exit()">Cancel</button>
      <button @click="action()">Yes</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirmation',
  props: {
    action: Function,
  },
  data() {
    return {
      content: 'Are you sure you want to delete?',
    };
  },
  methods: {
    exit() {
      this.$emit('exit');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
