<template>
  <div class="confModal">
    <h1>New Conference</h1>
    <div>
      <h3>Info</h3>
      <input placeholder="Name" v-model="newConf.title">
      <p class="error" v-if="warn.title">Please enter a name</p>
      <span>
        <input type="date" placeholder="Start Date" v-model="dates.start">
        <p class="error" v-if="warn.start_date">Please enter a start date</p>
        <input type="date" placeholder="End Date" v-model="dates.end">
        <p class="error" v-if="warn.end_date">Please enter an end date</p>
      </span>
      <h3>Logo</h3>
      <img class="logo" :src="require('@/assets/img/home.png')">
      <p span="caption">
        Supported format:<br>JPG, PNG, SVG<br>Max file size: 5MB
      </p>
    </div>
    <h3>Chairs</h3>
    <div>
      <ul v-if="newConf.chairman.length > 0">
        <li v-for="(chairs, i) in newConf.chairman" :key="i">
          {{ chairs }}
        </li>
      </ul>
      <div>
      <span>
        <input type="email" placeholder="E-mail" v-model="email" @keyup.enter="addChair()">
        <button>
          <font-awesome-icon :icon="['fas', 'plus']" @click="addChair()"/>
        </button>
      </span>
        <p class="error" v-if="warn.email">Please enter a valid e-mail address</p>
        <p class="error" v-if="warn.invalid">E-mail is not registered at MUNlite</p>
        <p class="error" v-if="warn.chairman">Please assign at least one chair</p>
      </div>
    </div>
    <h3>Rules</h3>
      <div>
      <input placeholder="Majority" v-model="newConf.majority">
      <p class="error" v-if="warn.majority">Please enter a rule formula</p>
      <input placeholder="Quorum" v-model="newConf.quorum">
      <p class="error" v-if="warn.quorum">Please enter a rule formula</p>
      <input placeholder="DR Votes" v-model="newConf.dr_vote">
      <p class="error" v-if="warn.dr_vote">Please enter a rule formula</p>
      <h4>Rounding</h4>
      <span>
        <p>Down</p>
          <input type="checkbox" v-model="round">
        <p>Up</p>
      </span>
    </div>
    <span class="disabled">
      <h3>Crisis Council</h3>
      <input type="checkbox" disabled>
    </span>
    <button @click="exit()">Cancel</button>
    <button @click="addNewConf()">Create</button>
  </div>
</template>

<script>
import { createConference } from '@/api/conference';

export default {
  name: 'AddConference',
  data() {
    return {
      round: null,
      email: null,
      dates: {
        start: null,
        end: null,
      },
      warn: {
        title: false,
        start_date: false,
        end_date: false,
        majority: false,
        dr_vote: false,
        quorum: false,
        chairman: false,
        email: false,
        invalid: false,
      },
      invalid: false,
      newConf: {
        title: null,
        start_date: null,
        end_date: null,
        majority: null,
        dr_vote: null,
        quorum: null,
        rounding: 'down',
        chairman: [],
      },
    };
  },
  methods: {
    addChair() {
      const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };
      if (validateEmail(this.email)) {
        this.newConf.chairman.push(this.email);
      } else {
        this.warn.email = true;
      }
    },
    exit() {
      this.$emit('exit');
    },
    async addNewConf() {
      try {
        if (this.newConf.chairman.length > 0 && Object.values(this.newConf).forEach((e) => typeof e === 'string' || 'array')) {
          await createConference(this.newConf);
          this.$emit('update');

          this.newConf = '';
          this.$emit('exit');
        } else {
          if (this.newConf.chairman.length <= 0) {
            this.warn.chairman = true;
          }
          Object.keys(this.newConf)
            .filter((f) => !this.newConf[f])
            .forEach((e) => { this.warn[e] = true; });
        }
      } catch (err) {
        console.error(err);
        this.invalid = true;
      }
    },
  },
  watch: {
    round() {
      switch (this.round) {
        case true:
          this.newConf.rounding = 'up';
          break;
        case false:
          this.newConf.rounding = 'down';
          break;
        default:
          this.newConf.rounding = null;
      }
    },
    email() {
      if (this.email) {
        this.warn.email = false;
        this.warn.chairman = false;
      }
    },
    dates: {
      deep: true,
      handler() {
        this.newConf.start_date = new Date(this.dates.start).toISOString();
        this.newConf.end_date = new Date(this.dates.end).toISOString();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
