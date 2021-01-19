<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('stage', 0)" id='close' title="Close">
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <p>Scroll to move up &amp; down</p>
    <div id='call'>
      <CardStack
      :progress="`presence`"
      :desc="`presence`"
      :delegates="delegatesData"
      :active="currentCountry"
      @move="move"
      class="left" />
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
        <p v-if="$store.state.done !== delegatesData.length">
          {{ delegatesData.length - voteCount }} countries left
        </p>
        <p v-else-if="$store.state.done === delegatesData.length">
          no countries left
        </p>
        <button @click="$parent.$emit('stage', 2)"
        :disabled="voteCount !== delegatesData.length"
        id="continue">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { editDelegates, getAllDelegates } from '@/api/delegates';
import CardStack from '@/components/CardStack/index.vue';

export default {
  components: {
    CardStack,
  },
  data() {
    return {
      button: 'Present &amp;&nbsp;Voting',
      voteCount: 0,
      currentCountry: 0,
    };
  },
  props: {
    delegatesData: Array,
  },
  methods: {
    async presence(j) {
      const i = this.currentCountry;
      try {
        const data = {
          country: this.delegatesData[i].country,
          status: j,
        };
        await editDelegates(this.$route.params.id, data);
        this.$emit('update');
        this.getVoteCount();
      } catch (err) {
        console.error(err);
      }
      this.$children[0].goNext();
    },
    move(index) {
      const j = Math.min(Math.max(parseInt(index, 10), 0), this.delegatesData.length - 1);
      this.currentCountry = j;
    },
    async getVoteCount() {
      const vote = await getAllDelegates(this.$route.params.id);
      this.voteCount = (vote.data.data.filter((obj) => obj.status !== 'N/A')).length;
    },
    decoder(str) { // Vue workaround for &nbsp;
      const textArea = document.createElement('textarea');
      textArea.innerHTML = str;
      return textArea.value;
    },
  },
  created() {
    this.getVoteCount();
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
