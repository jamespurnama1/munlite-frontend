<template>
  <div class="home">
    <div class="left">
      <picture>
        <source media="(min-device-width: 1280px)"
          srcset="@/assets/img/home@3x.png">
        <source media="(min-device-width: 800px)"
          srcset="@/assets/img/home@2x.png">
        <source media="(min-device-width: 500px)"
          srcset="@/assets/img/home.png">
        <img
          class="banner-image"
          src="@/assets/img/home@2x.png"
          alt="Indonesia MUN 2020">
      </picture>
      <h1>Indonesia MUN 2020</h1>
    </div>
    <div class="right">
      <div class="chair">
        <p class="chair-sub-header">Chair</p>
        <div v-for="(data, index) in chairData" :key="index" class="chair-data">
          <div class="chair-img"></div>
          <div class="info">
            <p class="chair-name">{{data.name}}</p>
            <p class="chair-email">{{data.email}}</p>
          </div>
        </div>
      </div>
      <div class="rules">
        <p class="rules-sub-header">Rules</p>
        <div v-for="(data, index) in rules" :key="index" class="rules-data">
          <p class="rules-point">{{data.title}}</p>
          <p class="rules-val">{{data.val}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      chairData: [
        {
          name: 'Hans Marvin T.',
          email: 'hans.tanuardi@gmail.com',
        },
        {
          name: 'Joshua A.',
          email: 'joshmahawira@gmail.com',
        },
        {
          name: 'Nicole Charlene',
          email: 'niccharlene@gmail.com',
        },
      ],
      rules: [
        {
          title: 'Majority',
          val: '1/2 Delegates + 1',
        },
        {
          title: 'DR Votes',
          val: '2/3 Delegates',
        },
        {
          title: 'Quorum',
          val: '2/3 Delegates',
        },
        {
          title: 'Rounding',
          val: 'Round Up',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
