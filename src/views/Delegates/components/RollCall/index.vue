<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('confirm', 'discard')" id='close' title="Close">
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <h3>Countries</h3>
    <div id='call'>
      <Slider
        :active="voteCount"
        :current="currentCountry"
        @move="move" v-if="true"
        :delegatesData="delegatesData"
      />
      <div id='selection'>
        <button @click="presence('Present')">
          Present
        </button>
        <button @click="presence('Present & Voting')">
          Present &amp; Voting
        </button>
        <button @click="presence('Not Present')" class="red">
          Not Present
        </button>
      </div>
      <button @click="$parent.$emit('stage', 2)"
        :disabled="voteCount !== delegatesData.length"
        id="continue"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { editDelegates, getAllDelegates } from '@/api/delegates';
import Slider from '@/components/Slider/index.vue';

export default {
  components: {
    Slider,
  },
  data() {
    return {
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
      this.$children[0].nextSlide();
    },
    un() {
      this.voteCount -= 1;
      this.$store.commit('undo');
    },
    move(index) {
      this.currentCountry = index;
    },
    async getVoteCount() {
      const vote = await getAllDelegates(this.$route.params.id);
      this.voteCount = (vote.data.data.filter((obj) => obj.status !== 'N/A')).length;
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
