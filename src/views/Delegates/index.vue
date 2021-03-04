<template>
  <div class="delegates" :style="`min-height=${infoHeight}`">
    <transition name="fade">
      <add-delegates
        v-if="showInput"
        :items="countryList"
        @exit="exit"
        @update="updateDelegatesData"
      />
    </transition>
    <div class="delegates-upper">
      <div class="delegates-button">
        <span>
          <h1 class="title">Delegates</h1>
          <p v-if="width > 960">Right click for more options</p>
          <p v-else>Touch &amp; hold for more options</p>
        </span>
        <span class="buttons">
          <button
            class="button press"
            @click="showModal"
            :disabled="delStore.length < 1"
          >
            Roll Call
          </button>
          <button class="button" @click="toggleInput">
            <font-awesome-icon :icon="['fas', 'plus']"/>
          </button>
        </span>
      </div>
      <div class="info" v-if="width <= 960">
        <div class="info-data" v-for="(value, key) in info" :key="key">
          <p class="title emphasize">{{ key }}</p>
          <p class="data"><b class="emphasize">{{ value }}</b> Delegates</p>
        </div>
      </div>
    </div>
    <div class="delegates-table">
      <div class="table">
        <div class="title">
          <p class="title-name">Name</p>
          <p class="title-presence">Presence</p>
        </div>
        <div class="content">
          <div class="table-data" v-if="delStore.length > 0">
            <Search
              class="search"
              :items="delStore"
              :sortFunc="sortMethod"
              :sortTypes="['Name', 'Presence']"
              sortDefault="Name"
              dirDefault="up"
              :filterFunc="filterMethod"
              :key="`${key} search`"
              :filterTypes="[['Present', 'Present & Voting', 'Not Present'],
                ['Asia',
                'Americas',
                'Africa',
                'Western Europe',
                'Central & Eastern Europe',
                'Middle East']]"
              @sortedData="(data) => {
                delegatesData = data
              }"
            />
            <transition-group name="fade">
            <div
              v-for="(data, index) in delegatesData"
              :key="data._id"
              class="data"
              @contextmenu.prevent="showC($event, data, index)"
              v-touch:touchhold.prevent="showCon(data, index)"
            >
              <p class="name">
                <span
                :class="`flag-icon img flag-icon-${getDelegatesID(data.country).toLowerCase()}`" />
                {{ data.country }}
              </p>
              <p class="presence">{{ data.status }}</p>
              <transition name="fade">
                <Confirmation
                  :content="`Are you sure you want to delete ${data.country}?`"
                  :action="deleteDelegatesData"
                  :id="data._id"
                  :negative="true"
                  button="Delete"
                  v-if="showConfirm === `del ${index}`"
                  v-click-outside="config"
                  @exit="exit"
                />
              </transition>
            </div>
            </transition-group>
          </div>
          <div class="table-data empty-data" v-else>No Delegates in the list</div>
          <div class="info" v-if="width> 960">
            <div class="info-data" v-for="(value, key) in info" :key="key">
              <p class="title emphasize"><b>{{ key }}</b></p>
              <div class="data"><b class="emphasize">{{ value }}</b> Delegates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="rollcall" v-if="showOverlay">
        <RollCall
          :key="1"
          :delegatesData="delStore"
          @update="updateDelegatesData"
          v-if="stage === 1"
        />
        <Vote
          :key="2" v-else-if="stage === 2"
          :delegatesData="delStore"
          :info="info"
          :rulesData="rulesData"
        />
        <Pass :key="3" v-else-if='stage === 3' />
      </div>
    </transition>
    <transition name="fade">
    <div class="overlay" v-if="showOverlay || showInput || showConfirm != null" />
    </transition>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllDelegates, deleteDelegates } from '@/api/delegates';
