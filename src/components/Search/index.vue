<template>
  <div class="search">
    <span>
      <div class="input">
        <input
          placeholder=" "
          :class="{focus: filterD.length > 0}"
          v-model="search"
          :data-value="search ? search : ''"
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

<script>
export default {
  name: 'Search',
  data() {
    return {
      showFilter: false,
      showSort: false,
      sortDir: 'down',
      sort: 'date',
      filterD: [],
      config: {
        handler: this.outside,
        events: ['click'],
      },
      configF: {
        handler: this.outsideF,
        events: ['click'],
      },
      search: '',
      prevSearch: '',
      filteredData: this.items,
      extraPadding: 10,
    };
  },
  props: {
    items: Array,
    sortFunc: Function,
    sortTypes: Array,
    filterFunc: Function,
    filterTypes: Array,
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
        this.extraPad();
        this.$emit('sortedData', this.filteredData);
      },
      deep: true,
    },
  },
  mounted() {
    this.filteredData = this.filterFunc(this.items, this.filterD, this.search);
    this.$emit('sortedData', this.filteredData);
  },
  computed: {
  },
  methods: {
    extraPad() {
      let padding = 10 + (parseInt(this.em(), 10) * parseInt(this.filterD.length, 10));
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
    em() {
      return parseFloat(getComputedStyle(document.querySelector('.badge')).fontSize);
    },
    del(event) {
      if (this.filterD.length > 0
      && (event.target.selectionStart === 0 && this.prevSearch.length !== 1)) {
        this.filterD.pop();
      }
      this.prevSearch = this.search;
    },
    outside(e) {
      if (!e.target.classList.contains('exclude')
      && !e.target.parentElement.classList.contains('exclude')) {
        this.showSort = false;
      }
    },
    outsideF(e) {
      if (!e.target.classList.contains('excludeF')
      && !e.target.parentElement.classList.contains('excludeF')) {
        this.showFilter = false;
      }
    },
    filterData(tag) {
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
              if (item.includes(tag) && item.includes(f)) {
                this.filterD.splice(this.filterD.indexOf(f), 1, tag);
                noReplace = false;
              }
            });
            if (noReplace && item.includes(tag)) {
              this.filterD.push(tag);
            }
          }
        }
      }
    },
    sortData(i) {
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
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
