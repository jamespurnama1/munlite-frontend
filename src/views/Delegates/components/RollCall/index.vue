<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('no-modal-warn')" id='close' title="Close">
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <h3>Countries</h3>
    <div id='call'>
      <CardStack prgrs="presence" desc="presence" />
      <div id='selection'>
        <button @click="un()"
        :disabled="$store.state.active === 0"
        title="Undo"
        class="red" id="undo">
          <font-awesome-icon :icon="['fas', 'undo']" size="lg" />
        </button>
        <button @click="presence('Present')"
        :disabled="$store.state.done === $store.state.delegates.length">
          <p>Present</p>
        </button>
        <button @click="presence('Present & Voting')"
        :disabled="$store.state.done === $store.state.delegates.length">
          <p>Present<br>&amp; Voting</p>
        </button>
        <button @click="presence('Not Present')" class="red"
        :disabled="$store.state.done === $store.state.delegates.length">
          <p>Not Present</p>
        </button>
      </div>
      <p class='left' v-if="$store.state.done !== $store.state.delegates.length">
        {{ $store.state.delegates.length - $store.state.done }} countries left
      </p>
      <p class='left' v-else-if="$store.state.done === $store.state.delegates.length">
        no countries left
      </p>
        <button @click="$parent.$emit('stage', 2)"
        :disabled="$store.state.done !== $store.state.delegates.length"
        id="continue">
          <p>Continue</p>
        </button>
    </div>
  </div>
</template>

<script>
import CardStack from '@/components/CardStack/index.vue';

export default {
  components: {
    CardStack,
  },
  methods: {
    presence(j) {
      const i = this.$store.state.active;
      this.$store.commit('presence', { i, j });
      this.$store.commit('active', 1);
      if (j === 'Present') {
        this.$store.commit('present');
      } else if (j === 'Present & Voting') {
        this.$store.commit('presentVoting');
      } else if (j === 'Not Present') {
        this.$store.commit('notPresent');
      }
    },
    un() {
      this.$store.commit('active', -1);
      this.$store.commit('undo');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
