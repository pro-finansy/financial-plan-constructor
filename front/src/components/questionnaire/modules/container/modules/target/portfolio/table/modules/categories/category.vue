<template>
  <div class="category">
    <div class="category--title flex items-center justify-between" :class="portfolioId">
      <span>{{ currentName.name }}</span>
      <span class="total">{{ currentText }}</span>
    </div>
    <div class="category--files" v-if="category.files?.length">
      <div class="files flex wrap-wrap">
        <div class="title">Смотреть файлы:</div>
        <div class="file" v-for="file of category.files" :key="file._id" @click="openUrl(file.src)">
          <span>{{ file.originalname || `Безымянный файл${file.src.split(file.meta)[1]}` }}</span>
        </div>
      </div>
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
import { defineComponent, inject, PropType } from 'vue-demi';
import { getCorrectInstrumentsCurrency } from '../../../../../../table/modules/container/calculation';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import categoryTable from "./table/index.vue";
import { COURSES_ENUM } from '@/utils/enums';
import { valueof } from '@/interfaces';

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
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
  },
  computed: {
    totalCategory() {
      return getCorrectInstrumentsCurrency(this.category.modules.map(m => m.data).filter(m => m.price), String(this.targetCurrencyId), this.course);
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
        (${Math.ceil10(((Number(this.totalCategory.replace(/ /g, '')) / Number(this.total.replace(/ /g, ''))) * 100), -1) || 0} %)
      `
    }
  },
  methods: {
    openUrl(src: string) {
      window.open(src);
    },
  },
  setup() {
    const targetCurrencyId = inject('targetCurrencyId');
    const targetCurrencySign = inject('targetCurrencySign');
    const total: string = inject('total') || '';
    return { targetCurrencyId, targetCurrencySign, total }
  },
  components: {
    categoryTable,
  },
});
</script>

<style lang="scss" scoped>
.category {
  margin-top: 20px;
  &--title {
    padding: 15px 30px;
    border-radius: 5px 5px 0 0;
    position: relative;
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
  &--files {
    background-color: #fff;
    .files {
      font-size: 14px;
      padding: 15px 30px;
      .title {
        margin-right: 15px;
      }
      .file {
        margin-right: 15px;
        transition: 0.3s all;
        cursor: pointer;
        &:hover {
          transition: 0.3s all;
          color: rgb(23, 143, 255);
        }
      }
    }
  }
}
</style>