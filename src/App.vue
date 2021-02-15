<template>
  <div id="app">
    <div class="nav" v-if="$route.name != 'Log In' && $route.name !='Sign Up'">
      <div class="navLogo">
        <img id="logo" src="@/assets/img/logo_main.png" @click="goToHome()"/>
      </div>
      <div class="navTab" :class="{toggle: open}">
        <div
          class="navLeft"
          v-show="pathCheckConference"
        >
          <div
            v-for="(route, index) in conference"
            :key="index"
            :class="{disabled: route === 'crisis'}">
            <router-link
              :id="route"
              :to="`/${route}/${$route.params.id}`"
              @click.native="onTabClick"
            >
              {{ capitalize(route) }}
            </router-link>
          </div>
        </div>
        <div
          class="navLeft"
          v-show="pathCheckGeneral"
        >
          <div  v-for="(route, index) in general" :key="index">
            <router-link
              :id="route"
              :to="`/${routeGeneral(route)}`"
              @click.native="onTabClick"
            >
              {{ capitalize(route) }}
            </router-link>
          </div>
        </div>
        <div class="navRight">
          <a>Settings</a>
          <a @click="logout()">Log Out</a>
          <a><img src="@/assets/img/icon/Share.png" /></a>
        </div>
        <div
          class="border conff"
          id="border"
          v-if="widthWindow > 960"
          :style="{
            left: `${borderStyles.left-1}px`,
            width: `${borderStyles.width}px`,
          }"
        ></div>
      </div>
      <div class="burger"
      @click="toggleMenu"
      :class="{open: open}"
      v-if="widthWindow <= 960">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <transition name="slide">
      <div class="indicator" v-if="state" :class="{blue: isConnected}">
        <p v-if="!isConnected">You are offline. Reconnecting...</p>
        <p v-else>Back Online!</p>
      </div>
    </transition>
    <transition name="slide">
      <div class="indicator" v-if="noAuth">
        <p>You don't have permission</p>
      </div>
    </transition>
    <transition name="slide">
      <div class="indicator" v-if="generic">
        <p>Something went wrong</p>
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view :key="$route.fullPath" />
    </transition>
    <div class="overlay-nav" @click="open = false" v-if="open"></div>
  </div>
</template>

<script>
import { logout } from '@/api/user';
import { mapState } from 'vuex';

export default {
  name: 'MUN',
  data() {
    return {
      border: {
        left: 0,
        width: 0,
        height: 0,
      },
      borderTemp: null,
      open: false,
      conference: ['overview', 'delegates', 'gsl', 'motions', 'caucus', 'crisis'],
      general: ['home', 'conferences', 'connections', 'files', 'account'],
      state: false,
    };
  },
  computed: {
    ...mapState({
      isConnected: (state) => state.Socket.isConnected,
      noAuth: (state) => state.Global.notAuthorized,
      generic: (state) => state.Global.genericError,
      widthWindow: (state) => state.Global.widthWindow,
    }),
    borderStyles() {
      return this.borderTemp == null ? this.border : this.borderTemp;
    },
    showNavBar() {
      return this.widthWindow > 960 || this.open;
    },
    pathCheckConference() {
      if (this.$route.path === '/') {
        return false;
      }
      return this.conference.includes(this.$route.path.split('/')[1]);
    },
    pathCheckGeneral() {
      if (this.$route.path === '/') {
        return true;
      }
      return this.general.includes(this.$route.path.split('/')[1]);
    },
  },
  created() {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView);
  },
  beforeUpdate() {
    if (!this.open) {
      this.onTabClick();
    }
  },
  beforeMount() {
    this.onTabClick();
  },
  watch: {
    isConnected() {
      this.offline();
    },
    async noAuth() {
      let timeout;
      if (this.noAuth === true) {
        timeout = await setTimeout(() => {
          this.$store.commit('noAuth', false);
        }, 3000);
      } else {
        clearTimeout(timeout);
      }
    },
    async generic() {
      let timeout;
      if (this.generic === true) {
        timeout = await setTimeout(() => {
          this.$store.commit('error', false);
        }, 3000);
      } else {
        clearTimeout(timeout);
      }
    },
  },
  methods: {
    async offline() {
      let timeout;
      if (this.state !== !this.isConnected) {
        timeout = await setTimeout(() => {
          this.state = !this.isConnected;
        }, 1000);
      } else {
        clearTimeout(timeout);
      }
      return this.state;
    },
    onTabClick() {
      if (this.$route.path.split('/')[1] === '') {
        const styles = {
          left: 32,
          width: 59,
          height: 28,
        };
        this.border = styles;
      } else if (this.$route.path.split('/')[1] === 'overview') {
        const styles = {
          left: 32,
          width: 88,
          height: 28,
        };
        this.border = styles;
      } else {
        const tab = this.$route.path.split('/')[1] === '' ? document.getElementById('home') : document.getElementById(this.$route.path.split('/')[1]);
        const styles = {
          left: tab.offsetLeft + 32,
          width: tab.offsetWidth + 2,
          height: tab.offsetHeight,
        };
        this.border = styles;
      }
      document.body.style.overflow = 'visible';
      this.open = false;
    },
    async logout() {
      this.open = false;
      try {
        await logout();
        this.$store.dispatch('logout');
        this.$router.push('/login');
      } catch (err) {
        console.error(err);
      }
    },
    toggleMenu() {
      if (this.open) {
        document.body.style.overflow = 'visible';
      } else {
        document.body.style.overflow = 'hidden';
      }
      this.open = !this.open;
    },
    checkMobileView() {
      this.$store.commit('getWidth', window.innerWidth);
      this.$store.commit('getHeight', window.innerHeight);
      this.onTabClick();
    },
    capitalize(string) {
      if (string === 'gsl') {
        return string.toUpperCase();
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    routeGeneral(string) {
      return string === 'home' ? '' : string;
    },
    goToHome() {
      this.$router.push('/');
      this.onTabClick();
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobileView);
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './App.scss'
</style>
