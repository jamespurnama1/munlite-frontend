<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('stage', 0)" id='close' title="Close">
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <p>Scroll to move up &amp; down</p>
    <div id='call'>
      <CardStack prgrs="presence" desc="presence" />
      <div id='selection'>
        <div id='select'>
          <button @click="presence('Present')">
            <p>Present</p>
          </button>
          <button @click="presence('Present & Voting')">
            <p>{{ decoder(button) }}</p>
          </button>
          <button @click="presence('Not Present')" class="red">
            <p>Not Present</p>
          </button>
        </div>
      </div>
      <div class="verdict">
        <p v-if="$store.state.done !== $store.state.delegates.length">
          {{ $store.state.delegates.length - $store.state.done }} countries left
        </p>
        <p v-else-if="$store.state.done === $store.state.delegates.length">
          no countries left
        </p>
        <button @click="$parent.$emit('stage', 2)"
        :disabled="$store.state.done !== $store.state.delegates.length"
        id="continue">
          <p>Continue</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CardStack from '@/components/CardStack/index.vue';

export default {
  components: {
    CardStack,
  },
  data() {
    return {
      button: 'Present &amp;&nbsp;Voting',
    };
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
    decoder(str) { // Vue workaround for &nbsp;
      const textArea = document.createElement('textarea');
      textArea.innerHTML = str;
      return textArea.value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
