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
        <p class="list">
          {{ item }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import negara from '@/const/country.json';

@Component
export default class Context extends Vue {
  @State((state) => state.Global.item[0]) nameItem?: string

  @State((state) => state.Global.item[1]) idItem?: string

  @State((state) => state.Global.item[2]) index?: number

  @State((state) => state.Global.widthWindow) width?: number

  @State((state) => state.Global.heightWindow) height?: number

  @State((state) => state.Global.contextPos) pos?: Array<number>

  @State((state) => state.Global.showContext) action?: boolean

  position = {};

  posXY() {
    const x = Math.min(Math.max(
      (this.pos as Array<number>)[0], 0,
    ), (this.width as number) - this.rect().width);
    const y = Math.min(Math.max(
      (this.pos as Array<number>)[1], 0,
    ), (this.height as number) - this.rect().height);
    this.position = { x, y };
  }

  click(item) {
    this.$store.commit('clickedContext', {
      action: item,
      name: this.nameItem,
      id: this.idItem,
      index: this.index,
    });
    this.$root.$emit('context');
    this.$store.dispatch('resetContext');
  }

  getDelegatesID = (name: string) => {
    const data = negara.find((obj) => obj.name === name);
    if (data) return data['alpha-2'];
    return 'ad';
  }

  rect = () => (document.querySelector('.context') as HTMLElement).getBoundingClientRect();

  mounted() {
    this.posXY();
  }

  @Watch('pos')
  onPos() {
    this.posXY();
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
