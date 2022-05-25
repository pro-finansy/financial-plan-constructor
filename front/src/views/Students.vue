<template>
  <StudentMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import StudentMain from "../components/student/index.vue";

export default defineComponent({
  name: "Student",
  components: {
    StudentMain,
  },
});
</script>
