<template>
  <nav class="flex">
    <ul class="flex items-center">
      <router-link
        :to="element.link"
        v-for="element of current_nav"
        :key="element.link"
        custom
        v-slot="{ navigate, isExactActive }"
      >
        <li :class="{ active: isExactActive }" @click="navigate">
          {{ element.name }}
        </li>
      </router-link>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { NAVIGATION } from "@/store/commonDatas";
import { dynamicsObject } from "@/interfaces";
import { User } from "@/interfaces/dto/user";

export default defineComponent({
  name: "Nav",
  props: {
    user: {
      type: Object as PropType<User.Dto>,
      required: true,
    },
  },
  data() {
    return {
      nav: NAVIGATION,
      current_nav: [] as Array<dynamicsObject>,
    };
  },
  created() {
    this.current_nav = this.nav[this.user.role];
  },
});
</script>

<style lang="scss" scoped>
nav {
  height: inherit;
  flex-grow: 1;
  text-transform: uppercase;
  padding-left: 50px;
  ul {
    li {
      cursor: pointer;
      color: #9da8ae;
      transition: all 0.3s;
      padding: 30px 0;
      &:hover {
        transition: all 0.3s;
        color: #5d6468;
      }
      &.active {
        cursor: default;
        color: #349c5d;
        box-shadow: inset 0 -2px 0 0 #349c5d;
      }
      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
}
</style>
