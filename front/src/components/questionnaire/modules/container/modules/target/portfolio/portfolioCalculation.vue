<template>
  <div class="calculation">
    <div class="currencies">
      <div class="currency" v-for="currency of currentCurrencies" :key="currency.id">
        <span>Сумма инструментов в {{ currency.id }}: {{ currency.value }} ({{ currency.count }} шт.)</span>
      </div>
      <div class="currency">
        <span>Остаток {{ remainder.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{ mainCurrency }}</span>
      </div>
      <div class="currency">
        <span>Итого {{ mainAmount.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{ mainCurrency }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { mapGetters } from 'vuex';
import { dynamicsObject } from '@/interfaces';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { FV, currentTerm } from '../../../table/modules/container/calculation';
import { COURSES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: 'PortfolioCalculation',
  props: {
    sections: {
      type: Array,
      required: true
    },
    targetId: {
      type: Number,
      required: true
    },
    portfolioId: {
      type: String,
    },
    course: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      mainAmount: 0,
      tacticPercent: 0,
      mainCurrency: ''
    }
  },
  computed: {
    ...mapGetters(["questionnaire", "currencies"]),
    currentPortfolio() {
      if (!this.portfolioId) return {};
      const target = this.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === this.targetId);
      if (!target) return {};
      this.setValues(target);
      const portfolio = target.portfolios[this.portfolioId];
      if (!portfolio) return {};
      return portfolio;
    },
    currentCurrencies() {
      const currencies = this.currentPortfolioCurrencies();
      const amounts = this.currentPortfolioInstruments();

      currencies.forEach(currency => {
        const filter = amounts.filter(a => a.currency === currency.id);
        currency.value = filter.reduce((acc, a) => acc + a.amount, 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        currency.count = filter.length;
      });
      this.total();
      return currencies;
    },
    remainder() {
      const amounts = this.currentPortfolioInstruments();
      const core = this.getCorrectCurrency(amounts, this.mainCurrency);
      return Math.ceil10(this.mainAmount - core, -2);
    },
  },
  methods: {
    setValues(target: any) {
      this.mainCurrency = target.main.data.currency_id;
      this.tacticPercent = target
    },
    total() {
      const target = this.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === this.targetId);
      const { inflation, profitability } = target.main.data;
      const term = target.type.sections[1].modules[0].data;
      const correctInflation = inflation / 100;
      const correctProfitability = (profitability / 100 ) || 0.10;
      const amount = target.type.sections[0].modules[0].data.amount;
      const current_term = currentTerm(term);

      let fv = Number(FV(
        amount,
        correctInflation,
        current_term
      ));
      const capital = (fv * 12) / correctProfitability;
      if (target.type.id === 2) fv = capital;

      this.mainAmount = Number(fv);
      this.mainCurrency = target.main.data.currency_id;
    },
    unique(array: Array<dynamicsObject>) {
      let result: Array<dynamicsObject> = [];
      array.forEach(e => {
        if (!result.find(r => r.id === e.id)) result = [...result, e];
      });
      return result;
    },
    getCurrentInstruments(sectionIndex: number) {
      const section: Questionnaire.QSection = this.currentPortfolio.sections[sectionIndex];
      return section && (!section.optional || (section.optional && section.selected))
        ? section.modules.map(m => m.data) 
        : [];
    },
    getInstruments() {
      const core = this.getCurrentInstruments(1);
      const tactic = this.getCurrentInstruments(2);
      return [...core, ...tactic]
        .filter(i => i[`currency_${this.course}_id`]);
    },
    currentPortfolioInstruments() {
      return this.getInstruments().map(i => {
        const lot = i.lot && this.course === COURSES_ENUM.TWO ? i.lot : 1;
        return { amount: Math.ceil10(i.number_papers * lot * i.price, -2), currency: i[`currency_${this.course}_id`] }
      });
    },
    currentPortfolioCurrencies() {
      const currencies = this.getInstruments().map(i => ({ count: 0, value: 0, id: i[`currency_${this.course}_id`] }));
      return this.unique(currencies);
    },
    getCorrectCurrency(instruments: Array<dynamicsObject>, currency: string) {
      return instruments.reduce((acc, instrument) => acc + (instrument.amount / this.currencies[instrument.currency] * this.currencies[currency]), 0);
    },
  }
})
</script>

<style lang="scss" scoped>
  .calculation {
    text-align: left;
    .currencies {
      .currency {
        margin-bottom: 5px;
        div, span {
          color: #5D6272;
        }
      }
    }
  }
</style>