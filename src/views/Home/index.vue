<template>
  <div id="Home">
    <add-conference
      type="add"
      v-if="showConf"
      @exit="outside"
      @update="updateConferencesData"
      v-click-outside="config"
    />
    <div class="overlay" v-if="showConf"/>
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
          <button class="button" @click="showConf = true">
            <font-awesome-icon :icon="['fas', 'plus']"/>
          </button>
        </div>
        <div class="list-conferences">
          <div
            v-for="(data, index) in conferences"
            :key="index"
            class="conference-data"
            @click="$router.push(`/overview/${data._id}`)" >
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
import AddConference from '@/components/AddConference/index.vue';

export default {
  name: 'Home',
  components: {
    AddConference,
  },
  data() {
    return {
      name: '',
      ongoing: {
        name: 'Indonesia MUN',
        timestamp: 10,
        flag: 'id',
      },
      conferences: [],
      config: {
        handler: this.outside,
        events: ['click'],
      },
      showConf: false,
    };
  },
  async created() {
    try {
      const profile = await getUserData();
      this.name = profile.data.data.first_name;
      this.updateConferencesData();
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    async updateConferencesData() {
      try {
        const conferences = await getAllConferences();
        if (conferences.data.data !== null) {
          this.conferences = this.sortData(conferences.data.data, 'date', 'down');
        }
      } catch (err) {
        console.error(err);
      }
    },
    sortData(items, type, dir) {
      if (type === 'date') {
        items.sort((a, b) => {
          const dateA = Date.parse(a.start_date);
          const dateB = Date.parse(b.start_date);
          let compare;
          switch (dir) {
            case 'down':
              compare = dateA < dateB;
              break;
            case 'up':
              compare = dateA > dateB;
              break;
            default:
              compare = dateA < dateB;
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
      } else if (type === 'name') {
        items.sort((a, b) => {
          let compare;
          switch (dir) {
            case 'up':
              compare = a.title < b.title;
              break;
            case 'down':
              compare = a.title > b.title;
              break;
            default:
              compare = a.title < b.title;
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
      return items;
    },
    outside() {
      this.showConf = false;
    },
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
