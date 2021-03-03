<template>
  <div class="context" :style="`left: ${position.x}px; top: ${position.y}px;`">
    <ul>
      <li>
        <span
          v-if="$route.name === 'GSL' || $route.name === 'Delegates'"
          :class="`flag-icon img flag-icon-${getDelegatesID(nameItem).toLowerCase()}`" />
        <img
          v-else-if="$route.name !== 'Motions'"
          class="logo" :src="require('@/assets/img/home.png')"
        >
        {{ nameItem }}
      </li>
      <li
        v-for="(disabled, item, index) in action"
        :key="index"
        @click="click(item)"
        :class="{
        disabled: !disabled,
        red: item === 'Delete' || item === 'Remove From Queue' }">
        <p>
          {{ item }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { negara } from '@/const/country';

export default {
  name: 'Context',
  data() {
    return {
      position: {},
    };
  },
  methods: {
    posXY() {
      const x = Math.min(Math.max(this.pos[0], 0), this.width - this.rect().width);
      const y = Math.min(Math.max(this.pos[1], 0), this.height - this.rect().height);
      this.position = { x, y };
    },
    click(item) {
      this.$root.$emit('context', [item, this.nameItem, this.idItem, this.index]);
      this.$store.dispatch('resetContext');
    },
    getDelegatesID(name) {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
    rect() {
      return document.querySelector('.context').getBoundingClientRect();
    },
  },
  mounted() {
    this.posXY();
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      height: (state) => state.Global.heightWindow,
      nameItem: (state) => state.Global.item[0],
      idItem: (state) => state.Global.item[1],
      index: (state) => state.Global.item[2],
      pos: (state) => state.Global.contextPos,
      action: (state) => state.Global.showContext,
    }),
  },
  watch: {
    pos: {
      handler: 'posXY',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
