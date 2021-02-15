<template>
  <div class="delegates">
    <div class="delegates-upper">
      <h1 class="title">Delegates</h1>
      <div class="info" v-if="width <= 960">
        <div class="info-data" v-for="(value, key) in info" :key="key">
          <p class="title emphasize">{{ key }}</p>
          <p class="data"><b class="emphasize">{{ value }}</b> Delegates</p>
        </div>
      </div>
      <div class="delegates-button">
        <button
          class="button"
          @click="showModal"
          :disabled="delegatesData.length < 1"
        >
          Roll Call
        </button>
        <div class="button">
          <transition name="fade">
            <add-delegates
              v-if="showInput"
              :items="countryList"
              @exit="exit"
              @update="updateDelegatesData"
            />
          </transition>
          <font-awesome-icon :icon="['fas', 'plus']" @click="toggleInput"/>
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
          <div class="table-data" v-if="delegatesData.length > 0">
            <div v-for="(data, index) in delegatesData" :key="index" class="data">
              <p class="name" @mouseover="hoverable = index" @mouseleave="hoverable = null">
                <span
                :class="`flag-icon img flag-icon-${getDelegatesID(data.country).toLowerCase()}`" />
                {{ data.country }}
                <span
                  class="hidden"
                  :class="{show: hoverable == index}"
                  @click="showConfirm = data.country"
                >
                  <font-awesome-icon :icon="['fas', 'trash-alt']" />
                </span>
              </p>
              <Confirmation
                content="Are you sure you want to delete?"
                :action="deleteDelegatesData"
                :delegateName="data.country"
                :delegateId="data._id"
                v-if="showConfirm === data.country"
                @exit="exit"
              />
              <p class="presence">{{ data.status }}</p>
            </div>
          </div>
          <div class="table-data empty-data" v-else>No Delegates in the list</div>
          <div class="info" v-if="width> 960">
            <div class="info-data" v-for="(value, key) in info" :key="key">
              <p class="title emphasize">{{ key }}</p>
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
          :delegatesData="delegatesData"
          @update="updateDelegatesData"
          v-if="stage === 1"
        />
        <Vote
          :key="2" v-else-if="stage === 2"
          :delegatesData="delegatesData"
          :info="info"
          :rulesData="rulesData"
        />
        <Pass :key="3" v-else-if='stage === 3' />
      </div>
    </transition>
    <div class="overlay" v-if="showOverlay || showInput || showConfirm != null" />
  </div>
</template>

<script>
import { getAllDelegates, deleteDelegates } from '@/api/delegates';
import { getConference } from '@/api/conference';
import { negara } from '@/const/country';
import Confirmation from '@/components/Confirmation/index.vue';
import { mapState } from 'vuex';
import AddDelegates from './components/AddDelegates/index.vue';
import RollCall from './components/RollCall/index.vue';
import Vote from './components/Vote/index.vue';
import Pass from './components/Pass/index.vue';

export default {
  name: 'Delegates',
  components: {
    RollCall,
    Vote,
    Pass,
    Confirmation,
    AddDelegates,
  },
  data() {
    return {
      showOverlay: false,
      hoverable: null,
      showInput: false,
      newCountry: '',
      stage: 0,
      delegatesData: [],
      dr_vote: 0,
      rulesData: [],
      countryList: negara,
      showConfirm: null,
    };
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
    }),
    info() {
      const present = this.delegatesData.filter((obj) => obj.status.toLowerCase() === 'present');
      const pv = this.delegatesData.filter((obj) => obj.status.toLowerCase() === 'present & voting');
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
        if (delegates.data.data !== null) {
          this.delegatesData = this.sortCountry(delegates.data.data);
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
    this.updateDelegatesData();
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
    this.$on('stage', (i) => {
      if (i === 0) {
        this.showOverlay = false;
      }
      this.stage = i;
    });
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import './index.scss';
</style>
