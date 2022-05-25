<template>
  <section class="analysis">
    <div class="analysis--title space">Ядро портфеля</div>
    <div class="analysis--container" style="position: relative">
      <div class="element space" style="display: flex">
        <div>Текущее соотношение ядра портфеля и тактических идей:</div>
        <div class="chartLegend">
          <canvas :id="target.number + 'myCanvas' + index"></canvas>
          <div
            :id="target.number + 'myLegend' + index"
            class="legend"
            style="margin-left: 15px"
          ></div>
        </div>
      </div>
      <div class="element space" style="position: absolute; bottom: 30px; display: flex; flex-direction: column;">
        <div style="width: 120px; padding: 0; margin-bottom: 5px;">Сумма портфеля:</div>
        <div>{{ target.portfolios[index].mainAmount }} {{ target.mainCurrency }}</div>
      </div>
    </div>
    <div class="analysis--table" v-if="target.portfolios[index].core.selected">
      <div class="title">Состав портфеля по инструментам:</div>
      <div class="types">
        <div 
          class="type" 
          v-for="(type, typeIndex) of coreTypes"
          :key="type.id"
        >
          <div v-if="getCurrentInstruments(type.id).length > 0" class="type--name space">{{ type[course] }}:</div>
          <table v-if="getCurrentInstruments(type.id).length > 0">
            <thead>
              <tr class="space">
                <th style="width: 8%">Тикер/ISIN</th>
                <th style="width: 8%">Цена текущая</th>
                <th style="width: 6%" v-if="index === 0 && course === 'one'">Цена покупки</th>
                <th style="width: 6%">Процент</th>
                <th style="width: 8%">Кол-во бумаг</th>
                <th v-if="course === 'two'" style="width: 8%">Лотность</th>
                <th style="width: 8%">Сумма</th>
                <th style="width: 8%">Валюта покупки</th>
                <th style="width: 8%">Тип инструмента</th>
                <th style="width: 9%">Класс актива</th>
                <th style="width: 9%">География</th>
                <th v-if="course === 'one' || typeIndex !== 1" style="width: 9%">Сектор экономики</th>
                <th v-if="course === 'one' && index === 0" style="width: 9%">Доходность</th>
              </tr>
            </thead>
            <tbody
              class="space"
              v-for="instrument of getCurrentInstruments(type.id)"
              :key="instrument.name"
            >
              <tr class="gray">
                <td>{{ instrument.name }}</td>
                <td>{{ currentNumber(instrument.price) }}</td>
                <td v-if="index === 0 && course === 'one'">{{ currentNumber(instrument.purchase_price )|| '' }}</td>
                <td>{{ instrument.percent }}</td>
                <td>{{ numberWithSpaces(instrument.number_papers) }}</td>
                <td v-if="course === 'two'">{{ instrument.lot || 1 }}</td>
                <td>
                  {{ currentNumber((instrument.price * instrument.number_papers * ((course === 'two' && instrument.lot) ? instrument.lot : 1)).toFixed(1)) }}
                </td>
                <td>{{ instrument['currency_' + course] }}</td>
                <td>{{ instrument['instrument_type_' + course] }}</td>
                <td>{{ instrument['class_' + course] }}</td>
                <td>{{ instrument['country_' + course] }}</td>
                <td v-if="course === 'one' || typeIndex !== 1">{{ instrument['section_' + course] }}</td>
                <td v-if="course === 'one' && index === 0 && instrument.purchase_price > 0">{{ ((instrument.price - instrument.purchase_price) / instrument.purchase_price * 100).toFixed(1) }}%</td>
                <td v-if="course === 'one' && index === 0 && instrument.purchase_price == 0"></td>
              </tr>
              <tr :class="course" v-if="instrument.comment || instrument.commentInstrument">
                <td colspan="2">Комментарий эксперта:</td>
                <td
                  colspan="10"
                  class="commentLinks"
                  v-html="parseLinks(instrument.comment + (instrument.commentInstrument ? (!instrument.comment.trim() ? '' : '\n\n') + instrument.commentInstrument : ''))"
                ></td>
              </tr>
              <hr style="height: 1px;" v-else />
            </tbody>
          </table>
          <div class="charts" v-if="course === 'two' && index === 1">
            <div class="chart" v-if="Object.keys(target.portfolios[index].core.stock_risk_percents).length > 0 && type.id === 'stock'">
              <div class="chart--title">
                Структура портфеля по рисковой части:
              </div>
              <div class="chart--container">
                <canvas :id="target.number + 'myCanvas8' + index"></canvas>
                <div :id="target.number + 'myLegend8' + index" class="legend"></div>
              </div>
            </div>
            <div class="chart" v-if="Object.keys(target.portfolios[index].core.stock_percents).length > 0 && type.id === 'stock'">
              <div class="chart--title">
                Структура акций по секторам экономики:
              </div>
              <div class="chart--container">
                <canvas :id="target.number + 'myCanvas6' + index"></canvas>
                <div :id="target.number + 'myLegend6' + index" class="legend"></div>
              </div>
            </div>
            <div class="chart" v-if="Object.keys(target.portfolios[index].core.conserv_percents).length > 0 && type.id === 'bond'">
              <div class="chart--title">Структура портфеля по консервативной части:</div>
              <div class="chart--container">
                <canvas :id="target.number + 'myCanvas5' + index"></canvas>
                <div :id="target.number + 'myLegend5' + index" class="legend"></div>
              </div>
            </div>
            <div class="chart" v-if="Object.keys(target.portfolios[index].core.bond_period_percents).length > 0 && type.id === 'bond'">
              <div class="chart--title">Структура облигаций по срокам:</div>
              <div class="chart--container">
                <canvas :id="target.number + 'myCanvas7' + index"></canvas>
                <div :id="target.number + 'myLegend7' + index" class="legend"></div>
              </div>
            </div>
          </div>
          <div v-if="course === 'two' && (target.portfolios[index].comments[type.id] !== '<div></div>' && target.portfolios[index].comments[type.id])">
            <div style="padding: 10px 0; font-weight: 700;">{{ type.comment }}</div>
            <div style="font-size: 10px; white-space: pre-line; word-break: break-word;" v-html="target.portfolios[index].comments[type.id]"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="charts space" v-if="target.portfolios[index].core.selected">
      <div class="chart">
        <div class="chart--title">Структура портфеля по классам активов:</div>
        <div class="chart--container">
          <canvas :id="target.number + 'myCanvas1' + index"></canvas>
          <div :id="target.number + 'myLegend1' + index" class="legend"></div>
        </div>
      </div>
      <div class="chart">
        <div class="chart--title">Структура портфеля по географии:</div>
        <div class="chart--container">
          <canvas :id="target.number + 'myCanvas2' + index"></canvas>
          <div :id="target.number + 'myLegend2' + index" class="legend"></div>
        </div>
      </div>
    </div>
    <div class="charts space" v-if="target.portfolios[index].core.selected">
      <div class="chart">
        <div class="chart--title">Структура портфеля по валютам:</div>
        <div class="chart--container">
          <canvas :id="target.number + 'myCanvas3' + index"></canvas>
          <div :id="target.number + 'myLegend3' + index" class="legend"></div>
        </div>
      </div>
      <div class="chart" v-if="Object.keys(target.portfolios[index].core.section_percents).length > 0 && (index === 2 || (course === 'one'))">
        <div class="chart--title">Структура портфеля по секторам экономики:</div>
        <div class="chart--container">
          <canvas :id="target.number + 'myCanvas4' + index"></canvas>
          <div :id="target.number + 'myLegend4' + index" class="legend"></div>
        </div>
      </div>
    </div>
    <div class="charts space" v-if="course === 'two' && index !== 0">
      <div class="chart" v-if="Object.keys(target.portfolios[index].core.conserv_percents).length > 0 && index !== 1">
        <div class="chart--title">Структура портфеля по консервативной части:</div>
        <div class="chart--container">
          <canvas :id="target.number + 'myCanvas5' + index"></canvas>
          <div :id="target.number + 'myLegend5' + index" class="legend"></div>
        </div>
      </div>
      <div class="chart" v-if="Object.keys(target.portfolios[index].core.stock_percents).length > 0 && index !== 1">
        <div class="chart--title">Структура акций по секторам экономики:</div>
        <div class="chart--container">
          <canvas :id="target.number + 'myCanvas6' + index"></canvas>
          <div :id="target.number + 'myLegend6' + index" class="legend"></div>
        </div>
      </div>
    </div>
    <div class="charts space" v-if="course === 'two' && index !== 0">
      <div class="chart" v-if="Object.keys(target.portfolios[index].core.bond_period_percents).length > 0 && index !== 1">
        <div class="chart--title">Структура облигаций по срокам:</div>
        <div class="chart--container">
          <canvas :id="target.number + 'myCanvas7' + index"></canvas>
          <div :id="target.number + 'myLegend7' + index" class="legend"></div>
        </div>
      </div>
    </div>
    <div class="analysis--title space" style="margin-bottom: 10px;" v-if="target.portfolios[index].tactic.selected">
      Тактические идеи
    </div>
    <div class="analysis--table" v-if="target.portfolios[index].tactic.selected">
      <div class="analysis--table">
        <table>
          <thead>
            <tr class="space">
              <th style="width: 7%">Тикер/ISIN</th>
              <th style="width: 6%">Цена текущая</th>
              <th style="width: 5%" v-if="index === 0 && course === 'one'">Цена покупки</th>
              <th style="width: 6%">Кол-во бумаг</th>
              <th v-if="course === 'two'" style="width: 8%">Лотность</th>
              <th style="width: 7%">Сумма</th>
              <th style="width: 7%">Валюта покупки</th>
              <th style="width: 7%">Тип инструмента</th>
              <th style="width: 8%">Класс актива</th>
              <th style="width: 8%">География</th>
              <th style="width: 8%">Сектор экономики</th>
              <th v-if="course === 'two'" style="width: 7%">Точка входа</th>
              <th v-if="course === 'two'" style="width: 7%">Точка выхода</th>
            </tr>
          </thead>
          <tbody
            class="space"
            v-for="instrument of getTactics('tactic')"
            :key="instrument.name"
          >
            <tr class="gray">
              <td>{{ instrument.name }}</td>
              <td>{{ currentNumber(instrument.price) }}</td>
              <td v-if="index === 0 && course === 'one'">{{ currentNumber(instrument.purchase_price) || '' }}</td>
              <td>{{ numberWithSpaces(instrument.number_papers) }}</td>
              <td v-if="course === 'two'">{{ instrument.lot || 1 }}</td>
              <td>
                {{
                  currentNumber((instrument.price * instrument.number_papers * ((course === 'two' && instrument.lot) ? instrument.lot : 1)).toFixed(1))
                }}
              </td>
              <td>{{ instrument['currency_' + course] }}</td>
              <td>{{ instrument['instrument_type_' + course] }}</td>
              <td>{{ instrument['class_' + course] }}</td>
              <td>{{ instrument['country_' + course] }}</td>
              <td>{{ instrument['section_' + course] }}</td>
              <td v-if="course === 'two'">{{ instrument.entryPoint }}</td>
              <td v-if="course === 'two'">{{ instrument.exitPoint }}</td>
              <td v-if="course === 'one' && index === 0 && instrument.purchase_price > 0">{{ ((instrument.price - instrument.purchase_price) / instrument.purchase_price * 100).toFixed(1) }}%</td>
              <td v-if="course === 'one' && index === 0 && instrument.purchase_price == 0"></td>
            </tr>
            <tr :class="course" v-if="instrument.comment || instrument.commentInstrument">
              <td colspan="2">Комментарий эксперта:</td>
              <td
                colspan="8"
                class="commentLinks"
                v-html="parseLinks(instrument.comment + (instrument.commentInstrument ? (!instrument.comment.trim() ? '' : '\n\n') + instrument.commentInstrument : ''))"
              ></td>
            </tr>
            <hr style="height: 1px;" v-else />
          </tbody>
        </table>
      </div>
      <div class="description" v-if="course === 'one' && index === 0">
        Указанная доходность не учитывает дивиденды и купоны по инструменту, а
        только разницу цены покупки и продажи.
      </div>
    </div>
    <div class="comment" v-if="(course === 'two' && target.portfolios[index].comments.tactic && target.portfolios[index].comments.tactic !== '<div></div>')">
      <div class="comment--title">Обзор тактических идей</div>
      <div class="comment--container" style="white-space: pre-line; word-break: break-word;" v-html="parseLinks(target.portfolios[index].comments.tactic)"></div>
    </div>
    <div class="comment" v-if="(course === 'one' || index !== 1) && (target.portfolios[index].comments.common !== '<div></div>' && target.portfolios[index].comments.common)">
      <div class="comment--title">Комментарий эксперта</div>
      <div class="comment--container" style="white-space: pre-line; word-break: break-word;" v-html="parseLinks(target.portfolios[index].comments.common)"></div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { Instrument } from "@/interfaces/dto/instrument";
