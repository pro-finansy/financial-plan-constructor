<template>
  <ProfileMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import ProfileMain from "../components/profile/index.vue";

export default defineComponent({
  name: "Profile",
  components: {
    ProfileMain,
  },
});
</script>
