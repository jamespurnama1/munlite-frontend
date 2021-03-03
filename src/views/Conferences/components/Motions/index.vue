<template>
  <div class="delegates">
    <div class="delegates-upper">
      <font-awesome-icon
        :icon="['fas', 'chevron-left']"
        @click="$emit('goBack')"
      />
      <h1 class="title">Motions</h1>
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
                <b>{{ parseFloat((motion.total_time / 60).toFixed(1)) }}</b>
                <span class="caption"> minutes</span>
                <span v-if="motion.speaking_time !== 0">
                  <br>
                  <b>{{ motion.speaking_time }}</b>
                  <span class="caption"> seconds / individual</span>
                </span>
              </p>
              <div class="vote">
                <p>{{ motion.yes_vote }}</p>
              </div>
              <div class="vote">
                <p>{{ motion.no_vote }}</p>
              </div>
              </span>
            </div>
            </transition-group>
          </div>
          <div class="table-data empty-data" v-else>No Motions in the list</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { negara } from '@/const/country';
import { mapState } from 'vuex';

export default {
  name: 'Motions',
  data() {
    return {
      motionsData: [],
      delegatesData: [],
      expand: null,
    };
  },
  props: {
    confData: Object,
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
    }),
  },
  methods: {
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
  },
  created() {
    this.confData.motions.batches.forEach((motion) => {
      this.motionsData.push(...motion.batch_motions);
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
