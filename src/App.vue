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
            :class="{
              disabled: route === 'crisis'
              }">
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
            left: `${border.left-1}px`,
            width: `${border.width}px`,
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
    <transition-group name="slide">
      <div key="1" class="indicator" v-if="state && $route.params.id" :class="{blue: isConnected}">
        <p v-if="!isConnected && off">You are offline. Reconnecting...</p>
        <p v-else-if="!isConnected">Disconnected from server. Reconnecting...</p>
        <p v-else>Back Online!</p>
      </div>
      <div key="2" class="indicator" v-if="noAuth">
        <p>You don't have permission</p>
      </div>
      <div key="3" class="indicator" v-if="generic">
        <p>Something went wrong</p>
      </div>
    </transition-group>
    <Context
      v-if="showContext"
      v-click-outside="config"
    />
    <transition name="fade" mode="out-in">
      <router-view :key="$route.fullPath" />
    </transition>
    <div class="overlay-nav" @click="open = false" v-if="open"></div>
    <transition name="slide-up">
    <GlobalTimer
      v-if="$route.params.id && $route.name !== 'GSL' && $route.name !== 'Caucus'"/>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { logout } from '@/api/user';
import Context from '@/components/Context/index.vue';
import GlobalTimer from '@/components/Global Timer/index.vue';

@Component({
  components: {
    GlobalTimer,
    Context,
  },
})
export default class App extends Vue {
  // =============================================================================
  // Vue Hooks
  // =============================================================================

  async created() {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView);
    window.addEventListener('storage', this.logout);
    window.addEventListener('online', () => { this.off = false; });
    window.addEventListener('offline', () => { this.off = true; });
  }

  beforeUpdate() {
    if (!this.open) {
      this.onTabClick();
    }
  }

  beforeMount() {
    this.onTabClick();
  }

  goToHome() {
    this.$router.push('/').catch(() => {});
    this.onTabClick();
  }

  // =============================================================================
  // Window Width
  // =============================================================================

  @State((state) => state.Global.widthWindow) widthWindow?: number

  checkMobileView() {
    this.$store.commit('getWidth', window.innerWidth);
    this.$store.commit('getHeight', window.innerHeight);
    this.onTabClick();
  }

  // =============================================================================
  // Navbar
  // =============================================================================

  open = false

  border = {
    left: 0,
    width: 0,
    height: 0,
  }

  get showNavBar(): Boolean {
    return (this.widthWindow || 0) > 960 || this.open;
  }

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
        left: (tab as HTMLElement).offsetLeft + 32,
        width: (tab as HTMLElement).offsetWidth + 2,
        height: (tab as HTMLElement).offsetHeight,
      };
      this.border = styles;
    }
    document.body.style.overflow = 'visible';
    this.open = false;
  }

  toggleMenu() {
    if (this.open) {
      document.body.style.overflow = 'visible';
    } else {
      document.body.style.overflow = 'hidden';
    }
    this.open = !this.open;
  }

  capitalize = (string: string): string => {
    if (string === 'gsl') {
      return string.toUpperCase();
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // =============================================================================
  // General / Conference
  // =============================================================================

  conference = ['overview', 'delegates', 'gsl', 'motions', 'caucus', 'crisis'] as string[];

  general = ['home', 'conferences', 'connections', 'files', 'account'] as string[];

  routeGeneral = (string: string) => (string === 'home' ? '' : string);

  get pathCheckConference() {
    if (this.$route.path === '/') {
      return false;
    }
    return this.conference.includes(this.$route.path.split('/')[1]);
  }

  get pathCheckGeneral(): Boolean {
    if (this.$route.path === '/') {
      return true;
    }
    return this.general.includes(this.$route.path.split('/')[1]);
  }

  // =============================================================================
  // Logout
  // =============================================================================

  async logout(event: StorageEvent): Promise<void> {
    if (event.key === 'logout') {
      this.open = false;
      try {
        await logout();
        this.$store.dispatch('logout');
        if (!localStorage.getItem('logout')) window.localStorage.setItem('logout', Date.now().toString());
        this.$router.push('/login');
      } catch (err) {
        console.error(err);
      }
    }
  }

  // =============================================================================
  // Context Menu
  // =============================================================================

  @State((state) => state.Global.showContext) showContext?: boolean

  @State((state) => state.Global.contextPos) contextPos?: Array<number>

  config = {
    handler: () => { this.$store.dispatch('resetContext'); },
    events: ['click', 'touchstart', 'touchmove'],
  }

  // =============================================================================
  // Notifications
  // =============================================================================

  @State((state) => state.Global.notAuthorized) noAuth?: boolean

  @State((state) => state.Global.genericError) generic?: boolean

  @State((state) => state.socket.isConnected) isConnected?: boolean

  state = false as boolean

  off = false as Boolean

  @Watch('isConnected')
  async offline(): Promise<boolean> {
    let timeout;
    if (this.state !== !this.isConnected) {
      timeout = await setTimeout(() => {
        this.state = !this.isConnected;
      }, 1000);
    } else {
      clearTimeout(timeout);
    }
    return this.state;
  }

  @Watch('noAuth')
  async onNoAuth() {
    let timeout;
    if (this.noAuth === true) {
      timeout = await setTimeout(() => {
        this.$store.commit('noAuth', false);
      }, 3000);
    } else {
      clearTimeout(timeout);
    }
  }

  @Watch('generic')
  async onGeneric() {
    let timeout;
    if (this.generic === true) {
      timeout = await setTimeout(() => {
        this.$store.commit('error', false);
      }, 3000);
    } else {
      clearTimeout(timeout);
    }
  }
}
</script>

<style lang="scss">
@import './App.scss'
</style>
