<template>
  <div class="target--conclusion color">
    <div v-if="isStudent" class="title">{{ conclusion.name }}</div>
    <div class="container">
      <QuestionnaireSections
        :course="course"
        :questionnaireMode="questionnaireMode"
        :sections="conclusion.sections"
        :sectionsStudent="conclusionStudent.sections"
        :targetCurrencySign="targetCurrencySign"
        id="target-conclusion"
        :targetId="targetId"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { COURSES_ENUM, ROLES_ENUM } from "@/utils/enums";
import QuestionnaireSections from "../../common/sections/index.vue";
import { valueof } from "@/interfaces";

export default defineComponent({
  name: "TargetConclusion",
  props: {
    conclusion: {
      type: Object,
      required: true,
    },
    conclusionStudent: {
      type: Object,
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
    questionnaireMode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    targetCurrencySign: {
      type: String,
      default: "",
    },
  },
  components: {
    QuestionnaireSections,
  },
  computed: {
    isStudent() {
      return (
        this.$store.getters.user &&
        this.$store.getters.user.role !== ROLES_ENUM.STUDENT
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.target--conclusion {
  width: 95%;
  margin: 0 auto;
  padding: 0 20px;
  .title {
    font-weight: 500;
    font-size: 30px;
    line-height: 35px;
    margin-bottom: 20px;
    color: #5d6272;
  }
  &.color {
    background-color: #fef2cc;
  }
}
</style>
