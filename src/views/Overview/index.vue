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
      <h1>{{ title }}</h1>
    </div>
    <div class="right">
      <div class="chair">
        <p class="chair-sub-header">Chair</p>
        <div class="chair-list" v-if="chairData.length > 0">
          <div v-for="(data, index) in chairData" :key="index" class="chair-data">
            <div class="chair-img"></div>
            <div class="info">
              <p class="chair-name">{{data.name}}</p>
              <p class="chair-email">{{data.email}}</p>
            </div>
          </div>
        </div>
        <p v-else class="empty-data">No chair in the list</p>
      </div>
      <div class="rules">
        <p class="rules-sub-header">Rules</p>
        <div v-for="(data, index) in rules" :key="index" class="rules-data">
          <p class="rules-point">{{data}}</p>
          <p class="rules-val">{{rulesData[index]}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getConference } from '@/api/conference';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      title: '' as string,
      chairData: [] as string[],
      rules: [] as string[],
      rulesData: [] as string[],
    };
  },
  async created() {
    try {
      const conference = await getConference(this.$route.params.id);
      this.rulesData = Object.values(conference.data.data.rules);
      this.rules = Object.keys(conference.data.data.rules);
      this.rules = this.rules.map((rule) => {
        if (rule === 'dr_vote') return 'DR Sponsors';
        return rule[0].toUpperCase() + rule.slice(1).toLowerCase();
      });
      this.title = conference.data.data.title;
      if (conference.data.data.chairman) {
        this.chairData = conference.data.data.chairman;
      }
    } catch (err) {
      console.error(err);
    }
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
