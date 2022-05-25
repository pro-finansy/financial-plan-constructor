<template>
  <div class="totalPercent" v-if="portfolioId !== 'existingPortfolio'">
    Вы заполнили {{ portfolioId === 'expertPortfolio' ? 'ядро' : 'портфель' }} на {{ totalPercent }}%, осталось {{ leftTotalPercent }}%
  </div>
  <div class="categories">
    <portfolio-category
      v-for="category of categories"
      :key="category.default"
      :category="category"
      :portfolioId="portfolioId"
      :course="course"
    ></portfolio-category>
    <div v-if="onTacticFiles" class="tactic" :class="{error: !target.portfolios[portfolioName].sections[2].file}">
      <label>
        <input type="file" :name="'tactic-' + portfolioId" :ref="'tactic-' + portfolioId" @change="emitter.emit(`changeTacticFile`, { portfolioName, file: getFile })">
        <span v-if="target.portfolios[portfolioName].sections[2].file">Изменить файл</span>
        <span v-else>Прикрепить файлы</span>
      </label>
      <span v-if="target.portfolios[portfolioName].sections[2].file" class="delete" @click="emitter.emit(`deleteTacticFile`, { portfolioName })">Удалить файл</span>
    </div>
    <div class="total" v-if="portfolioId !== 'expertPortfolio'" :class="portfolioId">ВСЕГО (ЯДРО+ТАКТИКА): {{ total }} {{ targetCurrencySign }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from 'vue-demi';
import { mapGetters } from 'vuex';
import portfolioCategory from "./category.vue";
import { currentTerm, FV, getCorrectInstrumentsCurrency } from '../../../../../../table/modules/container/calculation';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { valueof } from '@/interfaces';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: "PortfolioCategories",
  props: {
    categories: {
      type:  Array as PropType<Array<Questionnaire.QSection>>,
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
    portfolioName: {
      type: String,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    core: [Number, String]
  },
  setup() {
    const targetCurrencyId = inject('targetCurrencyId');
    const targetCurrencySign = inject('targetCurrencySign');
    const status = inject('status');
    return { targetCurrencyId, targetCurrencySign, status }
  },
  provide() {
    return {
      total: computed(() => this.total),
      totalInstruments: computed(() => this.totalInstruments),
      targetTotal: computed(() => {
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

        if (this.course === COURSES_ENUM.ONE && this.uncombine) {
          fv = this.target.type.sections[3].modules[0].data.fv.replace(` ${this.targetCurrencySign}`, '');
        }

        if (this.portfolioName === 'expert') {
          fv = fv * (Number(this.core) / 100);
        }
        return Math.ceil10(fv, -2);
      }),
      expertTotal: computed(() => {
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

        if (this.course === COURSES_ENUM.ONE && this.uncombine) {
          fv = this.target.type.sections[3].modules[0].data.fv.replace(` ${this.targetCurrencySign}`, '');
        }

        return Math.ceil10(fv * (this.target.portfolios.expert.sections[0].modules[0].data.core / 100), -2);
      }),
      studentTotal: computed(() => {
        return this.target.type.sections[2].modules[0].data.amount;
      })
    }
  },
  computed: {
    ...mapGetters(['uncombine']),
    getFile() {
      return (this.$refs['tactic-' + this.portfolioId] as any).files[0];
    },
    onTacticFiles() {
      return this.$store.getters.role === ROLES_ENUM.STUDENT && this.course === COURSES_ENUM.TWO && this.status;
    },
    totalInstruments() {
      const arr = this.categories.map(c => c.modules).reduce((acc, arr) => acc.concat(arr));
      return arr
        .map(m => m.data)
        .filter(m => m.price);
    },
    total() {
      const arr = this.categories.map(c => c.modules).reduce((acc, arr) => acc.concat(arr));
      const result = arr
        .map(m => m.data)
        .filter(m => m.price);
      return getCorrectInstrumentsCurrency(result, String(this.targetCurrencyId), this.course);
    },
    totalPercent() {
      const arr = this.categories.map(c => c.modules).reduce((acc, arr) => acc.concat(arr));
      return Math.ceil10(arr
        .map(m => m.data)
        .filter(i => i.percent)
        .reduce((acc, i) => acc + Number(i.percent), 0), -2);
    },
    leftTotalPercent() {
      return Math.ceil10(100 - this.totalPercent <= 0 ? 0 : 100 - this.totalPercent, -2);
    }
  },
  components: {
    portfolioCategory,
  },
});
</script>

<style lang="scss" scoped>
.totalPercent {
  text-align: center;
  color: #3C3A39;
  font-size: 18px;
}
.tactic {
  font-size: 14px;
  margin: 0 30px;
  padding: 10px 30px;
  border: 1px solid #EFEFEF;
  border-top: none;
  .delete {
    cursor: pointer;
    margin-left: 30px;
    color: rgb(255, 89, 89);
  }
  label {
    cursor: pointer;
  }
  &.error {
    background: #ffe6e6;
  }
}
.total {
  padding: 10px 0;
  text-align: center;
  border-top: 1px solid #EFEFEF;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  background-color: #fff;
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
</style>