import { dynamicsObject, valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";
import { COURSES_TYPE } from "@/store/commonDatas";

export default defineComponent({
  name: "CommonQuestionnaireTemplatePortfolio",
  props: {
    target: {
      type: Object as PropType<dynamicsObject>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true
    }
  },
  data() {
    return {
      coreTypes: COURSES_TYPE
    }
  },
  methods: {
    parseLinks(text: string) {
      return `<div>${text.replace(/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g,'<a style="color: rgb(0, 89, 255);" href="$1">$1</a>').replace(/([*].+?[*])/g, '<strong>$1</strong>').replace(/\*/g, '')}</pre>`;
    },
    currentNumber(number: number | string) {
      number = Number(number);
      if (this.course === COURSES_ENUM.ONE) return number;
      return this.numberWithSpaces(number.toFixed(0));
    },
    numberWithSpaces(x: string) {
      if (this.course === COURSES_ENUM.ONE) return x;
      if (!x) return x;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    getTactics(type: string) {
      return this.target.portfolios[this.index][type].instruments;
    },
    sortInstrumentsSection(instruments: Array<Instrument.Dto>) {
      return instruments.sort((a, b) => {
        if (a.section_two > b.section_two) return 1;
        if (a.section_two < b.section_two) return -1;
        return 0;
      });
    },
    sortInstruments(type: string, instruments: Array<Instrument.Dto>) {
      if (type === 'stock') {
        return [
          ...this.sortInstrumentsSection(instruments.filter(i => i.instrument_type_two === 'Акции')),
          ...this.sortInstrumentsSection(instruments.filter(i => i.instrument_type_two !== 'Акции')),
        ];
      }
      if (type === 'bond') {
        const sorting = ['Вклады', 'Валютные счета', 'Деньги', 'Надёжные облигации', 'Облигации', 'ВДО', 'ETF и БПИФ на облигации'];
        let array: Array<Instrument.Dto> = [];
        for (const sort of sorting) {
          for (const instrument of instruments) {
            if (instrument.instrument_type_two === sort) array = [...array, instrument];
          }
        }
        for (const instrument of instruments) {
          if (!array.find(e => e.name === instrument.name)) array = [...array, instrument];
        }
        return array;
      }
      return instruments;
    },
    getCurrentInstruments(type: string) {
      if (this.course === COURSES_ENUM.TWO) {
        return this.sortInstruments(type, this.target.portfolios[this.index].core.instruments.filter((i: dynamicsObject) => i[`class_${this.course}_id`] === type));
      }
      return this.target.portfolios[this.index].core.instruments.filter((i: dynamicsObject) => i[`class_${this.course}_id`] === type);
    },
    getCurrentComment(type: string) {
      return this.target.portfolios[this.index].comments[type];
    }
  },
});
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.comment {
  padding: 20px 0 10px;
  &--title {
    font-weight: 800;
    font-size: 24px;
    line-height: 24px;
  }
  &--container {
    margin-top: 10px;
    font-size: 13px;
    line-height: 16px;
    pre {
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
.analysis {
  margin: 25px 42px 0 42px;
  padding: 15px;
  background: #FFFFFF;
  border: 2px dashed #FCC033;
  border-radius: 15px;
  color: #000;
  &.purple {
    border-color: #941E76;
  }
  &.blue {
    border-color: #5C6BC0;
  }
  &.green {
    border-color: #33AB5C;
  }
  &.orange {
    border-color: #F78B23;
  }
  &--title {
    font-weight: 800;
    font-size: 24px;
    line-height: 24px;
  }
  &--container {
    margin-top: 20px;
    .element {
      margin-bottom: 10px;
      position: relative;
      > div {
        display: table-cell;
        &:first-child {
          font-weight: 700;
          margin-right: 60px;
          padding: 0 30px 0 0;
          vertical-align: top;
          width: 200px;
          font-size: 12px;
        }
        &:last-child {
          font-size: 12px;
          font-weight: 400;
        }
      }
    }
  }
}

canvas {
  width: 125px;
  height: 125px;
}

.chartLegend {
  display: flex !important;
  align-items: center;
}

.analysis .expert-comment {
  font-weight: 800;
  font-size: 12px;
}

.analysis--title.cc {
  font-size: 14px;
  margin: 20px 0 10px 0;
}

.analysis--comment {
  font-size: 12px;
}

.analysis--table .title {
  font-size: 12px;
  font-weight: 700;
}

.analysis--table .types {
  .type {
    margin-top: 15px;
    &--name {
      font-size: 12px;
      font-weight: 700;
    }
  }
}

.analysis--table table {
  margin: 5px 0 0;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  &.large {
    tr {
      th, td {
        font-size: 9px !important;
        line-height: 9px !important;
        padding: 1px 2px !important;
      }
    }
  }
}

.analysis--table table tr th {
  text-align: left;
  padding: 2px 3px;
  font-weight: 600;
}

.analysis--table table tr th, .analysis--table table tr td {
  border: none;
  font-size: 10px;
  color: #000;
  line-height: 11px;
}

.analysis--table table tr td {
  vertical-align: top;
  padding: 4px;
  white-space: pre-wrap;
}

.analysis--table table tbody tr:first-child td {
  background: rgba(0, 0, 0, 0.1);
}

.analysis--table table tbody tr:nth-child(2) {
  font-style: italic;
  &.two {
    font-style: normal;
  }
}

.analysis--table .description {
  font-style: italic;
  font-size: 10px;
}

.charts {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}

.charts .chart {
  width: 49%;
  vertical-align: top;
  margin-top: 10px;
}

.charts .chart--title {
  font-weight: bold;
  font-size: 12px;
  height: 30px;
  vertical-align: top;
}

.charts .chart--container {
  width: 100%;
  // margin-top: 10px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

.charts .chart .legend {
  margin-top: 15px;
  font-size: 11px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>