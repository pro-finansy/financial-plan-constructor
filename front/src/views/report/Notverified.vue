<template>
  <ReportNotverifiedExpertMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import ReportNotverifiedExpertMain from "../../components/report/expert/notverified/index.vue";

export default defineComponent({
  name: "ReportProcess",
  components: {
    ReportNotverifiedExpertMain,
  },
});
</script>
