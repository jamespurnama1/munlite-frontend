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
    <!-- <li class="stackedcards--animatable stackedcards-overlay right">Swipe RIGHT</li>
    <li class="stackedcards--animatable stackedcards-overlay left">Swipe LEFT</li> -->
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

    // this.obj = document.querySelector('.stack-cards');
    // this.stackedCardsObj = this.obj.querySelector('.stack-cards__item');
    // this.listElNodesObj = this.stackedCardsObj.children;
    // this.rightObj = this.obj.querySelector('.stackedcards-overlay.right');
    // this.leftObj = this.obj.querySelector('.stackedcards-overlay.left');
    // this.listElNodesWidth = this.stackedCardsObj.offsetWidth;
    // eslint-disable-next-line prefer-destructuring
    // this.currentElementObj = this.listElNodesObj[0];
    // setInterval(() => {
    //   document.querySelector('.stackOverflow').scrollTop = this.topPos;
    // }, 1000);
  },
  methods: {
    // gestureStart(evt) {
    //   this.startTime = new Date().getTime();

    //   this.startX = evt.changedTouches[0].clientX;
    //   this.startY = evt.changedTouches[0].clientY;

    //   this.currentX = this.startX;
    //   this.currentY = this.startY;

    //   this.touchingElement = true;
    // },
    // gestureMove(evt) {
    //   this.currentX = evt.changedTouches[0].pageX;
    //   this.currentY = evt.changedTouches[0].pageY;

    //   this.translateX = this.currentX - this.startX;
    //   this.translateY = this.currentY - this.startY;
    // },
    // gestureEnd() {
    //   if (!this.touchingElement) {
    //     return;
    //   }
    //   this.translateX = this.currentX - this.startX;
    //   this.translateY = this.currentY - this.startY;
    //   this.timeTaken = new Date().getTime() - this.startTime;
    //   this.touchingElement = false;
    // },
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
    // this.obj.addEventListener('touchstart', this.gestureStart, false);
    // this.obj.addEventListener('touchmove', this.gestureMove, false);
    // this.obj.addEventListener('touchend', this.gestureEnd, false);
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss'
</style>
