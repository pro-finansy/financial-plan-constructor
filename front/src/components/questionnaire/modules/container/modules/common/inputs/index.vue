<template>
  <div class="inputs" :class="{gap: currentMode}">
    <div class="inputs--container" v-if="questionnaireMode === 'GAP' && moduleStudent.inputs && sectionStudent.show && portfolioId !== 'expert'">
      <QuestionnaireInput
        v-for="input of moduleStudent.inputs" 
        :key="input.id" 
        :input="input" 
        :data="moduleStudent.data"
        :showName="!!currentMode"
        :gap="!!currentMode"
        :block="true"
      />
    </div>
    <div class="inputs--container test" v-if="section.show">
      <QuestionnaireInput
        v-for="input of module.inputs" 
        :key="input.id" 
        :input="input"
        :data="module.data"
        :dataStudent="moduleStudent.data"
        :targetId="targetId"
        :targetCurrencySign="targetCurrencySign"
        :section="section"
        @toggleDrop="toggleDrop"
        @selectDropElement="selectDropElement"
        @formula="formula"
        @inputFocus="inputFocus"
        @inputKeyUp="inputKeyUp"
        :expert="!!currentMode"
        :showName="!currentMode"
        :gap="!!currentMode"
        :block="block"
      />
    </div>
    <div class="dublicaties">
      <label 
        class="dublicate" 
        v-if="questionnaireMode !== 'GAP' && portfolioId === 'existing' && indexSection !== 0 && indexSection !== 3 && course === 'one'"
        @change="dublicateInstrument('student')"
      >
        <span>Дублировать в портфель студента</span>
        <input type="checkbox" v-model="module.data.dublicateStudent">
      </label>
      <label 
        class="dublicate" 
        v-if="((portfolioId === 'student' || portfolioId === 'existing') && (indexSection === 1 || indexSection === 2))"
        @change="dublicateInstrument('expert')"
      >
        <span>Дублировать в портфель эксперта</span>
        <input type="checkbox" v-model="module.data.dublicateExpert">
      </label>
      <label 
        class="dublicate" 
        v-if="(portfolioId === 'student' && indexSection === 2)"
        @change="dublicateInstrument('existing')"
      >
        <span>Дублировать в стартовый портфель</span>
        <input type="checkbox" v-model="module.data.dublicateExisting">
      </label>
      <label 
        class="dublicate" 
        v-if="(portfolioId === 'student' && indexSection === 1 && course === 'two')"
        @change="dublicateInstrument('existing')"
      >
        <span>Дублировать в портфель на стартовый капитал</span>
        <input type="checkbox" v-model="module.data.dublicateExisting">
      </label>
    </div>
    <div class="actions" v-if="(questionnaireMode !== 'GAP' || portfolioId === 'expert') && portfolioId && (indexSection === 1 || (indexSection === 2 && portfolioId !== 'expert')) && questionnaireStatus">
      <button class="btn btn--qn btn--green" @click="$store.commit('addNewModule', { section, indexSection, targetId, element: false, indexModule })">Добавить блок</button>
    </div>
    <div class="actions" v-else-if="(questionnaireMode !== 'GAP' || portfolioId === 'expert') && portfolioId && (indexSection === 1 || (indexSection === 2 && portfolioId !== 'expert')) && !questionnaireStatus">
      <button class="btn btn--qn btn--green btn--disabled">Добавить блок</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import { mapGetters } from 'vuex';
import { calculationRealityRepleshment, calculationFV } from './calculation';
import { getCurrentExchange, getCorrectInstruments } from './exchange';
import { sectionStock, sectionBond, sectionAlternative, sectionTwo, sectionTwoAlternative, typesInsurance } from '@/store/modules/questionnaire_/common/index';
import { countries, targetTypes, studentTypes, portfolios, periods, instrumentCountries, duration, instrumentTypes, classes } from '@/store/modules/questionnaire_/common/index';
import { getCurrencyTwo } from '../../../table/modules/container/calculation';
import { COURSES_ENUM, DURATION_ENUM, ROLES_ENUM } from '@/utils/enums';
import QuestionnaireInput from './input.vue';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { dynamicsObject, valueof } from '@/interfaces';
import { Instrument } from '@/interfaces/dto/instrument';
import { COURSES_TYPE } from '@/store/commonDatas';

