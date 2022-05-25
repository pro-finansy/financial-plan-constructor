<template>
  <header class="flex justify-between items-center">
    <Logotype />
    <Nav :user="user" />
    <Profile :user="user" />
  </header>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import Nav from "./Nav.vue";
import Profile from "./Profile.vue";
import Logotype from "@/components/common/Logotype.vue";
import { User } from "@/interfaces/dto/user";

export default defineComponent({
  name: "Header",
  props: {
    user: {
      type: Object as PropType<User.Dto>,
      required: true,
    },
  },
  components: {
    Nav,
    Profile,
    Logotype,
  },
});
</script>

<style lang="scss" scoped>
header {
  position: relative;
  padding: 0 45px;
  background-color: #fff;
}
</style>
