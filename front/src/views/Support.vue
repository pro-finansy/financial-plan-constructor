<template>
  <SupportMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import SupportMain from "../components/support/index.vue";

export default defineComponent({
  name: "Support",
  components: {
    SupportMain,
  },
});
</script>
