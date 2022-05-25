<template>
  <div class="timer flex items-center justify-center">{{ time || "00:00" }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import zero from "@/filters/zero.filter";

export default defineComponent({
  name: "QuestionnaireTimer",
  props: {
    seconds: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    time() {
      const seconds = zero(this.seconds % 60);
      const minutes = zero(Math.floor(this.seconds / 60));
      return `${minutes}:${seconds}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.timer {
  position: fixed;
  left: calc(50% - 60px);
  top: 25px;
  padding: 0px 30px;
  font-size: 18px;
  height: 50px;
  color: #575a64;
  background: linear-gradient(
      317.7deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(255, 255, 255, 0.4) 105.18%
    ),
    #f4f5f9;
  background-blend-mode: soft-light, normal;
  box-shadow: inset 0px 0px 5px #dfdfdf;
  border-radius: 10px;
  font-feature-settings: "pnum" on, "lnum" on;
  font-family: "Raleway", sans-serif;
}
</style>
