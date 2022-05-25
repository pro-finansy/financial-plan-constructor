<template>
  <div class="targets" data-id="targets">
    <Target
      :key="target.id"
      :target="target"
      :targetStudent="targetsStudent[targetIndex]"
      :number="targetIndex"
      :course="course"
      :status="status"
      :questionnaireMode="questionnaireMode"
      :checkSection="checkSection"
      :role="role"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { valueof } from "@/interfaces";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import { COURSES_ENUM } from "@/utils/enums";
import Target from "../target/index.vue";

export default defineComponent({
  name: "QuestionnaireTargets",
  props: {
    targets: {
      type: Array as PropType<Array<Questionnaire.QTarget>>,
      required: true,
    },
    targetsStudent: {
      type: Array as PropType<Array<Questionnaire.QTarget>>,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    checkSection: {
      type: Function,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  computed: {
    target() {
      if (!this.targets.find((t) => t.selected)) this.setTargetSelected();
      return this.targets.find((t) => t.selected) || this.targets[0];
    },
    targetIndex() {
      return this.targets.findIndex((t) => t.selected) || 0;
    },
  },
  methods: {
    setTargetSelected() {
      this.targets[0].selected = true
    }
  },
  components: {
    Target,
  },
});
</script>
