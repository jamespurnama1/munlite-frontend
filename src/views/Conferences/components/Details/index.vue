<template>
  <div class="wrap">
    <div class="upper" id="pin" v-if="width <= 960">
      <span class="left">
      <font-awesome-icon
        :icon="['fas', 'chevron-left']"
        @click="$emit('goBack')"
      />
      <img :src="require('@/assets/img/home.png')">
      <h1>{{ confData.title }}</h1>
      </span>
      <p
        @click="$router.push(`/overview/${confData._id}`).catch(() => {})"
        class="right take"
        v-if="ongoing">
        Take me there
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </p>
      <span class="right exportEdit">
        <button @click="buildExcel()">
          Export
          <font-awesome-icon :icon="['fas', 'file-export']" />
        </button>
        <button @click="$emit('edit', sel)">
          Edit
          <font-awesome-icon :icon="['fas', 'edit']" />
        </button>
      </span>
    </div>
    <transition name="fade" appear>
      <div class="details" v-if="sel !== null">
        <transition name="slide" appear>
          <div v-show="ongoing" class="ongoing">
            <h3>This conference is ongoing</h3>
            <p
              class="take"
              @click="$router.push(`/overview/${confData._id}`).catch(() => {});">
              Take me there
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </p>
          </div>
        </transition>
        <div class="left" :class="{offset: ongoing}">

          <div class="chair">
            <h3>Chair</h3>
            <ul>
              <li v-for="(chair, i) in confData.chairman" :key="i">
                <img :src="require('@/assets/img/home.png')">
                {{ chair.email }}
              </li>
            </ul>
          </div>

          <div class="rules">
            <h3 class="title">Rules</h3>
            <div class="grid">
              <div>
                <h3>Majority</h3>
                <span><p>{{ confData.rules.majority }}</p></span>
              </div>
              <div>
                <h3>Quorum</h3>
                <span><p>{{ confData.rules.quorum }}</p></span>
              </div>
              <div>
                <h3>DR Sponsors</h3>
                <span><p>{{ confData.rules.dr_vote }}</p></span>
              </div>
              <div>
                <h3>Rounding</h3>
                <p>
                  <font-awesome-icon
                    v-if="confData.rules.rounding === 'Round Up'"
                    :icon="['fas', 'arrow-up']"
                  />
                  <font-awesome-icon
                    v-else
                    :icon="['fas', 'arrow-down']"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="right" :class="{offset: ongoing && width > 600}">

          <span class="exportEdit" v-if="width > 960">
            <button @click="buildExcel()">
              Export
              <font-awesome-icon :icon="['fas', 'file-export']" />
            </button>
            <button @click="$emit('edit', sel)">
              Edit
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
          </span>

          <div class="others">
            <div>
              <h3>Motions Count</h3>
              <span>
                <h4>{{ motionsData.length }}&nbsp;</h4>
                <p>motions</p>
              </span>
              <button @click="$emit('motions')">
                View All
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
            </div>
            <div>
              <h3>Total Delegates</h3>
              <span>
                <h4 v-if="confData.delegates">{{ confData.delegates.length }}&nbsp;</h4>
                <h4 v-else>0 &nbsp;</h4>
                <p>delegates</p>
              </span>
              <button @click="$emit('delegates')">
                View All
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
            </div>
            <div>
              <h3>Activity Log</h3>
              <span>
                <h4>{{ confData.motions.batches.length + confData.caucus.list.length }}&nbsp;</h4>
                <p>recorded<br>activities</p>
              </span>
              <button>View All<font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
            </div>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mapState } from 'vuex';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'confDetails',
  props: {
    sel: Number,
    confData: Object,
    ongoing: Boolean,
    transEnd: Boolean,
  },
  data() {
    return {
      tl: null,
      motionsData: [],
    };
  },
  mounted() {
    this.scroll();
  },
  created() {
    this.confData.motions.batches.forEach((motion) => {
      this.motionsData.push(...motion.batch_motions);
    });
  },
  methods: {
    buildExcel() {
      const wb = XLSX.utils.book_new();
      // ROLLCALL WS
      const data = [['Country', 'Present', 'Present & Voting']];
      this.confData.delegates.forEach((delegate) => {
        data.push([
          delegate.country,
          delegate.status.toLowerCase() === 'present' ? 1 : 0,
          delegate.status.toLowerCase() === 'present & voting' ? 1 : 0,
        ]);
      });
      const rollCallWS = XLSX.utils.aoa_to_sheet(data);
      const rows = this.confData.delegates.length;
      const rollCallRange = {
        s: { r: 0, c: 0 },
        e: { r: rows + 3, c: 3 },
      };

      rollCallWS['!ref'] = XLSX.utils.encode_range(rollCallRange);
      rollCallWS[`A${rows + 2}`] = { v: '' };
      rollCallWS[`B${rows + 2}`] = { f: `SUM(B2:B${rows})` }; // present total
      rollCallWS[`C${rows + 2}`] = { f: `SUM(C2:C${rows})` }; // present & voting total
      rollCallWS[`A${rows + 4}`] = { v: 'Simple Majority' };
      rollCallWS[`B${rows + 4}`] = { f: `SUM(B${rows + 2}:C${rows + 2})*50%` };

      XLSX.utils.book_append_sheet(wb, rollCallWS, 'Roll Call');

      // RULES WS
      const rules = [
        ['Present'],
        ['Present & Voting'],
        ['Total'],
        '',
        [`Majority Vote (${this.confData.rules.majority})`],
        [`Quorum Vote (${this.confData.rules.quorum})`],
        '',
        // ['Moderated Caucus', // TODO: add time rules
        // `${this.confData.caucus.list[0].total_time / 60}
        // minutes total time & ${this.confData.caucus.list[0].speaking_time} speaking time`],
        // ['Unmoderated Caucus'],
      ];

      const rulesRange = {
        s: { r: 0, c: 0 },
        e: { r: 5, c: 1 },
      };

      const rulesWS = XLSX.utils.aoa_to_sheet(rules);
      rulesWS['!ref'] = XLSX.utils.encode_range(rulesRange);
      rulesWS.B1 = { f: `'Roll Call'!B${rows + 2}` };
      rulesWS.B2 = { f: `'Roll Call'!C${rows + 2}` };
      rulesWS.B3 = { f: 'SUM(B1:B2)' };
      rulesWS.B5 = { f: '(B3/2)+1' }; // TODO: custom maojrity rule
      rulesWS.B6 = { f: 'ROUNDUP(B3*30%)' }; // TODO: custom quorum rule & Rounding

      XLSX.utils.book_append_sheet(wb, rulesWS, 'Rules');

      // GSL WS
      const gsl = [
        ['No', 'Country', 'Time', 'Yield', 'Yield'],
        ['', '', 'Min', 'Sec', 'Yield', 'Yield'],
      ];
      for (let i = 0; i < this.confData.gsl.length; i += 1) {
        gsl.push([i + 1, '', this.confData.gsl.queue[i].time_left, 'Yield to']);
      } // TODO: delegate, time minute, & yield to

      const gslWS = XLSX.utils.aoa_to_sheet(gsl);
      const merge = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // no
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // country
        { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } }, // time
        { s: { r: 0, c: 4 }, e: { r: 1, c: 5 } }, // yield
      ];
      gslWS['!merges'] = merge;
      XLSX.utils.book_append_sheet(wb, gslWS, 'GSL');

      // TODO: Formal Debate WS

      const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      /* create data URL */
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, `${this.confData.title}.xlsx`);
    },
    scroll() {
      ScrollTrigger.matchMedia({
        '(max-width: 960px)': () => {
          ScrollTrigger.create({
            trigger: '.nav',
            start: 'bottom top',
            endTrigger: '.details',
            end: 'bottom top',
            pinSpacing: false,
            pin: '#pin',
          });
          this.tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.nav',
              start: 'bottom top',
              endTrigger: '.details',
              end: 'top top',
              scrub: true,
            },
          });
          this.tl.fromTo('.upper .exportEdit', {
            autoAlpha: 1,
            scaleX: 1,
          }, {
            autoAlpha: 0,
            scaleX: 0.5,
          }, 0)
            .fromTo('#pin', {
              scaleY: 1,
              boxShadow: '0 0 20px 0 rgba(0,0,0,0)',
              borderRadius: '0',
            }, {
              scaleY: 0.5,
              boxShadow: '0 0 20px 0 rgba(0,0,0,0.15)',
              borderRadius: '0 0 15px 15px',
            }, 0)
            .fromTo('.upper .left', {
              scaleX: 1,
            }, {
              scaleX: 0.5,
            }, 0);
          if (this.ongoing && typeof this.sel === 'number') {
            this.tl.to('#pin', {
              backgroundColor: '#5f78ff',
              boxShadow: '0 0 20px 0 #5f78ff',
              color: 'white',
            }, 0)
              .fromTo('.upper p.right', {
                autoAlpha: 0,
                scaleX: 1,
                scaleY: 1,
              }, {
                autoAlpha: 1,
                scaleY: 1.5,
                scaleX: 0.75,
              }, 0);
          }
        },
      });
    },
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
    }),
  },
  watch: {
    transEnd() {
      ScrollTrigger.refresh(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
