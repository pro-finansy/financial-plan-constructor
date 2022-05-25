<template>
  <ReportReadyExpertMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import ReportReadyExpertMain from "../../components/report/expert/ready/index.vue";

export default defineComponent({
  name: "ReportReady",
  components: {
    ReportReadyExpertMain,
  },
});
</script>
