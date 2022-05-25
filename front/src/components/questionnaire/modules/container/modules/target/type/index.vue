<template>
  <div class="target--type color">
    <div class="title">{{ type.name }}</div>
    <div class="container">
      <QuestionnaireSections
        :questionnaireMode="questionnaireMode"
        :course="course"
        :sections="type.sections"
        :sectionsStudent="typeStudent.sections"
        id="target-type"
        :targetId="targetId"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";
import QuestionnaireSections from "../../common/sections/index.vue";

export default defineComponent({
  name: "TargetType",
  props: {
    type: {
      type: Object,
      required: true,
    },
    typeStudent: {
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
  },
  components: {
    QuestionnaireSections,
  },
});
</script>

<style lang="scss" scoped>
.target--type {
  width: 95%;
  margin: 0 auto;
  padding: 0 20px;
  .title {
    font-weight: 500;
    font-size: 30px;
    line-height: 35px;
    color: #5d6272;
    padding: 20px 0;
  }
  &.color {
    background-color: #fef2cc;
  }
}
</style>
