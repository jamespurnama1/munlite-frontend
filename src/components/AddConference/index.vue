<template>
  <div
    class="addConf"
    :class="{
      scrollTop: scrollTop,
      scrollBottom: scrollBottom,
    }">
  <div class="confModal"
  @touchmove="scrollTop = confModal.scrollTop > 0;
  scrollBottom = confModal.scrollHeight - confModal.scrollTop !== confModal.clientHeight">
    <h1 v-if="!conf || Object.keys(conf).length === 0">New Conference</h1>
    <h1 v-else>Edit Conference</h1>
    <div class="top">
      <div class="info">
        <h3>Info</h3>
        <div class="input">
          <input
            :class="{error: warn.title}"
            placeholder=" "
            v-model="newConf.title">
          <label>Name</label>
        <p class="err" v-if="warn.title">Please enter a name</p>
        </div>
      </div>
      <div class="upload">
        <h3>Logo</h3>
        <span class="contain">
          <div class="over">
            <p class="caption">
              Upload Image
            </p>
          </div>
          <img
            class="logo"
            :src="require('@/assets/img/home.png')">
        </span>
        <p class="caption">
          Supported format:<br>JPG, PNG, SVG<br>Max file size: 5MB
        </p>
      </div>
      <span class="dates">
        <div class="input">
          <input
            :class="{error: warn.start_date}"
            placeholder="dd/mm/yyyy"
            type="date"
            v-model="dates.start">
          <label>Start Date</label>
          <p class="err" v-if="warn.start_date">Please enter a start date</p>
        </div>
        <hr>
        <div class="input">
          <input
            :class="{error: warn.end_date}"
            placeholder="dd/mm/yyyy"
            type="date"
            v-model="dates.end">
          <label>End Date</label>
          <p class="err" v-if="warn.end_date">Please enter an end date</p>
        </div>
      </span>
    </div>
    <h3>Chairs</h3>
    <div class="chair">
      <ul>
        <li v-if="me" @contextmenu.prevent="showC(me.email, $event)">
          <Context
            v-if="showContext === me.email"
            :name="me.email"
            :id="me.email"
            :pos="contextPos"
            :action="['delete']"
            :disabled="[true]"
            @context="(...args) => context(...args)"
            v-click-outside="config" />
          <img class="avatar" :src="require('@/assets/img/home.png')">
          <p><b>{{ me.first_name }}
            {{ me.last_name }}</b>
          <br>
          {{ me.email }}</p>
        </li>
        <li
          v-for="(chair, index) in newConf.chairman"
          :key="index"
          @contextmenu.prevent="showC(chair, $event)">
          <Context
            v-if="showContext === chair"
            :name="chair"
            :id="chair"
            :pos="contextPos"
            :action="['delete']"
            @context="(...args) => context(...args)"
            v-click-outside="config" />
          <img class="avatar" :src="require('@/assets/img/home.png')">
          <p><b>{{ chairman[index].first_name }}
            {{ chairman[index].last_name }}</b>
            <br>
            {{ chair }}</p>
        </li>
        <li>
          <div>
            <span>
              <div class="input">
                <input
                  :class="{error: warn.email}"
                  placeholder=" "
                  type="email"
                  v-model="email"
                  @keyup.enter="addChair()">
                <label>E-mail</label>
                <p class="err" v-if="warn.email">{{ warn.email }}</p>
              </div>
              <button @keyup.enter="addChair()" @click="addChair()">
                <font-awesome-icon :icon="['fas', 'plus']"/>
              </button>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <h3>Rules</h3>
    <p class="err">
      Note that <b>1/2 delegates + 1</b> is not the same as <b>1/2 + 1 delegates</b>
    </p>
    <div class="rules">
      <div class="input">
          <input
            :class="{error: warn.majority}"
            placeholder=" "
            v-model="newConf.majority"
            @blur="append('majority')"
          >
          <label>Majority</label>
        <p class="err" v-if="warn.majority">Please enter a valid formula</p>
      </div>
      <div class="input">
        <input
          :class="{error: warn.quorum}"
          placeholder=" "
          v-model="newConf.quorum"
          @blur="append('quorum')"
        >
        <label>Quorum Vote</label>
        <p class="err" v-if="warn.quorum">Please enter a valid formula</p>
      </div>
      <div class="input">
        <input
          :class="{error: warn.dr_vote}"
          placeholder=" "
          @blur="append('dr_vote')"
          v-model="newConf.dr_vote"
        >
        <label>DR Sponsors</label>
        <p class="err" v-if="warn.dr_vote">Please enter a valid formula</p>
      </div>
      <div class="round">
        <h3>Rounding</h3>
        <span>
          <p>Down</p>
          <label class="switch">
            <input v-model="round" type="checkbox">
            <span class="slider" />
          </label>
          <p>Up</p>
        </span>
      </div>
    </div>
    <span class="crisis disabled">
      <h3>Crisis Council</h3>
      <label class="switch">
            <input type="checkbox">
            <span class="slider" />
      </label>
    </span>
  </div>
    <span class="buttons">
      <button @click="$emit('exit')">
        Cancel
      </button>
      <button
        class="blue"
        @click="addNewConf()"
        v-if="Object.keys(conf).length === 0"
      >
        Create
      </button>
      <button
        class="blue"
        @click="editConf()"
        v-else
      >
        Save
      </button>
    </span>
  </div>
