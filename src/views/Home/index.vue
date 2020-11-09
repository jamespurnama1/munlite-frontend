<template>
  <div id="Home">
    <div class="upper">
      <div class="profile">
        <div class="img"></div>
        <div class="detail">
          <h1>Hi, {{ name }}!</h1>
          <p>Not {{ name }}? <a @click="$router.push('/login')">Change Account</a></p>
        </div>
      </div>
      <div class="ongoing" @click="$router.push('/overview')">
        <h3>Ongoing</h3>
        <div class="ongoing-conference">
          <img class="conference-img" src="@/assets/img/home.png" />
          <div class="conference-detail">
            <p class="name">{{ ongoing.name }}</p>
            <p class="started-time">
              started {{ ongoing.timestamp }} mins ago
              <img :src="`https://www.countryflags.io/${ongoing.flag}/flat/64.png`"/>
            </p>
          </div>
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
          <div v-for="(data, index) in conferences" :key="index" class="conference-data">
            <div class="img"></div>
            <div class="detail">
              <p class="name">{{ data.name }}</p>
              <div class="info">
                <span class="started-time">
                  {{ data.timestamp }}
                  <img v-if="data.status !== 'chair'" :src="`https://www.countryflags.io/${data.flag}/flat/64.png`"/>
                </span>
                <span v-if="data.status !== 'delegate'" class="status">
                  {{ data.status.toUpperCase() }}
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
export default {
  name: 'Home',
  data() {
    return {
      name: 'John',
      ongoing: {
        name: 'Indonesia MUN',
        timestamp: 10,
        flag: 'id',
      },
      conferences: [
        {
          name: 'Indonesia MUN',
          timestamp: 2020,
          flag: 'in',
          status: 'ongoing',
        },
        {
          name: 'Jakarta MUN',
          timestamp: 2020,
          flag: 'in',
          status: 'best delegate',
        },
        {
          name: 'HI MUN',
          timestamp: 2019,
          flag: 'in',
          status: 'delegate',
        },
        {
          name: 'INI MUN',
          timestamp: 2019,
          flag: 'in',
          status: 'chair',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
