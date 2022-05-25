<template>
  <div class="diversification">
    <div class="diversification--title flex items-center justify-between" :class="portfolioId">
      <span>Диверсификация портфеля на {{ portfolioId === 'existingPortfolio' ? 'стартовую' : 'полную' }} сумму</span>
    </div>
    <div class="diversification--container flex">
      <table v-if="portfolioId !== 'expertPortfolio'">
        <thead>
          <tr>
            <th colspan="2">Баланс ядро/тактика</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Доля ядра</td>
            <td>{{ percentBalance["0"] || defaults.first }}</td>
          </tr>
          <tr>
            <td>Доля тактики</td>
            <td>{{ percentBalance["1"] || defaults.first }}</td>
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
            <td>{{ percentTypes["0"] || defaults.second }}</td>
          </tr>
          <tr>
            <td>Доля облигаций</td>
            <td>{{ percentTypes["1"] || defaults.second }}</td>
          </tr>
          <tr>
            <td>Доля защитного класса</td>
            <td>{{ percentTypes["2"] || defaults.second }}</td>
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
          <tr v-for="(currency, key) in percentCurrencies" :key="key">
            <td>{{ key }}</td>
            <td>{{ currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { mapGetters } from "vuex";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import {
  getCorrectPercentBalance,
  getCorrectPercentCurrencies,
} from "../../../../../../table/modules/container/calculation";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "PortfolioDiversification",
  props: {
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    target: {
      type: Object,
      required: true,
    },
    portfolioId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      defaults: {
        first: "Процент считается по сумме всех инструментов",
        second: "Процент считается по сумме всех инструментов ядра портфеля",
      },
    };
  },
  methods: {
    setPercents(percents: dynamicsObject) {
      this.portfolio.sections[0].modules[0].data.core = percents["0"]
        ? percents["0"].replace("%", "")
        : NaN;
      this.portfolio.sections[0].modules[0].data.tactic = percents["1"]
        ? percents["1"].replace("%", "")
        : NaN;
    },
  },
  computed: {
    ...mapGetters(["mixedAssets"]),
    percentBalance() {
      const coreArray = this.portfolio.sections[1].modules
        .map((m) => m.data)
        .filter((m) => m.price);
      const tacticArray = this.portfolio.sections[2].modules
        .map((m) => m.data)
        .filter((m) => m.price);
      const percents = getCorrectPercentBalance(
        this.target.main.data.currency_id,
        this.course,
        this.mixedAssets,
        coreArray,
        tacticArray
      );
      this.setPercents(percents);
      return percents;
    },
    percentTypes() {
      const coreArray = this.portfolio.sections[1].modules
        .map((m) => m.data)
        .filter((m) => m.price);
      return getCorrectPercentBalance(
        this.target.main.data.currency_id,
        this.course,
        this.mixedAssets,
        coreArray.filter((i) => i[`class_${this.course}_id`] === "stock"),
        coreArray.filter((i) => i[`class_${this.course}_id`] === "bond"),
        coreArray.filter((i) => i[`class_${this.course}_id`] === "alternative")
      );
    },
    percentCurrencies() {
      const coreArray = this.portfolio.sections[1].modules;
      const tacticArray = this.portfolio.sections[2].modules;
      const array = coreArray
        .concat(tacticArray)
        .map((m) => m.data)
        .filter((m) => m.price);
      return getCorrectPercentCurrencies(
        this.target.main.data.currency_id,
        array,
        this.course
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.diversification {
  margin-top: 20px;
  &--title {
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
          &:last-child {
            font-size: 13px;
          }
        }
        td,
        th {
          background-color: #fff;
          vertical-align: middle;
          padding: 10px 15px;
          border: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
