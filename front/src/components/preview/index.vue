<template>
  <CommonQuestionnaireActions
    :pending="pending"
    :questionnaire_id="questionnaire_id"
    :pendingStudent="pendingStudent"
    :pendingOnePage="pendingOnePage"
    :loading="loading"
    @create="create"
    @createOnePage="createOnePage"
  />
  <div class="pdf" id="element-to-print1" :class="course" v-if="ready">
    <div class="page">
      <FirstQuestionnaireTemplate
        v-if="course === 'one'"
        :expert="expert"
        :student="student"
        :targets="targets"
      />
      <SecondQuestionnaireTemplate
        v-if="course === 'two'"
        :expert="expert"
        :student="student"
        :targets="targets"
      />
    </div>
  </div>
  <div
    id="element-to-print2"
    style="position: relative"
    class="pdf other second1"
    v-if="ready && targets[0]"
  >
    <!-- <div style="position: absolute; top: 1056px; width: 10px; height: 10px; background: red"></div> -->
    <common-questionnaire-template-portfolios
      :course="course"
      :target="targets[0]"
    />
  </div>
  <div id="element-to-print3" class="pdf other" v-if="ready && targets[1]">
    <common-questionnaire-template-portfolios
      :course="course"
      :target="targets[1]"
    />
  </div>
  <div class="pdf other" id="element-to-print4" v-if="ready">
    <common-questionnaire-template-portfolios
      :course="course"
      v-if="targets[2]"
      :target="targets[2]"
    />
    <div class="page">
      <common-questionnaire-template-comment
        :course="course"
        :commonComment="commonComment"
      />
    </div>
  </div>
  <div class="pdf other" id="element-to-print5" v-if="ready">
    <common-questionnaire-template-chart
      v-for="target of targets"
      :course="course"
      :chart="target.chart"
      :number="target.number"
      :key="target.id"
    />
  </div>
  <div class="pdf other" id="element-to-print6" v-if="ready">
    <div class="page">
      <main :class="course">
        <common-questionnaire-template-info
          :course="course"
          :content="
            course === 'one'
              ? preview.firstQuestionnaireInfo
              : preview.secondQuestionnaireInfo
          "
        />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from '@vue/runtime-core';
import { mapGetters } from "vuex";
import correctDescription from "@/utils/correctEnd";
import calculation from "./calculation";
import { createCharts } from "./charts";
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { dynamicsObject, valueof } from '@/interfaces';
import { Instrument } from '@/interfaces/dto/instrument';
import { COURSES_ENUM, PERIODS_ENUM } from '@/utils/enums';
import { COURSES_TYPE } from '@/store/commonDatas';

const FirstQuestionnaireTemplate = defineAsyncComponent(() => import('./first/index.vue'));
const SecondQuestionnaireTemplate = defineAsyncComponent(() => import('./second/index.vue'));
const CommonQuestionnaireActions = defineAsyncComponent(() => import('./common/actions.vue'));
const CommonQuestionnaireTemplateInfo = defineAsyncComponent(() => import('./common/info.vue'));
const CommonQuestionnaireTemplateChart = defineAsyncComponent(() => import('./common/chart.vue'));
const CommonQuestionnaireTemplateComment = defineAsyncComponent(() => import('./common/comment.vue'));
const CommonQuestionnaireTemplatePortfolios = defineAsyncComponent(() => import('./common/portfolios.vue'));

