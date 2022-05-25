<template>
  <div class="target" :data-id="'target-' + target.id">
    <div class="target--title color" v-if="course === 'one'">{{ target.name }}</div>
    <div
      class="target--title color"
      v-else
      :class="{ dNone: !checkSection('target') }"
    >
      Цель
    </div>
    <div v-if="questionnaireMode === 'GAP'" class="target--description color" :class="[{ dNone: !checkSection('target') }]">
      <div>
        <div>Это написал студент</div>
        <div>Тут эксперт вносит правки для итогового отчёта (если нужно)</div>
      </div>
    </div>
    <TargetMain
      :class="{ dNone: !checkSection('target') }"
      :course="course"
      :main="target.main"
      :mainStudent="targetStudent.main"
      :targetId="target.id"
      :questionnaireMode="questionnaireMode"
      :role="role"
    />
    <TargetType
      :class="{ dNone: !checkSection('target') }"
      :course="course"
      :type="target.type"
      :typeStudent="targetStudent.type"
      :targetId="target.id"
      :questionnaireMode="questionnaireMode"
      :role="role"
    />
    <TargetConclusion
      :class="{ dNone: !checkSection('target') }"
      :course="course"
      :conclusion="target.conclusion"
      :conclusionStudent="targetStudent.conclusion"
      :targetId="target.id"
      :questionnaireMode="questionnaireMode"
      :role="role"
      :targetCurrencySign="targetCurrencySign"
    />
    <TargetPortfolios
      :course="course"
      :portfolios="target.portfolios"
      :portfoliosStudent="targetStudent.portfolios"
      :sectionStatus="target.status"
      :sectionStudentStatus="targetStudent.status"
      :targetId="target.id"
      :checkSection="checkSection"
      :questionnaireMode="questionnaireMode"
      :role="role"
      :targetCurrencyId="targetCurrencyId"
    />
    <div
      class="target--remove"
      v-if="number !== 0 && !isNaN(number) && status"
      @click="$store.commit('removeTarget', number)"
    >
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
        <path d="M294.111,256.001L504.109,46.003c10.523-10.524,10.523-27.586,0-38.109c-10.524-10.524-27.587-10.524-38.11,0L256,217.892 L46.002,7.894c-10.524-10.524-27.586-10.524-38.109,0s-10.524,27.586,0,38.109l209.998,209.998L7.893,465.999 c-10.524,10.524-10.524,27.586,0,38.109c10.524,10.524,27.586,10.523,38.109,0L256,294.11l209.997,209.998 c10.524,10.524,27.587,10.523,38.11,0c10.523-10.524,10.523-27.586,0-38.109L294.111,256.001z"/>
      </svg>
    </div>
  </div>
  {{ checkInstruments }}
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import TargetMain from "./main/index.vue";
import TargetType from "./type/index.vue";
import TargetConclusion from "./conclusion/index.vue";
import TargetPortfolios from "./portfolio/index.vue";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import { valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "QuestionnaireTarget",
  props: {
    target: {
      type: Object as PropType<Questionnaire.QTarget>,
      required: true,
    },
    targetStudent: {
      type: Object,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    checkSection: {
      type: Function,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  computed: {
    checkInstruments() {
      const sections = [1, 2];
      for (const section of sections) {
        this.target.portfolios.existing.sections[section].modules.forEach(m => {
          const status = !this.target.portfolios.student.sections[section].modules.find(mm => mm.data.name.trim().toLowerCase() === m.data.name.trim().toLowerCase());
          m.data.notStudent = status;
        });
      }
      return ''
    },
    targetCurrencySign() {
      return this.target.main.data.currency_sign;
    },
    targetCurrencyId() {
      return this.target.main.data.currency_id;
    },
  },
  components: {
    TargetMain,
    TargetType,
    TargetConclusion,
    TargetPortfolios,
  },
});
</script>

<style lang="scss" scoped>
.target {
  position: relative;
  &--title {
    font-weight: 500;
    font-size: 30px;
    line-height: 35px;
    color: #5d6272;
    padding: 30px 0;
    width: 95%;
    margin: 0 auto;
    &.color {
      background-color: #fef2cc;
    }
  }
  &--description {
    width: 95%;
    margin: 0 auto;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 450px;
      margin: 0 auto;
      > div {
        font-size: 18px;
        color: #5d6272;
        width: 45%;
        text-align: center;
      }
    }
    &.color {
      background-color: #fef2cc;
    }
  }
  &--remove {
    top: 30px;
    right: 50px;
    position: absolute;
    cursor: pointer;
    > svg {
      width: 15px;
    }
  }
}
</style>