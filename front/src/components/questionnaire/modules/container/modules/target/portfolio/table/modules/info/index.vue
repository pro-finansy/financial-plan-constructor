<template>
  <div class="distribution">
    <div class="distribution--title flex items-center justify-between" :class="portfolioId">
      <span>Распределение на ядро и тактику</span>
    </div>
    <div class="distribution--container flex">
      <div class="type" v-if="portfolioId === 'expert'">
        <div class="type--title">Ядро</div>
        <div class="type--container">
          <input type="number" placeholder="00" v-model="portfolio.sections[0].modules[0].data.core" @keyup="input('core')">
        </div>
      </div>
      <div class="type" v-if="portfolioId === 'expert'">
        <div class="type--title">Тактика</div>
        <div class="type--container">
          <input type="number" placeholder="00" v-model="portfolio.sections[0].modules[0].data.tactic" @keyup="input('tactic')">
        </div>
      </div>
      <div class="error" v-if="!portfolio.sections[0].modules[0].data.core && portfolioId === 'expert'">
        <div>Введите проценты ядра и тактики</div>
      </div>
      <div class="additional">
        <div>
          <div>Риск-профиль</div>
          <div>{{ risk }}</div>
        </div>
        <div>
          <div>Срок инв-ия</div>
          <div>{{ term }}</div>
        </div>
        <div>
          <div v-if="portfolioId === 'student'">Сумма FV студента</div>
          <div v-if="portfolioId === 'existing'">Сумма портфеля</div>
          <div v-if="portfolioId === 'expert'">Сумма FV</div>
          <div>{{ numberSpaces(total) }} {{ currency }}</div>
        </div>
      </div>
      <div class="additional" v-if="portfolio.sections[0].modules[0].data.core">
        <div>
          <div>Сумма ядра ({{ portfolio.sections[0].modules[0].data.core }}%)</div>
          <div>{{ numberSpaces(core) }} {{ currency }}</div>
        </div>
        <div>
          <div>Сумма тактики ({{ portfolio.sections[0].modules[0].data.tactic }}%)</div>
          <div>{{ numberSpaces(tactic) }} {{ currency }}</div>
        </div>
        <div v-if="portfolioId !== 'expert'">
          <div>Цель</div>
          <div>{{ targetType }}</div>
        </div>
        <div v-else>
          <div>Остаток</div>
          <div>{{ numberSpaces(remainder) }} {{ currency }}</div>
        </div>
      </div>
      <button class="btn" v-if="showButton" @click="percents">Пересчитать кол-во активов</button>
      <button class="btn" v-if="showActual && portfolioId === 'expert' && course === 'two'" @click="actualPrices">Актуализировать цену активов</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import { mapGetters } from 'vuex';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { getCurrencyTwo, numberSpaces, getCorrectInstrumentsCurrency, FV, currentTerm, getCurrency } from '../../../../../../table/modules/container/calculation';

