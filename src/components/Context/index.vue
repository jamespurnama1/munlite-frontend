<template>
  <div class="context" :style="`left: ${position[0]}px; top: ${position[1]}px;`">
    <ul>
      <li>
        <span
          v-if="delegateName"
          :class="`flag-icon img flag-icon-${getDelegatesID(delegateName).toLowerCase()}`" />
        <img v-else class="logo" :src="require('@/assets/img/home.png')">
        {{ nameItem }}
      </li>
      <li
        v-for="(item, i) in action"
        :key="i"
        @click="click(item)"
        :class="{
        disabled: disabled[i],
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
  props: {
    action: Array,
    delegateName: String,
    delegateId: String,
    conferenceName: String,
    conferenceId: String,
    name: String,
    id: String,
    pos: Array,
    disabled: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    click(item) {
      this.$emit('context', [item, this.nameItem]);
    },
    getDelegatesID(name) {
      const data = negara.filter((obj) => obj.name === name);
      if (data.length > 0) {
        return data[0].id;
      }
      return 'ad';
    },
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
      height: (state) => state.Global.heightWindow,
    }),
    position() {
      const x = Math.min(Math.max(this.pos[0], 0), this.width - 175);
      const y = Math.min(Math.max(this.pos[1], 0), this.height - 200);
      return [x, y];
    },
    idItem() {
      if (this.delegateId) {
        return this.delegateId;
      }
      if (this.conferenceId) {
        return this.conferenceId;
      }
      return this.id;
    },
    nameItem() {
      if (this.delegateName) {
        return this.delegateName;
      }
      if (this.conferenceName) {
        return this.conferenceName;
      }
      return this.name;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
