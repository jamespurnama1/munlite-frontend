<template>
  <div class="conferences">
    <transition name="fade">
      <add-conference
        v-if="showInput"
        @exit="exit"
        @update="updateConferencesData"
      />
    </transition>
    <transition name="fade">
      <div class="overlay" v-if="showInput" />
    </transition>
    <div class="conferences-upper">
      <h1 class="title">Conferences</h1>
      <div class="conferences-button">
        <div class="button">
          <font-awesome-icon :icon="['fas', 'plus']" @click="toggleInput"/>
        </div>
      </div>
    </div>
    <div class="conferences-table">
      <div class="table">
        <div class="content">
          <div class="table-data" v-if="conferencesData.length > 0">
              <!-- eslint-disable-next-line max-len -->
            <Search @sortData="(...args)=> {this.conferencesData = sortData(this.conferencesData, ...args)}"
              @filterData="filterData(f)" />
            <transition-group name="fade">
              <div v-for="(data, index) in conferencesData"
              :key="index" class="data"
              @click="select(index)"
              :class="{selected: sel === index}">
                <img class="logoConf" :src="require('@/assets/img/home@2x.png')" />
                <div class="nameConf">
                  <h3 class="name">
                    {{ data.title }}
                  </h3>
                  <span>
                    <p v-if="sel === index" class="date">
                      {{ readable(data.start_date, data.end_date) }}
                    </p>
                    <p v-else class="date">
                      {{ readable(data.start_date) }}
                    </p>
                  </span>
                </div>
                <!-- <Context
                  content="Are you sure you want to delete?"
                  :action="['delete', 'edit']"
                  :delegateName="data.title"
                  :delegateId="data._id"
                  v-if="showContext === data.title"
                  @exit="exit"
                /> -->
                <Confirmation
                  content="Are you sure you want to delete?"
                  :action="deleteConferenceData"
                  :delegateName="data.title"
                  :delegateId="data._id"
                  v-if="showConfirm === data.title"
                  @exit="exit"
                />
              </div>
            </transition-group>
          </div>
          <!-- <div class="table-data empty-data" v-else>There's nothing here.</div> -->
          <div class="details" v-if="typeof sel === 'number'">
            <div v-if="ongoing()">
              <h3>This conference is ongoing</h3>
              <p
                class="take"
                @click="$router.push(`/overview/${conferencesData[sel]._id}`)">
                Take me there
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </p>
            </div>
            <h3>Chair</h3>
            <button>Edit<font-awesome-icon :icon="['fas', 'edit']" /></button>
            <ul>
              <li v-for="(chair, i) in conferencesData[sel].chairman" :key="i">
                {{ chair.email }}
              </li>
            </ul>
            <div class="numberInfo">
              <div>
                <h3>Motions</h3>
                <h2>6</h2><p>motions</p>
                <button>View All<font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
              </div>
              <div>
                <h3>Total Present</h3>
                <h2>8</h2><p>delegates</p>
                <button>View All<font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
              </div>
              <div>
                <h3>Activity Log</h3>
                <h2>48</h2><p>recorded activities</p>
                <button>View All<font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getConference,
  getAllConferences,
  deleteConference,
  updateConference,
} from '@/api/conference';
import Search from '@/components/Search/index.vue';
import Confirmation from '@/components/Confirmation/index.vue';
import AddConference from './components/AddConference/index.vue';

export default {
  name: 'Conference',
  components: {
    Search,
    Confirmation,
    AddConference,
  },
  data() {
    return {
      showConfirm: null,
      conferencesData: [],
      conf: null,
      showInput: false,
      focus: null,
      sortConf: 'down',
      sel: null,
    };
  },
  methods: {
    ongoing() {
      const a = new Date(this.conferencesData[this.sel].start_date);
      const b = new Date(this.conferencesData[this.sel].end_date);
      const dt = Date.now();

      const c = new Date(b.getTime());
      c.setDate(c.getDate() + 1);
      return dt >= a && dt < c;
    },
    select(i) {
      this.sel = i;
    },
    toggleInput() {
      this.showInput = !this.showInput;
      this.newCountry = '';
    },
    async updateOneConf(conf) {
      try {
        // eslint-disable-next-line no-underscore-dangle
        this.conf = await getConference(conf._id);
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
    async updateConferencesData() {
      try {
        const conferences = await getAllConferences();
        if (conferences.data.data !== null) {
          this.conferencesData = this.sortData(conferences.data.data, 'date', 'down');
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteConferenceData(conf) {
      try {
        const responses = new Promise((resolve) => {
          // eslint-disable-next-line no-underscore-dangle
          resolve(deleteConference(conf._id));
        });
        responses.then(() => {
          this.exit();
          this.updateConferencesData();
        });
      } catch (err) {
        console.error(err);
      }
    },
    exit() {
      this.showInput = false;
      this.showConfirm = null;
    },
    async patchConferences(conf, data) {
      try {
        const responses = new Promise((resolve) => {
          // eslint-disable-next-line no-underscore-dangle
          resolve(updateConference(conf._id, data));
        });
        responses.then(() => {
          this.updateConferencesData();
        });
      } catch (err) {
        console.error(err);
      }
    },
    readable(d, e) {
      const sDate = new Date(d);
      const eDate = new Date(e);
      const ye = (y) => new Intl.DateTimeFormat('en', { year: 'numeric' }).format(y);
      const mo = (m) => new Intl.DateTimeFormat('en', { month: 'short' }).format(m);
      const da = (day) => new Intl.DateTimeFormat('en', { day: '2-digit' }).format(day);
      let r;
      if (typeof e === 'string') {
        r = `${da(sDate)} ${mo(sDate)} - ${da(eDate)} ${mo(eDate)} ${ye(eDate)}`;
      } else if (typeof e === 'undefined') {
        r = ye(sDate);
      }
      return r;
    },
    yearOnly(d) {
      return d;
    },
  },
  created() {
    this.updateConferencesData();
    this.readable('2021-02-02T03:52:23.571Z');
  },
  computed: {
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
