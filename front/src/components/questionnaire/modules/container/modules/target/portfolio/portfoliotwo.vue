<template>
  <transition name="portfolioAnimation">
    <div
      class="portfolio color"
      v-if="currentSection && checkSection(portfolioId)"
      :class="{ dNone: !checkSection(portfolioId) }"
      :data-id="portfolioId"
    >
      <portfolio-table
        :class="{ dNone: !checkSection(portfolioId) }"
        :course="course"
        :targetId="targetId"
        :portfolio="portfolio"
        :portfolioId="portfolioId"
      ></portfolio-table>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { mapGetters } from "vuex";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import portfolioTable from "./table/index.vue";
import { COURSES_ENUM } from "@/utils/enums";
import { valueof } from "@/interfaces";

export default defineComponent({
  name: "PortfolioTwo",
  props: {
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true,
    },
    portfolioStudent: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true,
    },
    portfolioId: {
      type: String,
      required: true,
    },
    targetId: {
      type: Number,
      required: true,
    },
    sectionStatus: {
      type: Object,
      required: true,
    },
    sectionStudentStatus: {
      type: Object,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    checkSection: {
      type: Function,
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
    targetCurrencyId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["questionnaireStatus", "questionnaireVersion"]),
    portfolioStatus() {
      return this.portfolioId !== "expert";
    },
    currentSection() {
      return this.questionnaireMode === "GAP"
        ? this.sectionStudentStatus[this.portfolioId] !== -1
        : this.sectionStatus[this.portfolioId] !== -1;
    },
  },
  components: {
    portfolioTable,
  },
});
</script>

<style lang="scss" scoped>
.portfolio {
  padding: 20px;
  width: 95%;
  margin: 0 auto;
  &--title {
    font-weight: 500;
    font-size: 30px;
    line-height: 35px;
    color: #5d6272;
    margin-bottom: 20px;
  }
  &--description {
    font-size: 18px;
    line-height: 21px;
    color: #5d6272;
    margin-bottom: 20px;
  }
  &--actions {
    margin-bottom: 10px;
    .btn:first-child {
      margin-right: 20px;
    }
  }
  &.color {
    &[data-id="student"] {
      background: #deebf7;
    }
    &[data-id="existing"] {
      background: #e2f0d9;
    }
    &[data-id="expert"] {
      background: #fbe4d6;
    }
  }
}
</style>
