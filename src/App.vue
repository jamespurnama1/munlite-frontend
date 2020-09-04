<template>
  <div id="app">
    <div class="nav">
      <div class="navLeft">
        <div class="navLogo">
          <img id="logo" src="@/assets/img/logo_main.png" />
        </div>
        <div class="navTab">
          <router-link to="/" @click.native="onTabClick">Overview</router-link>
          <router-link to="/delegates" @click.native="onTabClick">Delegates</router-link>
          <router-link to="/motions" @click.native="onTabClick">Motions</router-link>
          <router-link to="/caucus" @click.native="onTabClick">Caucus</router-link>
          <router-link to="/crisis" @click.native="onTabClick">Crisis</router-link>
          <div
            class="border"
            :style="{
              left: `${borderStyles.left-1}px`,
              width: `${borderStyles.width}px`,
              height: `${borderStyles.height}px`
            }"
          ></div>
        </div>
      </div>
      <div class="navRight">
        <a>Settings</a>
        <a>SignIn/Up</a>
        <a><img src="@/assets/img/icon/Share.png" /></a>
      </div>
    </div>
    <router-view/>
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
    };
  },
  computed: {
    borderStyles() {
      return this.borderTemp == null ? this.border : this.borderTemp;
    },
  },
  mounted() {
    const tab = document.getElementsByClassName('router-link-exact-active');
    if (tab[0]) {
      const styles = {
        left: tab[0].offsetLeft,
        width: tab[0].clientWidth,
        height: tab[0].clientHeight,
      };
      console.log(tab[0].clientHeight);
      this.border = styles;
    }
  },
  methods: {
    onTabClick(evt) {
      console.log('clicked');
      const tab = evt.target;
      const styles = {
        left: tab.offsetLeft,
        width: tab.clientWidth,
        height: tab.clientHeight,
      };
      this.border = styles;
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './App.scss'
</style>
