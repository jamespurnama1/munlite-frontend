<template>
  <div id="app">
    <div id="nav">
      <div class="navLogo">
        <img src="@/assets/img/logo_main.png" />
      </div>
      <div class="navLeft">
        <router-link to="/">Overview</router-link>
        <router-link to="/delegates">Delegates</router-link>
        <router-link to="/motions">Motions</router-link>
        <router-link to="/caucus">Caucus</router-link>
        <router-link to="/crisis">Crisis</router-link>
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

<style lang="scss">
@import '@/styles/index.scss';
@import './App.scss'
</style>
