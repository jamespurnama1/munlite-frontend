<template>
  <div id="app">
    <div class="nav">
      <div class="navLogo">
        <img id="logo" src="@/assets/img/logo_small.svg" @click="$router.push('/')"/>
      </div>
      <div class="navTab" :class="{toggle: open}">
        <div class="navLeft">
          <router-link id="overview" to="/" @click.native="onTabClick">Overview</router-link>
          <router-link id="delegates" to="/delegates" @click.native="onTabClick">
            Delegates
          </router-link>
          <router-link id="gsl" to="/gsl" @click.native="onTabClick">GSL</router-link>
          <router-link id="motions" to="/motions" @click.native="onTabClick">Motions</router-link>
          <router-link id="caucus" to="/caucus" @click.native="onTabClick">Caucus</router-link>
          <router-link id="crisis" to="/crisis" @click.native="onTabClick">Crisis</router-link>
          <div
            class="border"
            v-if="widthWindow > 960"
            :style="{
              left: `${borderStyles.left - 6}px`,
              width: `${borderStyles.width + 10}px`,
              height: `${borderStyles.height + 5}px`
            }"
          ></div>
        </div>
        <div class="navRight">
          <a>Settings</a>
          <a>Sign In/Up</a>
          <a><img src="@/assets/img/icon/Share.png" /></a>
        </div>
      </div>
      <div class="burger" @click="toggleMenu" :class="{open: open}" v-if="widthWindow <= 960">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view :key="$route.fullPath" />
    </transition>
    <div class="overlay-nav" v-if="open"></div>
  </div>
</template>

<script>
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
      widthWindow: 0,
    };
  },
  computed: {
    borderStyles() {
      return this.borderTemp == null ? this.border : this.borderTemp;
    },
    showNavBar() {
      return this.widthWindow > 960 || this.open;
    },
  },
  beforeUpdate() {
    if (!this.open) {
      this.onTabClick();
    }
  },
  created() {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView);
    this.onTabClick();
  },
  methods: {
    onTabClick() {
      const tab = this.$route.path.substring(1) === '' ? document.getElementById('overview') : document.getElementById(this.$route.path.substring(1));
      if (tab) {
        const styles = {
          left: tab.offsetLeft,
          width: tab.clientWidth,
          height: tab.clientHeight,
        };
        this.border = styles;
      }
      this.open = false;
    },
    toggleMenu() {
      this.open = !this.open;
    },
    checkMobileView() {
      this.widthWindow = window.innerWidth;
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
