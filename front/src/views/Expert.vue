<template>
  <ExpertMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import ExpertMain from "../components/expert/index.vue";

export default defineComponent({
  name: "Expert",
  components: {
    ExpertMain,
  },
});
</script>
