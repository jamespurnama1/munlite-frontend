<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('stage', 0)" id='close' title="Close">
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <p>Scroll to move up &amp; down</p>
    <div id='call'>
      <div id="wrapper">
        <CardStack
        :progress="`presence`"
        :desc="`presence`"
        :delegates="delegatesData"
        :display="currentCountry"
        @move="move"
        class="left" />
      </div>
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

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropType } from 'vue';
import { editDelegates, getAllDelegates } from '@/api/delegates';
import CardStack from '@/components/CardStack/index.vue';
// eslint-disable-next-line no-unused-vars
import { delegatesType } from '@/types/api';

export default Vue.extend({
  components: {
    CardStack,
  },
  data() {
    return {
      button: 'Present &amp;&nbsp;Voting' as string,
      voteCount: 0 as number,
      currentCountry: 0 as number,
    };
  },
  props: {
    delegatesData: Array as PropType<delegatesType.getAllDelegates[]>,
  },
  methods: {
    async presence(j: string): Promise<void> {
      try {
        const data = {
          country: this.delegatesData[this.currentCountry].country,
          status: j,
        };
        await editDelegates(
          this.$route.params.id,
          this.delegatesData[this.currentCountry]._id,
          data,
        );
        this.$emit('update');
        this.getVoteCount();
      } catch (err) {
        console.error(err);
      }
      // @ts-ignore
      this.$children[0].goNext();
    },
    move(index: number): void {
      const j = Math.min(Math.max(parseInt(index.toString(), 10), 0),
        this.delegatesData.length - 1);
      this.currentCountry = j;
    },
    async getVoteCount(): Promise<void> {
      const vote = await getAllDelegates(this.$route.params.id);
      this.voteCount = (vote.data.data.filter((obj: delegatesType.getAllDelegates) => obj.status !== 'N/A')).length;
    },
    decoder(str: string): string { // Vue workaround for &nbsp;
      const textArea = document.createElement('textarea');
      textArea.innerHTML = str;
      return textArea.value;
    },
  },
  created() {
    this.getVoteCount();
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
