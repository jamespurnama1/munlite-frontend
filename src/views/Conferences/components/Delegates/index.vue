<template>
  <div class="delegates">
    <div class="delegates-upper">
      <span class="upper-left">
      <font-awesome-icon
        :icon="['fas', 'chevron-left']"
        @click="$emit('goBack')"
      />
      <h1 class="title">Delegates</h1>
      </span>
      <Search
        :items="confData.delegates"
        :key="key"
        :sortFunc="sortMethod"
        :sortTypes="['Name', 'Presence']"
        sortDefault="Name"
        dirDefault="up"
        :filterFunc="filterMethod"
        :filterTypes="[['Present', 'Present & Voting', 'Not Present'],
        ['Asia',
        'Americas',
        'Africa',
        'Western Europe',
        'Central & Eastern Europe',
        'Middle East']]"
        @sortedData="(data) => {
          delegatesData = data;
        }"
      />
    </div>
    <div class="delegates-table">
      <div class="table">
        <div class="title">
          <p class="title-name">Name</p>
          <p>Presence</p>
        </div>
        <div class="content">
          <div class="table-data" v-if="confData.delegates.length > 0">
            <transition-group tag="ul" name="fade">
            <li
              v-for="(delegate) in delegatesData"
              :key="delegate.country"
              class="data"
            >
              <span>
                <p class="name">
                  <span
                  :class="`flag-icon img flag-icon-${getDelegatesID(delegate.country)
                    .toLowerCase()}`"
                />
                  {{ delegate.country }}
                </p>
              </span>
              <p>
                {{ delegate.status }}
              </p>
            </li>
            </transition-group>
          </div>
          <div class="table-data empty-data" v-else>No Delegates</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import negara from '@/const/country';
import { mapState } from 'vuex';
import Search from '@/components/Search/index.vue';
// eslint-disable-next-line no-unused-vars
import { delegatesType } from '@/types/api';

export default Vue.extend({
  name: 'Motions',
  components: {
    Search,
  },
  data() {
    return {
      delegatesData: [] as delegatesType.getAllDelegates[],
      key: 0 as number,
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
    getDelegatesID(name: string): string {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    sortMethod(
      items: delegatesType.getAllDelegates[],
      type: string,
      dir: string,
    ): delegatesType.getAllDelegates[] {
      let tipe: string = 'status';
      if (type === 'Name') tipe = 'country';
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
    filterMethod(
      items: delegatesType.getAllDelegates[],
      tags: string[],
      search: string,
    ): delegatesType.getAllDelegates[] {
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
    created() {
      this.key += 1;
    },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
