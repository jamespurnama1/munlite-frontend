<template>
  <div>
    <transition-group name="fade">
      <Confirmation
        content="Discard Conference?"
        :action="exitAdd"
        :negative="true"
        button="Discard"
        whiteButton="Keep Editing"
        v-if="showConfirm === 'add'"
        @exit="showConfirm = false"
        :key="`${showConfirm}Modal`"
      />
      <div class="overlay modal" :key="showConfirm" v-if="showConfirm === 'add'" />
      <add-conference
        v-if="showInput"
        :conf="editData"
        @exit="showConfirm = 'add'"
        @exitSafe="exit(); showInput = false; editData = {};"
        @update="updateConferencesData"
        v-click-outside="configAdd"
        key="addConf"
      />
      <div class="overlay" key="overlay" v-if="showInput || showConfirm" />
    </transition-group>
    <transition-group
      v-on:beforeEnter="() => {transEnd = false}"
      v-on:afterLeave="() => {transEnd = true}"
      class="conferences"
      :class="{mobile: width <= 960 && (sel !== null || motions !== null || delegates !== null)}"
      tag="div"
      :name="transName">
      <div key="3upper" class="conferences-upper" v-if="width > 960
        || (sel === null && motions === null && delegates === null)">
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
        key="4table"
        class="table-data"
        v-if="conferencesData.length > 0
        && (width > 960 || (sel === null && motions === null && delegates === null))"
      >
        <Search
          class="search"
          :items="conferencesData"
          :sortFunc="sortFunc"
          sortDefault="Date"
          dirDefault="down"
          :sortTypes="['Name', 'Date']"
          :filterFunc="filterFunc"
          :key="key"
          :filterTypes="['Ongoing', ['Chair', 'Delegate', 'Best Delegate']]"
          @sortedData="(data) => {
            filteredData = data
          }"
        />
        <transition-group name="fade">
          <div
            v-for="(data, index) in filteredData"
            :key="data.title" class="data"
            @click="select(index); motions = null; delegates = null"
            @contextmenu.prevent="showC($event, data, index)"
            v-touch:touchhold.prevent="showCon(data, index)"
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
        :key="`${sel}${filteredData[sel].chairman.length}`"
        :ongoing="ongoing([filteredData[sel]]).length > 0"
        :sel="sel"
        @goBack="sel = null"
        v-if="sel !== null && (motions === null && delegates === null)"
        @edit="(...t) => toggleInput(...t)"
        @motions="motions = sel"
        @delegates="delegates = sel"
        :transEnd="transEnd"
        :confData="filteredData[sel]"
      />
      <Motions
        :key="`${motions}motions`"
        v-else-if="motions  !== null"
        @goBack="motions = null"
        :confData="filteredData[motions]"
      />
      <Delegates
        :key="`${delegates}delegates`"
        v-else-if="delegates  !== null"
        @goBack="delegates = null"
        :confData="filteredData[delegates]"
      />
      <div key="8" v-else-if="!conferencesData && error" class="confError">
        <h3>Something went wrong. 😥</h3>
        <p>Try refreshing the page.</p>
      </div>
      <div key="6" v-else-if="conferencesData && conferencesData.length === 0" class="noConf">
        <h3>Create your first MUN Conference</h3>
        <p>Pick one conference from the left tab to view its details.</p>
      </div>
      <div key="7" v-else-if="width > 960 && sel === null" class="notSelected">
        <h3>Select a MUN Conference</h3>
        <p>Pick one conference from the left tab to view its details.</p>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import {
  getAllConferences,
  delConference,
  updateConference,
} from '@/api/conference';
import Search from '@/components/Search/index.vue';
import Confirmation from '@/components/Confirmation/index.vue';
import AddConference from '@/components/AddConference/index.vue';
// eslint-disable-next-line no-unused-vars
import { conferenceType } from '@/types/api';
import Details from './components/Details/index.vue';
import Motions from './components/Motions/index.vue';
import Delegates from './components/Delegates/index.vue';

