<template>
  <div class="charts">
    <div class="charts--title" :class="portfolioId">
      <span>Структуры портфеля</span>
    </div>
    <div class="charts--container" v-if="showStructure">
      <div class="chart" :class="{hidden: !option.courses.includes(course)}" v-for="option of options" :key="option.id">
        <div class="chart--title" v-if="option.courses.includes(course)">{{ option.name }}</div>
        <div class="chart--container" v-if="option.courses.includes(course)">
          <chart :option="option" :colors="colors" :portfolioId="portfolioId"></chart>
          <div class="legend">
            <div v-for="(label, index) of Object.entries(option.data)" :key="label[0]">
              <div :style="`background-color: ${colors[index]}`"></div>
              <span>{{ label[0] }} {{ label[1] }}%</span>
            </div>
          </div>
        </div>
        <div class="chart--actions" v-if="option.action && option.courses.includes(course)">
          <button class="btn btn--green" @click="showSectionMore = !showSectionMore">Подробнее</button>
        </div>
        <transition name="fade">
          <div class="chart--additional" v-if="showSectionMore && option.action">
            <div class="total">
              <div>Всего:</div>
              <div>{{ Object.keys(sectionsPercents).length }} шт.</div>
              <div>{{ totalInstruments }} шт.</div>
            </div>
            <div v-for="(section, skey) in sectionsPercents" :key="skey">
              <div class="section--percent">{{ section.amount }}%</div>
              <div class="section--name">{{ skey }}</div>
              <div class="instruments">
                <div v-for="(instrument, ikey) in section.list" :key="ikey">
                  <div>{{ ikey }}</div>
                  <div>{{ instrument }}%</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="charts--container" v-else>
      <span>Добавьте активы в портфель для отображения структур!</span>
    </div>
  </div>
  {{ percents }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import { mapGetters } from 'vuex'
import { dynamicsObject, valueof } from '@/interfaces';
import chart from './Chart.vue';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { Instrument } from '@/interfaces/dto/instrument';
import { COURSES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: 'PortfolioCharts',
  props: {
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true
    },
    target: {
      type: Object,
      required: true
    },
    portfolioId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showSectionMore: false,
      showStructure: false,
      colors: [],
      options: [] as Array<dynamicsObject>,
    }
  },
  computed: {
    ...mapGetters(["preview", "currencies", "mixedAssets"]),
    percents() {
      const core = this.portfolio.sections[1].modules.map((m) => m.data).filter(i => i.name && i.price);
      this.setOptions(core);
      return '';
    },
    sectionsPercents() {
      const percents: dynamicsObject = {};
      const core = this.portfolio.sections[1].modules.map((m) => m.data).filter((i) => i[`class_${this.course}_id`] === "stock" && ["Акции", "Отраслевые ETF и БПИФ"].includes(i[`instrument_type_${this.course}`]));
      core.forEach(instrument => {
        if (!percents[instrument[`section_${this.course}`]]) percents[instrument[`section_${this.course}`]] = { amount: 0, list: { } };
        let lot = this.course === COURSES_ENUM.TWO && instrument.lot ? instrument.lot : 1;
        const amount = instrument.price * instrument.number_papers * lot;
        const currentAmount =
          this.course === COURSES_ENUM.ONE
            ? this.getUSDCurrency(amount, instrument[`currency_${this.course}_id`])
            : this.getRUBCurrency(amount, instrument[`currency_${this.course}_id`]);
        percents[instrument[`section_${this.course}`]].list[instrument.name] = currentAmount;
        percents[instrument[`section_${this.course}`]].amount += currentAmount;
      });
      if (Object.values(percents).length > 0) {
        const total = Object.values(percents).reduce((t, n) => t + n.amount, 0);
        for (const key in percents) {
          percents[key].amount = Math.ceil10((percents[key].amount / total) * 100, -1);
          for (const listKey in percents[key].list) {
            const instrument = percents[key].list[listKey];
            percents[key].list[listKey] = Math.ceil10((instrument / total) * 100, -1);
          }
        }
      }
      return percents;
    },
    totalInstruments() {
      let length = 0;
      for (const key in this.sectionsPercents) {
        length += Object.keys(this.sectionsPercents[key].list).length;
      }
      return length;
    }
  },
  created() {
    this.colors = this.preview[this.course === COURSES_ENUM.ONE ? 'firstQuestionnaireColors' : 'secondQuestionnaireColors'];
  },
  methods: {
    setOptions(core: Instrument.Dto[]) {
      const date = Date.now();
      this.showStructure = core.length > 0;
      this.options = [
        { id: `section_percents_${this.portfolioId}_${date}`, courses: ['one', 'two'], action: true, name: 'Структура акций по секторам экономики:', data: this.getCorrectStructurePercents(core, `section_${this.course}`) },
        { id: `stock_risk_percents_${this.portfolioId}_${date}`, courses: ['two'], name: 'Структура портфеля по рисковой части:', data: this.getCorrectStructurePercents(core, `instrument_type_${this.course}`, true) },
        { id: `currency_percents_${this.portfolioId}_${date}`, courses: ['one', 'two'], name: 'Структура портфеля по валютам:', data: this.getCorrectStructurePercents(core, `base_currency_${this.course}_id`) },
        { id: `conserv_percents_${this.portfolioId}_${date}`, courses: ['two'], name: 'Структура портфеля по консервативной части:', data: this.getCorrectStructurePercents(core, `instrument_type_${this.course}`)},
        { id: `country_percents_${this.portfolioId}_${date}`, courses: ['one', 'two'], name: 'Структура портфеля по географии:', data: this.getCorrectStructurePercents(core, `country_${this.course}`) },
        { id: `bond_period_percents_${this.portfolioId}_${date}`, courses: ['two'], name: 'Структура облигаций по сроку:', data: this.getCorrectStructurePercents(core, `matdate`) },
      ]
    },
    getCurrentInstruments(instruments: Array<Instrument.Dto>, type: string, moreFilter = false) {
      if (type === 'matdate')
        return instruments.filter((i) => i[`class_${this.course}_id`] === "bond");
      if (type.includes("section_"))
        return instruments.filter((i) => i[`class_${this.course}_id`] === "stock" && i["section_" + this.course] && ["Акции", "Отраслевые ETF и БПИФ"].includes(i[`instrument_type_${this.course}`]));
      if (type.includes("instrument_type_") && moreFilter) 
        return instruments.filter((i) => i[`class_${this.course}_id`] === "stock" && i["section_" + this.course] && ["Акции", "Отраслевые ETF и БПИФ", "ETF и БПИФ на акции широкого рынка (не отраслевые)"].includes(i[`instrument_type_${this.course}`]));
      if (type.includes("instrument_type_"))
        return instruments.filter((i) => i[`class_${this.course}_id`] === "bond" && i["instrument_type_" + this.course]);
      return instruments;
    },
    getCorrectStructurePercents(instruments: Array<Instrument.Dto>, type: string, moreFilter = false) {
      const result: dynamicsObject = {};
      const copy = this.getCurrentInstruments(instruments, type, moreFilter);
      copy.forEach((instrument) => {
        if (!result[instrument[type]] && type !== 'matdate') result[instrument[type]] = 0;
        let lot = this.course === COURSES_ENUM.TWO && instrument.lot ? instrument.lot : 1;
        const amount = instrument.price * instrument.number_papers * lot;

        const currentAmount =
          this.course === COURSES_ENUM.ONE
            ? this.getUSDCurrency(amount, instrument[`currency_${this.course}_id`])
            : this.getRUBCurrency(amount, instrument[`currency_${this.course}_id`]);

        if (
          (type.includes('class_') || type.includes('section_')) &&
          instrument[`instrument_type_${this.course}`] === "Фонды смешанных активов"
        ) {
          const mixedAsset = this.mixedAssets.find(
            (asset: dynamicsObject) =>
              asset.name.toLowerCase().trim() ===
              instrument.name.toLowerCase().trim()
          );
          if (mixedAsset) {
            const classes = [
              { one: "Акция", two: "Рисковая часть", id: "stock" },
              { one: "Облигация", two: "Консервативная часть", id: "bond" },
              { one: "Альтернативные инвестиции", two: "Защитная часть", id: "alternative" },
            ];
            if (type.includes('section_')) {
              result[instrument[type]] +=
                currentAmount * (mixedAsset.stock / 100);
            }
            if (type.includes('class_')) {
              classes.forEach((classAsset) => {
                if (!result[classAsset[this.course]])
                  result[classAsset[this.course]] = 0;
                result[classAsset[this.course]] +=
                  currentAmount * (mixedAsset[classAsset.id] / 100);
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
          result[instrument[type]] += currentAmount;
        }
      });
      if (Object.values(result).length > 0) {
        const total = Object.values(result).reduce((t, n) => t + n);
        for (const key in result) {
          if (Object.hasOwnProperty.call(result, key)) {
            result[key] = Math.ceil10((result[key] / total) * 100, -1);
          }
        }
      }
      if (result && result['Акции'] && moreFilter && type === `instrument_type_${this.course}`) {
        Object.defineProperty(result, 'Акции отдельных компаний',
          Object.getOwnPropertyDescriptor(result, 'Акции') || '');
        delete result['Акции'];
      }
      return result;
    },
    getUSDCurrency(amount: number, currency: string) {
      const rates = this.currencies;
      return Math.ceil10(amount / rates[currency], -1);
    },
    getRUBCurrency(amount: number, currency: string) {
      const rates = this.currencies;
      return Math.ceil10((amount / rates[currency]) * rates["RUB"], -1);
    },
  },
  components: {
    chart
  }
})
</script>

<style lang="scss" scoped>
.charts {
  margin-top: 20px;
  &--title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    border-radius: 5px 5px 0 0;
    span {
      color: #fff;
    }
    &.studentPortfolio {
      background: #74b2e6;
    }
    &.existingPortfolio {
      background: #71be67;
    }
    &.expertPortfolio {
      background: #ec8b51;
    }
  }
  &--container {
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 30px;
    .chart {
      position: relative;
      width: 33%;
      margin-bottom: 30px;
      &.hidden {
        display: none;
      }
      &--title {
        font-size: 14px;
        font-weight: 500;
      }
      &--container {
        padding: 0 50px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        canvas {
          margin-top: 15px;
        }
        .legend {
          padding-top: 15px;
          display: flex;
          flex-wrap: wrap;
          > div {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            margin-right: 10px;
            div {
              width: 14px;
              height: 14px;
              border-radius: 4px;
            }
            span {
              margin-left: 5px;
              font-size: 12px;
              color: #686868;
            }
          }
        }
      }
      &--actions {
        position: absolute;
        top: 20px;
        right: 0;
      }
      &--additional {
        width: 500px;
        background: #fff;
        border-radius: 5px;
        top: 65px;
        padding: 10px 15px;
        left: -30px;
        position: absolute;
        z-index: 1;
        box-shadow: 2px 2px 10px rgba(0, 50, 92, 0.1);
        .total {
          > div {
            padding: 5px 10px;
            text-align: left;
            &:first-child {
              width: 60px;
            }
            &:nth-child(2) {
              border-left: 1px solid black;
              border-right: 1px solid black;
              flex-grow: 1;
            }
            &:last-child {
              width: 180px;
            }
          }
        }
        > div {
          display: flex;
          border: 1px solid black;
          font-size: 13px;
          .section--percent {
            padding: 5px 10px;
            box-shadow: 0px 0px 0px 1px black;
            display: flex;
            align-items: center;
            width: 60px;
            min-width: 60px;
          }
          .section--name {
            text-align: left;
            padding: 5px 10px;
            flex-grow: 1;
            display: flex;
            align-items: center;
          }
          .instruments {
            width: 180px;
            > div {
              box-shadow: 0px 0px 0px 1px black;
              display: flex;
              > div {
                text-align: left;
                padding: 5px 0 5px 10px;
                &:first-child {
                  width: 130px;
                  border-right: 1px solid black;
                }
                &:last-child {
                  width: 50px;
                }
              }
              &:not(:first-child) {
                margin-top: 1px;
              }
            }
          }
          &:not(:first-child) {
            margin-top: -1px;
          }
        }
      }
    }
  }
}
</style>