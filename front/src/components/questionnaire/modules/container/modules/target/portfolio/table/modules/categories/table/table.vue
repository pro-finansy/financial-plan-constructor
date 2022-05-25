<template>
  <table :data-id="type ? type.id : 'tactic'">
    <thead>
      <tr class="title" v-if="type">
        <th :colspan="type.id === 'bond' && (portfolioId !== 'expertPortfolio') ? 14 : ((portfolioId !== 'expertPortfolio') ? 15 : ((type.id === 'bond') ? (course === 'one' ? 12 : 13) : (course === 'one' ? 13 : 14)))">
          <div>
            <div class="name">
              <span :class="portfolioId">{{ type[course + '_name'] }}</span>
              <svg @click="hiddens[type?.id || 'stock'] = !hiddens[type?.id || 'stock']" :class="{ hiddenArrow: hiddens[type.id] }" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-1c9f44a7=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-1c9f44a7=""></path></svg>
            </div>
            <button v-if="portfolioId === 'studentPortfolio' && type.id !== 'mixed'" class="btn" @click="toComment">К комментарию</button>
            <button v-if="portfolioId !== 'studentPortfolio' && type.id === 'stock'" class="btn" :class="portfolioId" @click="toComment">К комментарию</button>
          </div>
        </th>
      </tr>
      <tr>
        <th style="width: 7%">#</th>
        <th style="width: 8%">Тикер</th>
        <th v-if="course === 'two'" style="width: 8%">Валюта покупки</th>
        <th style="width: 8%">Валюта диверс.</th>
        <th v-if="(type && type.id !== 'bond') || course === 'one'" style="width: 8%">Класс</th>
        <th v-if="type && type.id === 'bond' && course === 'two'" style="width: 8%">Срок погашения</th>
        <th style="width: 8%">Тип</th>
        <th style="width: 8%">Страна</th>
        <th v-if="type && type.id !== 'bond'" style="width: 8%">Сектор эконом.</th>
        <th style="width: 8%">Цена за 1 шт</th>
        <th style="width: 8%">Кол-во</th>
        <th style="width: 8%">% от {{ portfolioId !== 'expertPortfolio' ? 'общей суммы' : 'ядра' }} портфеля</th>
        <th style="width: 8%">Сумма на актив</th>
        <th v-if="portfolioId !== 'expertPortfolio' && type" style="width: 8%">Дубл. в портфель эксперта</th>
        <th style="width: 8%">Коммент. эксперта</th>
        <th style="width: 8%"></th>
      </tr>
    </thead>
    <transition name="fade">
      <tbody v-if="(type && !hiddens[type.id]) || !type">
        <tr 
          v-for="(instrument, index) of instrumentArray" :key="instrument.name"
          class="instrument"
          :data-name="instrument.name"
          :class="{error: (instrument.percent || correctPercent(instrument)) == 0 && instrument.number_papers === 0 && portfolioId !== 'existingPortfolio'}"
        >
          <td>
            <div>{{ index + 1 }}</div>
          </td>
          <td style="word-break: break-word;" :class="{notStudent: instrument.notStudent && portfolioId === 'existingPortfolio'}">
            <div>{{ instrument.name }}</div>
          </td>
          <td v-if="course === 'two'">
            <div>{{ instrument[`currency_${course}`] }}</div>
          </td>
          <td>
            <div>{{ instrument[`base_currency_${course}`] }}</div>
          </td>
          <td v-if="(type && type.id !== 'bond') || course === 'one'">
            <div>{{ instrument[`class_${course}`] }}</div>
          </td>
          <td v-if="type && type.id === 'bond' && course === 'two'">
            <div>{{ getCurrentMatDate(instrument.matdate) }}</div>
          </td>
          <td>
            <div>{{ instrument[`instrument_type_${course}`] }}</div>
          </td>
          <td>
            <div>{{ instrument[`country_${course}`] }}</div>
          </td>
          <td v-if="type && type.id !== 'bond'">
            <div>{{ instrument[`section_${course}`] }}</div>
          </td>
          <td>
            <div>{{ numberSpaces(instrument.price) }}</div>
          </td>
          <td>
            <div>{{ numberSpaces(instrument.number_papers) }}</div>
          </td>
          <td>
            <div>{{ instrument.percent || correctPercent(instrument) }}</div>
          </td>
          <td>
            <div>
              {{ numberSpaces(currentAmount(instrument)) }}
              {{ currectSignCurrency(instrument[`currency_${course}_id`]) }}
            </div>
          </td>
          <td v-if="portfolioId !== 'expertPortfolio' && type">
            <input v-if="status" type="checkbox" @change="dublicateInstrument('expert', instrument)" v-model="instrument.dublicateExpert">
          </td>
          <td v-if="status" class="comment" @click="modal('instrument-comment', {...instrument, type: type?.id, portfolioId, targetId: targetId })">
            <div>{{ instrument.comment }}</div>
          </td>
          <td v-else>
            <div>{{ instrument.comment }}</div>
          </td>
          <td class="actions" v-if="status">
            <div @click="modal('questionnaire_instrument-edit', {...instrument, role: 'EXPERT', type: type?.id, portfolioId, totalInstruments: totalInstruments, targetCurrencyId: targetCurrencyId, targetTotal: totalPortfolio, targetId: targetId, course: course })">
              <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.1476 9.00019C14.7838 9.00019 14.489 9.288 14.489 9.64305V16.0716C14.489 16.4266 14.1941 16.7144 13.8304 16.7144H1.97577C1.61203 16.7144 1.31717 16.4266 1.31717 16.0716V3.21451C1.31717 2.85946 1.61203 2.57164 1.97577 2.57164H9.87885C10.2426 2.57164 10.5375 2.28383 10.5375 1.92878C10.5375 1.57373 10.2426 1.28595 9.87885 1.28595H1.97577C0.884582 1.28595 0 2.14939 0 3.21451V16.0716C0 17.1367 0.884582 18.0001 1.97577 18.0001H13.8304C14.9216 18.0001 15.8062 17.1367 15.8062 16.0716V9.64302C15.8062 9.288 15.5113 9.00019 15.1476 9.00019Z" fill="#858995"/>
                <path d="M17.7018 0.720883C17.2289 0.259235 16.5875 -6.51637e-05 15.9187 1.01705e-05C15.2496 -0.00187318 14.6075 0.257879 14.1359 0.721298L5.46099 9.18826C5.38902 9.25904 5.33472 9.34507 5.30227 9.43961L3.98511 13.2967C3.87015 13.6336 4.05673 13.9976 4.40183 14.1098C4.46878 14.1315 4.5389 14.1427 4.60944 14.1427C4.68014 14.1426 4.75041 14.1315 4.81755 14.11L8.76908 12.8243C8.86613 12.7926 8.95431 12.7394 9.02659 12.6687L17.7015 4.20106C18.6861 3.2401 18.6862 1.68196 17.7018 0.720883ZM16.7703 3.29268L8.20861 11.6498L5.65065 12.4835L6.5022 9.98989L15.0671 1.63284C15.538 1.17413 16.3007 1.17488 16.7707 1.6345C16.9951 1.85406 17.1216 2.15129 17.1226 2.46148C17.1234 2.77333 16.9966 3.07255 16.7703 3.29268Z" fill="#858995"/>
              </svg>
            </div>
            <div @click="modal('questionnaire_instrument-remove', {...instrument, type: type?.id, portfolioId, targetId: targetId })">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0461 2.24998H10.8767V1.68749C10.8767 0.757014 10.1011 0 9.14788 0H6.84282C5.88957 0 5.11403 0.757014 5.11403 1.68749V2.24998H1.94457C1.15019 2.24998 0.503906 2.88082 0.503906 3.65622V5.62496C0.503906 5.9356 0.761929 6.18746 1.08017 6.18746H1.3951L1.89296 16.3926C1.93693 17.2939 2.69544 17.9999 3.61977 17.9999H12.3709C13.2953 17.9999 14.0538 17.2939 14.0977 16.3926L14.5956 6.18746H14.9105C15.2288 6.18746 15.4868 5.9356 15.4868 5.62496V3.65622C15.4868 2.88082 14.8405 2.24998 14.0461 2.24998ZM6.26656 1.68749C6.26656 1.37734 6.52508 1.12499 6.84282 1.12499H9.14788C9.46562 1.12499 9.72414 1.37734 9.72414 1.68749V2.24998H6.26656V1.68749ZM1.65644 3.65622C1.65644 3.50115 1.7857 3.37498 1.94457 3.37498H14.0461C14.205 3.37498 14.3343 3.50115 14.3343 3.65622V5.06247C14.1567 5.06247 2.39236 5.06247 1.65644 5.06247V3.65622ZM12.9465 16.3391C12.9319 16.6395 12.679 16.8749 12.3709 16.8749H3.61977C3.31165 16.8749 3.05881 16.6395 3.04419 16.3391L2.54893 6.18746H13.4418L12.9465 16.3391Z" fill="#858995"/>
                <path d="M7.99619 15.7501C8.31443 15.7501 8.57245 15.4983 8.57245 15.1876V7.87521C8.57245 7.56457 8.31443 7.31271 7.99619 7.31271C7.67794 7.31271 7.41992 7.56457 7.41992 7.87521V15.1876C7.41992 15.4983 7.67791 15.7501 7.99619 15.7501Z" fill="#858995"/>
                <path d="M10.877 15.7501C11.1953 15.7501 11.4533 15.4983 11.4533 15.1876V7.87521C11.4533 7.56457 11.1953 7.31271 10.877 7.31271C10.5588 7.31271 10.3008 7.56457 10.3008 7.87521V15.1876C10.3008 15.4983 10.5588 15.7501 10.877 15.7501Z" fill="#858995"/>
                <path d="M5.11337 15.7501C5.43162 15.7501 5.68964 15.4983 5.68964 15.1876V7.87521C5.68964 7.56457 5.43162 7.31271 5.11337 7.31271C4.79513 7.31271 4.53711 7.56457 4.53711 7.87521V15.1876C4.53711 15.4983 4.7951 15.7501 5.11337 15.7501Z" fill="#858995"/>
              </svg>
            </div>
          </td>
          <td class="actions disabled" v-else></td>
        </tr>
        <tr v-if="status">
          <td class="adding" @click="modal('questionnaire_instrument-create', { role: 'EXPERT', type: type?.id, portfolioId, totalInstruments: totalInstruments, targetCurrencyId: targetCurrencyId, targetTotal: totalPortfolio, targetId: targetId, course: course })">Добавить</td>
          <td></td>
          <td></td>
          <td v-if="course === 'two'"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td v-if="type && type.id !== 'bond'"></td>
          <td></td>
          <td></td>
          <td v-if="portfolioId !== 'expertPortfolio' && type">
            <input v-if="status" type="checkbox" @change="dublicateAllInstrument()" v-model="onDublicateAllInstrument">
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr class="total" v-if="type">
          <td :class="portfolioId" :colspan="(type.id === 'bond' ? (portfolioId === 'expertPortfolio' ? (course === 'one' ? 8:9) : 10) : (portfolioId === 'expertPortfolio' ? (course === 'one' ? 9:10) : 11))">{{ type[course + '_total'] }}</td>
          <td :class="portfolioId" colspan="4">{{ currentText }}</td>
        </tr>
      </tbody>
    </transition>
  </table>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { defineComponent, PropType, inject } from 'vue-demi';
