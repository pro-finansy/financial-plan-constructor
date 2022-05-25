<template>
  <div class="experts flex wrap-wrap">
    <div class="expert flex justify-between" v-for="expert of experts" :key="expert.expert">
      <div class="name">{{ expert.expert }}</div>
      <div></div>
      <div class="minutes">{{ expert.minutes }} мин.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue-demi';
import { dynamicsObject } from '@/interfaces';

export default defineComponent({
  name: "AnalyticsExperts",
  props: {
    experts: {
      type: Array as PropType<Array<dynamicsObject>>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.experts {
  .expert {
    font-size: 14px;
    font-weight: 300;
    width: 33.33%;
    padding: 7px 20px;
    div:nth-child(2) {
      flex: 1 0;
      border-bottom: 1px dotted #000;
      height: 1em;
      margin: 0 0.2em;
    }
  }
}
</style>