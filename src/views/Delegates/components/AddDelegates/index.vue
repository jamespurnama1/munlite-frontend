<template>
  <div id="addModal">
    <div class="upper">
      <h2>Add New Delegates</h2>
      <a id='close' @click="exit()">
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </a>
    </div>
    <div class="mid">
      <div class="left">
        <img class="def-img" :srcset='defImg' />
        <input type="file" name="myImage" accept="image/*" class="inputimage"/>
      </div>
      <div class="right">
        <label>Name</label>
        <Autocomplete :items="items"/>
        <label>Short Name</label>
        <input type="text" placeholder="Short Name"/>
      </div>
    </div>
    <button>Add</button>
  </div>
</template>

<script>
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
