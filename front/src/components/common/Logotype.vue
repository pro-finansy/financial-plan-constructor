<template>
  <div class="logotype flex justify-center items-center">
    <span>PRO.</span>
    <span>Финансы</span>
  </div>
  <div class="version" :class="{ q: q }">beta version</div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "ExpertMain",
  props: {
    q: {
      type: Boolean,
      default: false
    }
  },
});
</script>

<style lang="scss" scoped>
.logotype {
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  span:first-child {
    color: #f67816;
  }
  span:last-child {
    color: #5c6172;
  }
}
.version {
  top: 50px;
  left: 55px;
  position: absolute;
  font-size: 11px;
  &.q {
    top: 60px;
    left: 90px;
  }
}
</style>
