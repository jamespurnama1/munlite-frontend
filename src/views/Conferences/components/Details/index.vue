<template>
  <div class="wrap">
    <div class="upper" id="pin" v-if="width <= 960">
      <span class="left">
      <font-awesome-icon
        :icon="['fas', 'chevron-left']"
        @click="$emit('goBack')"
      />
      <img :src="require('@/assets/img/home.png')">
      <h1>{{ confData.title }}</h1>
      </span>
      <p
        @click="$router.push(`/overview/${confData._id}`)"
        class="right take"
        v-if="ongoing">
        Take me there
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </p>
      <span class="right exportEdit">
        <button>
          Export
          <font-awesome-icon :icon="['fas', 'file-export']" />
        </button>
        <button @click="$emit('edit', sel)">
          Edit
          <font-awesome-icon :icon="['fas', 'edit']" />
        </button>
      </span>
    </div>
    <transition name="fade" appear>
      <div class="details" v-if="sel !== null">
        <transition name="slide" appear>
          <div v-show="ongoing" class="ongoing">
            <h3>This conference is ongoing</h3>
            <p
              class="take"
              @click="$router.push(`/overview/${confData._id}`)">
              Take me there
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </p>
          </div>
        </transition>
        <div class="left" :class="{offset: ongoing}">

          <div class="chair">
            <h3>Chair</h3>
            <ul>
              <li v-for="(chair, i) in confData.chairman" :key="i">
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
        <div class="right" :class="{offset: ongoing && width > 600}">

          <span class="exportEdit" v-if="width > 960">
            <button>
              Export
              <font-awesome-icon :icon="['fas', 'file-export']" />
            </button>
            <button @click="$emit('edit', sel)">
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
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mapState } from 'vuex';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'confDetails',
  props: {
    sel: Number,
    confData: Object,
    ongoing: Boolean,
    transEnd: Boolean,
  },
  data() {
    return {
      tl: null,
    };
  },
  mounted() {
    this.scroll();
  },
  methods: {
    scroll() {
      ScrollTrigger.matchMedia({
        '(max-width: 960px)': () => {
          ScrollTrigger.create({
            trigger: '.nav',
            start: 'bottom top',
            endTrigger: '.details',
            end: 'bottom top',
            pinSpacing: false,
            pin: '#pin',
          });
          this.tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.nav',
              start: 'bottom top',
              endTrigger: '.details',
              end: 'top top',
              scrub: true,
            },
          });
          this.tl.fromTo('.upper .exportEdit', {
            autoAlpha: 1,
            scaleX: 1,
          }, {
            autoAlpha: 0,
            scaleX: 0.5,
          }, 0)
            .fromTo('#pin', {
              scaleY: 1,
              boxShadow: '0 0 20px 0 rgba(0,0,0,0)',
              borderRadius: '0',
            }, {
              scaleY: 0.5,
              boxShadow: '0 0 20px 0 rgba(0,0,0,0.15)',
              borderRadius: '0 0 15px 15px',
            }, 0)
            .fromTo('.upper .left', {
              scaleX: 1,
            }, {
              scaleX: 0.5,
            }, 0);
          if (this.ongoing && typeof this.sel === 'number') {
            this.tl.to('#pin', {
              backgroundColor: '#5f78ff',
              boxShadow: '0 0 20px 0 #5f78ff',
              color: 'white',
            }, 0)
              .fromTo('.upper p.right', {
                autoAlpha: 0,
                scaleX: 1,
                scaleY: 1,
              }, {
                autoAlpha: 1,
                scaleY: 1.5,
                scaleX: 0.75,
              }, 0);
          }
        },
      });
    },
  },
  computed: {
    ...mapState({
      width: (state) => state.Global.widthWindow,
    }),
  },
  watch: {
    transEnd() {
      console.log('refresh');
      ScrollTrigger.refresh(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
