<template>
  <div id="addModal">
    <div class="upper">
      <h2>Add New Delegate</h2>
      <a id='close' @click="exit()">
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </a>
    </div>
    <div class="mid">
      <div class="left">
        <div class="profile-pic" :style="`background-image: url('${defImg}')`" >
          <span class="cam-logo">
            <font-awesome-icon :icon="['fas', 'camera']" size="lg" />
          </span>
          <span>Change Image</span>
          <input type="file" name="myImage" accept="image/*" class="inputimage"/>
        </div>
      </div>
      <div class="right">
        <label>Name</label>
        <Autocomplete :items="items" @onchangeCountry="onchangeCountry"/>
        <label>Short Name</label>
        <input type="text" placeholder="Short Name" v-model="newCountry.short"/>
      </div>
    </div>
    <button @click="addNewCountry()">Add</button>
  </div>
</template>

<script>
import { addDelegates } from '@/api/delegates';
import Autocomplete from '@/components/Autocomplete/index.vue';

export default {
  name: 'AddDelegates',
  components: {
    Autocomplete,
  },
  props: {
    items: Array,
  },
  data() {
    return {
      imageDel: null,
      newCountry: {
        name: null,
        short: null,
      },
    };
  },
  computed: {
    defImg() {
      // eslint-disable-next-line global-require
      return require('../../../../assets/img/home.png');
    },
  },
  methods: {
    exit() {
      this.$emit('exit');
    },
    onchangeCountry(country) {
      this.newCountry.name = country;
    },
    async addNewCountry() {
      try {
        if (this.newCountry.name.length > 0) {
          const data = [{
            country: this.newCountry.name,
            status: 'N/A',
          }];
          await addDelegates(this.$route.params.id, data);
          this.$emit('update');

          this.newCountry = '';
          this.$emit('exit');
        }
      } catch (err) {
        console.error(err.response);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
