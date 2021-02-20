<template>
  <div>
    <transition name="fade">
      <add-conference
        v-if="showInput"
        :conf="conferencesData[sel]"
        @exit="exit"
        @update="updateConferencesData"
        v-click-outside="config"
      />
    </transition>
    <transition name="fade">
      <div class="overlay" v-if="showInput || showConfirm" />
    </transition>
    <transition-group
      v-on:beforeEnter="() => {transEnd = false}"
      v-on:afterLeave="() => {transEnd = true}"
      class="conferences"
      :class="{mobile: width <= 960 && sel !== null}"
      tag="div"
      :name="transName">
      <div :key="3" class="conferences-upper" v-if="width > 960 || sel === null">
        <span>
          <h1 class="title">Conferences</h1>
          <p v-if="width > 960">Right click for more options</p>
          <p v-else>Press &amp; hold for more options</p>
        </span>
        <div class="conferences-button">
          <div class="button" @click="toggleInput('add')">
            <font-awesome-icon :icon="['fas', 'plus']"/>
          </div>
        </div>
      </div>
      <div
        :key="4"
        class="table-data"
        v-if="conferencesData.length > 0 && (width > 960 || sel === null)"
      >
        <Search
          class="search"
          :items="conferencesData"
          :sortFunc="sortFunc"
          :sortTypes="['name', 'date']"
          :filterFunc="filterFunc"
          :filterTypes="['Ongoing', ['Chair', 'Delegate', 'Best Delegate']]"
          @sortedData="(data) => {
            this.filteredData = data
          }"
        />
        <transition-group name="fade">
          <div
            v-for="(data, index) in filteredData"
            :key="data.title" class="data"
            @click="select(index)"
            @contextmenu.prevent="showC($event, data)"
            v-touch:touchhold.prevent="showCon(data)"
            :class="{selected: sel === index}">
            <img class="logoConf" :src="require('@/assets/img/home@2x.png')" />
            <div class="nameConf">
              <h3 class="name">
                {{ data.title }}
              </h3>
              <span>
                <p v-if="sel === index || width <= 960" class="date">
                  {{ readable(data.start_date, data.end_date) }}
                </p>
                <p v-else class="date">
                  {{ readable(data.start_date) }}
                </p>
                <div v-if="ongoing([data]).length > 0" class="badge">
                  ONGOING
                </div>
              </span>
            </div>
            <font-awesome-icon v-if="width <= 960" :icon="['fas', 'chevron-right']"/>
            <Confirmation
              :content="`Are you sure you want to delete ${data.title}?`"
              :action="deleteConferenceData"
              :id="data._id"
              button="Delete"
              :negative="true"
              v-if="showConfirm === data.title"
              v-click-outside="config"
              @exit="exit"
            />
          </div>
        </transition-group>
      </div>
      <Details
        key="5"
        :ongoing="ongoing([filteredData[sel]]).length > 0"
        :sel="sel"
        @goBack="sel = null"
        v-if="sel !== null"
        @edit="(...t) => toggleInput(...t)"
        :transEnd="transEnd"
        :confData="filteredData[sel]" />
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import {
  getAllConferences,
  delConference,
  updateConference,
} from '@/api/conference';
import Search from '@/components/Search/index.vue';
import Confirmation from '@/components/Confirmation/index.vue';
import AddConference from '@/components/AddConference/index.vue';
import Details from './components/Details/index.vue';

export default {
  name: 'Conference',
  components: {
    Search,
    Details,
    Confirmation,
    AddConference,
  },
  data() {
    return {
      showConfirm: false,
      showInput: false,
      conferencesData: [],
      filteredData: [],
      filter: '',
      conf: null,
      sortConf: 'down',
      sel: null,
      transEnd: false,
      config: {
        handler: this.outside,
        events: ['click'],
      },
    };
  },
  methods: {
    delegate(items) {
      return items.filter((item) => item.chairman
        .some((chair) => chair.email !== this.$store.state.Global.me.email));
    },
    chair(items) {
      return items.filter((item) => item.chairman
        .some((chair) => chair.email === this.$store.state.Global.me.email));
    },
    ongoing(items) {
      const dt = Date.now();
      return items.filter((item) => {
        const a = new Date(item.start_date);
        const b = new Date(item.end_date);
        const c = new Date(b.getTime());
        c.setDate(c.getDate() + 1);
        return dt >= a && dt < c;
      });
    },
    filterFunc(items, tags, search) {
      let list = items;
      if (search !== '') {
        list = list.filter(
          (item) => item.title.toLowerCase().indexOf(search.toLowerCase()) > -1,
        );
      }
      if (tags.includes('Delegate')) {
        list = this.delegate(list);
      }
      if (tags.includes('Chair')) {
        list = this.chair(list);
      }
      if (tags.includes('Ongoing')) {
        list = this.ongoing(list);
      }
      if (tags.includes('Best Delegate')) {
        console.error('No backend support!'); // wait for backend
      }
      return list;
    },
    sortFunc(items, type, dir) {
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
      this.showInput = false;
      this.showConfirm = false;
    },
    showC(event, data) {
      if (!this.showInput) {
        this.$store.dispatch('context', [
        // eslint-disable-next-line no-underscore-dangle
          [data.title, data._id],
          {
            Edit: true,
            Delete: true,
          },
          [event.clientX, event.clientY],
        ]);
      }
    },
    showCon(data) {
      return (event) => {
        if (!this.showInput) {
          this.$store.dispatch('context', [
          // eslint-disable-next-line no-underscore-dangle
            [data.title, data._id],
            {
              Edit: true,
              Delete: true,
            },
            [event.touches[0].clientX, event.touches[0].clientY],
          ]);
        }
      };
    },
    context([item, name, id]) {
      if (item === 'delete') {
        this.showConfirm = name;
      } else {
        this.showInput = true;
        // eslint-disable-next-line no-underscore-dangle
        this.sel = this.conferencesData.findIndex((i) => i._id === id);
      }
    },
    select(i) {
      this.sel = i;
    },
    toggleInput(t) {
      this.showInput = t;
    },
    async updateConferencesData() {
      try {
        const conferences = await getAllConferences();
        if (conferences.data.data !== null) {
          this.conferencesData = conferences.data.data;
        }
        this.sel = null;
      } catch (err) {
        console.error(err);
      }
    },
    deleteConferenceData(conf) {
      delConference(conf)
        .catch((err) => {
          if (err.response.status === 422) {
            this.$store.commit('noAuth', true);
          } else {
            this.$store.commit('error', true);
          }
          console.error(err);
        });
      this.exit();
      this.updateConferencesData();
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
    this.$root.$on('context', (...args) => this.context(...args));
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      notAuthorized: (state) => state.Global.notAuthorized,
      me: (state) => state.Global.me,
    }),
    transName() {
      if (this.sel === null) return 'slide-right';
      return 'slide-left';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
