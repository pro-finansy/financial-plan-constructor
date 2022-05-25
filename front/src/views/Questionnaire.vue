<template>
  <QuestionnaireMain />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import QuestionnaireMain from "../components/questionnaire/index.vue";

export default defineComponent({
  name: "Questionnaire",
  components: {
    QuestionnaireMain,
  },
});
</script>
