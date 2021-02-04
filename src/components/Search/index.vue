<template>
  <div>
    <span>
      <input placeholder="Search">
      <font-awesome-icon
        @click="showSort = true"
        v-if="sortDir === 'down'"
        :icon="['fas', 'sort-amount-down']" />
      <font-awesome-icon
        @click="showSort = true"
        v-else
        :icon="['fas', 'sort-amount-up']" />
      <font-awesome-icon
        @click="showFilter = true"
        :icon="['fas', 'filter']" />
    </span>
    <div>
      <ul v-if="showFilter">
        <li
          @click="filterData('chair')"
          :class="{sel: filterD.includes('chair')}">
          Chair
        </li>
        <li
          @click="filterData('del')"
          :class="{sel: filterD.includes('del')}">
          Delegate
        </li>
        <li
          @click="filterData('bestDel')"
          :class="{sel: filterD.includes('bestDel')}">
          Best Delegate
        </li>
        <li
          @click="filterData('ongoing')"
          :class="{sel: filterD.includes('ongoing')}">
          Ongoing
        </li>
      </ul>
    </div>
    <div v-if="showSort">
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
    };
  },
  methods: {
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
