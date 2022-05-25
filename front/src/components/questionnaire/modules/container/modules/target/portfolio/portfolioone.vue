<template>
  <transition name="portfolioAnimation">
    <div
      class="portfolio color"
      v-if="currentSection && questionnaireVersion === 'new' && checkSection(portfolioId)"
      :class="{ dNone: !checkSection(portfolioId) }"
      :data-id="portfolioId"
    >
      <div v-if="portfolioStatus && questionnaireMode !== 'GAP'" class="portfolio--description">{{ portfolio.description }}</div>
      <div v-if="portfolioStatus && questionnaireMode !== 'GAP'" class="portfolio--actions">
        <button class="btn btn--qn btn--orange btn--disabled" v-if="!questionnaireStatus">Есть инструменты</button>
        <button class="btn btn--qn btn--orange" v-else @click="onSectionStatus(portfolioId, 1)">Есть инструменты</button>
        <button class="btn btn--qn btn--orange btn--disabled" v-if="!questionnaireStatus">Нет инструментов</button>
        <button class="btn btn--qn btn--orange" v-else @click="onSectionStatus(portfolioId, -1)">Нет инструментов</button>
      </div>
      <div class="portfolio--balance" v-if="questionnaireMode === 'GAP' && portfolioId !== 'expert'">
        <portfolio-balance :course="course" :portfolio="portfolioId !== 'expert' ? portfolioStudent : portfolio" :targetCurrencyId="targetCurrencyId"></portfolio-balance>
      </div>
      <portfolio-table 
        :class="[
          { dNone: !checkSection(portfolioId) },
        ]"
        v-if="portfolioId === 'expert'"
        :course="course"
        :targetId="targetId"
        :portfolio="portfolio"
        :portfolioId="portfolioId"
      ></portfolio-table>
      <div class="portfolio--container">
        <QuestionnaireSections
          id="target-portfolio"
          :course="course"
          :sections="portfolio.sections"
          :sectionsStudent="portfolioStudent.sections"
          :targetId="targetId"
          :portfolioId="portfolioId"
          :sectionStatus="sectionStatus"
          :questionnaireMode="questionnaireMode"
        />
        <PortfolioCalculation
          v-if="isCalculationAccess"
          :sections="portfolio.sections"
          :targetId="targetId"
          :portfolioId="portfolioId"
          :course="course"
        />
      </div>
    </div>
  </transition>
  <div
    class="portfolio"
    v-if="questionnaireVersion === 'old'"
    :class="[
      { dNone: !checkSection(portfolioId) },
      { color: role === 'EXPERT' },
    ]"
    :data-id="portfolioId"
  >
    <div v-if="portfolioStatus" class="portfolio--description">{{ portfolio.description }}</div>
    <div v-if="portfolioStatus" class="portfolio--actions">
      <button class="btn btn--qn btn--orange btn--disabled" v-if="!questionnaireStatus">Есть инструменты</button>
      <button class="btn btn--qn btn--orange" v-else @click="onSectionStatus(portfolioId, 1)">Есть инструменты</button>
      <button class="btn btn--qn btn--orange btn--disabled" v-if="!questionnaireStatus">Нет инструментов</button>
      <button class="btn btn--qn btn--orange" v-else @click="onSectionStatus(portfolioId, -1)">Нет инструментов</button>
    </div>
    <portfolio-table 
      :class="{dNone: !checkSection(portfolioId) }"
      v-if="portfolioId === 'expert'"
      :course="course"
      :targetId="targetId"
      :portfolio="portfolio"
      :portfolioId="portfolioId"
    ></portfolio-table>
    <div class="portfolio--container" v-if="sectionStatus[portfolioId] !== -1">
      <QuestionnaireSections
        id="target-portfolio"
        :course="course"
        :sections="portfolio.sections"
        :sectionsStudent="portfolioStudent.sections"
        :targetId="targetId"
        :portfolioId="portfolioId"
        :sectionStatus="sectionStatus"
        :questionnaireMode="questionnaireMode"
      />
      <PortfolioCalculation
        :sections="portfolio.sections"
        :targetId="targetId"
        :portfolioId="portfolioId"
        :course="course"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { mapGetters } from "vuex";
import portfolioBalance from "./balance.vue";
import QuestionnaireSections from "../../common/sections/index.vue";
import PortfolioCalculation from "./portfolioCalculation.vue";
import portfolioTable from './table/index.vue';
import { valueof } from "@/interfaces";
import { COURSES_ENUM, ROLES_ENUM } from "@/utils/enums";
import { Questionnaire } from "@/interfaces/dto/questionnaire";

export default defineComponent({
  name: "QuestionnairePortfolio",
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
      required: true
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
      required: true
    }
  },
  data() {
    return {
      status: false,
    };
  },
  computed: {
    ...mapGetters(["questionnaireStatus", "questionnaireVersion"]),
    portfolioStatus() {
      return (
        (this.course === COURSES_ENUM.TWO && this.portfolioId !== "expert") ||
        (this.course === COURSES_ENUM.ONE && this.portfolioId === "existing")
      );
    },
    currentSection() {
      return this.questionnaireMode === 'GAP' ? this.sectionStudentStatus[this.portfolioId] !== -1 : this.sectionStatus[this.portfolioId] !== -1;
    },
    isCalculationAccess() {
      return this.course === COURSES_ENUM.TWO && this.role !== ROLES_ENUM.STUDENT && this.portfolioId !== 'expert'
    }
  },
  methods: {
    onSectionStatus(portfolioId: string, status: number) {
      if (status === 1) {
        this.jq(`[data-id="${portfolioId}"] .portfolio--container [data-target="${this.targetId}"] input,
           [data-id="${portfolioId}"] .portfolio--container [data-target="${this.targetId}"] textarea`).prop('disabled', 'false');
        this.$store.commit('onQuestionnaireStatus', false);
        setTimeout(() => {
          this.$store.commit('onQuestionnaireStatus', true);
        }, 100);
      }
      this.$store.commit('sectionPortfolio', {targetId: this.targetId, portfolioId, status})
    }
  },
  components: {
    QuestionnaireSections,
    PortfolioCalculation,
    portfolioBalance,
    portfolioTable
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