import { getConference } from '@/api/conference';
import { negara } from '@/const/country';
import Confirmation from '@/components/Confirmation/index.vue';
import { mapState } from 'vuex';
import Search from '@/components/Search/index.vue';
import AddDelegates from './components/AddDelegates/index.vue';
import RollCall from './components/RollCall/index.vue';
import Vote from './components/Vote/index.vue';
import Pass from './components/Pass/index.vue';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'Delegates',
  components: {
    RollCall,
    Vote,
    Search,
    Pass,
    Confirmation,
    AddDelegates,
  },
  data() {
    return {
      showOverlay: false,
      showInput: false,
      newCountry: '',
      stage: 0,
      delegatesData: [],
      dr_vote: 0,
      rulesData: [],
      countryList: negara,
      showConfirm: null,
      config: {
        handler: this.exit,
        events: ['click'],
      },
      key: 0,
      infoHeight: 0,
    };
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      delStore: (state) => state.Delegates.delegates,
    }),
    info() {
      const present = this.delStore.filter((obj) => obj.status.toLowerCase() === 'present');
      const pv = this.delStore.filter((obj) => obj.status.toLowerCase() === 'present & voting');
      const total = present.length + pv.length;
      const data = {
        Present: present.length,
        'Present & Voting': pv.length,
        'Total Present': total,
        'DR Sponsors': Math.floor(this.dr_vote * (total)),
      };
      return data;
    },
  },
  methods: {
    scroll() {
      ScrollTrigger.matchMedia({
        '(max-width: 960px)': () => {
          this.tl = gsap.timeline({
            scrollTrigger: {
              trigger: '#app',
              start: 0,
              end: `+=${this.infoHeight}`,
              id: 'trigger1',
              scrub: true,
              snap: {
                snapTo: [0, 1],
                duration: { min: 0.3, max: 0.5 },
                delay: 0.5,
              },
            },
          });
          this.tl.to('.info', {
            y: `-=${this.infoHeight}`,
            opacity: 0,
            ease: 'power1',
          })
            .to('.delegates-table', {
              y: `-=${this.infoHeight}`,
              ease: 'power1',
            }, 0);
        },
      });
    },
    filterMethod(items, tags, search) {
      let list = items;
      if (search !== '') {
        list = list.filter(
          (item) => item.country.toLowerCase().indexOf(search.toLowerCase()) > -1,
        );
      }
      if (tags.includes('Present')) {
        list = list.filter((item) => item.status.toLowerCase() === 'present');
      }
      if (tags.includes('Not Present')) {
        list = list.filter((item) => item.status.toLowerCase() === 'not present');
      }
      if (tags.includes('Present & Voting')) {
        list = list.filter((item) => item.status.toLowerCase() === 'present & voting');
      }
      return list;
    },
    sortMethod(items, type, dir) {
      let tipe;
      if (type === 'Name') {
        tipe = 'country';
      } else if (type === 'Presence') tipe = 'status';
      items.sort((a, b) => {
        let compare;
        switch (dir) {
          case 'up':
            compare = a[tipe].toLowerCase() < b[tipe].toLowerCase();
            break;
          case 'down':
            compare = a[tipe].toLowerCase() > b[tipe].toLowerCase();
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
      return items;
    },
    context([action, , , index]) {
      switch (action) {
        case 'Present':
          // change presence
          break;
        case 'View Notes':
          // view notes
          break;
        case 'Delete':
          this.showConfirm = `del ${index}`;
          break;
        default:
      }
    },
    showC(event, data, index) {
      if (!this.stage) {
        this.$store.dispatch('context', [
          [data.country, data._id, index],
          { Present: false, 'View Notes': false, Delete: true },
          [event.clientX, event.clientY],
        ]);
      }
    },
    showCon(data, index) {
      return (event) => {
        if (!this.stage) {
          this.$store.dispatch('context', [
            [data.country, data._id, index],
            { Present: false, 'View Notes': false, Delete: true },
            [event.touches[0].clientX, event.touches[0].clientY],
          ]);
        }
      };
    },
    showModal() {
      this.showOverlay = true;
      this.stage = 1;
    },
    toggleInput() {
      this.showInput = !this.showInput;
      this.newCountry = '';
    },
    getDelegatesID(name) {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    sortCountry(items) {
      items.sort((a, b) => {
        const nameA = a.country.toUpperCase();
        const nameB = b.country.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return items;
    },
    async updateDelegatesData() {
      try {
        const delegates = await getAllDelegates(this.$route.params.id);
        this.$store.commit('delList', delegates.data.data);
        if (this.delStore) {
          this.delegatesData = this.sortCountry(this.delStore);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteDelegatesData(country) {
      try {
        const responses = new Promise((resolve) => {
          resolve(deleteDelegates(this.$route.params.id, country));
        });
        responses.then(() => {
          this.exit();
          this.updateDelegatesData();
        });
      } catch (err) {
        console.error(err);
      }
    },
    exit() {
      this.showInput = false;
      this.showConfirm = null;
    },
  },
  watch: {
    stage() {
      if (this.stage > 0) {
        document.querySelector('body').style.cssText = 'height: 100vh; width: 100vw; overflow: hidden;';
      } else {
        document.querySelector('body').style.removeProperty('height');
        document.querySelector('body').style.removeProperty('width');
        document.querySelector('body').style.removeProperty('overflow');
      }
    },
  },
  async created() {
    this.$root.$on('context', (...args) => this.context(...args));
    if (this.delStore) this.sortCountry(this.delStore); // TODO: localstorage cache & loading
    this.updateDelegatesData();
    this.key += 1;
    try {
      const conference = await getConference(this.$route.params.id);
      this.rulesData = conference.data.data.rules;
      const [parse] = (conference.data.data.rules.dr_vote).split(' ');
      const num = parse.split('/');
      this.dr_vote = (num[0] / num[1]).toFixed(2);
    } catch (err) {
      console.error(err);
    }
  },
  mounted() {
    this.infoHeight = this.$el.querySelector('.info').clientHeight;
    this.scroll();
    this.$on('stage', (i) => {
      if (i === 0) {
        this.showOverlay = false;
      }
      this.stage = i;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
