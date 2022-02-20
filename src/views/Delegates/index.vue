<template>
  <div class="delegates" :style="`min-height=${infoHeight}`">
    <transition name="fade">
      <add-delegates
        v-if="showInput"
        :items="negara"
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
    </div>
    <div class="delegates-table">
      <div class="info" v-if="width <= 960">
        <div class="info-data" v-for="(value, key) in info" :key="key">
          <p class="title emphasize">{{ key }}</p>
          <p class="data"><b class="emphasize">{{ value }}</b> Delegates</p>
        </div>
      </div>
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
                'Europe',
                'Oceania']]"
              @sortedData="(data) => {
                delegatesData = data
              }"
            />
            <transition-group name="fade">
            <li
              v-for="(data, index) in delegatesData"
              :key="data._id"
              class="data"
              @contextmenu.prevent="showC($event, data, index)"
              v-touch:touchhold.prevent="showCon(data, index)"
            >
              <p class="name">
                <span
                :class="`flag-icon img flag-icon-${getDelegatesID(data.country).toLowerCase()}`"
                />
                {{ data.country }}
              </p>
              <p class="presence">{{ data.status }}</p>
            </li>
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
    <transition-group name="fade">
      <Confirmation
        :content="`Are you sure you want to delete ${delegatesData[showConfirm].country}?`"
        :action="deleteDelegatesData"
        :id="delegatesData[showConfirm]._id"
        :negative="true"
        button="Delete"
        :key="`del ${showConfirm}`"
        v-if="typeof showConfirm === 'number'"
        v-click-outside="config"
        @exit="exit"
      />
      <div
        class="overlay"
        v-if="showOverlay || showInput || typeof showConfirm === 'number'"
        key="overlay"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { getAllDelegates, deleteDelegates } from '@/api/delegates';
// import { getConference } from '@/api/conference';
import negara from '@/const/country.json';
import Confirmation from '@/components/Confirmation/index.vue';
import { mapState } from 'vuex';
import Search from '@/components/Search/index.vue';
// eslint-disable-next-line no-unused-vars
import { delegatesType } from '@/types/api';
import AddDelegates from './components/AddDelegates/index.vue';
import RollCall from './components/RollCall/index.vue';
import Vote from './components/Vote/index.vue';
import Pass from './components/Pass/index.vue';

gsap.registerPlugin(ScrollTrigger);

