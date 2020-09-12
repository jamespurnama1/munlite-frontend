<template>
  <div id="app">
    <div class="nav">
      <div class="navLogo">
        <img id="logo" src="@/assets/img/logo_main.png" />
      </div>
      <div class="navTab" :class="{toggle: open}">
        <div class="navLeft">
          <router-link to="/" @click.native="onTabClick">Overview</router-link>
          <router-link to="/delegates" @click.native="onTabClick">Delegates</router-link>
          <router-link to="/motions" @click.native="onTabClick">Motions</router-link>
          <router-link to="/caucus" @click.native="onTabClick">Caucus</router-link>
          <router-link to="/crisis" @click.native="onTabClick">Crisis</router-link>
          <div
            class="border"
            v-if="widthWindow > 960"
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
      <div class="burger" @click="toggleMenu" :class="{open: open}" v-if="widthWindow <= 960">
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
  mounted() {
    this.onTabClick();
  },
  beforeUpdate() {
    this.onTabClick();
  },
  created() {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView);
  },
  methods: {
    onTabClick() {
      const tab = document.getElementsByClassName('router-link-exact-active');
      if (tab[0]) {
        const styles = {
          left: tab[0].offsetLeft,
          width: tab[0].clientWidth,
          height: tab[0].clientHeight,
        };
        this.border = styles;
      }
    },
    toggleMenu() {
      this.open = !this.open;
    },
    checkMobileView() {
      this.widthWindow = window.innerWidth;
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
