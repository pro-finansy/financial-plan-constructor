<template>
  <table>
    <thead>
      <tr class="title" v-if="type">
        <th colspan="9">{{ type[course + '_name'] }}</th>
      </tr>
      <tr>
        <th style="width: 10%">Наименование</th>
        <th style="width: 10%">Тикер/ISIN</th>
        <th style="width: 10%">Страна</th>
        <th style="width: 10%">Цена за 1 шт</th>
        <th style="width: 14%">% от общей суммы портфеля</th>
        <th style="width: 14%">Сумма на инструмент</th>
        <th style="width: 12%">Количество</th>
        <th v-if="portfolioId === 'existingPortfolio'" style="width: 10%">Дублировать в основной портфель</th>
        <th style="width: 8%"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="instrument of instruments" :key="instrument.name" :class="{error: (instrument.percent || correctPercent(instrument)) === 0}">
        <td>{{ instrument.title }}</td>
        <td>{{ instrument.name }}</td>
        <td>{{ instrument[`country_${course}`] }}</td>
        <td>{{ numberSpaces(instrument.price) }}</td>
        <td>{{ instrument.percent || correctPercent(instrument) }}</td>
        <td>
          {{
            numberSpaces(currentAmount(instrument))
          }}
          {{ currectSignCurrency(instrument[`currency_${course}_id`]) }}
        </td>
        <td>{{ numberSpaces(instrument.number_papers) }}</td>
        <td v-if="portfolioId === 'existingPortfolio'">
          <input v-if="status" type="checkbox" @change="dublicateInstrument(instrument)" v-model="instrument.dublicateStudent">
        </td>
        <td class="actions" v-if="status">
          <div @click="modal('questionnaire_instrument-edit', {...instrument, role: user.role, type: type?.id, portfolioId, totalInstruments: totalInstruments, targetCurrencyId: targetCurrencyId, targetTotal: targetTotal, targetId: targetId, course: course })">
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
      <tr v-if="length < correctLength(type) && status">
        <td class="adding" @click="modal('questionnaire_instrument-create', { role: user.role, type: type?.id, portfolioId, totalInstruments: totalInstruments, targetCurrencyId: targetCurrencyId, targetTotal: targetTotal, targetId: targetId, course: course })">Добавить</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td v-if="portfolioId === 'existingPortfolio'" ></td>
        <td></td>
      </tr>
      <tr class="total" v-if="type">
        <td colspan="4">{{ type[course + '_total'] }}</td>
        <td>{{ currentText }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType, inject } from 'vue-demi';
import { mapGetters } from 'vuex';
import { currectSignCurrency, getCorrectInstrumentsCurrency, numberSpaces, getCurrency } from '../../../calculation';
import { Instrument } from '@/interfaces/dto/instrument';
import { dynamicsObject, valueof } from '@/interfaces';
import { COURSES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: "TableElement",
  props: {
    instruments: {
      type: Array as PropType<Array<Instrument.Dto>>,
      required: true,
    },
    type: {
      type: Object,
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
      type: String as PropType<valueof<COURSES_ENUM>>,
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
    return {
      targetCurrencyId, targetId, targetCurrencySign, status, total, totalInstruments, targetTotal
    }
  },
  data() {
    return {
      lengths: [
        { id: 'one', type: true, number: 25 },
        { id: 'one', type: false, number: 10 },
        { id: 'two', type: true, number: 58 },
        { id: 'two', type: false, number: 5 },
      ]
    }
  },
  computed: {
    ...mapGetters(['user']),
    totalType() {
      return getCorrectInstrumentsCurrency(this.instruments, String(this.targetCurrencyId), this.course).replace(/ /g, '');
    },
    currentText() {
      return `
        ${ this.totalType } 
        ${ this.targetCurrencySign || '' }
        (${Math.ceil10(((Number(this.totalType) / Number(this.total.replace(/ /g, ''))) * 100), -1) || 0} %)
      `;
    }
  },
  methods: {
    currectSignCurrency,
    dublicateInstrument(instrument: Instrument.Dto) {
      const price = getCurrency(instrument, String(this.targetCurrencyId), this.course);
      const percent = Math.ceil10((price / Number(this.targetTotal)) * 100, -2);
      this.$store.commit('dublicateStudentInstrument', { instrument, percent, targetId: this.targetId, type: this.type });
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
      return Math.ceil10((price / Number(this.total.replace(/ /g, ''))) * 100, -1);
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
  thead {
    tr {
      th {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        text-transform: uppercase;
      }
    }
    .title {
      th {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        color: #349c5d;
        text-align: left;
        text-transform: none;
      }
    }
  }
  tbody {
    tr {
      &.error {
        background-color: #ffecec;
      }
      td {
        font-size: 12px;
        line-height: 14px;
        &.adding {
          cursor: pointer;
          color: #858995;
          &.disabled {
            cursor: not-allowed;
          }
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
      }
      &.total {
        td {
          color: #349c5d;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: none;
          &:first-child {
            border-left: none;
            text-align: right;
          }
        }
      }
    }
  }
  tr {
    td,
    th {
      border: 1px solid #efefef;
      padding: 10px 20px;
      vertical-align: middle;
    }
  }
}
</style>