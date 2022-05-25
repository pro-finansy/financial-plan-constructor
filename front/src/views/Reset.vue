<template>
  <ResetMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import ResetMain from "../components/auth/reset.vue";

export default defineComponent({
  name: "Reset",
  components: {
    ResetMain,
  },
});
</script>
