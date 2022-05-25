<template>
  <QuestionnairesMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import QuestionnairesMain from "../components/report/admin/index.vue";

export default defineComponent({
  name: "Questionnaires",
  components: {
    QuestionnairesMain,
  },
});
</script>
