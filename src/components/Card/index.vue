<template>
  <div class="card" :class="{isActive: isActive}">
    <p class="desc" v-if="dsc && progress !== 100">{{ dsc }}</p>
    <div class="country" v-if="progress !== 100">
      <span :class="`flag-icon img flag-icon-${countryId(del.country).toLowerCase()}`" />
      <h1>{{ countryShort(del.country) }}</h1>
    </div>
    <div
      class="progress"
      :style="`clip-path: inset(0 ${-progress + 100}% 0 0);
                border: 1px solid ${clr};
                background-color: ${clr}`">
      <p class="desc" v-if="dsc">{{ dsc }}</p>
      <div class="country">
        <span :class="`flag-icon img flag-icon-${countryId(del.country).toLowerCase()}`" />
        <h1>{{ countryShort(del.country) }}</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Watch,
  Component,
  Prop,
} from 'vue-property-decorator';
import { State } from 'vuex-class';
import negara from '@/const/country.json';
// eslint-disable-next-line no-unused-vars
import { caucusType, delegatesType, gslType } from '@/types/api';

@Component
export default class Card extends Vue {
  @Prop(Object) del!: delegatesType.getAllDelegates & {yield?: string}

  @Prop(String) desc!: string

  @Prop([String, Number]) prgrs!: string | number

  @Prop({ type: String, default: '#5F78FF' }) color!: string

  @Prop(Boolean) active!: boolean // timer

  @Prop(Boolean) isActive!: boolean // current

  @Prop({ type: Number, required: true }) number!: number

  @State((state) => state.Delegates.gslList) gslList?
  : gslType.getGSL[] & {yield?: string, time_start?: number, time_left?: number}[]

  @State((state) => state.Delegates.caucusList) caucusList?: caucusType.createCaucus

  @State((state) => state.Socket.message.time) timer?: number

  @State((state) => state.Socket.message.session) session?: string

  @State((state) => state.Socket.message.state) status?: number

  @State((state) => state.Socket.message.order) order?: number

  progress = this.prgrs

  dsc: string | null = null

  clr: string | null = null

  pos = () => {
    const country = document.querySelectorAll('.max.card .country') as unknown as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < country.length; i += 1) {
      country[i].style.cssText = 'right: -35%; transform: translate(0, 0) scale(0.3)';
    }
  }

  defaults() {
    if (this.desc === 'presence') {
      this.dsc = this.del.status;
    } else if (this.cardTime !== null) {
      if (this.del.yield && this.$route.name === 'GSL') {
        this.dsc = `${this.cardTime.toString()} sec → ${this.delYield}`;
      } else {
        this.dsc = `${this.cardTime.toString()} sec`;
      }
    } else {
      this.dsc = this.desc;
    }

    this.clr = this.color;

    if (this.prgrs === 'presence' && this.del.status.toLowerCase() === 'n/a') {
      this.progress = 0;
    } else if (this.prgrs === 'presence' && this.del.status.toLowerCase() !== 'n/a') {
      this.progress = 100;
      if (this.del.status.toLowerCase() === 'not present') {
        this.clr = '#FF5F5F';
      }
    }
  }

  countryId = (name: string): string => {
    const data = negara.find((obj) => obj.name === name);
    if (data) return data['alpha-2'];
    return 'ad';
  }

  countryShort = (name: string): string => {
    const data = negara.find((obj) => obj.name === name);
    if (data) return data['alpha-3'];
    return name.substring(0, 3).toUpperCase();
  }

  @Watch('cardTime', { immediate: true })
  onCardTime() {
    // TODO: max to 100 not 125 with rounding
    this.progress = Math.min(Math.max((this.cardTime / this.time_start) * 100, 0), 125);
    if (this.delYield && this.$route.name === 'GSL') {
      this.dsc = `${this.cardTime.toString()} sec → ${this.delYield}`;
    } else {
      this.dsc = `${this.cardTime.toString()} sec`;
    }
    this.pos();
  }

  @Watch('delYield')
  onDelYield() {
    if (this.delYield && this.$route.name === 'GSL') {
      this.dsc = `${this.cardTime.toString()} sec → ${this.delYield}`;
    } else {
      this.dsc = `${this.cardTime.toString()} sec`;
    }
  }

  @Watch('del', { deep: true })
  onDel() {
    this.defaults();
  }

  get cardTime() {
    if (this.isActive && this.session === this.$route.name?.toLowerCase()
    && this.order === this.number) {
      return this.timer;
    }
    return this.time_left;
  }

  get time_start() {
    if (this.$route.name === 'GSL' && this.gslList) return this.gslList[this.number].time_start;
    return this.caucusList![this.number].time_start;
  }

  get time_left() {
    if (this.$route.name === 'GSL' && this.gslList) return this.gslList[this.number].time_left;
    return this.caucusList![this.number].time_left;
  }

  get delYield() {
    return this.gslList![this.number].yield;
  }

  mounted() {
    this.pos();
  }

  created() {
    this.$nextTick(() => {
      this.defaults();
    });
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
