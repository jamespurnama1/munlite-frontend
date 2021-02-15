<template>
  <div class="conferences" :class="{mobile: width <= 960 && sel !== null}">
    <transition name="fade">
      <add-conference
        type="add"
        v-if="showInput === 'add'"
        @exit="exit"
        @update="updateConferencesData"
        v-click-outside="config"
      />
    </transition>
    <transition name="fade">
      <div class="overlay" v-if="showInput || showConfirm" />
    </transition>
    <div class="conferences-upper">
      <h1 class="title">Conferences</h1>
      <div class="conferences-button">
        <div class="button" @click="toggleInput('add')">
          <font-awesome-icon :icon="['fas', 'plus']"/>
        </div>
      </div>
    </div>
    <div
      class="table-data"
      :class="{mobile1: width <= 960 && sel === null}"
      v-if="conferencesData.length > 0">
      <Search
        class="search"
        @sortData="(...args) => {
        this.conferencesData = sortData(this.conferencesData, ...args)}"
        @filterData="filterData" />
      <transition-group name="fade">
        <div
        v-for="(data, index) in conferencesData"
        :key="data.title" class="data"
        @click="select(index)"
        @contextmenu.prevent="showC(data.title, $event)"
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
              <div v-if="ongoing(index)" class="badge">
                ONGOING
              </div>
            </span>
          </div>
          <font-awesome-icon v-if="width <= 960" :icon="['fas', 'chevron-right']"/>
          <Context
            :action="['edit', 'delete']"
            :conferenceName="data.title"
            :conferenceId="data._id"
            :pos="contextPos"
            v-if="showContext === data.title"
            @context="(...args) => context(...args)"
            v-click-outside="config"
          />
          <Confirmation
            :content="`Are you sure you want to delete ${data.title}?`"
            :action="deleteConferenceData"
            :conferenceName="data.title"
            :id="data._id"
            v-if="showConfirm === data.title"
            v-click-outside="config"
            @exit="exit"
          />
          <add-conference
            class="edit"
            :conf="data"
            type="edit"
            v-if="showInput === data.title"
            @exit="exit"
            @update="updateConferencesData"
            v-click-outside="config"
          />
        </div>
      </transition-group>
    </div>
    <Details
    :ongoing="ongoing"
    :sel="sel"
    @goBack="sel = null"
    @edit="(...t) => toggleInput(...t)"
    :confData="conferencesData" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  getConference,
  getAllConferences,
  delConference,
  updateConference,
} from '@/api/conference';
import Search from '@/components/Search/index.vue';
import Confirmation from '@/components/Confirmation/index.vue';
import Context from '@/components/Context/index.vue';
import AddConference from '@/components/AddConference/index.vue';
import Details from './components/Details/index.vue';

export default {
  name: 'Conference',
  components: {
    Search,
    Details,
    Confirmation,
    AddConference,
    Context,
  },
  data() {
    return {
      showConfirm: false,
      showInput: false,
      showContext: false,
      conferencesData: [],
      conf: null,
      sortConf: 'down',
      sel: null,
      config: {
        handler: this.outside,
        events: ['click'],
      },
      contextPos: [0, 0],
    };
  },
  methods: {
    filterData() {
      // console.log(f);
    },
    ongoing(i) {
      const a = new Date(this.conferencesData[i].start_date);
      const b = new Date(this.conferencesData[i].end_date);
      const dt = Date.now();

      const c = new Date(b.getTime());
      c.setDate(c.getDate() + 1);
      return dt >= a && dt < c;
    },
    outside() {
      this.showContext = false;
      this.showInput = false;
      this.showConfirm = false;
    },
    showC(d, e) {
      if (e) {
        this.contextPos = [e.clientX, e.clientY];
      }
      if (!this.showInput) {
        this.showContext = d;
      }
    },
    context([i, n]) {
      this.showContext = false;
      if (i === 'delete') {
        this.showConfirm = n;
      } else {
        this.showInput = n;
      }
    },
    select(i) {
      this.sel = i;
    },
    toggleInput(t) {
      this.showInput = t;
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
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      notAuthorized: (state) => state.Global.notAuthorized,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
