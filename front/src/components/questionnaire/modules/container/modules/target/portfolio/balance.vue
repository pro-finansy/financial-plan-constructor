<template>
  <div class="diversification">
    <div class="diversification--container flex">
      <table>
        <thead>
          <tr>
            <th colspan="2">Баланс ядро/тактика</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Доля ядра</td>
            <td>{{ percentBalance['0'] || defaults.first}}</td>
          </tr>
          <tr>
            <td>Доля тактики</td>
            <td>{{ percentBalance['1'] || defaults.first}}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th colspan="2">Баланс ядра портфеля по классам активов</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Доля {{ titles.stock[course] }}</td>
            <td>{{ percentTypes['0'] || defaults.second}}</td>
          </tr>
          <tr>
            <td>Доля {{ titles.bond[course] }}</td>
            <td>{{ percentTypes['1'] || defaults.second}}</td>
          </tr>
          <tr>
            <td>Доля {{ titles.alternative[course] }}</td>
            <td>{{ percentTypes['2'] || defaults.second}}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th colspan="2">Баланс по валюте</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(currency, key) in percentCurrencies" :key="currency">
            <td>{{ key }}</td>
            <td>{{ currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import { mapGetters } from 'vuex';
import { dynamicsObject, valueof } from '@/interfaces';
import { getCorrectPercentBalance, getCorrectPercentCurrencies } from '../../../table/modules/container/calculation';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { COURSES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: 'PortfolioBalance',
  props: {
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true
    },
    targetCurrencyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      titles: {
        stock: {
          one: 'акций',
          two: 'рисковой части'
        },
        bond: {
          one: 'облигаций',
          two: 'консервативной части'
        },
        alternative: {
          one: 'защитного класса',
          two: 'защитной части'
        }
      },
      defaults: {
        first: 'Процент считается по сумме всех инструментов',
        second: 'Процент считается по сумме всех инструментов ядра портфеля'
      }
    }
  },
  computed: {
    ...mapGetters(['mixedAssets']),
    percentBalance() {
      const percents = {
        0: this.portfolio.sections[0].modules[0].data.core,
        1: this.portfolio.sections[0].modules[0].data.tactic
      }
      return percents;
    },
    percentTypes() {
      const coreArray = this.portfolio.sections[1].modules.map(m => m.data).filter(m => m.price);
      return getCorrectPercentBalance(
        this.targetCurrencyId,
        this.course,
        this.mixedAssets,
        coreArray.filter((i: dynamicsObject) => i[`class_${this.course}_id`] === 'stock'),
        coreArray.filter((i: dynamicsObject) => i[`class_${this.course}_id`] === 'bond'),
        coreArray.filter((i: dynamicsObject) => i[`class_${this.course}_id`] === 'alternative')
      );
    },
    percentCurrencies() {
      const coreArray = this.portfolio.sections[1].modules;
      const tacticArray = this.portfolio.id === "expertPortfolio" ? [] : this.portfolio.sections[2].modules;
      const array = coreArray.concat(tacticArray).map(m => m.data).filter(m => m.price);
      return getCorrectPercentCurrencies(this.targetCurrencyId, array, this.course);
    }
  }
})
</script>

<style lang="scss" scoped>
.diversification {
  &--container {
    align-items: flex-start;
    table {
      width: 33.3333%;
      min-width: 33.3333%;
      vertical-align: top;
      tr {
        th {
          font-weight: 500;
          font-size: 16px;
          line-height: 19px;
          text-align: center;
        }
        td {
          width: 50%;
          padding: 10px 15px;
          font-size: 12px;
          line-height: 14px;
          &:first-child {
            font-weight: 500;
            text-transform: uppercase;
          }
        }
        td, th {
          vertical-align: middle;
          padding: 10px 15px;
          border: 1px solid #EFEFEF;
          background: #fff;
        }
      }
    }
  }
}
</style>