export default Vue.extend({
  name: 'Conference',
  components: {
    Search,
    Details,
    Confirmation,
    AddConference,
    Motions,
    Delegates,
  },
  data() {
    return {
      showConfirm: false as boolean | string,
      showInput: false as boolean,
      conferencesData: [] as conferenceType.getAllConferences[],
      editData: {} as Partial<conferenceType.getConference>,
      filteredData: [] as conferenceType.getAllConferences[],
      // filter: '' as string,
      conf: null,
      sel: null as number | null,
      key: 0 as number,
      transEnd: false,
      config: {
        // @ts-ignore
        handler: this.outside,
        events: ['click', 'touchstart', 'touchmove'],
      },
      configAdd: {
        handler: () => {
          // @ts-ignore
          this.showConfirm = 'add';
        },
        middleware: (event) => event.target.className !== 'cancel' && event.target.className !== 'list',
        events: ['click', 'touchstart', 'touchmove'],
      },
      motions: null,
      error: null,
      delegates: null,
    };
  },
  methods: {
    exitAdd(): void {
      this.showInput = false;
    },
    delegate(items: conferenceType.getAllConferences[]): conferenceType.getAllConferences[] {
      return items.filter((item) => item.chairman
        .some((chair) => chair.email !== this.$store.state.Global.me.email));
    },
    chair(items: conferenceType.getAllConferences[]): conferenceType.getAllConferences[] {
      return items.filter((item) => item.chairman
        .some((chair) => chair.email === this.$store.state.Global.me.email));
    },
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
    filterFunc(
      items: conferenceType.getAllConferences[],
      tags: string[],
      search: string,
    ): conferenceType.getAllConferences[] {
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
    sortFunc(
      items: conferenceType.getAllConferences[],
      type: string,
      dir: string,
    ): conferenceType.getAllConferences[] {
      if (type === 'Date') {
        items.sort((a, b) => {
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
      } else if (type === 'Name') {
        items.sort((a, b) => {
          let compare;
          switch (dir) {
            case 'up':
              compare = a.title.toLowerCase() < b.title.toLowerCase();
              break;
            case 'down':
              compare = a.title.toLowerCase() > b.title.toLowerCase();
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
      return items;
    },
    outside(): void {
      this.showInput = false;
      this.editData = {};
      this.showConfirm = false;
    },
    showC(event: MouseEvent, data: conferenceType.getConference, index: number): void {
      if (!this.showInput) {
        this.$store.dispatch('context', [
          [data.title, data._id, index],
          {
            Edit: true,
            Delete: true,
          },
          [event.clientX, event.clientY],
        ]);
      }
    },
    showCon(data: conferenceType.getConference, index: number) {
      return (event) => {
        if (!this.showInput) {
          this.$store.dispatch('context', [
            [data.title, data._id, index],
            {
              Edit: true,
              Delete: true,
            },
            [event.touches[0].clientX, event.touches[0].clientY],
          ]);
        }
      };
    },
    context(): void {
      if (!this.showInput && this.contextData.action === 'Delete') {
        this.showConfirm = this.contextData.name;
      } else if (!this.showInput) {
        this.showInput = true;
        this.editData = this.filteredData[this.contextData.index];
        this.sel = this.conferencesData.findIndex((i) => i._id === this.contextData.id);
      }
    },
    select(i: number): void {
      this.sel = i;
    },
    toggleInput(t: string): void {
      if (t === 'add') {
        this.editData = {};
      } else {
        this.editData = this.filteredData[t];
      }
      this.showInput = true;
    },
    async updateConferencesData(): Promise<void> {
      try {
        const conferences = await getAllConferences();
        if (conferences.data.data !== null) {
          this.conferencesData = conferences.data.data;
          this.key += 1;
        }
      } catch (err) {
        this.error = err;
        console.error(err);
      }
    },
    async deleteConferenceData(conf: string): Promise<void> {
      delConference(conf)
        .then(() => {
          this.sel = null;
          this.updateConferencesData();
        })
        .catch((err) => {
          if (err.response.status === 422) {
            this.$store.commit('noAuth', true);
          } else {
            this.$store.commit('error', true);
          }
          console.error(err);
        });
      this.exit();
    },
    exit(): void {
      this.showConfirm = false;
    },
    async patchConferences(
      conf: conferenceType.getConference,
      data: conferenceType.updateConference,
    ): Promise<void> {
      try {
        const responses = new Promise((resolve) => {
          resolve(updateConference(conf._id, data));
        });
        responses.then(() => {
          this.updateConferencesData();
        });
      } catch (err) {
        console.error(err);
      }
    },
    readable(d: string, e: string): string {
      const sDate = new Date(d);
      const eDate = new Date(e);
      const ye = (y: Date) => new Intl.DateTimeFormat('en', { year: 'numeric' }).format(y);
      const mo = (m: Date) => new Intl.DateTimeFormat('en', { month: 'short' }).format(m);
      const da = (day: Date) => new Intl.DateTimeFormat('en', { day: '2-digit' }).format(day);
      let r: string = '';
      if (typeof e === 'string') {
        r = `${da(sDate)} ${mo(sDate)} - ${da(eDate)} ${mo(eDate)} ${ye(eDate)}`;
      } else if (typeof e === 'undefined') {
        r = ye(sDate);
      }
      return r;
    },
    yearOnly(d: string) {
      return d;
    },
  },
  created() {
    this.updateConferencesData();
    this.$root.$on('context', this.context);
  },
  beforeDestroy() {
    this.$root.$off('context', this.context);
  },
  computed: {
    ...mapState({
      width: (state: any) => state.Global.widthWindow,
      notAuthorized: (state: any) => state.Global.notAuthorized,
      me: (state: any) => state.Global.me,
      contextData: (state: any) => state.Global.contextData,
    }),
    transName() {
      if (this.width > 960) return 'fade';
      if (this.sel === null) return 'slide-right';
      return 'slide-left';
    },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