import { currectSignCurrency, getCorrectInstrumentsCurrency, numberSpaces, getCurrency } from '@/components/questionnaire/modules/container/table/modules/container/calculation';
import { Instrument } from '@/interfaces/dto/instrument';
import { dynamicsObject, valueof } from '@/interfaces';
import { COURSES_ENUM } from '@/utils/enums';
import { Type } from '../../../../interfaces';

export default defineComponent({
  name: "TableElement",
  props: {
    instrumentArray: {
      type: Array as PropType<Array<Instrument.Dto>>,
      required: true,
    },
    type: {
      type: Object as PropType<Type>,
    },
    portfolioId: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
  },
  setup() {
    const targetCurrencyId = inject('targetCurrencyId');
    const targetId = inject('targetId');
    const targetCurrencySign = inject('targetCurrencySign');
    const status = inject('status');
    const total: string = inject('total') || '';
    const totalInstruments = inject('totalInstruments');
    const targetTotal = inject('targetTotal');
    const studentTotal = inject('studentTotal');
    const expertTotal = inject('expertTotal');
    return {
      targetCurrencyId, targetId, targetCurrencySign, status, total, totalInstruments, targetTotal, studentTotal, expertTotal
    }
  },
  data() {
    return {
      lengths: [
        { id: 'one', type: true, number: 25 },
        { id: 'one', type: false, number: 10 },
        { id: 'two', type: true, number: 58 },
        { id: 'two', type: false, number: 5 },
      ],
      hiddens: {
        stock: false,
        bond: false,
        alternative: false,
        mixed: false,
      },
      onDublicateAllInstrument: !!(this.instrumentArray.filter(i => !i.dublicateExpert).length === 0)
    }
  },
  mounted() {
    this.jq('.instrument').toArray().forEach(i => {
      const element = this.jq(i);
      const name = String(element.attr('data-name'));
      const variables = [`currency_${this.course}`, `base_currency_${this.course}`, `class_${this.course}`, `instrument_type_${this.course}`, `country_${this.course}`, `section_${this.course}`];
      
      const instrument = this.instrumentArray.find(i => i.name.trim().toLowerCase() === name.trim().toLowerCase());
      const cinstrument = this.instruments.find((i: dynamicsObject) => i.name.trim().toLowerCase() === name.trim().toLowerCase());
      for (const [index, variable] of variables.entries()) {
        if (cinstrument && instrument && variable.includes('currency_') && !!(cinstrument && (cinstrument[variable] !== instrument[variable] || cinstrument[variable + '_id'] !== instrument[variable + '_id']))) {
          if (cinstrument[variable] !== instrument[variable]) element.children()[2 + index].className = 'divergences';
          if (cinstrument[variable + '_id'] !== instrument[variable + '_id']) element.children()[2 + index].className = 'error';
        }
        if (cinstrument && instrument && !!(cinstrument && cinstrument[variable] !== instrument[variable])) {
          element.children()[2 + index].className = 'divergences';
        }
      }
    });
  },
  computed: {
    ...mapGetters(['instruments']),
    totalPortfolio() {
      return this.portfolioId === 'expertPortfolio' ? this.targetTotal : this.studentTotal;
    },
    totalType() {
      return getCorrectInstrumentsCurrency(this.instrumentArray, String(this.targetCurrencyId), this.course);
    },
    currentText() {
      return `
        ${ this.totalType } 
        ${ this.targetCurrencySign || '' }
        (${Number(((Number(this.totalType.replace(/ /g, '')) / Number(this.total.replace(/ /g, ''))) * 100).toFixed(1)) || 0} %)
      `;
    },
  },
  methods: {
    currectSignCurrency,
    getCurrentMatDate(matdate: string) {
      if (!matdate) return 'Не указан';
      const date = new Date(matdate);
      if (isNaN(date.getMonth())) return 'Некорректно';
      const correctDate = new Date();
      correctDate.setDate(correctDate.getDate() + 1460);
      return correctDate <= date ? 'Долгосрочная' : 'Краткосрочная';
    },
    toComment() {
      const comments = this.jq('.comments').offset() || { top: 120 };
      this.jq('html, body').animate({ scrollTop: comments.top - 120 }, 400);
    },
    async dublicateAllInstrument() {
      for (const instrument of this.instrumentArray) {
        instrument.dublicateExpert = this.onDublicateAllInstrument;
        await this.dublicateInstrument('expert', instrument, true);
      }
      this.onDublicateAllInstrument = !!(this.instrumentArray.filter(i => !i.dublicateExpert).length === 0);
    },
    async dublicateInstrument(portfolioId: string, instrument: Instrument.Dto, all = false) {
      const price = getCurrency(instrument, String(this.targetCurrencyId), this.course);
      const percent = Number(((price / Number(this.expertTotal)) * 100).toFixed(2));
      await this.$store.commit('dublicateTableInstrument', { instrument, percent, targetId: this.targetId, type: this.type, portfolioId, from: this.portfolioId, all });
      if (!all) {
        this.onDublicateAllInstrument = !!(this.instrumentArray.filter(i => !i.dublicateExpert).length === 0);
      }
    },
    correctLength(type: any) {
      const length = this.lengths.find(l => l.id === this.course && l.type === !!type);
      if (!length) return 30;
      return length.number;
    },
    currentAmount(instrument: Instrument.Dto) {
      const lot = (this.course === COURSES_ENUM.TWO && instrument.lot) ? instrument.lot : 1;
      return instrument.price * lot * instrument.number_papers;
    },
    correctPercent(instrument: Instrument.Dto) {
      const price = getCurrency(instrument, String(this.targetCurrencyId), this.course);
      if (!price) return price;
      const percent = ((price / Number(this.total.replace(/ /g, ''))) * 100).toFixed(1);
      instrument.percent = Number(percent);
      return percent;
    },
    modal(id: string, data: dynamicsObject | null) {
      this.$store.commit('createModal', { id, data })
    },
    numberSpaces
  },
});
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  text-align: center;
  table-layout: fixed;
  thead {
    tr {
      th {
        background-color: #fff;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        text-transform: uppercase;
      }
    }
    .title {
      th {
        text-align: left;
        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .name {
            span {
              font-weight: bold;
              font-size: 16px;
              line-height: 19px;
              text-transform: none;
              &.studentPortfolio {
                color: #74b2e6;
              }
              &.existingPortfolio {
                color: #71be67;
              }
              &.expertPortfolio {
                color: #ec8b51;
              }
            }
            svg {
              width: 12px;
              height: 12px;
              margin-left: 10px;
              transition: 0.3s all;
              cursor: pointer;
              &.hiddenArrow {
                transition: 0.3s all;
                transform: rotate(180deg);
              }
            }
          }
          button {
            padding: 10px 20px;
            border-radius: 7px;
            font-size: 12px;
            background-color: #74b2e6;
            &.existingPortfolio {
              background-color: #71be67;
            }
            &.expertPortfolio {
              background-color: #ec8b51;
            }
          }
        }
      }
    }
  }
  tbody {
    tr {
      &:nth-child(2n - 1) {
        td {
          background-color: rgb(250, 250, 250);
        }
      }
      td {
        background-color: #fff;
        font-size: 12px;
        line-height: 12px;
        div {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &.adding {
          cursor: pointer;
          color: #858995;
          &.disabled {
            cursor: not-allowed;
          }
        }
        &.notStudent {
          background-color: #e0ffdc;
        }
        &.error {
          background-color: #ffecec;
        }
        &.divergences {
          background-color: #fffcbe;
        }
        &.actions {
          div {
            cursor: pointer;
            width: 50%;
            display: inline-block;
            
          }
          &.disabled {
            div {
              cursor: not-allowed;
            }
          }
        }
        &.comment {
          cursor: pointer;
          background-color: #f8fbff;
        }
      }
      &.total {
        td {
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: none;
          &:first-child {
            border-left: none;
            text-align: right;
          }
          &.studentPortfolio {
            color: #74b2e6;
          }
          &.existingPortfolio {
            color: #71be67;
          }
          &.expertPortfolio {
            color: #ec8b51;
          }
        }
      }
      &.error {
        td {
          background-color: #ffecec;
        }
      }
    }
  }
  tr {
    td,
    th {
      border: 1px solid #efefef;
      padding: 8px 10px;
      vertical-align: middle;
    }
  }
}
</style>