<template>
  <QuestionnairePivotMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import QuestionnairePivotMain from "../components/report/expert/pivot/index.vue";

export default defineComponent({
  name: "QuestionnairePivot",
  components: {
    QuestionnairePivotMain,
  },
});
</script>
