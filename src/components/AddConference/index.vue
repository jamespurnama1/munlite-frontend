<!-- eslint-disable vue/valid-v-on -->
<template>
  <div
    class="addConf"
    :class="{
      scrollTop: scrollTop,
      scrollBottom: scrollBottom,
    }"
    v-shortkey="{enter: ['enter']}"
    @shortkey="onEnter"
  >
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
        <div class="contain">
          <span class="over">
            <p>
              <font-awesome-icon :icon="['fas', 'camera']" size="lg" />
              <br>
              Change Image
            </p>
          </span>
          <input type="file" name="myImage" accept="image/*" class="inputimage"/>
        </div>
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
        <li v-if="me">
          <img class="avatar" :src="require('@/assets/img/home.png')">
          <p><b>{{ me.first_name }}
            {{ me.last_name }}</b>
          <br>
          {{ me.email }}</p>
        </li>
        <li
          v-for="(chair, index) in newConf.chairman"
          :key="chair._id"
          @contextmenu.prevent="showC($event, chair, index)"
          v-touch:touchhold.prevent="showCon(chair, index)"
        >
          <img class="avatar" :src="require('@/assets/img/home.png')">
          <p><b>{{ chairman[index].first_name }}
            {{ chairman[index].last_name }}</b>
            <br>
            {{ chair }}
          </p>
          <Confirmation
            :content="`Are you sure you want to remove ${chairman[index].first_name}
            ${chairman[index].last_name}?`"
            :action="removeChairman"
            :id="chair"
            button="Remove"
            :negative="true"
            v-if="showConfirm === chair"
            v-click-outside="config"
            @exit="showConfirm = null"
          />
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
                  v-shortkey="{enter: ['enter']}"
                  @shortkey.stop="() => { if (focus) addChair() }"
                  @focusin="focus = true"
                  @blur="focus = false"
                >
                <label>E-mail</label>
                <p class="err" v-if="warn.email">{{ warn.email }}</p>
              </div>
              <button @click="addChair()">
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

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import {
  createConference,
  updateConference,
  addChairman,
  delChairman,
} from '@/api/conference';
import Confirmation from '@/components/Confirmation/index.vue';
import { checkUser } from '@/api/profile';
import { evaluate } from 'mathjs';
// eslint-disable-next-line no-unused-vars
import { conferenceType, profileType } from '@/types/api';

export default Vue.extend({
  name: 'AddConference',
  props: {
    conf: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState({
      me: (state: any) => state.Global.me,
    }),
  //   defImg() {
  //     return require('../../../../assets/img/home.png');
  //   },
  },
  data() {
    return {
      focus: false as boolean,
      showConfirm: null as string | boolean | null,
      scrollTop: false as boolean,
      scrollBottom: false as boolean,
      confModal: null as Element | null,
      round: false as boolean,
      email: '' as string,
      dates: {
        start: null as string | null,
        end: null as string | null,
      },
      config: {
        // @ts-ignore
        handler: this.outside,
        middleware: (event) => event.target.className !== 'list',
        events: ['click', 'touchstart', 'touchmove'],
      },
      warn: {
        title: false,
        start_date: false,
        end_date: false,
        majority: false,
        dr_vote: false,
        quorum: false,
        email: '' as boolean | string,
      },
      newConf: {
        title: '',
        start_date: '',
        end_date: '',
        majority: '',
        dr_vote: '',
        quorum: '',
        rounding: 'Round Down',
        chairman: [],
      } as conferenceType.createConference,
      chairman: [] as Array<any>,
    };
  },
  components: {
    Confirmation,
  },
  methods: {
    onEnter(event): void {
      // TODO: fix event only works once
      if (!this.focus && event.srcKey === 'enter' && Object.keys(this.conf).length === 0) this.addNewConf();
      else if (!this.focus && event.srcKey === 'enter') this.editConf();
    },
    removeChairman(email): void {
      this.newConf.chairman = this.newConf.chairman.filter((chair) => chair !== email);
      this.showConfirm = null;
    },
    showC(event: MouseEvent, data: object, index: number): void {
      // if (!this.showInput) {
      this.$store.dispatch('context', [
        [`${this.chairman[index].first_name} ${this.chairman[index].last_name}`, data, index],
        {
          Delete: true,
        },
        [event.clientX, event.clientY],
      ]);
      // }
    },
    showCon(data: object, index: number): any {
      return (event) => {
        // if (!this.showInput) {
        this.$store.dispatch('context', [
          [`${this.chairman[index].first_name} ${this.chairman[index].last_name}`, data, index],
          {
            Delete: true,
          },
          [event.touches[0].clientX, event.touches[0].clientY],
        ]);
        // }
      };
    },
    context([, , email]: any[] = []): void {
      if (email) this.showConfirm = email;
    },
    append(string: string): void {
      if (this.newConf && this.newConf[string] !== '' && !this.newConf[string].match(/del/i)) {
        this.newConf[string] = this.newConf[string].concat(' delegates');
      }
      if (this.newConf && !this.newConf[string].match(/delegates/i)) {
        this.newConf[string] = this.newConf[string].replace(/(del)(?:[a-z]*)/i, 'delegates');
      }
    },
    outside(): void {
      this.showConfirm = false;
    },
    addChair(): void {
      const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };
      const duplicate = this.newConf.chairman
        .filter((f) => f === this.email);
      this.check(this.email)
        .then((res: any) => {
          if (validateEmail(this.email)
            && duplicate.length === 0
            && res.found
            && this.email
            && this.email !== this.me.email) {
              this.newConf!.chairman.push(this.email);
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
    editConf(): void {
      const difference = this.newConf.chairman
        .filter((chair) => !this.conf.chairman.map((old) => old.email).includes(chair));
      if (difference.length > 0) {
        try {
          for (let i = 0; i < difference.length; i += 1) {
            const data = {
              email: difference[i],
            };
            addChairman(this.conf._id, data);
          }
        } catch (err) {
          if (err.response.status === 422) {
            this.$store.commit('noAuth', true);
          }
          console.error(err);
        }
      }

      let diff;
      diff = this.conf.chairman
        .filter((chair) => !this.newConf!.chairman!.includes(chair.email));
      diff = diff.filter((chair) => this.me.email !== chair.email);
      if (diff.length > 0) {
        try {
          for (let i = 0; i < diff.length; i += 1) {
            const data = {
              email: diff[i].email,
            };
            delChairman(this.conf._id, data);
          }
        } catch (err) {
          if (err.response.status === 422) {
            this.$store.commit('noAuth', true);
          }
          console.error(err);
        }
      }

      const data: conferenceType.updateConference = (({ chairman, ...o }) => o)(this.newConf);
      this.checkForm(data);
      const warnings: {[key: string]: boolean | string } = { ...this.warn };
      delete warnings.email;
      if (Object.values(warnings).every((bool) => bool === false || bool === '')) {
        updateConference(this.conf._id, data)
          .then(() => {
            this.$emit('update');
            this.$emit('exitSafe');
          });
      }
    },
    addNewConf(): void {
      this.checkForm(this.newConf as conferenceType.createConference);
      const warnings: {[key: string]: boolean | string } = { ...this.warn };
      delete warnings.email;
      if (Object.values(warnings).every((bool) => bool === false)) {
        createConference(this.newConf)
          .then(() => {
            this.$emit('update');
            this.newConf = {
              title: '',
              start_date: '',
              end_date: '',
              majority: '',
              dr_vote: '',
              quorum: '',
              rounding: 'Round Down',
              chairman: [],
            };
            this.$emit('exitSafe');
          }).catch((err) => {
            console.error(err);
          });
      }
    },
    checkForm(data: any): void {
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
    async check(user: string): Promise<profileType.checkUser> {
      const data = {
        email: user,
      };
      const u = await checkUser(data);
      return u.data.data;
    },
    dateFormat(d): string {
      const sDate = new Date(d);
      const ye = (y) => new Intl.DateTimeFormat('en', { year: 'numeric' }).format(y);
      const mo = (m) => new Intl.DateTimeFormat('en', { month: '2-digit' }).format(m);
      const da = (day) => new Intl.DateTimeFormat('en', { day: '2-digit' }).format(day);
      return `${ye(sDate)}-${mo(sDate)}-${da(sDate)}`;
    },
  },
  async mounted(): Promise<void> {
    this.confModal = this.$el.querySelector('.confModal');
    if (this.conf && Object.keys(this.conf).length > 0) {
      this.newConf = { ...this.conf.rules };
      this.newConf!.title = this.conf.title;
      const c: Array<any> = this.conf.chairman;
      const arr: Array<any> = [];
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
      }
      if (this.conf.rules.rounding === 'Round Up') this.round = true;
      this.newConf!.chairman = [...arr];
      this.dates.end = this.dateFormat(this.conf.end_date);
      this.dates.start = this.dateFormat(this.conf.start_date);
    }
  },
  created(): void {
    window.onbeforeunload = () => 'Are you sure?';
    this.$root.$on('context', (...args) => this.context(...args));
  },
  beforeDestroy() {
    window.onbeforeunload = () => {};
  },
  watch: {
    round: {
      handler() {
        switch (this.round) {
          case true:
            this.newConf!.rounding = 'Round Up';
            break;
          case false:
            this.newConf!.rounding = 'Round Down';
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
        if (this.newConf && this.newConf.title) {
          this.warn.title = false;
        }
        if (this.newConf && this.newConf.quorum) {
          this.warn.quorum = false;
        }
        if (this.newConf && this.newConf.dr_vote) {
          this.warn.dr_vote = false;
        }
        if (this.newConf && this.newConf.majority) {
          this.warn.majority = false;
        }
        if (this.newConf && this.newConf.start_date) {
          this.warn.start_date = false;
        }
        if (this.newConf && this.newConf.end_date) {
          this.warn.end_date = false;
        }
      },
    },
    dates: {
      deep: true,
      handler(): void {
        this.newConf!.start_date = new Date(this.dates.start as string).toISOString();
        this.newConf!.end_date = new Date(this.dates.end as string).toISOString();
      },
    },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