export default defineComponent({
  name: "PreviewMain",
  data() {
    return {
      targets: [] as Array<dynamicsObject>,
      periods: {
        NOT_PERIOD: "без пополнений",
        MONTHLY: "мес.",
        QUARTERLY: "кварт.",
        SEMIANNUALLY: "раз в полгода",
        ANNUALLY: "год",
      },
      student: {},
      expert: {},
      commonComment: "",
      ready: false,
      loading: true,
      avatar: "",
      pending: false,
      pendingStudent: false,
      pendingOnePage: false,
      questionnaire_id: this.$attrs._id,
      course: "" as valueof<typeof COURSES_ENUM>,
      mixedAssets: [],
      combine: false,
    };
  },
  computed: {
    ...mapGetters(["preview", "currencies"]),
  },
  created() {
    this.getMixedAssets();
  },
  mounted() {
    if (!this.questionnaire_id) return this.$router.push("/");
    this.jq("#app > main > header").remove();
    this.getQuestionnaire();
    this.emitter.on('sendQuestionnaire', this.sendQuestionnaireEmitter);
  },
  unmounted() {
    this.emitter.off('sendQuestionnaire', this.sendQuestionnaireEmitter);
  },
  methods: {
    async getMixedAssets() {
      const result = await this.API.common.getMixeds();
      this.mixedAssets = result.data;
    },
    async getQuestionnaire() {
      const result = await this.API.questionnaire.getQuestionnaire(this.questionnaire_id);
      setTimeout(() => {
        this.combine = !!result.data.content_COMBINE_EXPERT;
        this.course = result.data.course.type;
        this.transformData(
          result.data.content_EXPERT,
          result.data.expert
        );
        setTimeout(() => {
          createCharts(
            this.targets,
            this.preview[this.course === 'one' ? 'firstQuestionnaireColors' : 'secondQuestionnaireColors']
          );
          if (this.$router.currentRoute.value.query.collection === 'true') {
            setTimeout(() => {
              this.loading = false;
            }, 20000);
          } else {
            this.loading = false;
          }
        }, 200);
      }, 100);
    },
    transformData(questionnaire: Questionnaire.Dto, expert: dynamicsObject) {
      this.student = questionnaire.student.data.module.data;
      this.expert = expert;
      this.commonComment = questionnaire.comment.data.module.data.comment;
  
      questionnaire.targets.data.forEach((target) => {
        const term = target.type.sections[1].modules[0].data;
        const period = target.conclusion.sections[0].modules[0].data.period_id;
        const targetCurrency = target.main.data.currency_id;
        const targetCurrencySign = target.main.data.currency_sign;

        const current_term = calculation.currentTerm(term);
        const income = this.getCorrectCurrency(target.type.sections[0].modules, targetCurrency);
        const resourses = this.getCorrectCurrency(target.type.sections[4].modules, targetCurrency);

        const { profitability, inflation } = target.main.data;
        const correctProfitability = profitability / 100;
        const correctInflation = inflation / 100;

        let FV = calculation.FV(
          income,
          correctInflation,
          current_term
        );

        let capital = (FV * 12) / correctProfitability;
        if (target.type.id === 2) FV = capital;

        if (this.combine) {
          FV = Number(target.type.sections[3].modules[0].data.fv.replace(` ${target.main.data.currency_sign}`, ''));
        }

        const correctTarget = {
          id: target.id,
          number: target.id,
          name: target.main.data.name,
          mainCurrency: targetCurrency,
          type: target.type.id,
          income,
          resourses,
          term: `${term.term} ${correctDescription(term)}`,
          riskPortfolio: this.getCorrectPortfolioTag(
            target.type.sections[5].modules[0].data.portfolio
          ),
          conclusion: {
            amount: 0,
            period: this.getCorrectPeriod(period),
            replenishment: this.getCorrectCurrency(
              target.conclusion.sections[1].modules,
              targetCurrency
            ),
            comment: target.conclusion.sections[3].modules[0].data.comment,
          },
          chart: [] as Array<dynamicsObject>,
          portfolios: this.getCurrentPortfolios(target, FV),
          status: target.status,
          capital: 0,
          passive: 0,
          percent: 0,
        };

        let FVS = calculation.FV(
          income,
          correctInflation,
          current_term
        );
        if (this.combine) {
          FVS = Number(target.type.sections[3].modules[0].data.fv.replace(` ${target.main.data.currency_sign}`, ''));
        }
        const FV1 = calculation.FV1(
          resourses,
          correctProfitability,
          current_term
        );

        const percent = (FV1 / FV) * 100;
        const FV2 = FV - FV1;
        const R = FV2 / ((Math.pow(1 + correctProfitability, current_term) - 1) / correctProfitability);
        const currentPeriod = calculation.currentPeriod(period);
        const currentMonths = calculation.currentMonths(period);
        const currentR = R / currentPeriod < 0 ? 0 : Number((R / currentPeriod).toFixed(1));

        correctTarget.capital = Math.ceil10(capital, -1);
        correctTarget.passive = Math.ceil10(FVS, -1);
        correctTarget.percent = percent > 100 ? 100 : Math.ceil10(percent, -1);
        correctTarget.conclusion.amount = FV2 < 0 ? 0 : Math.ceil10(FV2, -1);

        correctTarget.chart = calculation.chartFill(
          target.type.sections[4].modules,
          current_term,
          currentPeriod,
          currentMonths,
          currentR,
          correctProfitability,
          correctTarget,
          targetCurrency,
          targetCurrencySign,
          this.getCorrectCurrency,
        );

        this.targets = [...this.targets, correctTarget];
      });
      this.ready = true;
    },
    getCurrentPortfolios(target: Questionnaire.QTarget, FV: number) {
      let portfolios = [] as Array<dynamicsObject>;
      let index = 0;
      const keys = Object.typedKeys(target.portfolios);
      for (const key of keys) {
        if (Object.hasOwnProperty.call(target.portfolios, key)) {
          const portfolio = target.portfolios[key];
          const coreInstruments = portfolio.sections[1].modules.filter(m => m.data.name && m.data.price).map(m => m.data);
          const tacticInstruments = key !== 'expert' ? portfolio.sections[2].modules.filter(m => m.data.name && m.data.price).map(m => m.data) : [];

          portfolios = [
            ...portfolios,
            {
              id: key,
              ct_percents: {
                "Ядро": portfolio.sections[0].modules[0].data.core,
                "Тактическая часть":
                  portfolio.sections[0].modules[0].data.tactic,
              },
              mainAmount: key !== 'expert' ? this.getCorrectAmountCurrency([...coreInstruments, ...tacticInstruments], target.main.data.currency_id, this.course) : FV.toFixed(2),
              core: {
                selected: !!coreInstruments.find(i => i.name && i.price),
                instruments: coreInstruments,
                class_percents: this.getCorrectStructurePercents(
                  key,
                  false,
                  coreInstruments,
                  "class_" + this.course
                ),
                country_percents: this.getCorrectStructurePercents(
                  key,
                  false,
                  coreInstruments,
                  "country_" + this.course
                ),
                currency_percents: this.getCorrectStructurePercents(
                  key,
                  false,
                  coreInstruments,
                  `base_currency_${this.course}_id`
                ),
                section_percents: this.getCorrectStructurePercents(
                  key,
                  false,
                  coreInstruments,
                  "section_" + this.course
                ),
                conserv_percents: this.getCorrectStructurePercents(
                  key,
                  false,
                  coreInstruments,
                  "instrument_type_" + this.course
                ),
                stock_risk_percents: this.getCorrectStructurePercents(key, false, coreInstruments, "instrument_type_" + this.course, "instrument_type_" + this.course, ["Акции", "Отраслевые ETF и БПИФ", "ETF и БПИФ на акции широкого рынка (не отраслевые)"]),
                bond_period_percents: this.getCorrectStructurePercents(key, false, coreInstruments, "matdate"),
                stock_percents: this.getCorrectStructurePercents(
                  key,
                  false,
                  coreInstruments,
                  "section_" + this.course,
                  "instrument_type_" + this.course,
                  ["Акции", "Отраслевые ETF и БПИФ"]
                ),
                index,
              },
              tactic: {
                selected: portfolio.sections[2]
                  ? portfolio.sections[2].selected
                  : false,
                instruments: tacticInstruments,
              },
              comments: {
                common: this.getCorrectComment(portfolio, "conclusion-comment"),
                stock: this.getCorrectComment(portfolio, "stock-comment"),
                bond: this.getCorrectComment(portfolio, "bond-comment"),
                alternative: this.getCorrectComment(
                  portfolio,
                  "alternative-comment"
                ),
                tactic: this.getCorrectComment(portfolio, "tactic-comment"),
              },
              // comment: portfolio.sections.find(s => s.default === 'conclusion-comment') ? portfolio.sections.find(s => s.default === 'conclusion-comment').modules[0].data.comment : ''
            },
          ];
          index++;
        }
      }
      return portfolios;
    },
    getCurrentInstruments(instruments: Array<Instrument.Dto>, type: string, filter?: string, filterElements?: Array<string>) {
      if (filter && filterElements) {
        if (type.includes("section_") || type.includes('instrument_type_'))
          return instruments.filter((i) => i[`class_${this.course}_id`] === "stock" && i["section_" + this.course] && filterElements.includes(i[filter]));
      } else {
        if (type === 'matdate')
          return instruments.filter((i) => i[`class_${this.course}_id`] === "bond");
        if (type.includes("section_"))
          return instruments.filter((i) => i[`class_${this.course}_id`] === "stock" && i["section_" + this.course]);
        if (type.includes("instrument_type_"))
          return instruments.filter((i) => i[`class_${this.course}_id`] === "bond" && i["instrument_type_" + this.course]);
      }
      return instruments;
    },
    getCorrectComment(portfolio: Questionnaire.QTargetPortfolio, name: string) {
      const p = portfolio.sections.find((s) => s.default === name);
      if (!p) return '';
      return this.parseLinks(p.modules[0].data.comment);
    },
    parseLinks(text: string) {
      return `<div>${text
        .replace(/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g, '<a style="color: rgb(0, 89, 255);" href="$1">$1</a>')
        .replace(/([*].+?[*])/g, "<strong>$1</strong>")
        .replace(/\*/g, "")}</div>`;
    },
    getCorrectStructurePercents(pid: string, need: boolean, instruments: Array<Instrument.Dto>, type: string, filter?: string, filterElements?: Array<string>) {
      const result: dynamicsObject = {};
      const copy = this.getCurrentInstruments(instruments, type, filter, filterElements);
      
      copy.forEach((instrument: Instrument.Dto) => {
        const correct_type = instrument[type] ? instrument[type].trim() : instrument[type];
        if (!result[correct_type] && type !== 'matdate') result[correct_type] = 0;
        if (pid === 'expert' && need) {
          result[correct_type] += Number(instrument.percent);
        } else {
          let lot = this.course === COURSES_ENUM.TWO && instrument.lot ? instrument.lot : 1;
          const amount = instrument.price * instrument.number_papers * lot;

          const currentAmount =
            this.course === COURSES_ENUM.ONE ?
              Number(this.getUSDCurrency(amount, instrument[`currency_${this.course}_id`])) :
              Number(this.getRUBCurrency(amount, instrument[`currency_${this.course}_id`]));

          if ((type.includes('class_') || type.includes('section_')) && instrument[`instrument_type_${this.course}`] === "Фонды смешанных активов") {
            const mixedAsset: dynamicsObject | undefined = this.mixedAssets.find(
              (asset: dynamicsObject) => asset.name.toLowerCase().trim() === instrument.name.toLowerCase().trim()
            );
            if (mixedAsset) {
              const classes = COURSES_TYPE;
              if (type.includes('section_')) {
                result[correct_type] +=
                  currentAmount * ((mixedAsset as dynamicsObject).stock / 100);
              }
              if (type.includes('class_')) {
                classes.forEach((classAsset) => {
                  if (!result[classAsset[this.course]]) result[classAsset[this.course]] = 0;
                  result[classAsset[this.course]] += currentAmount * (mixedAsset[classAsset.id] / 100);
                });
              }
            }
          } else if (type === 'matdate') {
            const date = new Date(instrument.matdate);
            if (+date) {
              const correctDate = new Date();
              correctDate.setDate(correctDate.getDate() + 1460);
              if (correctDate <= date) {
                if (!result['Долгосрочные']) result['Долгосрочные'] = 0;
                result['Долгосрочные'] += currentAmount;
              } else {
                if (!result['Краткосрочные']) result['Краткосрочные'] = 0;
                result['Краткосрочные'] += currentAmount;
              }
            }
          } else {
            result[correct_type] += currentAmount;
          }
        }
        
      });
      if (Object.values(result).length > 0 && pid === 'expert' && need) {
        for (const key in result) {
          result[key] = Math.ceil10(result[key], -1);
        }
      }
      if (Object.values(result).length > 0 && !(pid === 'expert' && need)) {
        const total = Object.values(result).reduce((t, n) => t + n);
        for (const key in result) {
          if (Object.hasOwnProperty.call(result, key)) {
            result[key] = ((result[key] / total) * 100).toFixed(1);
          }
        }
      }
      if (result && result['Акции'] && type === filter && type === `instrument_type_${this.course}`) {
        Object.defineProperty(result, 'Акции отдельных компаний',
          Object.getOwnPropertyDescriptor(result, 'Акции') || '');
        delete result['Акции'];
      }
      return result;
    },
    getCorrectCurrency(datas: Array<Instrument.Module>, currency: string) {
      const rates = this.currencies;
      return Math.ceil10(datas
        .reduce((acc, data) => acc + (data.data.amount / rates[data.data.currency_id]) * rates[currency], 0), -1);
    },
    getCorrectAmountCurrency(instruments: Array<Instrument.Dto>, currency: string, course: valueof<typeof COURSES_ENUM>) {
      const rates = this.currencies;
      instruments = instruments.filter(i => i.name);
      return instruments.reduce((acc, instrument) => acc + (instrument.number_papers * ((course === 'two' && instrument.lot) ? instrument.lot : 1) * instrument.price / rates[instrument[`currency_${course}_id`]] * rates[currency]), 0).toFixed(0);
    },
    getOtherCurrency(amount: number, currency: string, baseCurrency: string) {
      const rates = this.currencies;
      return Math.ceil10((amount / rates[currency]) * rates[baseCurrency], -1);
    },
    getUSDCurrency(amount: number, currency: string) {
      const rates = this.currencies;
      return Math.ceil10(amount / rates[currency], -1);
    },
    getRUBCurrency(amount: number, currency: string) {
      const rates = this.currencies;
      return Math.ceil10((amount / rates[currency]) * rates["RUB"], -1);
    },
    division(last: boolean) {
      const all = document.querySelectorAll("*");
      all.forEach((element) => {
        const pelement = this.jq(element).closest(!last ? ".second1" : ".second2") || [];
        const parent = !!(pelement.length > 0);
        if (parent) {
          this.jq(element).addClass("eew");
        }
      });
      const hoffset = this.jq(!last ? ".second1" : ".second2").offset() || { top: 0 };
      const height = hoffset.top;
      this.jq(`${last ? ".second2" : ".second1"} .eew`)
        .toArray()
        .forEach((element) => {
          const offset = this.jq(element).offset() || { top: height };
          if (last) {
            if (
              offset.top - height < 7500 &&
              (this.jq(element).height() || 0) < 2000
            ) {
              this.jq(element).addClass("hiddenEEW");
            }
          } else {
            if (
              offset.top - height > 7500 &&
              (this.jq(element).height() || 0) < 2000
            ) {
              this.jq(element).addClass("hiddenEEW");
            }
          }
        });
      this.jq(`${last ? ".second2" : ".second1"} .hiddenEEW`).remove();
    },
    sendQuestionnaireEmitter() {
      this.createStudentFile();
    },
    async createStudentFile() {
      this.pendingStudent = true;
      await this.API.questionnaire.createStudentFile(this.questionnaire_id);
      this.pendingStudent = false;
    },
    async createOnePage() {
      this.pendingOnePage = true;
      const result = await this.API.questionnaire.createPDFOnePage(this.questionnaire_id)
      const a = document.createElement("a");
      a.href = result.data.src;
      a.download = result.data.name;
      a.click();
      this.pendingOnePage = false;
    },
    async create() {
      this.pending = true;
      const result = await this.API.questionnaire.createPDF(this.questionnaire_id);
      const a = document.createElement("a");
      a.href = result.data.src;
      a.download = result.data.name;
      a.click();
      this.pending = false;
    },
    getCorrectPeriod(period: keyof typeof PERIODS_ENUM) {
      return this.periods[period];
    },
    getCorrectPortfolioTag(portfolio: string) {
      const risk =
        this.course === "one"
          ? this.preview.firstQuestionnaireRisks.find((p: dynamicsObject) => p.name === portfolio)
          : this.preview.secondQuestionnaireRisks.find((p: dynamicsObject) => p.name === portfolio);
      risk.icon = risk.src;
      return risk;
    },
  },
  components: {
    FirstQuestionnaireTemplate,
    SecondQuestionnaireTemplate,
    CommonQuestionnaireActions,
    CommonQuestionnaireTemplateInfo,
    CommonQuestionnaireTemplateChart,
    CommonQuestionnaireTemplateComment,
    CommonQuestionnaireTemplatePortfolios,
  },
});
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.commentLinks {
  :deep() a {
    color: rgb(0, 89, 255);
  }
}
.pdf {
  font-family: "Raleway", sans-serif;
  letter-spacing: 0.02em;
  width: 850px;
  padding-top: 20px;
  margin: 0 auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-feature-settings: "pnum" on, "lnum" on;
  background: #ffffff;
  line-height: 10pt;
  position: relative;
}
.other {
  padding-top: 25px;
}

