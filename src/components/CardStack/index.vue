<template>
<div class="stackOverflow">
  <ul class="stack-cards js-stack-cards">
    <li v-for="(del, i) in $store.state.delegates" :key="i"
    class="stack-cards__item js-stack-cards__item">
      <Card
      :ref="`card-${i}`"
      :country="del.id"
      desc="presence"
      :minimized="false"
      :progress="prgrs"
      :progressColor="color" />
    </li>
  </ul>
</div>
</template>

<script>
import Card from '@/components/Card/index.vue';

export default {
  name: 'CardStack',
  props: {
    voteCount: Number,
    color: String,
    prgrs: {
      type: [String, Number],
    },
  },
  components: {
    Card,
  },
  data() {
    return {
      card: null,
      topPos: null,
    };
  },
  mounted() {
    this.card = document.getElementsByClassName('stack-cards__item');
    this.card[this.voteCount].classList.add('active');
    this.active = document.querySelector('.active');
    this.topPos = 0;
    setInterval(() => {
      // eslint-disable-next-line dot-notation
      // document.querySelector('.stackOverflow').scrollTop = this['topPos'];
    }, 1000);
  },
  watch: {
    voteCount() {
      this.card[this.voteCount - 1].classList.remove('active');
      this.card[this.voteCount].classList.add('active');
      this.topPos += this.active.offsetHeight;
      document.querySelector('.stackOverflow').scrollTop = this.topPos;
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss'
</style>
