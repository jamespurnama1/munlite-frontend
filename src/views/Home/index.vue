<template>
  <div id="Home">
    <div class="upper">
      <div class="profile">
        <div class="img"></div>
        <div class="detail">
          <h1>Hi, {{ name }}!</h1>
          <p>Not {{ name }}? <a @click="changeAcc()">Change Account</a></p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="conferences">
        <div class="sub-title">
          <h2>Conferences</h2>
          <button class="button"><font-awesome-icon :icon="['fas', 'plus']"/></button>
        </div>
        <div class="list-conferences">
          <div
            v-for="(data, index) in conferences"
            :key="index"
            class="conference-data"
            @click="$router.push(`/overview/${data._id}`)"
          >
            <div class="img"></div>
            <div class="detail">
              <p class="name">{{ data.title }}</p>
              <div class="info">
                <span class="started-time">
                  2020
                </span>
              </div>
            </div>
          </div>
        </div>
        <button class="viewall button" @click="$router.push('/conferences')">
          View All <font-awesome-icon :icon="['fas', 'chevron-right']"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserData } from '@/api/profile';
import { getAllConferences } from '@/api/conference';
import { logout } from '@/api/user';

export default {
  name: 'Home',
  data() {
    return {
      name: '',
      ongoing: {
        name: 'Indonesia MUN',
        timestamp: 10,
        flag: 'id',
      },
      conferences: [],
    };
  },
  async created() {
    try {
      const profile = await getUserData();
      this.name = profile.data.data.first_name;
      const conference = await getAllConferences();
      this.conferences = conference.data.data;
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    async changeAcc() {
      try {
        await logout();
        this.$store.dispatch('logout');
        this.$router.push('/login');
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
