<template>
  <div class="sections flex">
    <div
      class="section"
      @click="$emit('selectQuestionnaireSection', section.id)"
      v-for="section of sections"
      :class="section.id"
      :key="section.id"
    >
      {{ section.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "QuestionnaireSections",
  emits: ["selectQuestionnaireSection"],
  props: {
    sections: {
      required: true,
      type: Array as PropType<Array<dynamicsObject>>,
    },
  },
});
</script>

<style lang="scss" scoped>
.sections {
  width: 95%;
  margin: 0 auto;
  .section {
    cursor: pointer;
    width: 215px;
    padding: 20px;
    &:first-child {
      border-radius: 10px 0 0 0;
    }
    &:last-child {
      border-radius: 0 10px 0 0;
    }
    &.target {
      background-color: #fef2cc;
    }
    &.student {
      background-color: #deebf7;
    }
    &.expert {
      background-color: #fbe4d6;
    }
    &.existing {
      background-color: #e2f0d9;
    }
  }
}
</style>
