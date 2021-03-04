<template>
  <div class="delegates">
    <div class="delegates-upper">
      <h1 class="title">Motions</h1>
      <div class="button" @click="showModal = true">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </div>
    </div>
    <div class="delegates-table">
      <div class="table">
        <div class="title">
          <p class="title-name">Name</p>
          <p>Proposer</p>
          <p class="title-time" v-if="width > 960">Time</p>
          <p class="title-vote" v-if="width > 960">Yes Vote</p>
          <p class="title-vote" v-if="width > 960">No Vote</p>
        </div>
        <div class="content">
          <div class="table-data" v-if="motionsData.length > 0">
            <transition-group name="fade">
            <div
              v-for="(motion, index) in motionsData"
              :key="motion._id"
              class="data"
              @contextmenu.prevent="showC($event, motion, index)"
              v-touch:touchhold.prevent="showCon(motion, index)"
            >
              <span class="name">
                <p v-if="motion.name !== ''">
                  {{ motion.name }}
                </p>
                <p :class="{caption: motion.name}">
                  {{ motion.type }}
                </p>
              </span>
              <p>
                <span
                  :class="`flag-icon img flag-icon-${getDelegatesID(motion.proposer)
                    .toLowerCase()}`"
                />
                {{ motion.proposer }}
              </p>
              <font-awesome-icon
                :class="{rotate: expand === index}"
                v-if="width <= 960"
                :icon="['fas', 'chevron-down']"
                @click="expand === index ? expand = null : expand = index" />
              <span class="extra" v-if="width > 960 || expand === index">
              <p class="time">
                <b>{{ parseFloat((motion.total_time / 60).toFixed(1)) }}</b>
                <span class="caption"> minutes</span>
                <span v-if="motion.speaking_time !== 0">
                  <br>
                  <b>{{ motion.speaking_time }}</b>
                  <span class="caption"> seconds / individual</span>
                </span>
              </p>
              <div class="input vote">
                <input
                  @change="editMotion(motion)"
                  min="0"
                  :max="delegatesData.length - motion.no_vote"
                  type="number"
                  placeholder=" "
                  v-model.number="motion.yes_vote"
                >
                <label v-if="width <= 960">Yes Vote</label>
              </div>
              <div class="input vote">
                <input
                  @change="editMotion(motion)"
                  min="0"
                  :max="delegatesData.length - motion.yes_vote"
                  type="number"
                  placeholder=" "
                  v-model.number="motion.no_vote"
                >
                <label v-if="width <= 960">No Vote</label>
              </div>
              <button
                @click="showConfirm = index"
                :class="{
                  red: motion.no_vote > motion.yes_vote,
                  blue: canStart(motion._id),
                }">
                <p v-if="canStart(motion._id)">Start Caucus</p>
                <p v-else-if="motion.no_vote > motion.yes_vote">Voting Failed</p>
                <p v-else>No Votes</p>
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
              </span>
              <Confirmation
                :content="`Are you sure you want to delete ${motion.name
                ? motion.name : motion.type.toLowerCase()}?`"
                :action="deleteMotionsData"
                :negative="true"
                :id="motion._id"
                button="Delete"
                v-if="showConfirm !== null && showConfirm === `del ${index}`"
                v-click-outside="config"
                @exit="exit"
              />
              <Confirmation
                :content="`Start the ${motion.name
                ? motion.name : motion.type.toLowerCase()}?`"
                :action="startMotion"
                :negative="false"
                :id="motion._id"
                button="Start"
                v-else-if="showConfirm !== null && showConfirm === index"
                v-click-outside="config"
                @exit="exit"
              />
            </div>
            </transition-group>
          </div>
          <div class="table-data empty-data" v-else>No Motions in the list</div>
        </div>
      </div>
    </div>
    <transition-group name="fade">
    <Confirmation
      :content="`${temp} started!`"
      :action="function() {showOkay = false; temp = null;}"
      :negative="false"
      button="Okay"
      :whiteButton="false"
      v-if="showOkay"
      v-click-outside="configOK"
      :key="showOkay"
    />
    <Confirmation
      content="Discard adding motion?"
      :action="exitAdd"
      :negative="true"
      button="Discard"
      whiteButton="Keep Editing"
      v-if="showConfirm === 'add'"
      @exit="exit"
      :key="`${showConfirm}Modal`"
    />
    <div class="overlay modal" :key="showConfirm" v-if="showConfirm === 'add'" />
    <add-motion
      :editMotion="editMotion"
      v-if="showModal"
      :data="edit"
      @exit="showConfirm = 'add'"
      @exitSafe="exit(); showModal = false"
      @update="updateMotionsData"
      v-click-outside="configAdd"
      key="3"
    />
    <div class="overlay" key="4" v-if="showModal|| showConfirm != null || showOkay" />
    </transition-group>
  </div>
</template>

<script>
import { negara } from '@/const/country';
import {
  getMotions,
  deleteMotion,
  updateMotion,
  startCaucus,
} from '@/api/motions';
import { getAllDelegates } from '@/api/delegates';
import { getConference } from '@/api/conference';
import Confirmation from '@/components/Confirmation/index.vue';
import { mapState } from 'vuex';
import { evaluate } from 'mathjs';
import AddMotion from './components/AddMotion/index.vue';

export default {
  name: 'Motions',
  components: {
    Confirmation,
    AddMotion,
  },
  data() {
    return {
      showModal: false,
      showConfirm: null,
      showOkay: false,
      temp: null,
      motionsData: [],
      config: {
        handler: this.exit,
        events: ['click'],
      },
      configOK: {
        handler: () => {
          this.showOkay = false;
          this.temp = null;
        },
        events: ['click'],
      },
      configAdd: {
        handler: () => {
          this.showConfirm = 'add';
        },
        middleware: (event) => event.target.className !== 'cancel',
        events: ['click'],
      },
      edit: null,
      delegatesData: [],
      expand: null,
      rules: {},
      majority: 0,
      noTimer: [
        'Suspension of The Debate',
        'Continuation of The Debate',
        'Adjournment of The Meeting',
      ],
    };
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      countryList: (state) => state.Delegates.countryList,
    }),
  },
  methods: {
    canStart(id) {
      const [motion] = this.motionsData.filter((m) => m._id === id);
      const bool = (motion.no_vote + motion.yes_vote >= this.majority)
        && (motion.no_vote < motion.yes_vote)
        && (motion.no_vote + motion.yes_vote === this.delegatesData.length);
      return bool;
    },
    voteLogic() {
      let { majority } = this.rules;
      if (majority.match(/(\*|\+|-|\/)\s*(del)/i)) {
        majority = majority.replace(/delegates/i, `${this.delegatesData.length}`); // replace suffix with actual number
      } else {
        majority = majority.replace(/delegates/i, `* ${this.delegatesData.length}`); // if there was no operator, assume multiplication
      }
      majority = majority.replace(/\s/gi, ''); // remove whitespace
      if (majority.match(/((?:[-\d)(]*)(?:\d)(?:[-\d)(+/*]*))/i)) {
        try {
          majority = evaluate(majority);
        } catch (err) {
          console.error(err);
          this.$store.commit('error', true);
        }
      } else {
        console.error('Unsupported rule formula');
        this.$store.commit('error', true);
      }
      if (this.rules.rounding.match(/up/i)) this.majority = Math.ceil(evaluate(majority));
      else this.majority = Math.floor(evaluate(majority));
    },
    context([action, , , index]) {
      switch (action) {
        case 'Start Caucus':
          this.showConfirm = index;
          break;
        case 'Edit':
          this.edit = this.motionsData[index];
          this.showModal = true;
          break;
        case 'Delete':
          this.showConfirm = `del ${index}`;
          break;
        default:
      }
    },
    showC(event, data, index) {
      if (!this.showModal) {
        const name = data.name ? data.name : data.type;
        this.$store.dispatch('context', [
          [name, data._id, index],
          { Edit: true, 'Start Caucus': true, Delete: true },
          [event.clientX, event.clientY],
        ]);
      }
    },
    showCon(data, index) {
      return (event) => {
        if (!this.showModal) {
          const name = data.name ? data.name : data.type;
          this.$store.dispatch('context', [
            [name, data._id, index],
            { Edit: true, 'Start Caucus': true, Delete: true },
            [event.touches[0].clientX, event.touches[0].clientY],
          ]);
        }
      };
    },
    toggleModal() {
      this.showModal = !this.showModal;
    },
    getDelegatesID(name) {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    sortMotions(items) {
      items.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (a.type.toLowerCase() === 'unmoderated caucus' && b.type.toLowerCase() !== 'unmoderated caucus') {
          return -1;
        }
        if (a.type.toLowerCase() !== 'unmoderated caucus' && b.type.toLowerCase() === 'unmoderated caucus') {
          return 1;
        }
        if (a.type.toLowerCase() === 'consultation of the whole' && b.type.toLowerCase() !== 'consultation of the whole') {
          return -1;
        }
        if (a.type.toLowerCase() !== 'consultation of the whole' && b.type.toLowerCase() === 'consultation of the whole') {
          return 1;
        }
        if (a.type.toLowerCase() === 'moderated caucus' && b.type.toLowerCase() !== 'moderated caucus') {
          return -1;
        }
        if (a.type.toLowerCase() !== 'moderated caucus' && b.type.toLowerCase() === 'moderated caucus') {
          return 1;
        }
        if (a.type === b.type && b.type === 'moderated caucus' && nameA < nameB) {
          return -1;
        }
        if (a.type === b.type && b.type === 'moderated caucus' && nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return items;
    },
    async editMotion(data) {
      try {
        await updateMotion(this.$route.params.id, JSON.stringify(data));
      } catch (err) {
        console.error(err);
      }
    },
    async updateMotionsData() {
      try {
        const motions = await getMotions(this.$route.params.id);
        if (motions.data.data !== null) {
          this.motionsData = this.sortMotions(motions.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async updateDelegatesData() {
      try {
        const delegates = await getAllDelegates(this.$route.params.id);
        if (delegates.data.data !== null) {
          this.delegatesData = delegates.data.data.filter((del) => del.status.toLowerCase() === 'present' || del.status.toLowerCase() === 'present & voting');
          this.newCountryList();
          if (this.rules.majority) this.voteLogic();
        }
      } catch (err) {
        console.error(err.response);
      }
    },
    async deleteMotionsData(motion) {
      try {
        const responses = new Promise((resolve) => {
          resolve(deleteMotion(this.$route.params.id, motion));
        });
        responses.then(() => {
          this.exit();
          this.updateMotionsData();
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updateConferenceData() {
      try {
        const conf = await getConference(this.$route.params.id);
        if (conf.data.data !== null) {
          this.rules = conf.data.data.rules;
          if (this.delegatesData.length > 0) this.voteLogic();
        }
      } catch (err) {
        console.error(err);
      }
    },
    async startMotion(id) {
      try {
        const [motion] = this.motionsData.filter((m) => m._id === id);
        const data = {
          motion_id: id,
        };
        startCaucus(this.$route.params.id, JSON.stringify(data));
        if (this.canStart(id) && this.noTimer.includes(motion.type)) {
          this.showOkay = id;
          this.temp = motion.type.toString();
        } else if (this.canStart(id)) {
          const ws = {
            session: 'caucus',
            command: 'stop',
            order: 0,
          };
          this.$socket.send(JSON.stringify(ws));
          this.$router.push(`/caucus/${this.$route.params.id}`).catch(() => {});
        }
      } catch (err) {
        // console.error(err);
      }
    },
    newCountryList() {
      const list = [];
      this.delegatesData.forEach((item) => {
        let data = negara.filter((e) => e.name === item.country)[0];
        if (data) {
          list.push(data);
        } else {
          data = {
            name: item.country,
          };
          list.push(data);
        }
      });
      this.$store.commit('countryList', list);
    },
    async exit() {
      this.edit = null;
      this.showConfirm = null;
      await setTimeout(() => {
        this.updateMotionsData();
      }, 500);
    },
    exitAdd() {
      this.showConfirm = null;
      this.showModal = false;
    },
  },
  created() {
    this.$root.$on('context', (...args) => this.context(...args));
    this.updateMotionsData();
    this.updateConferenceData().then(() => this.updateDelegatesData());
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
