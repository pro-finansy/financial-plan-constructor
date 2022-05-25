<template>
  <InstrumentsMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import InstrumentsMain from "../components/instruments/index.vue";

export default defineComponent({
  name: "Report",
  components: {
    InstrumentsMain,
  },
});
</script>