.page {
  position: relative;
}

main {
  margin: 30px auto 0;
  padding: 0 42px;
  &.two {
    padding: 0;
  }
}

.left {
  float: left;
}

.right {
  float: right;
}

.papers,
.tactical,
.expertpp,
.comment,
.expertst {
  margin: 30px 0;
  background: #058255;
  border-radius: 15px;
  color: #fff;
  padding: 20px 25px;
}

.papers--title,
.tactical--title,
.expertpp--title,
.comment--title,
.info--title,
.expertst--title {
  font-weight: 800;
  font-size: 24px;
}

.targets--container,
.papers--container,
.tactical--container,
.expertpp--container,
.comment--container,
.info--container,
.expertst--container {
  margin-top: 20px;
}

.targets--container .element,
.papers--container .element,
.tactical--container .element,
.expertpp--container .element,
.comment--container .element,
.info--container .element,
.expertst--container .element {
  margin-bottom: 15px;
  position: relative;
}

.targets--container .element > div,
.papers--container .element > div,
.tactical--container .element > div,
.expertpp--container .element > div,
.comment--container .element > div,
.info--container .element > div,
.expertst--container .element > div {
  display: table-cell;
}

.targets--container .element > div:first-child,
.papers--container .element > div:first-child,
.tactical--container .element > div:first-child,
.expertpp--container .element > div:first-child,
.comment--container .element > div:first-child,
.info--container .element > div:first-child,
.expertst--container .element > div:first-child {
  font-weight: 700;
  width: 50px;
  margin-right: 40px;
  font-size: 10px;
}

