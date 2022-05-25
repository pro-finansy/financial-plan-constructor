<template>
  <div class="inputs grid">
    <Input
      v-for="input of module.inputs"
      :key="input.id"
      :data="module.data"
      :input="input"
      @toggleDrop="toggleDrop"
      @inputFocus="inputFocus"
      @inputTabKeyUp="inputTabKeyUp"
      @inputKeyUp="inputKeyUp"
      @selectDropElement="selectDropElement"
      @selectBoxElement="selectBoxElement"
    />
  </div>
  <transition name="fade">
    <div class="loading flex items-center justify-center" v-if="loadingInstrumentData">
      <img src="/images/common/loading.svg" alt="">
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import { mapGetters } from 'vuex';
import Input from "./ModalInput.vue";
import { getCurrentExchange, getCorrectInstruments } from './exchange';
import { sectionStock, sectionBond, sectionAlternative, sectionTwo, sectionTwoAlternative, typesInsurance } from '@/store/modules/questionnaire_/common/index';
import { targetTypes, studentTypes, portfolios, periods, instrumentCountries, duration, instrumentTypes, classes } from '@/store/modules/questionnaire_/common/index';
import { getCurrency, getCurrencyTwo } from '../../../questionnaire/modules/container/table/modules/container/calculation';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { Instrument } from '@/interfaces/dto/instrument';
import { dynamicsObject, valueof } from '@/interfaces';
import { Questionnaire } from '@/interfaces/dto/questionnaire';

