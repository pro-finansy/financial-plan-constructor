<template>
  <section class="questionnaire--container">
    <questionnaire-header
      v-if="course === 'one'"
      :targets="targets"
      :insurance="insurance"
      :selectedTargetId="selectedTarget.id"
      :pivot="pivot"
      @selectTarget="selectTarget"
      @addStudentTarget="$emit('addStudentTarget')"
    ></questionnaire-header>
    <questionnaire-container
      :course="course"
      :target="currentTarget"
    ></questionnaire-container>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import questionnaireHeader from "./modules/header/index.vue";
import questionnaireContainer from "./modules/container/index.vue";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "QuestionnaireTableMode",
  emits: ["addStudentTarget", "removeStudentTarget"],
  props: {
    targets: {
      type: Array as PropType<Array<Questionnaire.QTarget>>,
      required: true,
    },
    insurance: {
      type: Object,
      required: true,
    },
    pivot: {
      type: Boolean,
      default: false,
    },
    course: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.emits();
  },
  unmounted() {
    this.emitter.off("editInsurance", this.editInsuranceEmitter);
    this.emitter.off("changeTarget", this.changeTargetEmitter);
  },
  computed: {
    currentTarget() {
      return (
        this.targets.find((t) => t.id === this.selectedTarget.id) ||
        this.targets[0]
      );
    },
    selectedTarget() {
      return (
        this.targets.find((target: Questionnaire.QTarget) => target.selected) ||
        this.targets[0]
      );
    },
  },
  methods: {
    emits() {
      this.emitter.on("editInsurance", this.editInsuranceEmitter);
      this.emitter.on("changeTarget", this.changeTargetEmitter);
    },
    editInsuranceEmitter(element: dynamicsObject) {
      for (const key in element) {
        this.insurance[key] = element[key];
      }
    },
    changeTargetEmitter(id: number) {
      const target = this.targets.find(
        (t: Questionnaire.QTarget) => t.id === id
      );
      if (!target) return;
      this.selectTarget(target);
    },
    selectTarget(target: Questionnaire.QTarget) {
      for (const t of this.targets) t.selected = false;
      target.selected = true;
    },
  },
  components: {
    questionnaireHeader,
    questionnaireContainer,
  },
});
</script>

<style lang="scss" scoped>
.questionnaire--container {
  width: 92% !important;
  text-align: left !important;
  background: #ffffff;
  border-radius: 10px;
  margin: 120px 0 20px;
  padding: 0 !important;
}
</style>