export default Vue.extend({
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
      negara,
      showOverlay: false as boolean,
      showInput: false as boolean,
      newCountry: '' as string,
      stage: 0 as number,
      delegatesData: [] as delegatesType.getAllDelegates[],
      dr_vote: 0 as number,
      rulesData: [] as any,
      showConfirm: false as boolean | string,
      config: {
        // @ts-ignore
        handler: this.exit,
        events: ['click', 'touchstart', 'touchmove'],
      },
      key: 0 as number,
      infoHeight: 0 as number,
      tl: null as GSAPTimeline | null,
    };
  },
  computed: {
    ...mapState({
      width: (state: any) => state.Global.widthWindow as number,
      delStore: (state: any) => state.Delegates.delegates as delegatesType.getAllDelegates[],
      contextData: (state: any) => state.Global.contextData,
    }),
    info(): {[key: string]: number} {
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
    scroll(): void {
      ScrollTrigger.matchMedia({
        '(max-width: 960px)': () => {
          this.tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.table-data',
              start: 0,
              end: `+=${this.infoHeight}`,
              id: 'trigger1',
              scroller: '.table-data',
              scrub: true,
              snap: {
                snapTo: [0, 1],
                duration: { min: 0.3, max: 0.5 },
                delay: 0.5,
              },
            },
          });
          this.tl.fromTo('.table', {
            y: this.infoHeight,
          }, {
            y: `-=${this.infoHeight}`,
          })
            .to('.info', {
              y: `-=${this.infoHeight}`,
              opacity: 0,
            }, 0);
        },
        '(min-width: 961px)': () => {
          gsap.set('.table', {
            y: 0,
          });
        },
      });
    },
    filterMethod(
      items: delegatesType.getAllDelegates[] & {region?: string}[],
      tags: string[],
      search: string,
    ): delegatesType.getAllDelegates[] {
      let list = items;
      list.forEach((l: delegatesType.getAllDelegates & {region?: string}) => {
        const match = negara.find((n) => l.country === n.name);
        // eslint-disable-next-line no-param-reassign
        l.region = match?.region;
        // eslint-disable-next-line no-param-reassign
        l['alpha-2'] = match!['alpha-2'];
        // eslint-disable-next-line no-param-reassign
        l['alpha-3'] = match!['alpha-3'];
      });
      if (search !== '') {
        list = list.filter(
          (item) => item.country.toLowerCase().indexOf(search.toLowerCase()) > -1
          || item['alpha-2'].toLowerCase().indexOf(search.toLowerCase()) > -1
          || item['alpha-3'].toLowerCase().indexOf(search.toLowerCase()) > -1,
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
      if (tags.includes('Asia')) {
        list = list.filter((item: any) => item.region.toLowerCase() === 'asia');
      }
      if (tags.includes('Africa')) {
        list = list.filter((item: any) => item.region.toLowerCase() === 'africa');
      }
      if (tags.includes('Americas')) {
        list = list.filter((item: any) => item.region.toLowerCase() === 'americas');
      }
      if (tags.includes('Europe')) {
        list = list.filter((item: any) => item.region.toLowerCase() === 'europe');
      }
      if (tags.includes('Oceania')) {
        list = list.filter((item: any) => item.region.toLowerCase() === 'oceania');
      }
      return list;
    },
    sortMethod(
      items: delegatesType.getAllDelegates[],
      type: string,
      dir: string,
    ): delegatesType.getAllDelegates[] {
      let tipe: string = '';
      if (type === 'Name') {
        tipe = 'country';
      } else if (type === 'Presence') tipe = 'status';
      items.sort((a, b) => {
        let compare: boolean = false;
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
    context(): void {
      switch (this.contextData.action) {
        case 'Present':
          // change presence
          break;
        case 'View Notes':
          // view notes
          break;
        case 'Delete':
          this.showConfirm = this.contextData.index;
          break;
        default:
      }
    },
    showC(event: MouseEvent, data: delegatesType.getAllDelegates, index: number): void {
      if (!this.stage) {
        this.$store.dispatch('context', [
          [data.country, data._id, index],
          { Present: false, 'View Notes': false, Delete: true },
          [event.clientX, event.clientY],
        ]);
      }
    },
    showCon(data: delegatesType.getAllDelegates, index: number) {
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
    showModal(): void {
      this.showOverlay = true;
      this.stage = 1;
    },
    toggleInput(): void {
      this.showInput = !this.showInput;
      this.newCountry = '';
    },
    getDelegatesID(name: string): string {
      const data = this.negara.find((obj) => obj.name === name);
      if (data) return data['alpha-2'];
      return 'ad';
    },
    sortCountry(items: delegatesType.getAllDelegates[]): delegatesType.getAllDelegates[] {
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
    async updateDelegatesData(): Promise<void> {
    //   try {
    //     const delegates = await getAllDelegates(this.$route.params.id);
      // this.$store.commit('delList', this.delegatesData);
      if (this.delStore) {
        this.delegatesData = this.sortCountry(this.delStore);
      }
    //   } catch (err) {
    //     console.error(err);
    //   }
    },
    async deleteDelegatesData(ctry: string): Promise<void> {
    //   try {
    //     const responses = new Promise((resolve) => {
    //       resolve(deleteDelegates(this.$route.params.id, country));
    //     });
    //     responses.then(() => {
      const delTemp = [...this.delStore];
      delTemp.splice(
        this.delStore.findIndex(({ country }) => country.toLowerCase() === ctry), 1,
      );
      console.log(delTemp);
      this.$store.commit('delList', delTemp);
      this.exit();
      this.updateDelegatesData();
    //     });
    //   } catch (err) {
    //     console.error(err);
    //   }
    },
    exit(): void {
      this.showInput = false;
      this.showConfirm = false;
    },
  },
  watch: {
    stage() {
      if (this.stage > 0) {
        (document.querySelector('body') as HTMLElement).style.cssText = 'height: 100vh; width: 100vw; overflow: hidden;';
      } else {
        (document.querySelector('body') as HTMLElement).style.removeProperty('height');
        (document.querySelector('body') as HTMLElement).style.removeProperty('width');
        (document.querySelector('body') as HTMLElement).style.removeProperty('overflow');
      }
    },
  },
  async created() {
    this.$root.$on('context', this.context);
    if (this.delStore) this.sortCountry(this.delStore); // TODO: localstorage cache & loading
    this.updateDelegatesData();
    this.key += 1;
    try {
      // const conference = await getConference(this.$route.params.id);
      this.rulesData = {
        majority: '1/2 Delegates + 1',
        dr_vote: '2/3 Delegates',
        quorum: '2/3 Delegates',
        rounding: 'Round Up',
      };
      const [parse] = (this.rulesData.dr_vote).split(' ');
      const num = parse.split('/');
      this.dr_vote = parseFloat((num[0] / num[1]).toFixed(2));
    } catch (err) {
      console.error(err);
    }
  },
  beforeDestroy() {
    this.$root.$off('context', this.context);
  },
  mounted() {
    if (this.$el.querySelector('.info')) this.infoHeight = this.$el.querySelector('.info')!.clientHeight;
    this.scroll();
    this.$on('stage', (i) => {
      if (i === 0) {
        this.showOverlay = false;
      }
      this.stage = i;
    });
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
#app {
  max-height: 100vh;
}
</style>
