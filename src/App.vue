<template>
  <div id="app">
    <div class="nav" v-if="$route.path != '/login' && $route.path !='/signup'">
      <div class="navLogo">
        <img id="logo" src="@/assets/img/logo_main.png" @click="$router.push('/home')"/>
      </div>
      <div class="navTab" :class="{toggle: open}">
        <div class="navLeft">
          <router-link id="overview" to="/overview" @click.native="onTabClick">
            Overview
          </router-link>
          <router-link id="delegates" to="/delegates" @click.native="onTabClick">
            Delegates
          </router-link>
          <router-link id="gsl" to="/gsl" @click.native="onTabClick">GSL</router-link>
          <router-link id="motions" to="/motions" @click.native="onTabClick">Motions</router-link>
          <router-link id="caucus" to="/caucus" @click.native="onTabClick">Caucus</router-link>
          <router-link id="crisis" to="/crisis" @click.native="onTabClick">Crisis</router-link>
          <div
            class="border"
            v-if="$store.state.widthWindow > 960"
            :style="{
              left: `${borderStyles.left-1}px`,
              width: `${borderStyles.width}px`,
              height: `${borderStyles.height}px`
            }"
          ></div>
        </div>
        <div class="navRight">
          <a>Settings</a>
          <a>SignIn/Up</a>
          <a><img src="@/assets/img/icon/Share.png" /></a>
        </div>
      </div>
      <div class="burger"
      @click="toggleMenu"
      :class="{open: open}"
      v-if="$store.state.widthWindow <= 960">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <router-view/>
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
    };
  },
  computed: {
    borderStyles() {
      return this.borderTemp == null ? this.border : this.borderTemp;
    },
    showNavBar() {
      return this.$store.state.widthWindow > 960 || this.open;
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
      this.$store.commit('getWidth', window.innerWidth);
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
