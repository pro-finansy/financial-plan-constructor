<template>
  <transition name="fade">
    <svg
      v-if="showNavigation"
      @click="scroll"
      width="41"
      height="25"
      viewBox="0 0 41 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 22.5L20.5 4L39 22.5" stroke="black" stroke-width="5" />
    </svg>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "QuestionnaireNavigationBlock",
  data() {
    return {
      showNavigation: false,
    };
  },
  created() {
    window.addEventListener("scroll", this.onScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      this.showNavigation = window.scrollY > 500;
    },
    scroll() {
      this.jq("html, body").stop().animate({ scrollTop: 0 }, 500);
    },
  },
});
</script>

<style lang="scss" scoped>
svg {
  position: fixed;
  top: 94%;
  left: 25px;
  width: 35px;
  cursor: pointer;
}
</style>
