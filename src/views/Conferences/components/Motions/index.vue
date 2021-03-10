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
            <transition name="fade">
            <!-- <div
              v-for="(batch, index) in confData.motions.batches"
              :key="batch.motion_id"
              class="data"
            > -->
            <ul>
              <li
                v-for="(motion, index) in motionsData"
                :key="motion._id"
                :class="{pass: motion.passed, last: motion.last}"
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
              </li>
            </ul>
            <!-- </div> -->
            </transition>
          </div>
          <div class="table-data empty-data" v-else>No Motions in the list</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import negara from '@/const/country';
import { mapState } from 'vuex';
// eslint-disable-next-line no-unused-vars
import { delegatesType, motionsType } from '@/types/api';

export default Vue.extend({
  name: 'Motions',
  data() {
    return {
      motionsData: [] as motionsType.getMotions[],
      delegatesData: [] as delegatesType.getAllDelegates[],
      expand: null as null | string,
    };
  },
  props: {
    confData: Object,
  },
  computed: {
    ...mapState({
      width: (state: any) => state.Global.widthWindow,
    }),
  },
  methods: {
    sortMotions(items: motionsType.getMotions[]): motionsType.getMotions[] {
      items.sort((a, b) => {
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
        if (a.type === b.type && b.type && a.total_time > b.total_time) {
          return -1;
        }
        if (a.type === b.type && b.type && a.total_time > b.total_time) {
          return 1;
        }
        return 0;
      });
      return items;
    },
    getDelegatesID(name: string): string {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
  },
  created() {
    // this.confData.motions.batches;
    this.confData.motions.batches.forEach((motionBatch) => {
      const sorted: motionsType.getMotions[] = this.sortMotions(motionBatch.batch_motions);
      const passed = sorted.findIndex((motion) => motion.yes_vote > motion.no_vote);
      sorted[passed].passed = true;
      sorted[sorted.length - 1].last = true;
      this.motionsData.push(...sorted);
    });
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
