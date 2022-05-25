<template>
  <ReportProcessExpertMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import ReportProcessExpertMain from "../../components/report/expert/process/index.vue";

export default defineComponent({
  name: "ReportProcess",
  components: {
    ReportProcessExpertMain,
  },
});
</script>
