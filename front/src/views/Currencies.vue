<template>
  <CurrenciesMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import CurrenciesMain from "../components/currencies/index.vue";

export default defineComponent({
  name: "Currencies",
  components: {
    CurrenciesMain,
  },
});
</script>
