<template>
  <div class="section flex justify-between" :data-id="'section-' + indexSection" v-if="showSection">
    <div class="section--left">
      <div class="name">{{ section.name }}</div>
      <div
        class="calculation"
        v-if="portfolioId === 'expert' && indexSection === 0"
      >
        {{ currentCorePercent.replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
      </div>
    </div>
    <div class="section--middle">
      <QuestionnaireInputs
        v-for="(module, indexModule) of section.modules"
        id="section"
        :data-id="'module-' + indexModule"
        :targetCurrencySign="targetCurrencySign"
        :key="indexModule"
        :indexModule="indexModule"
        :indexSection="indexSection"
        :targetId="targetId"
        :portfolioId="portfolioId"
        :module="module"
        :moduleStudent="sectionStudent.modules[indexModule]"
        :modules="section.modules"
        :modulesStudent="sectionStudent.modules"
        :section="section"
        :sectionStudent="sectionStudent"
        :course="course"
        :questionnaireMode="questionnaireMode"
      />
    </div>
    <div class="section--right">
      <button
        v-if="section.file"
        @click="openUrl(section.file.src)"
        class="btn btn--qn btn--green"
      >
        Смотреть файл
      </button>
      <!-- <button
        v-if="isAddBlock"
        class="btn btn--qn btn--green"
        @click="
          $store.commit('addNewModule', { section, indexSection, targetId })
        "
      >
        Добавить блок2
      </button>
      <button
        v-else-if="isDisableAddBlock"
        class="btn btn--qn btn--green btn--disabled"
      >
        Добавить блок1
      </button>
      <button
        v-else-if="isDisableAddBlockMore"
        class="btn btn--qn btn--green btn--disabled"
      >
        Добавить блок
      </button> -->
    </div>
    <div
      class="section--settings"
      v-if="questionnaireMode !== 'GAP' && section.optional"
    >
      <label class="optional flex justify-between items-center">
        <span>Заполняется</span>
        <input
          type="checkbox"
          @change="onActionFields(section.selected)"
          v-model="section.selected"
        />
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { mapGetters } from "vuex";
import { Instrument } from "@/interfaces/dto/instrument";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import QuestionnaireInputs from "../../common/inputs/index.vue";
import { valueof } from "@/interfaces";
import { COURSES_ENUM, DURATION_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "QuestionnaireSection",
  props: {
    section: {
      type: Object,
      required: true,
    },
    sectionStudent: {
      type: Object,
      required: true,
    },
    targetId: {
      type: Number,
      required: true,
    },
    portfolioId: {
      type: String,
    },
    sectionStatus: {
      type: Object,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    indexSection: {
      type: Number,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    targetCurrencySign: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      status: false,
    };
  },
  computed: {
    ...mapGetters(["questionnaireStatus", "questionnaire", "currencies"]),
    showSection() {
      const tactic =
        this.section.default.includes("tactic") &&
        this.section.selected === false;
      const expert = this.portfolioId === "expert" && this.indexSection !== 2;
      return (
        (this.section.show ||
          (this.sectionStudent.show && this.questionnaireMode === "GAP")) &&
        !expert &&
        !tactic
      );
    },
    currentCorePercent() {
      const currentTarget: Questionnaire.QTarget =
        this.questionnaire.targets.find(
          (t: Questionnaire.QTarget) => t.id === this.targetId
        );
      const currentTerm = currentTarget.type.sections[1].modules[0].data;
      const currentTargetIncome = currentTarget.type.sections[0].modules;

      const inflation = currentTarget.main.data.inflation / 100;
      const profitability = currentTarget.main.data.profitability / 100 || 0;
      const term =
        currentTerm.duration_id === DURATION_ENUM.MONTH
          ? Number(currentTerm.term) / 12
          : Number(currentTerm.term);
      const income = this.getCorrectCurrency(
        currentTargetIncome,
        currentTarget.main.data.currency_id
      );
      const core =
        currentTarget.portfolios.expert.sections[0].modules[0].data.core;
      let FV = income * Math.pow(1 + inflation, term);
      const capital = (FV * 12) / profitability;
      if (currentTarget.type.id === 2) FV = capital;

      return `Ядро ${(FV * (core / 100)).toFixed(1)} ${
        currentTarget.main.data.currency_id
      }`;
    },
    isAddBlock() {
      return (
        (this.questionnaireMode !== "GAP" || this.portfolioId === "expert") &&
        this.section.adding &&
        this.questionnaireStatus &&
        (this.portfolioId !== "existing" ||
          (this.portfolioId === "existing" &&
            this.sectionStatus?.existing === 1))
      );
    },
    isDisableAddBlock() {
      return (
        (this.questionnaireMode !== "GAP" || this.portfolioId === "expert") &&
        this.section.adding &&
        !this.questionnaireStatus
      );
    },
    isDisableAddBlockMore() {
      return (
        (this.questionnaireMode !== "GAP" || this.portfolioId === "expert") &&
        this.section.adding &&
        this.questionnaireStatus &&
        this.portfolioId === "existing"
      );
    },
  },
  methods: {
    openUrl(src: string) {
      window.open(src);
    },
    onActionFields(status: boolean) {
      this.jq(
        `[data-id="target-${this.targetId}"] .target--portfolios [data-id="${this.portfolioId}"] [data-id="section-2"] .input input,
         [data-id="target-${this.targetId}"] .target--portfolios [data-id="${this.portfolioId}"] [data-id="section-2"] .input textarea`
      ).attr("disabled", `${!status}`);
    },
    getCorrectCurrency(datas: Array<Instrument.Module>, currency: string) {
      const rates = this.currencies;
      return Math.ceil10(datas
        .reduce(
          (acc, data) => acc +
            (data.data.amount / rates[data.data.currency_id]) * rates[currency], 0
        ), -1);
    },
  },
  components: {
    QuestionnaireInputs,
  },
});
</script>

<style lang="scss" scoped>
.section {
  padding: 20px 0;
  position: relative;
  &--left {
    width: 300px;
    text-align: left;
    .name {
      margin-bottom: 10px;
    }
    .name,
    .calculation {
      font-size: 18px;
      line-height: 21px;
      color: #5d6272;
    }
  }
  &--middle {
    width: 450px;
    min-width: 450px;
    .inputs {
      &:not(:first-child) {
        margin-top: 30px;
      }
    }
  }
  &--right {
    width: 300px;
    align-self: flex-end;
    padding-bottom: 11px;
  }
  &--settings {
    position: absolute;
    right: 0;
    top: -11px;
    font-size: 18px;
    .optional {
      cursor: pointer;
      span {
        color: #5d6272;
        margin-right: 10px;
      }
    }
  }
}
</style>
