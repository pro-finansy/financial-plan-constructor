<template>
  <PreviewMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import PreviewMain from "../components/preview/index.vue";

export default defineComponent({
  name: "Preview",
  components: {
    PreviewMain,
  },
});
</script>
