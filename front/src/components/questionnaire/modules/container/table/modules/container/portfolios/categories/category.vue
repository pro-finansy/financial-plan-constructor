<template>
  <div class="category">
    <div class="category--title flex items-center justify-between">
      <span>{{ currentName.name }}</span>
      <span class="total">{{ currentText }}</span>
    </div>
    <category-table
      :portfolioId="portfolioId"
      :modules="category.modules"
      :core="!category.optional"
      :course="course"
    ></category-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from "vue-demi";
import categoryTable from "./table/index.vue";
import { getCorrectInstrumentsCurrency } from '../../calculation';
import { Questionnaire } from "@/interfaces/dto/questionnaire";

export default defineComponent({
  name: "PortfolioCategory",
  props: {
    category: {
      type: Object as PropType<Questionnaire.QSection>,
      required: true,
    },
    portfolioId: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  setup() {
    const targetCurrencyId = inject('targetCurrencyId');
    const targetCurrencySign = inject('targetCurrencySign');
    const total: string = inject('total') || '';
    return {
      targetCurrencyId, 
      targetCurrencySign,
      total
    }
  },
  computed: {
    totalCategory() {
      return getCorrectInstrumentsCurrency(this.category.modules.map(m => m.data).filter(m => m.price), String(this.targetCurrencyId), this.course).replace(/ /g, '');
    },
    currentName() {
      if (this.category.name.includes('ядра')) return {name: 'Ядро', total: 'ядро'}
      else return {name: 'Тактическая часть', total: 'тактика'}
    },
    currentText() {
      return `Итого 
        ${ this.currentName.total }: 
        ${ this.totalCategory } 
        ${ this.targetCurrencySign || '' } 
        (${Math.ceil10(((Number(this.totalCategory) / Number(this.total.replace(/ /g, ''))) * 100), -1) || 0} %)
      `
    }
  },
  components: {
    categoryTable,
  },
});
</script>

<style lang="scss" scoped>
.category {
  &--title {
    background: #349c5d;
    padding: 20px 30px;
    span {
      color: #fff;
    }
  }
}
</style>