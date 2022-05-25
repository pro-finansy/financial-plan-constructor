<template>
  <section class="portfolios">
    <questionnaire-portfolio
      v-for="(portfolio, name) in target.portfolios"
      :key="portfolio.id"
      :portfolioName="name"
      :portfolio="portfolio"
      :target="target"
      :course="course"
    ></questionnaire-portfolio>
  </section>
</template>

<script lang="ts">
import { inject, defineComponent } from 'vue-demi';
import { dynamicsObject } from "@/interfaces";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import questionnairePortfolio from "./portfolio.vue";
import { COURSES_ENUM } from '@/utils/enums';

export default defineComponent({
  setup() {
    const questionnaire_id = inject('questionnaire_id');
    return { questionnaire_id };
  },
  name: "QuestionnaireTablePortfolios",
  props: {
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
    questionnairePortfolio,
  },
  mounted() {
    this.emits();
  },
  unmounted() {
    this.emitter.off(`createQuestionnaire`, this.createQuestionnaireEmitter);
    this.emitter.off(`editQuestionnaire`, this.editQuestionnaireEmitter);
    this.emitter.off(`errorQuestionnaireInstrument`, this.errorQuestionnaireInstrumentEmitter);
    this.emitter.off(`removeQuestionnaire`, this.removeQuestionnaireEmitter);
    this.emitter.off(`changeTacticFile`, this.changeTacticFileEmitter);
    this.emitter.off(`deleteTacticFile`, this.deleteTacticFileEmitter);
  },
  methods: {
    emits() {
      this.emitter.on(`deleteTacticFile`, this.deleteTacticFileEmitter);
      this.emitter.on(`changeTacticFile`, this.changeTacticFileEmitter);
      this.emitter.on(`createQuestionnaire`, this.createQuestionnaireEmitter);
      this.emitter.on(`errorQuestionnaireInstrument`, this.errorQuestionnaireInstrumentEmitter);
      this.emitter.on(`editQuestionnaire`, this.editQuestionnaireEmitter);
      this.emitter.on(`removeQuestionnaire`, this.removeQuestionnaireEmitter);
    },
    deleteTacticFileEmitter({ portfolioName, file }: { portfolioName: string, file: dynamicsObject }) {
      this.deleteTacticFile(this.target.id, this.target.portfolios[portfolioName], portfolioName, file);
    },
    changeTacticFileEmitter({ portfolioName, files }: { portfolioName: string, files: string }) {
      this.saveTacticFile(this.target.id, this.target.portfolios[portfolioName], portfolioName, files);
    },
    createQuestionnaireEmitter({type, portfolioId, ...element}: dynamicsObject) {
      try {
        for (const portfolio in this.target.portfolios) {
          const p: Questionnaire.QTargetPortfolio = this.target.portfolios[portfolio];
          if (p.id === portfolioId) {
            if (element.number_papers && element.price)  {
              let lot = (this.course === COURSES_ENUM.TWO && element.lot) ? element.lot : 1;
              element.formula = Math.floor(element.number_papers * element.price * lot);
            }
            if (type) {
              const cmodule = p.sections[1].modules.find(m => m.data.name === element.name);
              if (cmodule) {
                if (cmodule.data.comment === element.comment && cmodule.data.number_papers === element.number_papers) return;
                cmodule.data.number_papers = Number(cmodule.data.number_papers) + Number(element.number_papers);
                cmodule.data.percent = Number(cmodule.data.percent) + Number(element.percent);
                break;
              }
              this.$store.commit('addNewModule', { section: p.sections[1], indexSection: 1, targetId: this.target.id, element })
            } else {
              const cmodule = p.sections[2].modules.find(m => m.data.name === element.name);
              if (cmodule) {
                if (cmodule.data.comment === element.comment && cmodule.data.number_papers === element.number_papers) return;
                cmodule.data.number_papers = Number(cmodule.data.number_papers) + Number(element.number_papers);
                cmodule.data.percent = Number(cmodule.data.percent) + Number(element.percent);
                break;
              }
              this.$store.commit('addNewModule', { section: p.sections[2], indexSection: 2, targetId: this.target.id, element })
            }
            break;
          }
        }
      } catch (error) {
        this.$store.commit('addError', { err: error, func: 'CQS' });
      }
    },
    editQuestionnaireEmitter({ type, portfolioId, ...element }: dynamicsObject) {
      try {
        for (const portfolio in this.target.portfolios) {
          const p: Questionnaire.QTargetPortfolio = this.target.portfolios[portfolio];
          if (p.id === portfolioId) {
            if (type) {
              let instrument = p.sections[1].modules.find(m => m.data.name.toLowerCase().trim() === element.name.toLowerCase().trim());
              if (!instrument) return;
              for (const key in element) {
                instrument.data[key] = element[key];
              }
            } else {
              let instrument = p.sections[2].modules.find(m => m.data.name.toLowerCase().trim() === element.name.toLowerCase().trim());
              if (!instrument) return;
              for (const key in element) {
                instrument.data[key] = element[key];
              }
            }
            break;
          }
        }
      } catch (error) {
        this.$store.commit('addError', { err: error, func: 'EQS' });
      }
    },
    //
    removeQuestionnaireEmitter({ type, portfolioId, name, dublicateFrom }: dynamicsObject) {
      try {
        for (const portfolio in this.target.portfolios) {
          const p: Questionnaire.QTargetPortfolio = this.target.portfolios[portfolio];
          if (dublicateFrom && portfolio === dublicateFrom) {
            const indexSection = type ? 1 : 2;
            const module = p.sections[indexSection].modules.find((m) => m.data.name.toLowerCase().trim() === name.toLowerCase().trim());
            if (module) {
              module.data.dublicateStudent = false;
            }
          }
          if (p.id === portfolioId) {
            const indexSection = type ? 1 : 2;
            const indexModule = p.sections[indexSection].modules.findIndex(m => m.data.name.toLowerCase().trim() === name.toLowerCase().trim());
            this.$store.commit('removeModule', { modules: p.sections[indexSection].modules, indexSection: indexSection, indexModule, targetId: this.target.id});
            break;
          }
        }
      } catch (error) {
        this.$store.commit('addError', { err: error, func: 'RQS' });
      }
    },
    errorQuestionnaireInstrumentEmitter({ type, portfolioId, ...element }: dynamicsObject) {
      try {
        for (const portfolio in this.target.portfolios) {
          const p: Questionnaire.QTargetPortfolio = this.target.portfolios[portfolio];
          if (p.id === portfolioId) {
            if (type) {
              let instrument = p.sections[1].modules.find(m => m.data.name.toLowerCase().trim() === element.name.toLowerCase().trim());
              if (instrument) instrument.data.percent = element.percent;
            } else {
              let instrument = p.sections[2].modules.find(m => m.data.name.toLowerCase().trim() === element.name.toLowerCase().trim());
              if (instrument) instrument.data.percent = element.percent;
            }
            break;
          }
        }
      } catch (error) {
        this.$store.commit('addError', { err: error, func: 'EQS' });
      }
    },
    async deleteTacticFile(targetId: number, portfolio: Questionnaire.QTargetPortfolio, portfolioName: string, file: dynamicsObject) {
      const params = {
        questionnaireId: this.questionnaire_id,
        targetId,
        portfolioId: portfolioName,
        file
      }
      await this.API.questionnaire.deleteTacticFile(params, this.questionnaire_id);
      portfolio.sections[2].files = portfolio.sections[2].files?.filter(f => f.originalname !== file.originalname);
    },
    async saveTacticFile(targetId: number, portfolio: Questionnaire.QTargetPortfolio, portfolioName: string, files: string) {
      const formData = new FormData();
      for (const file of files) {
        formData.append("tactic", file);
      }
      const params = {
        questionnaireId: this.questionnaire_id,
        targetId,
        portfolioId: portfolioName
      }

      const result = await this.API.questionnaire.saveTacticFile(formData, params, this.questionnaire_id);
      portfolio.sections[2].files = result.data;
    }
  },
});
</script>

<style lang="scss" scoped>
</style>