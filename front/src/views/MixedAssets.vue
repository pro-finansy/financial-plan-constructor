<template>
  <AssetsMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import AssetsMain from "../components/mixedAssets/index.vue";

export default defineComponent({
  name: "Assets",
  components: {
    AssetsMain,
  },
});
</script>
