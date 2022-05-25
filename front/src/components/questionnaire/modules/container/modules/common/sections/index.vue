<template>
  <div class="sections" :data-target="targetId">
    <QuestionnaireSection
      v-for="(section, indexSection) of sections"
      :key="indexSection"
      :section="section"
      :sectionStudent="sectionsStudent[indexSection]"
      :targetId="targetId"
      :portfolioId="portfolioId"
      :sectionStatus="sectionStatus"
      :course="course"
      :indexSection="indexSection"
      :questionnaireMode="questionnaireMode"
      :targetCurrencySign="targetCurrencySign"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";
import QuestionnaireSection from "./section.vue";
import { Questionnaire } from "@/interfaces/dto/questionnaire";

export default defineComponent({
  name: "Sections",
  props: {
    sections: {
      type: Array as PropType<Array<Questionnaire.QSection>>,
      required: true,
    },
    sectionsStudent: {
      type: Array as PropType<Array<Questionnaire.QSection>>,
      required: true,
    },
    targetId: {
      type: Number,
      required: true,
    },
    portfolioId: {
      type: String,
    },
    sectionStatus: {
      type: Object,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    targetCurrencySign: {
      type: String,
      default: "",
    },
  },
  components: {
    QuestionnaireSection,
  },
});
</script>
