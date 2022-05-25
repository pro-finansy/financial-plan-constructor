<template>
  <div class="target--portfolios" v-if="isOneCourse">
    <portfolio-one
      v-for="(portfolio, key) in portfolios" 
      :key="key"
      :portfolio="portfolio"
      :portfolioStudent="portfoliosStudent[key]"
      :portfolioId="key"
      :targetId="targetId"
      :course="course"
      :sectionStatus="sectionStatus"
      :sectionStudentStatus="sectionStudentStatus"
      :checkSection="checkSection"
      :questionnaireMode="questionnaireMode"
      :role="role"
      :targetCurrencyId="targetCurrencyId"
    ></portfolio-one>
  </div>
  <div class="target--portfolios" v-else-if="isTwoCourse">
    <portfolio-two
      v-for="(portfolio, key) in portfolios" 
      :key="key"
      :portfolio="portfolio"
      :portfolioStudent="portfoliosStudent[key]"
      :portfolioId="key"
      :targetId="targetId"
      :course="course"
      :sectionStatus="sectionStatus"
      :sectionStudentStatus="sectionStudentStatus"
      :checkSection="checkSection"
      :questionnaireMode="questionnaireMode"
      :role="role"
      :targetCurrencyId="targetCurrencyId"
    ></portfolio-two>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import { valueof } from '@/interfaces';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import portfolioOne from './portfolioone.vue';
import portfolioTwo from './portfoliotwo.vue';

export default defineComponent({
  name: "TargetPortfolio",
  props: {
    targetId: {
      type: Number,
      required: true
    },
    portfolios: {
      type: Object,
      required: true
    },
    portfoliosStudent: {
      type: Object,
      required: true
    },
    sectionStatus: {
      type: Object,
      required: true
    },
    sectionStudentStatus: {
      type: Object,
      required: true
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true
    },
    checkSection: {
      type: Function,
      required: true
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    targetCurrencyId: {
      type: String,
      required: true
    }
  },
  mounted() {
    if (this.course === COURSES_ENUM.TWO) this.jq('.target--portfolios .portfolio:nth-child(2)').prependTo('.target--portfolios');
  },
  computed: {
    isOneCourse() {
      return !(this.role === ROLES_ENUM.STUDENT) && this.course === COURSES_ENUM.ONE;
    },
    isTwoCourse() {
      return !(this.role === ROLES_ENUM.STUDENT) && this.course === COURSES_ENUM.TWO;
    }
  },
  components: {
    portfolioOne,
    portfolioTwo
  }
})
</script>