export default defineComponent({
  name: "Inputs",
  props: {
    module: {
      type: Object as PropType<Questionnaire.QSectionModules>,
      required: true,
    },
    datas: {
      type: Object,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetTotal: {},
    targetCurrencyId: {
      type: String,
      default: 'RUB',
    },
    targetId: {
      type: [Number, String],
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    }
  },
  computed: {
    ...mapGetters(['questionnaire', 'currencies', 'user', 'currencyList'])
  },
  data() {
    return {
      debounce: 0,
      loadingInstrumentData: false,
      classes: [
        { id: 'stock', type: 'drop', drop: true, drop_data: this.course === 'one' ? sectionStock : sectionTwo, placeholder: 'Выберите сектор экономики' },
        { id: 'bond', type: 'drop', drop: true, drop_data: this.course === 'one' ? sectionBond : sectionTwo, placeholder: 'Выберите сектор экономики'  },
        { id: 'alternative', type: 'drop', drop: true, drop_data: this.course === 'one' ? sectionAlternative : sectionTwoAlternative, placeholder: 'Выберите сектор экономики' },
      ],
    }
  },
  methods: {
    inputFocus(input: Instrument.Input) {
      let instruments = (this.module.data.type === 'mixed') ? this.$store.getters.mixedAssets : ((this.user && this.user.role === ROLES_ENUM.STUDENT) ? [] : this.$store.getters.instruments);
      if (input.name.includes('Тикер')) getCorrectInstruments(input, this.module.data[input.id], instruments, this.module.data.type === 'mixed');
    },
    inputTabKeyUp(input: Instrument.Input) {
      input.showDrop = true;
    },
    inputKeyUp({event, input}: { event: any, input: Instrument.Input }) {
      if (event.key === 'Tab') {
        this.module.inputs.forEach(i => i.showDrop = false);
        if (input.drop || input.dropBox) input.showDrop = true;
        return;
      }
      if (event.key === 'Backspace' && input.drop && !input.name.includes('Тикер')) {
        this.module.data[input.id + '_id'] = '';
        if (this.module.data[input.id + '_sign']) this.module.data[input.id + '_sign'] = '';
      }
      if (input.name.includes('Тикер') || input.id === 'title') {
        let instruments = (this.module.data.type === 'mixed') ? this.$store.getters.mixedAssets : this.$store.getters.instruments;
        if (this.module.data.name === '') instruments = [];
        if (!input.showDrop) input.showDrop = true;
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          getCorrectInstruments(input, this.module.data[input.id], instruments, this.module.data.type === 'mixed');
        }, 500);
        return;
      }
      if (input.drop) {
        if (!input.showDrop) input.showDrop = true;
        this.inputDropKey(input);
      }
      if ((input.id === 'percent' || input.id === 'price' || input.id === 'lot') && this.module.data.portfolioId !== "existingPortfolio") {
        this.calculationNumberPapers();
      }
      if (input.id === 'number_papers' && this.module.data.portfolioId !== 'existingPortfolio') {
        if (this.user.role === ROLES_ENUM.STUDENT) this.calculationNumberPapers();
        if (this.user.role === ROLES_ENUM.EXPERT) {
          const amount = getCurrency(this.module.data, this.targetCurrencyId, this.course);
          this.module.data.percent = Math.ceil10(amount / Number(this.targetTotal) * 100, -2);
        }
      }
    },
    calculationNumberPapers() {
      if (+this.module.data.percent > 100) return this.module.data.percent = 100;
      const number_papers = Math.floor((Number(this.targetTotal) * (Number(this.module.data.percent) / 100)) / getCurrencyTwo(this.module.data, this.targetCurrencyId, this.course));
      this.module.data.number_papers = number_papers;
    },
    inputDropKey(input: Instrument.Input) {
      let data: dynamicsObject = [];
      if (input.id === 'currency_' + this.course) data = this.currencyList;
      if (input.id === 'base_currency_' + this.course) {
        data = this.course === COURSES_ENUM.TWO ? [...this.currencyList, { _id: 'MUL', name: 'Мульти', sign: 'M' }] : this.currencyList;
      }
      if (input.id === 'type') data = targetTypes;
      if (input.id === 'view') data = typesInsurance;
      if (input.id === 'country_' + this.course) data = instrumentCountries;
      if (input.id === 'role') data = studentTypes;
      if (input.id === 'portfolio') data = portfolios;
      if (input.id === 'period') data = periods;
      if (input.id === 'duration') data = duration;
      if (input.id === 'instrument_type_' + this.course) data = instrumentTypes(this.course);
      if (input.id === 'class_' + this.course) data = classes(this.course);
      if (input.id === 'section_' + this.course) {
        const correctClass = this.classes.find(c => c.id === this.module.data[`class_${this.course}_id`]);
        data = correctClass ? correctClass.drop_data : [];
      }
      if (input.id === 'code') data = this.datas.codes;
      if (input.id === 'expert' || input.id === 'change_expert') data = this.datas.experts;
      if (input.unsearch) return;
      input.drop_data = data.filter((e: dynamicsObject) => e.name.toLowerCase().includes(this.module.data[input.id].toLowerCase().trim()));
    },
    toggleDrop(input: Instrument.Input) {
      this.module.inputs.forEach((i) => {
        if (i.id !== input.id) i.showDrop = false;
      });
      input.showDrop = !input.showDrop;
      if (input.showDrop) {
        this.jq("body").bind("click", (e) => {
          if (
            this.jq(e.target).closest(".drop").length === 0 &&
            this.jq(e.target).siblings(".drop").length === 0
          )
            input.showDrop = false;
        });
      } else {
        this.jq("body").unbind("click");
      }
    },
    async selectDropElement(el: dynamicsObject, input: Instrument.Input) {
      this.module.data[input.id] = el.name;
      this.module.data[input.id + '_id'] = el._id;
      input.showDrop = false;
      
      if (input.id === "type") {
        this.$store.commit("targetType", 0);
      }
      if (input.name.includes('Тикер') || input.id === 'title') {
        this.loadingInstrumentData = true;
        if (el._id) {
          const options: dynamicsObject = {};
          options[`currency_${this.course}`] = el[`currency_${this.course}`];
          options[`currency_${this.course}_id`] = el[`currency_${this.course}_id`];
          this.module.data = { ...this.module.data, ...options, formula: el.formula, lot: el.lot || 1, name: el.name, price: el.price, type: this.module.data.type, portfolioId: this.module.data.portfolioId, index: this.module.data.index };
        } else {
          for (const key in this.module.data) {
            if (key === 'type' || key === 'portfolioId' || key === '_id' || key === 'course') continue;
            this.module.data[key] = '';
          }
        }
        this.module.data.percent = '';
        this.module.data.name_id = '1';
        if (Object.keys(this.currencies).find(k => k.trim().toLowerCase() === el.name.trim().toLowerCase())) {
          this.module.data.price = Math.ceil10((1 / this.currencies[el.name]) * this.currencies['RUB'], -1);
          this.module.data[`currency_${this.course}_id`] = 'RUB';
          this.module.data[`currency_${this.course}`] = 'Рубль';
          await getCurrentExchange(el, this.module, this.course, this.loadingInstrumentData);
        } else {
          await getCurrentExchange(el, this.module, this.course, this.loadingInstrumentData);
          const sections = [
            { id: 'stock', one: sectionStock, two: sectionTwo },
            { id: 'bond', one: sectionBond, two: sectionTwo },
            { id: 'alternative', one: sectionAlternative, two: sectionTwoAlternative },
          ];
          const correct = sections.find(s => s.id === this.module.data[`class_${this.course}_id`]);
          const input = this.module.inputs.find(i => i.id.includes('section_'));
          if (input && correct) {
            input.drop_data = correct[this.course];
          }
        }
        this.loadingInstrumentData = false;
        if (this.user.role === ROLES_ENUM.EXPERT) return;
        const target: Questionnaire.QTarget = this.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === this.targetId);
        if (target) {
          const keys = Object.typedKeys(target.portfolios);
          for (const portfolioId of keys) {
            const portfolio = target.portfolios[portfolioId];
            if (portfolio.sections[1].modules.filter(m => m.data.name && m.data.price).length === 0) return;
            const instrument = portfolio.sections[1].modules.find(m => m.data.name.trim().toLowerCase() === this.module.data.name.trim().toLowerCase())
            if (instrument) {
              const fields = [`currency_${this.course}`, `currency_${this.course}_id`, `base_currency_${this.course}`, `base_currency_${this.course}_id`, `instrument_type_${this.course}`, `instrument_type_${this.course}_id`, `class_${this.course}`, `class_${this.course}_id`, `section_${this.course}`, `section_${this.course}_id`, `country_${this.course}`, `country_${this.course}_id`];
              for (const key of fields) {
                this.module.data[key] = instrument.data[key];
              }
            }
          }
        }
      }
      if (input.id === 'class_' + this.course) {
        const sections = [
          { id: 'stock', one: sectionStock, two: sectionTwo },
          { id: 'bond', one: sectionBond, two: sectionTwo },
          { id: 'alternative', one: sectionAlternative, two: sectionTwoAlternative },
        ];
        const correct = sections.find(s => s.id === el._id);
        const input = this.module.inputs.find(i => i.id.includes('section_'));
        
        if (input && correct) {
          this.module.data[input.id] = '';
          input.drop_data = correct[this.course];
        }
      }
      if (input.id === 'instrument_type_two' && this.course === COURSES_ENUM.TWO && this.module.data.type) {
        const st = this.module.inputs.find(i => i.id === "section_two");
        const sm = this.module.inputs.find(i => i.id === "matdate");
        if (st)
          st.required = st.show  = !!(el._id === '7' || el._id === '9' || el._id === '10' || el._id === '11');
        if (sm)
          sm.show = !!(el._id === '4' || el._id === '5' || el._id === '8');
      }
      if (input.id === 'currency_' + this.course && this.module.data.portfolioId !== 'existingPortfolio') this.calculationNumberPapers();
      if (input.id === 'course') {
        const expert = this.module.inputs.find(i => i.id === 'expert');
        if (!expert) return;
        expert.drop_data = this.datas.experts.filter((e: dynamicsObject) => e.course === this.module.data.course_id);
        
        let oneStream = input.drop_data[0].streamDates.map((date: string) => ({ _id: date, name: date }))
        let twoStream = input.drop_data[1].streamDates.map((date: string) => ({ _id: date, name: date }))
        const streamDate = this.module.inputs.find(i => i.id === 'streamDate');
        if (!streamDate) return;
        this.module.data[streamDate.id] = '';
        streamDate.drop_data = this.module.data.course.includes('Капитал') ? oneStream : twoStream;
      }
    },
    selectBoxElement(el: dynamicsObject, input: Instrument.Input) {
      el.selected = !el.selected;
      this.module.data[input.id] = this.datas[input.id]
        .filter((el: dynamicsObject) => el.selected)
        .map((el: dynamicsObject) => el.name);

      this.module.data[input.id + "_id"] = this.datas[input.id]
        .filter((el: dynamicsObject) => el.selected)
        .map((el: dynamicsObject) => el._id);
    },
  },
  components: {
    Input,
  },
});
</script>

<style lang="scss" scoped>
.inputs {
  width: inherit;
  grid-template-columns: repeat(9, 1fr);
  gap: 10px;
}
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #c6c6c68a;
  border-radius: 20px;
  img {
    width: 64px;
  }
}
</style>