.targets--container .element > div:last-child,
.papers--container .element > div:last-child,
.tactical--container .element > div:last-child,
.expertpp--container .element > div:last-child,
.comment--container .element > div:last-child,
.info--container .element > div:last-child,
.expertst--container .element > div:last-child {
  font-size: 12px;
  font-weight: 400;
}

.analysis--header {
  font-weight: 800;
  font-size: 20px;
  background: #fcc033;
  border-radius: 15px;
  padding: 16px 25px;
  line-height: 23px;
}

.analysis--header.blue {
  background: #5c6bc0;
  color: #fff;
}

.analysis--header.purple {
  background: #941e76;
  color: #ffffff;
}

.analysis--header.red {
  background-color: #f44336;
  color: #ffffff;
}

.papers,
.tactical {
  background: #ffffff;
  border: 2px solid #fcc033;
  border-radius: 15px;
  color: #000;
}

.papers.blue,
.tactical.blue {
  border-color: #5c6bc0;
}

.papers.purple,
.tactical.purple {
  border-color: #941e76;
}

.papers--title,
.tactical--title,
.comment--title,
.info--title {
  color: #f44336;
}

.papers--title-two,
.tactical--title-two,
.comment--title-two,
.info--title-two {
  color: #5c6bc0;
}

.papers--title-three,
.tactical--title-three,
.comment--title-three,
.info--title-three {
  color: #369b5f;
}

