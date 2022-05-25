<template>
  <div class="portfolio" v-if="portfolio.id !== 'expertPortfolio'" :data-id="portfolio.id">
    <div class="portfolio--name">{{ portfolioTitle }}</div>
    <portfolio-categories
      :portfolioId="portfolio.id"
      :portfolioName="portfolioName"
      :target="target"
      :course="course"
      :categories="getCategories"
    ></portfolio-categories>
    <portfolio-diversification :course="course" :portfolio="portfolio"></portfolio-diversification>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import portfolioCategories from "./categories/index.vue";
import portfolioDiversification from "./diversification/index.vue";
import { COURSES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "QuestionnaireTablePortfolio",
  props: {
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true,
    },
    portfolioName: {
      type: [String, Number],
      required: true,
    },
    target: {
      type: Object,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  components: {
    portfolioCategories,
    portfolioDiversification
  },
  computed: {
    getCategories() {
      const sections = this.portfolio.sections.filter((section) => section.default.includes('portfolio-instrument-'));
      for (const module of sections[0].modules) {
        module.data.core = true;
      }
      return sections;
    },
    portfolioTitle() {
      return (this.portfolio.name.includes('Существующий') || this.portfolio.name.includes('стартовый')) ?
       (this.course === COURSES_ENUM.ONE ? 'Если у Вас уже есть активы, укажите их ниже:' : 'Портфель на стартовую сумму:') : 
       'Портфель на всю сумму цели с учетом инфляции:';
    }
  }
});
</script>

<style lang="scss" scoped>
.portfolio {
  &--name {
    padding: 15px 0;
    width: 100%;
    font-weight: bold;
    font-size: 30px;
    line-height: 35px;
    text-align: center;
    color: #5D6272;
  }
  &:not(:last-child) {
    margin-bottom: 100px;
  }
}
</style>