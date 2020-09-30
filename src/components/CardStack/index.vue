<template>
<div class="stackOverflow">
  <ul class="stack-cards js-stack-cards">
    <li v-for="(del, i) in $store.state.delegates" :key="i"
    class="stack-cards__item js-stack-cards__item">
      <Card
      :ref="`card-${i}`"
      :country="del.id"
      :desc="del.presence"
      :minimized="true"
      :progress="100" />
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
    const frontEnd = document.createElement('script');
    frontEnd.setAttribute('src', './stacking-cards.js');
    frontEnd.setAttribute('id', 'stack-cards-js');

    document.body.appendChild(frontEnd);

    this.card = document.getElementsByClassName('stack-cards__item');
    this.card[this.voteCount].classList.add('active');
    this.active = document.querySelector('.active');
    this.topPos = this.active.offsetTop;
  },
  methods: {
  },
  watch: {
    voteCount() {
      this.card[this.voteCount - 1].classList.remove('active');
      this.card[this.voteCount].classList.add('active');
      this.topPos = this.active.offsetTop;
      document.querySelector('.stackOverflow').scrollTop = this.topPos;
    },
  },
  destroyed() {
    document.getElementById('stack-cards-js').remove();
  },
  created() {
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss'
</style>