.papers--container .el,
.tactical--container .el,
.comment--container .el,
.info--container .el {
  margin-bottom: 10px;
}

.papers--container .el div:first-child,
.tactical--container .el div:first-child,
.comment--container .el div:first-child,
.info--container .el div:first-child {
  font-weight: bold;
  font-size: 10px;
  margin-bottom: 2px;
}

.papers--container .el div:last-child,
.tactical--container .el div:last-child,
.comment--container .el div:last-child,
.info--container .el div:last-child {
  font-weight: normal;
  font-size: 12px;
}

.papers--container .el div:last-child ul,
.tactical--container .el div:last-child ul,
.comment--container .el div:last-child ul,
.info--container .el div:last-child ul {
  margin-left: 20px;
}

.tactical--title {
  color: #000;
}

.expertpp {
  background: #941e76;
  border-radius: 15px;
  color: #fff;
}

.expertst--element .title {
  font-weight: 800;
  font-size: 20px;
}

.expertst--element .container {
  margin: 17px 0 30px;
}

.expertst--element .container table {
  border-collapse: collapse;
  border-spacing: 0;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}

.expertst--element .container table tr th div {
  font-weight: normal;
  font-size: 8px;
  width: 75%;
  float: right;
}

.expertst--element .container table tr th,
.expertst--element .container table tr td {
  text-align: right;
  padding: 10px;
}