export default defineComponent({
  name: 'PortfolioExpert',
  props: {
    portfolioId: {
      type: String,
      required: true,
    },
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true
    },
    course: {
      type: String,
      required: true
    },
    target: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      showButton: false,
      showActual: true,
    }
  },
  computed: {
    ...mapGetters(['uncombine']),
    targetType() {
      return this.target.type.name;
    },
    currency() {
      return this.target.main.data.currency_sign;
    },
    currency_id() {
      return this.target.main.data.currency_id;
    },
    total() {
      if (this.portfolioId === 'existing') {
        let total = getCorrectInstrumentsCurrency(this.portfolio.sections[1].modules.concat(this.portfolio.sections[2].modules).map(m => m.data).filter(i => i.name && i.price), this.currency_id, this.course);
        return Number(total.replace(/ /g, ''));
      }
      if (this.portfolioId === 'expert') {
        const { inflation, profitability } = this.target.main.data;
        const term = this.target.type.sections[1].modules[0].data;
        const correctInflation = inflation / 100;
        const correctProfitability = (profitability / 100 ) || 0.10;
        const amount = this.target.type.sections[0].modules[0].data.amount;
        const current_term = currentTerm(term);

        let fv = Number(FV(
          amount,
          correctInflation,
          current_term
        ));
        const capital = (fv * 12) / correctProfitability;
        if (this.target.type.id === 2) fv = capital;

        if (this.course === 'one' && this.uncombine) {
          fv = this.target.type.sections[3].modules[0].data.fv.replace(` ${this.currency}`, '');
        }
        return fv;
      }
      return this.target.type.sections[2].modules[0].data.amount;
    },
    term() {
      const current = this.target.type.sections[1].modules[0].data;
      return `${current.term} ${current.duration}`;
    },
    risk() {
      return `${this.target.type.sections[5].modules[0].data.portfolio}`;
    },
    tactic() {
      const tactic = this.total * (this.portfolio.sections[0].modules[0].data.tactic / 100);
      return Math.ceil10(tactic, -2);
    },
    core() {
      const core = this.total * (this.portfolio.sections[0].modules[0].data.core / 100);
      return Math.ceil10(core, -2);
    },
    remainder() {
      let amount = getCorrectInstrumentsCurrency(this.portfolio.sections[1].modules.map(m => m.data).filter(i => i.name && i.price), this.currency_id, this.course);
      if (this.portfolio.sections[1].modules.map(m => m.data).filter(i => i.name && i.price).length === 0) amount = '0';
      return this.core - Number(amount.replace(/ /g, ''));
    }
  },
  methods: {
    numberSpaces,
    input(type: string) {
      let correct = Number(this.portfolio.sections[0].modules[0].data[type]);
      if (correct > 100) {
        this.portfolio.sections[0].modules[0].data[type] = 100;
        this.portfolio.sections[0].modules[0].data[type === 'core' ? 'tactic' : 'core'] = 0;
      }
      this.portfolio.sections[0].modules[0].data[type === 'core' ? 'tactic' : 'core'] = 100 - this.portfolio.sections[0].modules[0].data[type];
      this.showButton = true;
    },
    percents() {
      const total = this.core;
      const currency = this.target.main.data.currency_id;
      this.portfolio.sections[1].modules.forEach(m => {
        m.data.number_papers = Math.floor((total * (+m.data.percent / 100)) / getCurrencyTwo(m.data, currency, this.course));
      });
      this.showButton = false;
    },
    async actualPrices() {
      const instruments = this.portfolio.sections[1].modules
        .filter(m => m.data.name && m.data.price)
        .map(m => ({ name: m.data.name, currency_two_id: m.data.currency_two_id, lot: m.data.lot, number_papers: m.data.number_papers }));
      
      const result = await this.API.instrument.actualPrices({ instruments });
      for (const i of result.data) {
        const c = this.portfolio.sections[1].modules.find(m => m.data.name.trim().toLowerCase() === i.name.trim().toLowerCase());
        if (c) {
          c.data.price = i.price || c.data.price;
          c.data.formula = i.formula || c.data.formula;
          const amount = getCurrency(c.data, this.target.main.data.currency_id, this.course);
          c.data.percent = Math.ceil10(amount / this.core * 100, -2);
        }
      }
      this.showActual = false;
    }
  }
})
</script>

<style lang="scss" scoped>
.distribution {
  margin-bottom: 20px;
  position: relative;
  &--title {
    padding: 15px 30px;
    border-radius: 5px 5px 0 0;
    span {
      color: #fff;
    }
    &.student {
      background: #74B2E6;
    }
    &.expert {
      background: #ec8b51;
    }
    &.existing {
      background: #71BE67;
    }
  }
  &--container {
    background-color: #fff;
    padding: 30px;
    .error {
      div {
        color: #ff5555;
        font-size: 18px;
        position: absolute;
        bottom: 5px;
        left: 70px;
      }
    }
    .type {
      margin-right: 20px;
      &--title {
        margin-bottom: 5px;
      }
      &--container {
        .amount {
          height: 36px;
          line-height: 36px;
          vertical-align: middle;
        }
        input {
          padding: 10px 15px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: inset 1px 1px 5px rgba(166, 171, 189, 0.3);
          border-radius: 8px;
          transition: 0.3s all;
        }
      }
    }
    .additional {
      margin-right: 30px;
      > div {
        display: flex;
        font-size: 14px;
        > div {
          text-align: left;
          padding: 4px 5px;
          &:first-child {
            width: 170px;
          }
        }
      }
    }
    button {
      padding: 10px 15px;
      font-size: 12px;
      position: absolute;
      top: 7px;
      right: 7px;
      background-color: #9c5234;
    }
  }
}
</style>