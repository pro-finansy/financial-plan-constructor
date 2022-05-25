<template>
  <AnalyticsMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import AnalyticsMain from "../components/analytics/index.vue";

export default defineComponent({
  name: "Analytics",
  components: {
    AnalyticsMain,
  },
});
</script>
