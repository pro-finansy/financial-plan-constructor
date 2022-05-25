<template>
  <div class="portfolio--table-container">
    <portfolio-info
      :portfolioId="portfolioId"
      :course="course"
      :portfolio="portfolio"
      :target="target"
    ></portfolio-info>
    <portfolio-categories
      :portfolioId="portfolio.id"
      :portfolioName="portfolioId"
      :target="target"
      :course="course"
      :core="portfolio.sections[0].modules[0].data.core"
      :categories="getInstruments"
    ></portfolio-categories>
    <portfolio-diversification
      :course="course"
      :portfolioId="portfolio.id"
      :portfolio="portfolio"
      :target="target"
    ></portfolio-diversification>
    <portfolio-comments
      :portfolioId="portfolio.id"
      :course="course"
      :portfolio="portfolio"
      :target="target"
    ></portfolio-comments>
    <portfolio-charts
      :portfolioId="portfolio.id"
      :course="course"
      :portfolio="portfolio"
      :target="target"
    ></portfolio-charts>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  PropType,
} from "vue-demi";
import { mapGetters } from "vuex";

import portfolioDiversification from "./modules/diversification/index.vue";
import portfolioCategories from "./modules/categories/index.vue";
import portfolioComments from "./modules/comments/index.vue";
import portfolioCharts from "./modules/charts/index.vue";