export default defineComponent({
  name: 'QuestionnairenInputs',
  props: {
    module: {
      type: Object as PropType<Questionnaire.QSectionModules>,
      required: true
    },
    moduleStudent: {
      type: Object,
      default: () => ({})
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true
    },
    targetId: {
      type: Number,
    },
    indexModule: {
      type: Number
    },
    indexSection: {
      type: Number
    },
    modules: {
      type: Array
    },
    modulesStudent: {
      type: Array
    },
    section: {
      type: Object,
      default: () => ({
        show: true
      })
    },
    sectionStudent: {
      type: Object,
      default: () => ({
        show: true
      })
    },
    portfolioId: {
      type: String
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      default: 'one'
    },
    block: {
      type: Boolean,
      default: false,
    },
    targetCurrencySign: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      debounce: 0,
      classes: [
        { id: 'stock', type: 'drop', drop: true, drop_data: this.course === COURSES_ENUM.ONE ? sectionStock : sectionTwo, placeholder: 'Выберите сектор экономики' },
        { id: 'bond', type: 'drop', drop: true, drop_data: this.course === COURSES_ENUM.ONE ? sectionBond : sectionTwo, placeholder: 'Выберите сектор экономики'  },
        { id: 'alternative', type: 'drop', drop: true, drop_data: this.course === COURSES_ENUM.ONE ? sectionAlternative : sectionTwoAlternative, placeholder: 'Выберите сектор экономики'  },
      ]
    }
  },
  created() {
    if (this.section.default && this.section.default.includes('portfolio-instrument-')) {
      const section = this.module.inputs.find(m => m.id === `section_${this.course}`);
      const correctClass = this.classes.find(c => c.id === this.module.data[`class_${this.course}_id`]);
      if (correctClass && section) {
        section.drop = true;
        section.drop_data = correctClass.drop_data;
      }
    }
    if (this.user.role === ROLES_ENUM.EXPERT && this.questionnaireMode && this.targetId) {
      calculationRealityRepleshment(this);
    }
  },
  computed: {
    ...mapGetters(['instruments', 'user', 'questionnaire', 'Authorization', 'currencies', 'questionnaireStatus', 'uncombine', 'currencyList']),
    currentMode() {
      return this.questionnaireMode === 'GAP' && this.moduleStudent.inputs && this.sectionStudent.show && this.section.show && this.portfolioId !== 'expert';
    }
  },
  methods: {
    dublicateInstrument(from: Questionnaire.Portfolios) {
      const dublicateTacticToCore = from === 'expert' && this.indexSection === 2;
      const duclicates = [
        { id: 'expert', element: 'dublicateExpert' },
        { id: 'student', element: 'dublicateStudent' },
        { id: 'existing', element: 'dublicateExisting' }
      ];
      const correctDublicate = duclicates.find(d => d.id === from)?.element;
      if (!correctDublicate) return;
      if (!this.module.data.name) {
        this.module.data[correctDublicate] = false;
        return;
      }
      this.$store.commit('dublicateInstrument', { to: this.portfolioId, from, indexSection: dublicateTacticToCore ? 1 : this.indexSection, indexModule: this.indexModule, target: this.targetId, dublicate: this.module.data[correctDublicate], tactic: dublicateTacticToCore });
    },
    inputKeyUp({event, input}: {event: dynamicsObject, input: Instrument.Input}) {
      if (event.key === 'Backspace' && input.drop) {
        this.module.data[input.id + '_id'] = '';
        if (this.module.data[input.id + '_sign']) this.module.data[input.id + '_sign'] = '';
      }
      if (input.id === 'profitability') {
        if (this.module.data.profitability > 20) this.module.data.profitability = 20;
      }
      if (input.id === 'inflation') {
        if (this.module.data.inflation > 30) this.module.data.inflation = 30;
      }
      if (input.id === 'name' && this.targetId) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          getCorrectInstruments(this, input);
        }, 500);
      } else if (input.id === 'core') {
        if (this.module.data.core > 100) this.module.data.core = 100;
        this.module.data.tactic = (100 - this.module.data.core).toFixed(2);
      } else if (input.id === 'tactic') {
        if (this.module.data.tactic > 100) this.module.data.tactic = 100;
        this.module.data.core = (100 - this.module.data.tactic).toFixed(2);
      } else if (
        this.user.role !== ROLES_ENUM.STUDENT && 
        ((this.indexSection === 0 && input.id === 'amount') || 
        (this.indexSection === 1 && input.id === 'term') || 
        input.id === 'inflation' || 
        input.id === 'profitability')
      ) {
        calculationFV(this);
        calculationRealityRepleshment(this);
      } else if ((input.id === 'number_papers' || input.id === 'lot')) {
        this.formula();
      } else if (input.id === 'price') {
        if (this.module.data.number_papers) {
          this.formula()
        } else if (!this.module.data.number_papers && this.module.data.percent) {
          const currentTarget: Questionnaire.QTarget = this.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === this.targetId);
          const number_papers = Math.floor((this.currentCorePercent(currentTarget) * (+this.module.data.percent / 100)) / getCurrencyTwo(this.module.data, currentTarget.main.data.currency_id, this.course));
          this.module.data.number_papers = number_papers;
        }
      } else if (input.id === 'percent') {
        if (+this.module.data.percent > 100) return this.module.data.percent = 100;
        if (this.module.data.number_papers && !this.module.data.percent) return;
        const currentTarget: Questionnaire.QTarget = this.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === this.targetId);
        const number_papers = Math.floor((this.currentCorePercent(currentTarget) * (+this.module.data.percent / 100)) / getCurrencyTwo(this.module.data, currentTarget.main.data.currency_id, this.course));
        this.module.data.number_papers = number_papers;
        this.formula();
      }
      if (input.drop) {
        this.inputDropKey(input);
      }
    },
    currentCorePercent(currentTarget: Questionnaire.QTarget) {
      const currentTerm = currentTarget.type.sections[1].modules[0].data;
      const currentTargetIncome = currentTarget.type.sections[0].modules;

      const inflation = currentTarget.main.data.inflation / 100;
      const profitability = currentTarget.main.data.profitability / 100 || 0;
      const term =
        currentTerm.duration_id === DURATION_ENUM.MONTH
          ? Number(currentTerm.term) / 12
          : Number(currentTerm.term);
      const income = this.getCorrectCurrency(
        currentTargetIncome,
        currentTarget.main.data.currency_id
      );
      const core =
        currentTarget.portfolios.expert.sections[0].modules[0].data.core;
      let FV = Number(income) * Math.pow(1 + inflation, term);
      const capital = (FV * 12) / profitability;
      if (currentTarget.type.id === 2) FV = capital;
      return FV * (core / 100);
    },
    getCorrectCurrency(datas: Array<Instrument.Module>, currency: string) {
      const rates = this.currencies;
      return datas
        .reduce(
          (acc, data) =>
            acc +
            (data.data.amount / rates[data.data.currency_id]) * rates[currency],
          0
        )
        .toFixed(1);
    },
    inputDropKey(input: Instrument.Input) {
      let data: Array<dynamicsObject> = [];
      if (input.id === 'currency_' + this.course || input.id === 'base_currency_' + this.course) data = this.currencyList;
      if (input.id === 'type') data = targetTypes;
      if (input.id === 'view') data = typesInsurance;
      if (input.id === 'country_' + this.course && this.targetId) data = instrumentCountries;
      if (input.id === 'country_' + this.course && !this.targetId) data = countries;
      if (input.id === 'role') data = studentTypes;
      if (input.id === 'portfolio') data = portfolios;
      if (input.id === 'period') data = periods;
      if (input.id === 'duration') data = duration;
      if (input.id === 'instrument_type_' + this.course) data = instrumentTypes(this.course);
      if (input.id === 'class_' + this.course) data = classes(this.course);
      if (input.id === 'section_' + this.course) {
        const correctClass = this.classes.find(c => c.id === this.module.data[`class_${this.course}_id`]);
        if (correctClass) data = correctClass.drop_data;
      }
      if (data.length === 0) return;
      input.drop_data = data.filter(e => e.name.toLowerCase().includes(this.module.data[input.id].toLowerCase().trim()));
    },
    toggleDrop(input: Instrument.Input) {
      this.module.inputs.forEach((i) => {
        if (i.id !== input.id) i.showDrop = false;
      });
      input.showDrop = !input.showDrop;
      this.jq("body").unbind("click");
      if (input.showDrop) {
        this.jq("body").bind("click", (e) => {
          if (
            this.jq(e.target).closest(".drop").length === 0 &&
            this.jq(e.target).siblings(".drop").length === 0
          ) input.showDrop = false;
        });
      }
    },
    formula() {
      if (this.module.data.number_papers && this.module.data.price) {
        let lot = (this.course === 'two' && this.module.data.lot) ? this.module.data.lot : 1;
        this.module.data.formula = Number((this.module.data.number_papers * lot * this.module.data.price).toFixed(2));
      } else {
        this.module.data.formula = 0;
      }
    },
    inputFocus(input: Instrument.Input) {
      if (input.id === 'name') getCorrectInstruments(this, input);
    },
    selectDropElement(el: Instrument.Dto, input: Instrument.Input) {
      this.module.data[input.id] = el.name;
      this.module.data[input.id + "_id"] = el._id;
      if (el.sign) this.module.data[input.id + "_sign"] = el.sign;

      input.showDrop = false;
      if (input.id === "type") this.$store.commit('changeTargetType', { id: this.targetId, data: el });
      if (input.id === 'class_' + this.course) {
        let section = this.module.inputs.find(i => i.id === 'section_' + this.course);
        const correctClass = this.classes.find(c => c.id === el._id);
        if (!correctClass || !section) return;

        this.module.data.section = '';
        this.module.data.section_id = '';
        section.drop = correctClass.drop;
        section.drop_data = correctClass.drop_data;
        section.type = correctClass.type;
        section.placeholder = correctClass.placeholder;
      }
      if (input.id === 'name') {
        if (el._id) {
          const classes = COURSES_TYPE;
          let currentClass = classes.find(c => c.id === el[`class_${this.course}_id`]);
          if (!currentClass) currentClass = { id: '', one: '', two: '', comment: '' };
          if (el.class !== currentClass[this.course]) {
            el.instrument_type = '';
            el.section = '';
          }
          el.class = currentClass[this.course];

          let section = this.module.inputs.find(i => i.id === 'section_' + this.course);
          const correctClass = this.classes.find(c => c.id === el[`class_${this.course}_id`]);
          if (correctClass && section) {
            section.drop = correctClass.drop;
            section.drop_data = correctClass.drop_data;
            section.type = correctClass.type;
            section.placeholder = correctClass.placeholder;
          }
 
          const correctComment = el.comments.find((c: dynamicsObject) => String(c._id) === String(this.user._id));
          let lot = (this.course === COURSES_ENUM.TWO && el.lot) ? el.lot : 1;
          if (el.number_papers && el.price) el.formula = el.number_papers * el.price * lot;
          this.module.data = {...el};
          if (correctComment) this.module.data.comment = correctComment.comment;
          else this.module.data.comment = '';
          delete this.module.data.__v;
        } else {
          for (const key in this.module.data) {
            this.module.data[key] = '';
          }
        }
        getCurrentExchange(this, el, this.course);
      }
      if (!this.indexSection && input.id === 'currency' && this.course === COURSES_ENUM.TWO && input.name === 'Валюта цели') {
        const target: Questionnaire.QTarget = this.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === this.targetId);
        if (target) {
          const sections = [0, 2, 4];
          for (const section of sections) {
            target.type.sections[section].modules[0].data.currency = el.name;
            target.type.sections[section].modules[0].data.currency_id = el._id;
            target.type.sections[section].modules[0].data.currency_sign = el.sign;
          }
          target.conclusion.sections[1].modules[0].data.currency = el.name;
          target.conclusion.sections[1].modules[0].data.currency_id = el._id;
          target.conclusion.sections[1].modules[0].data.currency_sign = el.sign;
        }
      }
      if ((this.indexSection === 0 && input.id === 'currency_' + this.course) || input.id === 'duration') calculationFV(this);
      if (input.id === 'currency_' + this.course || input.id === 'base_currency_' + this.course) input.drop_data = this.currencyList;
      if (input.id === 'type') input.drop_data = targetTypes;
      if (input.id === 'view') input.drop_data = typesInsurance;
      if (input.id === 'country_' + this.course && this.targetId) input.drop_data = instrumentCountries;
      if (input.id === 'country_' + this.course && !this.targetId) input.drop_data = countries;
      if (input.id === 'role') input.drop_data = studentTypes;
      if (input.id === 'portfolio') input.drop_data = portfolios;
      if (input.id === 'period') {
        if (this.user.role !== ROLES_ENUM.STUDENT) calculationRealityRepleshment(this);
        input.drop_data = periods;
      }
      if (input.id === 'duration') input.drop_data = duration;
      if (input.id === 'instrument_type_' + this.course) input.drop_data = instrumentTypes(this.course);
      if (input.id === 'class_' + this.course) input.drop_data = classes(this.course);
      if (input.id === 'section_' + this.course) {
        const correctClass = this.classes.find(c => c.id === this.module.data[`class_${this.course}_id`]);
        if (correctClass) input.drop_data = correctClass.drop_data;
      }
    },
  },
  components: {
    QuestionnaireInput
  }
})
</script>

<style lang="scss" scoped>
.inputs {
  position: relative;
  &.gap {
    display: flex;
    justify-content: space-between;
    .inputs--container {
      width: 45%;
    }
  }
}
.dublicaties {
  position: absolute;
  width: 250px;
  top: 0;
  right: -450px;
  font-size: 12px;
  label {
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    > span {
      color: #5D6272;
    }
  }
}
@media (max-width: 1450px) {
  .dublicaties {
    top: 50px;
    left: -350px;
  }
}
</style>