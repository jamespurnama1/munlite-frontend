<template>
  <div id="grid">
    <div>
      <h3>Majority</h3>
      <div class="delegates-row">
        {{ rulesData.majority }}
      </div>
    </div>
    <div>
      <h3>Quorum Vote</h3>
      <div class="delegates-row">
        {{ rulesData.quorum }}
      </div>
    </div>
    <div>
      <h3>DR Sponsors</h3>
      <div class="delegates-row">
        {{ rulesData.dr_vote }}
      </div>
    </div>
    <div class="center">
      <h3>Rounding</h3>
      <font-awesome-icon
        :icon="['fas', 'arrow-up']"
        size="lg"
        v-if="(rulesData.rounding).split(' ')[1] =='Up' "
      />
      <font-awesome-icon
        :icon="['fas', 'arrow-down']"
        size="lg"
        v-else
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    rulesData: Object,
  },
});
</script>

<style lang="scss" scoped>
@import './OtherInfo.scss';
</style>
