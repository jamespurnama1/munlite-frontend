<template>
  <div class="search">
    <span>
      <div class="input">
        <input placeholder=" " :class="{focus: filterD.length > 0}" v-model="search" type="text">
        <label>Search</label>
        <span class="containBadge">
          <div class="badge" v-for="(filter, i) in filterD" :key="i">
            <p>{{ filter }}</p>
          </div>
        </span>
      </div>
      <font-awesome-icon
        class ="exclude"
        @click="showSort = true; showFilter = false;"
        v-if="sortDir === 'down'"
        :icon="['fas', 'sort-amount-down']" />
      <font-awesome-icon
        class ="exclude"
        @click="showSort = true; showFilter = false;"
        v-else
        :icon="['fas', 'sort-amount-up']" />
      <font-awesome-icon
        class ="excludeF"
        @click="showFilter = true; showSort = false;"
        :icon="['fas', 'filter']" />
    </span>
    <transition name="scale">
    <div v-if="showFilter" class="filter" v-click-outside="configF">
      <ul>
        <li
          @click="filterData('CHAIR')"
          :class="{sel: filterD.includes('CHAIR')}">
          Chair
        </li>
        <li
          @click="filterData('DELEGATE')"
          :class="{sel: filterD.includes('DELEGATE')}">
          Delegate
        </li>
        <li
          @click="filterData('BEST DELEGATE')"
          :class="{sel: filterD.includes('BEST DELEGATE')}">
          Best Delegate
        </li>
        <li
          @click="filterData('ONGOING')"
          :class="{sel: filterD.includes('ONGOING')}">
          Ongoing
        </li>
      </ul>
    </div>
    </transition>
    <transition name="scale">
    <div v-if="showSort" class="sort" v-click-outside="config">
      <ul>
        <li
          @click="sortData('date')"
          :class="{sel: sort === 'date'}">
          Date
          <font-awesome-icon
            v-if="sortDir === 'up' && sort === 'date'"
            :icon="['fas', 'arrow-up']" />
          <font-awesome-icon
            v-else-if="sortDir === 'down' && sort === 'date'"
            :icon="['fas', 'arrow-down']" />
        </li>
        <li
          @click="sortData('name')"
          :class="{sel: sort === 'name'}">
          Name
          <font-awesome-icon
            v-if="sortDir === 'up' && sort === 'name'"
            :icon="['fas', 'arrow-up']" />
          <font-awesome-icon
            v-else-if="sortDir === 'down' && sort === 'name'"
            :icon="['fas', 'arrow-down']" />
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
    };
  },
  methods: {
    outside(e) {
      if (!e.target.classList.contains('excludeF')
      && !e.target.parentElement.classList.contains('excludeF')) {
        this.showSort = false;
      }
    },
    outsideF(e) {
      if (!e.target.classList.contains('excludeF')
      && !e.target.parentElement.classList.contains('excludeF')) {
        this.showFilter = false;
      }
    },
    filterData(i) {
      if (this.filterD.includes(i)) {
        this.filterD = this.filterD.filter((f) => f !== i);
      } else {
        this.filterD.push(i);
      }
      this.$emit('filterData', i);
    },
    sortData(i) {
      if (this.sort === i && this.sortDir === 'down') {
        this.sortDir = 'up';
      } else if (this.sort === i && this.sortDir === 'up') {
        this.sortDir = 'down';
      } else {
        this.sort = i;
      }
      this.$emit('sortData', i, this.sortDir);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
