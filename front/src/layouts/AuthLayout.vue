<template>
  <section>
    <div class="logotype flex items-center justify-center">
      <span>PRO.</span>
      <span>Финансы</span>
    </div>
    <router-view />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';

export default defineComponent({
  name: "auth-layout",
});
</script>

<style lang="scss" scoped>
section {
  width: 100%;
  height: 100%;
}
.logotype {
  user-select: none;
  position: absolute;
  top: 25px;
  left: 45px;
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
</style>