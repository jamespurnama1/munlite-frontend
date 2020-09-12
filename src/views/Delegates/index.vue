<template>
  <div class="delegates">
    <div class="delegates-upper">
      <h1 class="title">Delegates</h1>
      <div class="delegates-button">
        <button>Role Call</button>
        <button>&#43;</button>
      </div>
    </div>
    <div class="delegates-table">
      <table class="table">
        <tr class="title">
          <td class="title-name">Name</td>
          <td>Presence</td>
        </tr>
        <tr v-for="(data, index) in delegates" :key="index" class="data">
          <td class="name">
            <img :src="require('@/assets/img/' + data.flag)" :alt="data.name" class="img"/>
            {{data.name}}
          </td>
          <td style="width:60%" class="presence">{{data.presence}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Delegates',
  data() {
    return {
      delegates: [
        {
          flag: 'flag.png',
          name: 'Australia',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Belgium',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'China',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Egypt',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Hong Kong',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'India',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Japan',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Liberia',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'New Zealand',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'Thailand',
          presence: 'Not Present',
        },
        {
          flag: 'flag.png',
          name: 'United States of America',
          presence: 'Not Present',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
