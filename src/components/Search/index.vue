<template>
  <div class="search">
    <span>
      <div class="input">
        <input
          placeholder=" "
          :class="{focus: filterD.length > 0}"
          v-model="search"
          type="text"
          :style="`padding-left: ${extraPadding}px`"
          @keyup.delete="del($event)">
        <label>Search</label>
        <span class="containBadge">
          <div class="badge" v-for="(filter, i) in filterD" :key="i">
            <p>{{ filter.toUpperCase() }}</p>
          </div>
        </span>
      </div>
      <font-awesome-icon
        class ="exclude"
        @click="showSort = !showSort; showFilter = false;"
        v-if="sortDir === 'down'"
        :icon="['fas', 'sort-amount-down']" />
      <font-awesome-icon
        class ="exclude"
        @click="showSort = !showSort; showFilter = false;"
        v-else
        :icon="['fas', 'sort-amount-up']" />
      <font-awesome-icon
        class ="excludeF"
        @click="showFilter = !showFilter; showSort = false;"
        :icon="['fas', 'filter']" />
    </span>
    <transition name="scale">
    <div v-if="showFilter" class="filter" v-click-outside="configF">
      <ul>
        <li
          v-for="(filter, index) in filterTypes.flat()"
          :key="index"
          @click="filterData(filter)"
          :class="{sel: filterD.includes(filter)}"
        >
          {{ filter }}
        </li>
      </ul>
    </div>
    </transition>
    <transition name="scale">
    <div v-if="showSort" class="sort" v-click-outside="config">
      <ul>
        <li v-for="(type, index) in sortTypes"
          :key="index"
          @click="sortData(type)"
          :class="{sel: sort === type}"
        >
          {{ type }}
          <font-awesome-icon
            v-if="sortDir === 'up' && sort === type"
            :icon="['fas', 'arrow-up']"
          />
          <font-awesome-icon
            v-else-if="sortDir === 'down' && sort === type"
            :icon="['fas', 'arrow-down']"
          />
        </li>
      </ul>
    </div>
    </transition>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'Search',
  data() {
    return {
      showFilter: false as boolean,
      showSort: false as boolean,
      sortDir: 'down' as string,
      sort: 'date' as string,
      filterD: [] as Array<string>,
      config: {
        // @ts-ignore
        handler: this.outside,
        events: ['click'],
      },
      configF: {
        // @ts-ignore
        handler: this.outsideF,
        events: ['click'],
      },
      search: '' as string,
      prevSearch: '' as string,
      filteredData: this.items as Array<any>,
      extraPadding: 10 as number,
    };
  },
  props: {
    items: Array,
    sortFunc: Function,
    sortTypes: Array,
    sortDefault: String,
    dirDefault: String,
    filterFunc: Function,
    filterTypes: Array as PropType<string[]>,
  },
  watch: {
    search() {
      let list = this.filterFunc(this.items, this.filterD, this.search);
      list = this.sortFunc(list, this.sort, this.sortDir);
      this.filteredData = list;
      this.$emit('sortedData', this.filteredData);
    },
    filterD: {
      handler() {
        let list = this.filterFunc(this.items, this.filterD, this.search);
        list = this.sortFunc(list, this.sort, this.sortDir);
        this.filteredData = list;
        this.$emit('sortedData', this.filteredData);
        this.extraPad();
      },
      deep: true,
    },
  },
  mounted() {
    this.sort = this.sortDefault;
    this.sortDir = this.dirDefault;
    this.filteredData = this.sortFunc(this.filteredData, this.sort, this.sortDir);
    this.$emit('sortedData', this.filteredData);
  },
  computed: {
  },
  methods: {
    extraPad(): void {
      let padding = 10 + (parseInt(this.em().toString(), 10)
      * parseInt(this.filterD.length.toString(), 10));
      if (this.filterD.includes('DELEGATE')) {
        padding += 55.48; // 55.48px + 1em of .badge width
      }
      if (this.filterD.includes('CHAIR')) {
        padding += 38.09; // 38.09px + 1em of .badge width
      }
      if (this.filterD.includes('ONGOING')) {
        padding += 55.2; // 55.2px + 1em of .badge width
      }
      if (this.filterD.includes('BEST DELEGATE')) {
        padding += 78.58; // 78.58px + 1em of .badge width
      }
      this.extraPadding = padding;
    },
    em(): number {
      if (document.querySelector('.badge')) return parseFloat(getComputedStyle(document.querySelector('.badge') as Element).fontSize);
      return 10;
    },
    del(event): void {
      if (this.filterD.length > 0
      && (event.target.selectionStart === 0 && this.prevSearch.length !== 1)) {
        this.filterD.pop();
      }
      this.prevSearch = this.search;
    },
    outside(e): void {
      if (!e.target.classList.contains('exclude')
      && !e.target.parentElement.classList.contains('exclude')) {
        this.showSort = false;
      }
    },
    outsideF(e): void {
      if (!e.target.classList.contains('excludeF')
      && !e.target.parentElement.classList.contains('excludeF')) {
        this.showFilter = false;
      }
    },
    filterData(tag): void {
      if (this.filterD.includes(tag)) {
        this.filterD = this.filterD.filter((f) => f !== tag);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of this.filterTypes) {
          if (item === tag) {
            this.filterD.push(item);
            break;
          }
          if (typeof item === 'object') {
            let noReplace = true;
            this.filterD.forEach((f) => {
              if ((item as string).includes(tag) && (item as string).includes(f)) {
                this.filterD.splice(this.filterD.indexOf(f), 1, tag);
                noReplace = false;
              }
            });
            if (noReplace && (item as string).includes(tag)) {
              this.filterD.push(tag);
            }
          }
        }
      }
    },
    sortData(i): void {
      if (this.sort === i && this.sortDir === 'down') {
        this.sortDir = 'up';
      } else if (this.sort === i && this.sortDir === 'up') {
        this.sortDir = 'down';
      } else {
        this.sort = i;
      }
      this.filteredData = this.sortFunc(this.filteredData, i, this.sortDir);
    },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
