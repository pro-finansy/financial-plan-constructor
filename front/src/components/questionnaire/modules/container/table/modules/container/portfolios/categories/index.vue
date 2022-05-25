<template>
  <div class="totalPercent" v-if="portfolioId === 'studentPortfolio'">
    Вы заполнили портфель на {{ totalPercent }}%, осталось {{ leftTotalPercent }}%
  </div>
  <div class="categories">
    <portfolio-category
      v-for="category of categories"
      :key="category.default"
      :category="category"
      :portfolioId="portfolioId"
      :course="course"
    ></portfolio-category>
    <div v-if="onTacticFiles" class="tactic flex wrap-wrap">
      <div class="file flex items-center justify-between" v-for="file of target.portfolios[portfolioName].sections[2].files" :key="file._id">
        <div>{{ file.originalname || 'Безымянный файл' }}</div>
        <div class="delete" @click="emitter.emit(`deleteTacticFile`, { portfolioName, file })">
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-e3e394f6=""><path d="M14.0461 2.24998H10.8767V1.68749C10.8767 0.757014 10.1011 0 9.14788 0H6.84282C5.88957 0 5.11403 0.757014 5.11403 1.68749V2.24998H1.94457C1.15019 2.24998 0.503906 2.88082 0.503906 3.65622V5.62496C0.503906 5.9356 0.761929 6.18746 1.08017 6.18746H1.3951L1.89296 16.3926C1.93693 17.2939 2.69544 17.9999 3.61977 17.9999H12.3709C13.2953 17.9999 14.0538 17.2939 14.0977 16.3926L14.5956 6.18746H14.9105C15.2288 6.18746 15.4868 5.9356 15.4868 5.62496V3.65622C15.4868 2.88082 14.8405 2.24998 14.0461 2.24998ZM6.26656 1.68749C6.26656 1.37734 6.52508 1.12499 6.84282 1.12499H9.14788C9.46562 1.12499 9.72414 1.37734 9.72414 1.68749V2.24998H6.26656V1.68749ZM1.65644 3.65622C1.65644 3.50115 1.7857 3.37498 1.94457 3.37498H14.0461C14.205 3.37498 14.3343 3.50115 14.3343 3.65622V5.06247C14.1567 5.06247 2.39236 5.06247 1.65644 5.06247V3.65622ZM12.9465 16.3391C12.9319 16.6395 12.679 16.8749 12.3709 16.8749H3.61977C3.31165 16.8749 3.05881 16.6395 3.04419 16.3391L2.54893 6.18746H13.4418L12.9465 16.3391Z" fill="#858995" data-v-e3e394f6=""></path><path d="M7.99619 15.7501C8.31443 15.7501 8.57245 15.4983 8.57245 15.1876V7.87521C8.57245 7.56457 8.31443 7.31271 7.99619 7.31271C7.67794 7.31271 7.41992 7.56457 7.41992 7.87521V15.1876C7.41992 15.4983 7.67791 15.7501 7.99619 15.7501Z" fill="#858995" data-v-e3e394f6=""></path><path d="M10.877 15.7501C11.1953 15.7501 11.4533 15.4983 11.4533 15.1876V7.87521C11.4533 7.56457 11.1953 7.31271 10.877 7.31271C10.5588 7.31271 10.3008 7.56457 10.3008 7.87521V15.1876C10.3008 15.4983 10.5588 15.7501 10.877 15.7501Z" fill="#858995" data-v-e3e394f6=""></path><path d="M5.11337 15.7501C5.43162 15.7501 5.68964 15.4983 5.68964 15.1876V7.87521C5.68964 7.56457 5.43162 7.31271 5.11337 7.31271C4.79513 7.31271 4.53711 7.56457 4.53711 7.87521V15.1876C4.53711 15.4983 4.7951 15.7501 5.11337 15.7501Z" fill="#858995" data-v-e3e394f6=""></path></svg>
        </div>
      </div>
      <label 
        class="flex items-center justify-center" 
        :class="{error: !target.portfolios[portfolioName].sections[2].files.length}"
        v-if="target.portfolios[portfolioName].sections[2].files.length < 5"
      >
        <input type="file" :name="'tactic-' + portfolioId" multiple :ref="'tactic-' + portfolioId" @change="uploadFiles(portfolioName)">
        <span>Прикрепить файлы ({{ 5 - target.portfolios[portfolioName].sections[2].files.length}})</span>
        <files />
      </label>
    </div>
    <div class="total">ВСЕГО (ЯДРО+ТАКТИКА): {{ total }} {{ targetCurrencySign }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from 'vue-demi';
import portfolioCategory from "./category.vue";
import { currency, getCorrectInstrumentsCurrency } from '../../calculation';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { Files } from '@element-plus/icons';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: "PortfolioCategories",
  props: {
    categories: {
      type: Array as PropType<Array<Questionnaire.QSection>>,
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
      type: [String, Number],
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  setup() {
    const targetCurrencyId = inject('targetCurrencyId');
    const targetCurrencySign = inject('targetCurrencyId');
    const status = inject('status');
    return {
      targetCurrencyId,
      targetCurrencySign,
      status
    }
  },
  provide() {
    return {
      total: computed(() => this.total),
      totalInstruments: computed(() => this.totalInstruments),
      targetTotal: computed(() => {
        return currency(this.target.type.sections[2].modules[0].data.amount, this.target.type.sections[2].modules[0].data.currency_id, this.target.main.data.currency_id)
      }),
    }
  },
  methods: {
    uploadFiles(portfolioName: string | number) {
      this.emitter.emit(`changeTacticFile`, { portfolioName, files: (this.$refs['tactic-' + this.portfolioId] as any).files });
      (this.$refs['tactic-' + this.portfolioId] as any).files = null;
    }
  },
  computed: {
    totalInstruments() {
      const arr = this.categories.map(c => c.modules).reduce((acc, arr) => acc.concat(arr));
      return arr.map(m => m.data).filter(m => m.price);
    },
    total() {
      const arr = this.categories.map(c => c.modules).reduce((acc, arr) => acc.concat(arr));
      const array = arr.map(m => m.data).filter(m => m.price);
      return getCorrectInstrumentsCurrency(array, String(this.targetCurrencyId), this.course);
    },
    onTacticFiles() {
      return this.$store.getters.role === ROLES_ENUM.STUDENT && this.course === COURSES_ENUM.TWO && this.status;
    },
    totalPercent() {
      const arr = this.categories.map(c => c.modules).reduce((acc, arr) => acc.concat(arr));
      return Math.ceil10(arr.map(m => m.data).reduce((acc, m) => acc + Number(m.percent), 0), -2);
    },
    leftTotalPercent() {
      return Math.ceil10(100 - this.totalPercent <= 0 ? 0 : 100 - this.totalPercent, -2);
    }
  },
  components: {
    portfolioCategory, Files
  },
});
</script>

<style lang="scss" scoped>
.totalPercent {
  text-align: center;
  padding-bottom: 20px;
  color: #5D6272;
  font-size: 18px;
}
.tactic {
  font-size: 14px;
  margin: 0 30px;
  border: 1px solid #EFEFEF;
  border-top: none;
  .file {
    padding: 10px 15px;
    width: 25%;
    border-right: 1px solid #EFEFEF;
    border-bottom: 1px solid #EFEFEF;
  }
  .delete, label {
    cursor: pointer;
  }
  label {
    width: 25%;
    padding: 10px 15px;
    background-color: #F6FFF8;
    svg {
      width: 16px;
      height: 16px;
      margin-left: 10px;
    }
    &.error {
      background: #ffe6e6;
    }
  }
}
.total {
  margin: 0 30px;
  padding: 10px 0;
  text-align: center;
  border-right: 1px solid #EFEFEF;
  border-left: 1px solid #EFEFEF;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #349C5D;
}
</style>