<template>
  <div class="target--main color">
    <QuestionnaireInputs
      :module="main"
      :moduleStudent="mainStudent"
      :questionnaireMode="questionnaireMode"
      :course="course"
      id="target-main"
      :targetId="targetId"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";
import QuestionnaireInputs from "../../common/inputs/index.vue";
import { Questionnaire } from "@/interfaces/dto/questionnaire";

export default defineComponent({
  name: "TargetMain",
  props: {
    main: {
      type: Object as PropType<Questionnaire.QSectionModules>,
      required: true,
    },
    mainStudent: {
      type: Object as PropType<Questionnaire.QSectionModules>,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    targetId: {
      type: Number,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  components: {
    QuestionnaireInputs,
  },
});
</script>

<style lang="scss" scoped>
.target--main {
  margin: 0 auto;
  width: 95%;
  padding: 20px 20px;
  .inputs {
    width: 450px;
    margin: 0 auto;
  }
  &.color {
    background-color: #fef2cc;
  }
}
</style>
