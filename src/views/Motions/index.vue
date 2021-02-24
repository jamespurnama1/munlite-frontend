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
              <span>
                <p class="name" v-if="motion.name !== ''">
                  <b>{{ motion.name }}</b>
                </p>
                <p class="caption">
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
                <b>{{ motion.total_time / 60 }}</b>
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
                  :max="delegatesData.length"
                  type="number"
                  placeholder=" "
                  :data-value="typeof motion.yes_vote === 'number' ? motion.yes_vote : ''"
                  v-model.number="motion.yes_vote"
                >
                <label v-if="width <= 960">Yes Vote</label>
              </div>
              <div class="input vote">
                <input
                  @change="editMotion(motion)"
                  min="0"
                  :max="delegatesData.length"
                  type="number"
                  placeholder=" "
                  :data-value="typeof motion.no_vote === 'number' ? motion.no_vote : ''"
                  v-model.number="motion.no_vote"
                >
                <label v-if="width <= 960">No Vote</label>
              </div>
              <button
                @click="showConfirm = index"
                :class="{
                  red: motion.no_vote > motion.yes_vote,
                  blue: motion.no_vote < motion.yes_vote
                  && motion.no_vote + motion.yes_vote === delegatesData.length
                }">
                <p v-if="motion.no_vote > motion.yes_vote">Voting Failed</p>
                <p v-else>Start Caucus</p>
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
              v-else-if="showConfirm !== null && typeof showConfirm === 'number'"
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
    <Confirmation
      content="Discard adding motion?"
      :action="exitAdd"
      :negative="true"
      button="Discard"
      whiteButton="Save Changes"
      v-if="showConfirm === 'add'"
      v-click-outside="showconfirm = null"
      @exit="exit"
    />
    <transition name="fade">
      <add-motion
        :editMotion="editMotion"
        v-if="showModal"
        :data="edit"
        @exit="showConfirm = 'add'"
        @exitSafe="exit(); showModal = false"
        @update="updateMotionsData"
        v-click-outside="configAdd"
      />
    </transition>
    <div class="overlay" v-if="showModal|| showConfirm != null" />
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
import Confirmation from '@/components/Confirmation/index.vue';
import { mapState } from 'vuex';
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
      motionsData: [],
      config: {
        handler: this.exit,
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
    };
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      countryList: (state) => state.Delegates.countryList,
    }),
  },
  methods: {
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
          this.delegatesData = delegates.data.data;
          this.newCountryList();
        }
        console.log('Got new Delegates', delegates.data.data);
      } catch (err) {
        console.error(err.response);
      }
    },
    async deleteMotionsData(motion) {
      try {
        console.log('Deleting', motion);
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
    async startMotion(id) {
      const [motion] = this.motionsData.filter((m) => m._id === id);
      if (motion.no_vote < motion.yes_vote
        && motion.no_vote + motion.yes_vote === this.delegatesData.length) {
        try {
          const data = {
            motion_id: id,
          };
          startCaucus(this.$route.params.id, JSON.stringify(data));
          this.$router.push(`/caucus/${this.$route.params.id}`).catch(() => {});
        } catch (err) {
          console.error(err);
        }
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
      console.log('Matched Delegates with Country List', list);
      this.$store.commit('countryList', list);
    },
    async exit() {
      this.edit = null;
      // this.showModal = false;
      this.showConfirm = null;
      await setTimeout(() => {
        this.updateMotionsData();
      }, 500);
    },
    exitAdd() {
      this.confirm = null;
      this.showModal = false;
    },
  },
  created() {
    this.$root.$on('context', (...args) => this.context(...args));
    this.updateMotionsData();
    this.updateDelegatesData();
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
