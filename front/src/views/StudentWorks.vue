<template>
  <StudentWorksMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import StudentWorksMain from "../components/student/works/index.vue";

export default defineComponent({
  name: "StudentWorks",
  components: {
    StudentWorksMain,
  },
});
</script>
