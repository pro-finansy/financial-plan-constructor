<template>
  <AuthPasswordMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import AuthPasswordMain from "../components/auth/password/index.vue";

export default defineComponent({
  name: "AuthPassword",
  components: {
    AuthPasswordMain,
  },
});
</script>
