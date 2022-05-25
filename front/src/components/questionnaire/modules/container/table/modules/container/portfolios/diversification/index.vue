<template>
  <div class="diversification">
    <div class="diversification--title flex items-center justify-between">
      <span>Диверсификация портфеля на {{ portfolio.id === 'existingPortfolio' ? 'стартовую' : 'полную' }} сумму</span>
    </div>
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
            <td>{{ percentBalance['0'] || defaults.first }}</td>
          </tr>
          <tr>
            <td>Доля тактики</td>
            <td>{{ percentBalance['1'] || defaults.first }}</td>
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
            <td>Доля акций</td>
            <td>{{ percentTypes['0'] || defaults.second }}</td>
          </tr>
          <tr>
            <td>Доля облигаций</td>
            <td>{{ percentTypes['1'] || defaults.second }}</td>
          </tr>
          <tr>
            <td>Доля защитного класса</td>
            <td>{{ percentTypes['2'] || defaults.second }}</td>
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
          <tr v-for="(currency, key) in percentCurrencies" :key="currency + key">
            <td>{{ key }}</td>
            <td>{{ currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue-demi';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { getCorrectPercentBalance, getCorrectPercentCurrencies } from '../../calculation';
import { dynamicsObject } from '@/interfaces';

export default defineComponent({
  name: 'PortfolioDiversification',
  props: {
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true
    },
    course: {
      type: String,
      required: true
    }
  },
  setup() {
    const targetCurrencyId: string = inject('targetCurrencyId') || '';
    const targetCurrencySign: string = inject('targetCurrencySign') || '';
    return {
      targetCurrencySign,
      targetCurrencyId
    }
  },
  data() {
    return {
      mixedAssets: [],
      defaults: {
        first: 'Процент считается по сумме всех инструментов',
        second: 'Процент считается по сумме всех инструментов ядра портфеля'
      }
    }
  },
  created() {
    this.getMixedAssets();
  },
  methods: {
    async getMixedAssets() {
      const result = await this.API.common.getMixeds();
      this.mixedAssets = result.data;
    },
    setPercents(percents: dynamicsObject) {
      this.portfolio.sections[0].modules[0].data.core = percents['0'] ? percents['0'].replace('%', '') : NaN;
      this.portfolio.sections[0].modules[0].data.tactic = percents['1'] ? percents['1'].replace('%', '') : NaN;
    }
  },
  computed: {
    percentBalance() {
      const coreArray = this.portfolio.sections[1].modules.map(m => m.data).filter(m => m.price);
      const tacticArray = this.portfolio.sections[2].modules.map(m => m.data).filter(m => m.price);
      const percents = getCorrectPercentBalance(this.targetCurrencyId, this.course, this.mixedAssets, coreArray, tacticArray);
      this.setPercents(percents);
      return percents;
    },
    percentTypes() {
      const coreArray = this.portfolio.sections[1].modules.map(m => m.data).filter(m => m.price);
      return getCorrectPercentBalance(
        this.targetCurrencyId,
        this.course,
        this.mixedAssets,
        coreArray.filter(i => i[`class_${this.course}_id`] === 'stock'),
        coreArray.filter(i => i[`class_${this.course}_id`] === 'bond'),
        coreArray.filter(i => i[`class_${this.course}_id`] === 'alternative')
      );
    },
    percentCurrencies() {
      const coreArray = this.portfolio.sections[1].modules;
      const tacticArray = this.portfolio.sections[2].modules;
      const array = coreArray.concat(tacticArray).map(m => m.data).filter(m => m.price);
      return getCorrectPercentCurrencies(this.targetCurrencyId, array, this.course);
    }
  }
})
</script>

<style lang="scss" scoped>
.diversification {
  &--title {
    background: #349c5d;
    padding: 20px 30px;
    span {
      color: #fff;
    }
  }
  &--container {
    padding: 0 30px;
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
        }
      }
    }
  }
}
</style>