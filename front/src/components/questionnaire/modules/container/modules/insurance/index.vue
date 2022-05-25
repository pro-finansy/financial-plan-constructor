<template>
  <div class="insurance" data-id="insurance">
    <div class="insurance--title">{{ currectInsurance.name }}</div>
    <div class="insurance--container">
      <QuestionnairenInputs
        :block="!!(questionnaireMode === 'GAP')"
        :questionnaireMode="questionnaireMode"
        :module="currectInsurance.module"
        :id="currectInsurance.id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import QuestionnairenInputs from "../common/inputs/index.vue";

export default defineComponent({
  name: "QuestionnaireInsurance",
  props: {
    insurance: {
      type: Object,
      required: true,
    },
    insuranceStudent: {
      type: Object,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
  },
  computed: {
    currectInsurance() {
      return this.questionnaireMode === "DEFAULT"
        ? this.insurance
        : this.insuranceStudent;
    },
  },
  components: {
    QuestionnairenInputs,
  },
});
</script>

<style lang="scss" scoped>
.insurance {
  &--title {
    font-weight: 500;
    font-size: 30px;
    line-height: 35px;
    color: #5d6272;
    margin: 30px 0;
  }
  &--container {
    width: 450px;
    margin: 0 auto;
  }
}
</style>
