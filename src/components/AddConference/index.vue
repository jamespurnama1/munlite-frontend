<template>
  <div class="addConf">
  <div class="confModal">
    <h1 v-if="!conf">New Conference</h1>
    <h1 v-else>Edit Conference</h1>
    <div class="top">
      <div class="info">
        <h3>Info</h3>
        <div class="input">
          <input
            :class="{error: warn.title}"
            placeholder=" "
            :data-value="newConf.title ? newConf.title : ''"
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
            :data-value="dates.start ? dates.start : ''"
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
            :data-value="dates.end ? dates.end : ''"
            v-model="dates.end">
          <label>End Date</label>
          <p class="err" v-if="warn.end_date">Please enter an end date</p>
        </div>
      </span>
    </div>
    <h3>Chairs</h3>
    <div class="chair">
      <ul>
        <li v-if="this.me" @contextmenu.prevent="showC(me.email, $event)">
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
          <p>{{me.email}}</p>
        </li>
        <li
          v-for="(chair, i) in newConf.chairman"
          :key="i"
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
          <p>{{ chair }}</p>
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
                  :data-value="email ? email : ''"
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
    <div class="rules">
      <div class="input">
          <input
            :class="{error: warn.majority}"
            placeholder=" "
            v-model="newConf.majority"
            :data-value="newConf.majority ? newConf.majority : ''">
          <label>Majority</label>
        <p class="err" v-if="warn.majority">Please enter a formula</p>
      </div>
      <div class="input">
        <input
          :class="{error: warn.quorum}"
          placeholder=" "
          v-model="newConf.quorum"
          :data-value="newConf.quorum ? newConf.quorum : ''">
        <label>Quorum</label>
        <p class="err" v-if="warn.quorum">Please enter a formula</p>
      </div>
      <div class="input">
        <input
          :class="{error: warn.dr_vote}"
          placeholder=" "
          :data-value="newConf.dr_vote ? newConf.dr_vote : ''"
          v-model="newConf.dr_vote">
        <label>DR Vote</label>
        <p class="err" v-if="warn.dr_vote">Please enter a formula</p>
      </div>
      <div class="round">
        <h3>Rounding</h3>
        <span>
          <p>Down</p>
          <label class="switch">
            <input type="checkbox">
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
    <button @click="exit()">Cancel</button>
    <button class="blue" @click="addNewConf()" v-if="!conf">Create</button>
    <button class="blue" @click="editConf()" v-else>Save</button>
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

export default {
  name: 'AddConference',
  components: {
    Context,
  },
  props: {
    conf: Object,
  },
  data() {
    return {
      round: null,
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
        majority: null,
        dr_vote: null,
        quorum: null,
        rounding: 'down',
        chairman: [],
      },
    };
  },
  methods: {
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
          && res
          && this.email !== this.me.email) {
            this.newConf.chairman.push(this.email);
            this.$forceUpdate();
            this.email = '';
            // this.$set(this.newConf.chairman, this.newConf.chairman.length, this.email);
          } else if (!validateEmail(this.email)) {
            this.warn.email = 'Please enter a valid e-mail address';
          } else if (!res) {
            this.warn.email = 'E-mail is not registered at MUNLite';
          } else if (this.email === this.me.email || duplicate.length >= 0) {
            this.warn.email = 'Chair already added.';
          }
        })
        .catch((err) => console.error(err));
    },
    exit() {
      this.$emit('exit');
    },
    editConf() {
      const difference = this.newConf.chairman.filter((x) => !this.conf.chairman.includes(x));
      if (difference.length > 0) {
        try {
          for (let i = 0; i < difference.length; i += 1) {
            const data = {
              email: difference[i],
            };
            // eslint-disable-next-line no-underscore-dangle
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
            // eslint-disable-next-line no-underscore-dangle
            delChairman(this.conf._id, JSON.stringify(data));
          }
        } catch (err) {
          if (err.response.status === 422) {
            this.$store.commit('noAuth', true);
          }
          console.error(err);
        }
      }

      const data = this.newConf;
      delete data.chairman;
      // eslint-disable-next-line no-underscore-dangle
      updateConference(this.conf._id, JSON.stringify(data))
        .then(() => {
          this.$emit('update');
          this.exit();
        });
    },
    addNewConf() {
      const test = Object.keys(this.newConf).every((key) => {
        if (key === 'chairman') {
          return typeof this.newConf[key] === 'object';
        }
        return typeof this.newConf[key] === 'string' && this.newConf[key] !== '' && this.newConf[key];
      });
      if (test) {
        createConference(JSON.stringify(this.newConf))
          .then(() => {
            this.$emit('update');
            this.newConf = '';
            this.exit();
          }).catch((err) => {
            console.error(err);
          });
      } else {
        Object.keys(this.newConf)
          .filter((f) => !this.newConf[f])
          .forEach((e) => { this.warn[e] = true; });
      }
    },
    async getMe() {
      const u = await getUserData();
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
  created() {
    this.getMe()
      .then(() => {
        if (this.conf) {
          this.newConf = { ...this.conf.rules };
          this.newConf.title = this.conf.title;
          const c = this.conf.chairman;
          const arr = [];
          for (let i = 0; i < c.length; i += 1) {
            if (c[i].email !== this.me.email) {
              arr.push(c[i].email);
            }
          }
          this.newConf.chairman = [...arr];
          this.dates.end = this.dateFormat(this.conf.end_date);
          this.dates.start = this.dateFormat(this.conf.start_date);
        }
      });
  },
  computed: {
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