import { Questionnaire } from "@/interfaces/dto/questionnaire";
import { dynamicsObject, valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";

const portfolioInfo = defineAsyncComponent(
  () => import("./modules/info/index.vue")
);

export default defineComponent({
  name: "PortfolioTable",
  props: {
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    portfolio: {
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
  },
  computed: {
    ...mapGetters(["questionnaire", "questionnaireStatus"]),
    target(): Questionnaire.QTarget {
      return this.questionnaire.targets.find(
        (t: Questionnaire.QTarget) => t.id === this.targetId
      );
    },
    getInstruments() {
      return this.portfolio.sections.filter((section) =>
        section.default.includes("portfolio-instrument-")
      );
    },
  },
  mounted() {
    this.emits();
  },
  unmounted() {
    this.unemits();
  },
  methods: {
    unemits() {
      this.emitter.off(`createQuestionnaire`, this.createQuestionnaireEmitter);
      this.emitter.off(`editQuestionnaire`, this.editQuestionnaireEmitter);
      this.emitter.off(`commentQuestionnaire`, this.commentQuestionnaireEmitter);
      this.emitter.off(`removeQuestionnaire`, this.removeQuestionnaireEmitter);
    },
    emits() {
      this.emitter.on(`createQuestionnaire`, this.createQuestionnaireEmitter);
      this.emitter.on(`editQuestionnaire`, this.editQuestionnaireEmitter);
      this.emitter.on(`commentQuestionnaire`, this.commentQuestionnaireEmitter);
      this.emitter.on(`removeQuestionnaire`, this.removeQuestionnaireEmitter);
    },
    createQuestionnaireEmitter({
      type,
      portfolioId,
      ...element
    }: dynamicsObject) {
      try {
        const keys = Object.typedKeys(this.target.portfolios);
        for (const portfolio of keys) {
          const p = this.target.portfolios[portfolio];
          if (p.id === portfolioId) {
            const indexSection = type ? 1 : 2;
            if (element.number_papers && element.price) {
              let lot = this.course === "two" && element.lot ? element.lot : 1;
              element.formula = Math.floor(
                element.number_papers * element.price * lot
              );
            }
            const cmodule = p.sections[indexSection].modules.find(
              (m) => m.data.name === element.name
            );
            if (cmodule) {
              if (
                cmodule.data.comment === element.comment &&
                cmodule.data.number_papers === element.number_papers
              )
                return;
              cmodule.data.number_papers =
                Number(cmodule.data.number_papers) +
                Number(element.number_papers);
              cmodule.data.percent = Math.ceil10(
                Number(cmodule.data.percent) + Number(element.percent),
                -2
              );
              break;
            }
            this.$store.commit("addNewModule", {
              section: p.sections[indexSection],
              indexSection: indexSection,
              targetId: this.target.id,
              element,
            });
            break;
          }
        }
      } catch (error) {
        this.$store.commit("addError", { err: error, func: "CQS" });
      }
    },
    editQuestionnaireEmitter({
      type,
      portfolioId,
      ...element
    }: dynamicsObject) {
      try {
        const keys = Object.typedKeys(this.target.portfolios);
        for (const portfolio of keys) {
          const p = this.target.portfolios[portfolio];
          if (p.id === portfolioId) {
            const indexSection = type ? 1 : 2;
            let instrument = p.sections[indexSection].modules.find(
              (m) =>
                m.data.index === element.index ||
                m.data.name.toLowerCase().trim() ===
                  element.name.toLowerCase().trim()
            );
            if (!instrument) return;
            if (instrument && instrument.data.index !== element.index) {
              instrument.data.number_papers =
                Number(instrument.data.number_papers) +
                Number(element.number_papers);
              instrument.data.percent = Math.ceil10(
                Number(instrument.data.percent) + Number(element.percent),
                -2
              );
              p.sections[indexSection].modules = p.sections[
                indexSection
              ].modules.filter((m) => m.data.index !== element.index);
              break;
            }
            for (const key in element) {
              instrument.data[key] = element[key];
            }
            break;
          }
        }
      } catch (error) {
        this.$store.commit("addError", { err: error, func: "EQS" });
      }
    },
    commentQuestionnaireEmitter({
      type,
      portfolioId,
      ...element
    }: dynamicsObject) {
      try {
        const keys = Object.typedKeys(this.target.portfolios);
        for (const portfolio of keys) {
          const p = this.target.portfolios[portfolio];
          if (p.id === portfolioId) {
            const indexSection = type ? 1 : 2;
            let instrument = p.sections[indexSection].modules.find(
              (m) =>
                m.data.name.toLowerCase().trim() ===
                element.name.toLowerCase().trim()
            );
            if (instrument) {
              instrument.data.comment = element.comment;
              instrument.data.commentInstrument = element.commentInstrument;
            }
            break;
          }
        }
      } catch (error) {
        this.$store.commit("addError", { err: error, func: "EQS" });
      }
    },
    //
    removeQuestionnaireEmitter({
      type,
      portfolioId,
      name,
      dublicateFrom,
    }: dynamicsObject) {
      try {
        const keys = Object.typedKeys(this.target.portfolios);
        for (const portfolio of keys) {
          const p = this.target.portfolios[portfolio];
          if (dublicateFrom && portfolio === dublicateFrom) {
            const indexSection = type ? 1 : 2;
            const module = p.sections[indexSection].modules.find(
              (m) =>
                m.data.name.toLowerCase().trim() === name.toLowerCase().trim()
            );
            if (module) {
              module.data.dublicateExpert = false;
            }
          }
          if (p.id === portfolioId) {
            const indexSection = type ? 1 : 2;
            const indexModule = p.sections[indexSection].modules.findIndex(
              (m) =>
                m.data.name.toLowerCase().trim() === name.toLowerCase().trim()
            );
            this.$store.commit("removeModule", {
              modules: p.sections[indexSection].modules,
              indexSection: indexSection,
              indexModule,
              targetId: this.target.id,
            });
            break;
          }
        }
      } catch (error) {
        this.$store.commit("addError", { err: error, func: "RQS" });
      }
    },
  },
  provide() {
    return {
      targetId: computed(() => this.target.id),
      targetCurrencyId: computed(() => this.target.main.data.currency_id),
      targetCurrencySign: computed(() => this.target.main.data.currency_sign),
      status: computed(() => this.questionnaireStatus),
    };
  },
  components: {
    portfolioDiversification,
    portfolioCategories,
    portfolioComments,
    portfolioCharts,
    portfolioInfo,
  },
});
</script>

<style></style>
