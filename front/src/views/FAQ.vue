
<template>
  <FAQMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import FAQMain from "../components/faq/index.vue";

export default defineComponent({
  name: "FAQ",
  components: {
    FAQMain,
  },
});
</script>