</template>

<script>
import {
  createConference,
  updateConference,
  addChairman,
  delChairman,
} from '@/api/conference';
import { getUserData, checkUser } from '@/api/profile';
import Context from '@/components/Context/index.vue';
import { evaluate } from 'mathjs';

export default {
  name: 'AddConference',
  components: {
    Context,
  },
  props: {
    conf: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      scrollTop: false,
      scrollBottom: false,
      confModal: null,
      round: false,
      email: null,
      dates: {
        start: null,
        end: null,
      },
      me: '',
      showContext: false,
      config: {
        handler: this.outside,
        events: ['click'],
      },
      contextPos: [0, 0],
      warn: {
        title: false,
        start_date: false,
        end_date: false,
        majority: false,
        dr_vote: false,
        quorum: false,
        email: '',
      },
      newConf: {
        title: null,
        start_date: null,
        end_date: null,
        majority: '',
        dr_vote: '',
        quorum: '',
        rounding: 'Round Down',
        chairman: [],
      },
      chairman: [],
    };
  },
  methods: {
    debug() {
      console.log(this.confModal.scrollTop === 0);
    },
    append(string) {
      if (this.newConf[string] !== '' && !this.newConf[string].match(/del/i)) {
        this.newConf[string] = this.newConf[string].concat(' delegates');
      }
      if (!this.newConf[string].match(/delegates/i)) {
        this.newConf[string] = this.newConf[string].replace(/(del)(?:[a-z]*)/i, 'delegates');
      }
    },
    outside() {
      this.showContext = false;
    },
    showC(c, e) {
      if (e) {
        const r = e.target.getBoundingClientRect();
        this.contextPos = [e.clientX - r.left, e.clientY - r.top];
      }
      this.showContext = c;
    },
    context([i, d]) {
      this.showContext = false;
      if (i === 'delete') {
        this.newConf.chairman = this.newConf.chairman.filter((item) => !d.includes(item));
      } else {
        this.showInput = d;
      }
    },
    addChair() {
      const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };
      const duplicate = this.newConf.chairman
        .filter((f) => f === this.email);
      this.check(this.email)
        .then((res) => {
          if (validateEmail(this.email)
          && duplicate.length === 0
          && res.found
          && this.email !== this.me.email) {
            this.newConf.chairman.push(this.email);
            const resUpperCase = {
              first_name: res.user_name.first_name.charAt(0).toUpperCase()
            + res.user_name.first_name.slice(1),
              last_name: res.user_name.last_name.charAt(0).toUpperCase()
            + res.user_name.last_name.slice(1),
            };
            this.chairman.push(resUpperCase);
            this.$forceUpdate();
            this.email = '';
            // this.$set(this.newConf.chairman, this.newConf.chairman.length, this.email);
          } else if (!validateEmail(this.email)) {
            this.warn.email = 'Please enter a valid e-mail address';
          } else if (!res.found) {
            this.warn.email = 'E-mail is not registered at MUNLite';
          } else if (this.email === this.me.email || duplicate.length >= 0) {
            this.warn.email = 'Chair already added.';
          }
        })
        .catch((err) => console.error(err));
    },
    editConf() {
      const difference = this.newConf.chairman.filter((x) => !this.conf.chairman.includes(x));
      if (difference.length > 0) {
        try {
          for (let i = 0; i < difference.length; i += 1) {
            const data = {
              email: difference[i],
            };
            addChairman(this.conf._id, JSON.stringify(data));
          }
        } catch (err) {
          if (err.response.status === 422) {
            this.$store.commit('noAuth', true);
          }
          console.error(err);
        }
      }

      let diff = this.conf.chairman.filter((x) => !this.newConf.chairman.includes(x.email));
      diff = diff.filter((x) => this.me.email !== x.email);
      if (diff.length > 0) {
        try {
          for (let i = 0; i < diff.length; i += 1) {
            const data = {
              email: diff[i].email,
            };
            delChairman(this.conf._id, JSON.stringify(data));
          }
        } catch (err) {
          if (err.response.status === 422) {
            this.$store.commit('noAuth', true);
          }
          console.error(err);
        }
      }

      const data = { ...this.newConf };
      delete data.chairman;
      this.checkForm(data);
      if (Object.values(this.warn).every((bool) => bool === false || bool === '')) {
        updateConference(this.conf._id, JSON.stringify(data))
          .then(() => {
            this.$emit('update');
            this.$emit('exitSafe');
          });
      }
    },
    addNewConf() {
      this.checkForm(this.newConf);
      if (Object.values(this.warn).every((bool) => bool === false || bool === '')) {
        createConference(JSON.stringify(this.newConf))
          .then(() => {
            this.$emit('update');
            this.newConf = '';
            this.$emit('exitSafe');
          }).catch((err) => {
            console.error(err);
          });
      }
    },
    checkForm(data) {
      Object.keys(data)
        .filter((f) => !data[f])
        .forEach((e) => { this.warn[e] = true; });
      const rules = {
        majority: data.majority,
        quorum: data.quorum,
        dr_vote: data.dr_vote,
      };
      Object.keys(rules).forEach((key) => {
        let mathEval = rules[key];
        if (rules[key].match(/(\*|\+|-|\/)\s*(del)/i)) {
          mathEval = mathEval.replace(/delegates/i, '(3)'); // replace suffix with actual number
        } else {
          mathEval = mathEval.replace(/delegates/i, '* (3)'); // if there was no operator, assume multiplication
        }
        if (!(rules[key].match(/((?:[-\d)(]*)(?:\d)(?:[-\d)(+/*]*))/i) && rules[key].match(/delegates/i))) {
          this.warn[key] = true;
        } else {
          try {
            evaluate(mathEval);
          } catch (err) {
            this.warn[key] = true;
          }
        }
      });
    },
    async getMe() {
      const u = await getUserData();
      u.data.data.first_name = u.data.data.first_name.charAt(0).toUpperCase()
        + u.data.data.first_name.slice(1);
      u.data.data.last_name = u.data.data.last_name.charAt(0).toUpperCase()
        + u.data.data.last_name.slice(1);
      this.me = u.data.data;
    },
    async check(user) {
      const data = {
        email: user,
      };
      const u = await checkUser(JSON.stringify(data));
      return u.data.data;
    },
    dateFormat(d) {
      const sDate = new Date(d);
      const ye = (y) => new Intl.DateTimeFormat('en', { year: 'numeric' }).format(y);
      const mo = (m) => new Intl.DateTimeFormat('en', { month: '2-digit' }).format(m);
      const da = (day) => new Intl.DateTimeFormat('en', { day: '2-digit' }).format(day);
      return `${ye(sDate)}-${mo(sDate)}-${da(sDate)}`;
    },
  },
  async mounted() {
    this.confModal = this.$el.querySelector('.confModal');
  },
  created() {
    this.getMe()
      .then(() => {
        if (this.conf && Object.keys(this.conf).length > 0) {
          this.newConf = { ...this.conf.rules };
          this.newConf.title = this.conf.title;
          const c = this.conf.chairman;
          const arr = [];
          for (let i = 0; i < c.length; i += 1) {
            if (c[i].email !== this.me.email) {
              arr.push(c[i].email);
              this.check(c[i].email).then((response) => {
                const res = {
                  first_name: response.user_name.first_name.charAt(0).toUpperCase()
                + response.user_name.first_name.slice(1),
                  last_name: response.user_name.last_name.charAt(0).toUpperCase()
                + response.user_name.last_name.slice(1),
                };
                this.chairman.push(res);
              });
            }
            if (this.conf.rules.rounding === 'Round Up') this.round = true;
          }
          this.newConf.chairman = [...arr];
          this.dates.end = this.dateFormat(this.conf.end_date);
          this.dates.start = this.dateFormat(this.conf.start_date);
        }
      });
  },
  watch: {
    round: {
      handler() {
        switch (this.round) {
          case true:
            this.newConf.rounding = 'Round Up';
            break;
          case false:
            this.newConf.rounding = 'Round Down';
            break;
          default:
        }
      },
      immediate: true,
    },
    email() {
      if (this.email) {
        this.warn.email = false;
      }
    },
    newConf: {
      deep: true,
      handler() {
        if (this.newConf.title) {
          this.warn.title = false;
        }
        if (this.newConf.quorum) {
          this.warn.quorum = false;
        }
        if (this.newConf.dr_vote) {
          this.warn.dr_vote = false;
        }
        if (this.newConf.majority) {
          this.warn.majority = false;
        }
        if (this.newConf.start_date) {
          this.warn.start_date = false;
        }
        if (this.newConf.end_date) {
          this.warn.end_date = false;
        }
      },
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
