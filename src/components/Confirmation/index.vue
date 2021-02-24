<template>
  <div class="confirmation">
    <h3>{{ content }}</h3>
    <div class="buttons">
      <button @click="exit()" class="cancel">{{ whiteButton }}</button>
      <button @click="action(id); exit()"
        :class="{red: negative, blue: negative === false}">
        {{ button }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirmation',
  props: {
    action: Function,
    button: String,
    whiteButton: {
      type: String,
      default: 'Cancel',
    },
    content: String,
    id: String,
    negative: Boolean,
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
