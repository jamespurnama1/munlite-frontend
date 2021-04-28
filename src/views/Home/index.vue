<template>
  <div id="Home">
    <transition-group name="fade">
      <Confirmation
          content="Discard Conference?"
          :action="outside"
          :negative="true"
          button="Discard"
          whiteButton="Keep Editing"
          v-if="showConfirm === 'add'"
          @exit="showConfirm = false"
          :key="`${showConfirm}Modal`"
        />
        <div class="overlay modal" :key="showConfirm" v-if="showConfirm === 'add'" />
        <add-conference
          v-if="showConf"
          @exit="showConfirm = 'add'"
          @exitSafe="outside(); showConf = false"
          @update="updateConferencesData"
          v-click-outside="config"
          key="addConf"
        />
      <div class="overlay" key="overlay" v-if="showConf"/>
    </transition-group>
    <div class="upper">
      <div class="profile">
        <div class="img"></div>
        <div class="detail">
          <h1>Hi, {{ $store.state.Global.me.first_name }}!
          </h1>
          <p>Not {{ $store.state.Global.me.first_name }}?
            <a @click="changeAcc()">
              Change Account
            </a>
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="conferences">
        <div class="sub-title">
          <h2>Conferences</h2>
          <button class="button" @click="showConf = true">
            <font-awesome-icon :icon="['fas', 'plus']"/>
          </button>
        </div>
        <div class="list-conferences">
          <div
            v-for="(data, index) in conferences"
            :key="index"
            class="conference-data"
            @click="$router.push(`/overview/${data._id}`).catch(() => {})" >
            <div class="img"></div>
            <div class="detail">
              <p class="name">{{ data.title }}</p>
              <div class="info">
                <span class="started-time">
                  {{ data.start_date.split("-").shift() }}
                <div v-if="ongoing([data]).length > 0" class="badge">
                  ONGOING
                </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <button class="viewall button" @click="$router.push('/conferences').catch(() => {})">
          View All <font-awesome-icon :icon="['fas', 'chevron-right']"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getAllConferences } from '@/api/conference';
import { logout } from '@/api/user';
import AddConference from '@/components/AddConference/index.vue';
import Confirmation from '@/components/Confirmation/index.vue';
// eslint-disable-next-line no-unused-vars
import { conferenceType } from '@/types/api';

export default Vue.extend({
  name: 'Home',
  components: {
    AddConference,
    Confirmation,
  },
  data() {
    return {
      conferences: [] as conferenceType.getAllConferences[],
      config: {
        handler: () => {
          // @ts-ignore
          this.showConfirm = 'add';
        },
        middleware: (event) => event.target.className !== 'cancel',
        events: ['click', 'touchstart', 'touchmove'],
      },
      showConf: false as boolean,
      showConfirm: false as boolean,
    };
  },
  created() {
    this.updateConferencesData();
  },
  methods: {
    ongoing(items: conferenceType.getAllConferences[]): conferenceType.getAllConferences[] {
      const dt: Date = new Date(Date.now());
      return items.filter((item) => {
        const a: Date = new Date(item.start_date);
        const b: Date = new Date(item.end_date);
        const c: Date = new Date(b.getTime());
        c.setDate(c.getDate() + 1);
        return dt >= a && dt < c;
      });
    },
    async updateConferencesData(): Promise<void> {
      try {
        const conferences = await getAllConferences();
        if (conferences.data.data !== null) {
          this.conferences = this.sortData(conferences.data.data, 'date', 'down');
        }
      } catch (err) {
        console.error(err);
      }
    },
    sortData(
      items: conferenceType.getAllConferences[],
      type: string,
      dir: string,
    ): conferenceType.getAllConferences[] {
      const sort = items;
      if (type === 'date') {
        sort.sort((a, b) => {
          const dateA = Date.parse(a.end_date);
          const dateB = Date.parse(b.end_date);
          let compare;
          switch (dir) {
            case 'down':
              compare = dateA > dateB;
              break;
            case 'up':
              compare = dateA < dateB;
              break;
            default:
          }
          switch (compare) {
            case true:
              return -1;
            case false:
              return 1;
            default:
              return 0;
          }
        });
      }
      if (sort.length > 5) sort.length = 5;
      return items;
    },
    outside(): void {
      this.showConf = false;
    },
    async changeAcc(): Promise<void> {
      try {
        await logout();
        this.$store.dispatch('logout');
        this.$router.push('/login');
      } catch (err) {
        console.error(err);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
