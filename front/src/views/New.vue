<template>
  <NewMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import NewMain from "../components/auth/password/new.vue";

export default defineComponent({
  name: "New",
  components: {
    NewMain,
  },
});
</script>
