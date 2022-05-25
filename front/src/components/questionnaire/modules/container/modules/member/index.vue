<template>
  <section class="member" :data-id="member.id" :class="{ color: color }">
    <div class="member--title">{{ member.name }}</div>
    <div class="member--container">
      <QuestionnairenInputs
        :block="!!(questionnaireMode === 'GAP') && course === 'one'"
        :questionnaireMode="questionnaireMode"
        :module="member.module"
        :id="member.id"
        :course="course"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { COURSES_ENUM, ROLES_ENUM } from "@/utils/enums";
import QuestionnairenInputs from "../common/inputs/index.vue";
import { valueof } from "@/interfaces";

export default defineComponent({
  name: "Member",
  props: {
    member: {
      type: Object,
      required: true,
    },
    memberStudent: {
      type: Object,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
  },
  computed: {
    color() {
      return this.course === COURSES_ENUM.TWO && this.role !== ROLES_ENUM.STUDENT;
    },
    currectMember() {
      return this.questionnaireMode === "DEFAULT"
        ? this.member
        : this.memberStudent;
    },
  },
  components: {
    QuestionnairenInputs,
  },
});
</script>

<style lang="scss" scoped>
.member {
  width: 95%;
  margin: 0 auto;
  &--title {
    font-weight: 500;
    font-size: 30px;
    line-height: 35px;
    color: #5d6272;
    padding: 20px 0;
  }
  &--container {
    width: 450px;
    margin: 0 auto;
  }
  &.color {
    background-color: #fef2cc;
  }
}
</style>
