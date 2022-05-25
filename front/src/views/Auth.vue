<template>
  <AuthMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import AuthMain from "../components/auth/index.vue";

export default defineComponent({
  name: "Auth",
  components: {
    AuthMain,
  },
});
</script>
