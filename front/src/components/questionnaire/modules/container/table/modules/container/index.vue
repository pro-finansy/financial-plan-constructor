<template>
  <section class="container">
    <questionnaire-common
      :target="target"
      :course="course"
    ></questionnaire-common>
    <questionnaire-portfolios
      :course="course"
      :target="target"
    ></questionnaire-portfolios>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue-demi";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import questionnaireCommon from "./common/index.vue";
import questionnairePortfolios from "./portfolios/index.vue";

export default defineComponent({
  name: "QuestionnaireTableContainer",
  props: {
    target: {
      type: Object as PropType<Questionnaire.QTarget>,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  provide() {
    return {
      targetId: computed(() => this.target.id),
      targetCurrencyId: computed(() => this.target.main.data.currency_id),
      targetCurrencySign: computed(() => this.target.main.data.currency_sign),
    };
  },
  components: {
    questionnaireCommon,
    questionnairePortfolios,
  },
});
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 30px;
}
</style>