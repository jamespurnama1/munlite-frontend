<template>
  <div class="wrap">
    <div class="upper" v-if="width <= 960">
      <span class="left">
      <font-awesome-icon :icon="['fas', 'chevron-left']" @click="$emit('goBack')" />
      <img :src="require('@/assets/img/home.png')">
      <h1>{{ confData[sel].title }}</h1>
      </span>
      <span class="right exportEdit">
        <button>
          Export
          <font-awesome-icon :icon="['fas', 'file-export']" />
        </button>
        <button @click="$emit('edit', confData[sel].title)">
          Edit
          <font-awesome-icon :icon="['fas', 'edit']" />
        </button>
      </span>
    </div>
    <transition name="fade">
      <div class="details" v-if="sel !== null">
        <transition name="slide">
          <div v-show="ongoing(sel) && typeof sel === 'number'" class="ongoing">
            <h3>This conference is ongoing</h3>
            <p
              class="take"
              @click="$router.push(`/overview/${confData[sel]._id}`)">
              Take me there
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </p>
          </div>
        </transition>
        <div class="left" :class="{offset: ongoing(sel)}">

          <div class="chair">
            <h3>Chair</h3>
            <ul>
              <li v-for="(chair, i) in confData[sel].chairman" :key="i">
                <img :src="require('@/assets/img/home.png')">
                {{ chair.email }}
              </li>
            </ul>
          </div>

          <div class="rules">
            <h3 class="title">Rules</h3>
            <div class="grid">
              <div>
                <h3>Majority</h3>
                <span><p>1/2 + 1 &nbsp;<p>delegates</p></span>
              </div>
              <div>
                <h3>Quorum</h3>
                <span><p>8 &nbsp; delegates</p></span>
              </div>
              <div>
                <h3>DR Sponsors</h3>
                <span><p>4 &nbsp; delegates</p></span>
              </div>
              <div>
                <h3>Rounding</h3>
                <p><font-awesome-icon :icon="['fas', 'arrow-up']" /></p>
              </div>
            </div>
          </div>
        </div>
        <div class="right" :class="{offset: ongoing(sel) && width > 600}">

          <span class="exportEdit" v-if="width > 960">
            <button>
              Export
              <font-awesome-icon :icon="['fas', 'file-export']" />
            </button>
            <button @click="$emit('edit', confData[sel].title)">
              Edit
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
          </span>

          <div class="others">
            <div>
              <h3>Motions</h3>
              <span><h4>6&nbsp;</h4><p>motions</p></span>
              <button>View All<font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
            </div>
            <div>
              <h3>Total Present</h3>
              <span><h4>8&nbsp;</h4><p>delegates</p></span>
              <button>View All<font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
            </div>
            <div>
              <h3>Activity Log</h3>
              <span><h4>48&nbsp;</h4><p>recorded<br>activities</p></span>
              <button>View All<font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
            </div>
          </div>
        </div>

      </div>
      <div class="select" v-else>
        <h2>Select a MUN conference</h2>
        <p>Pick one Conference from the left tab to view its details</p>
        <img :src="require('@/assets/img/bg.png')">
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'confDetails',
  props: {
    sel: Number,
    confData: Array,
    ongoing: Function,
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