.expertst--element .container table tr th:first-child,
.expertst--element .container table tr td:first-child {
  width: 62px;
}

.expertst--element .container table tr td {
  border-top: 1px solid #e6e6e6;
  font-weight: bold;
  font-size: 10px;
}

.expertst--element .container .tt table {
  margin-bottom: 20px;
  width: 80%;
}

.expertst--element .container .tt table:first-child tr th {
  color: #f44336;
}

.expertst--element .container .tt table:nth-child(2) tr th {
  color: #5c6bc0;
}

.expertst--element .container .tt table:nth-child(3) tr th {
  color: #058255;
}

.expertst--element .container .tt table tr th {
  text-transform: uppercase;
  font-weight: 800;
  font-size: 12px;
}

.expertst--element .container .tt table tr th,
.expertst--element .container .tt table tr td {
  text-align: left;
}

.expertst--element .container .tt table tr th:nth-child(3),
.expertst--element .container .tt table tr th:nth-child(4),
.expertst--element .container .tt table tr td:nth-child(3),
.expertst--element .container .tt table tr td:nth-child(4) {
  text-align: right;
}

.expertst--element .container .tt table tr td {
  font-weight: bold;
  font-size: 10px;
}

.comment,
.expertst {
  border: 2px solid #f44336;
  background: #fff;
  color: #000;
}

.comment--title,
.expertst--title {
  color: #000;
}

.comment--container,
.expertst--container {
  font-size: 12px;
}

.comment--container {
  margin-top: 0;
}
</style>