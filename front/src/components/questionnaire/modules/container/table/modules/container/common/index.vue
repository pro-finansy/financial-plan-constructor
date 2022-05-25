<template>
  <section class="common flex items-center justify-between">
    <div class="elements flex">
      <div class="element">
        <div>{{ target.main.data.name || 'Не указана' }}</div>
        <div>Цель SMART</div>
      </div>
      <div class="element">
        <div>{{ FV || 'Не введено' }}</div>
        <div>с учетом инфляции</div>
      </div>
      <div class="element">
        <div>{{ correctTerm }}</div>
        <div>срок</div>
      </div>
      <div class="element">
        <div>{{ riskPortfolio }}</div>
        <div>риск-профиль</div>
      </div>
    </div>
    <div class="help" @click="onHelp = !onHelp" @mouseenter="onHelp = true" @mouseleave="onHelp = false">
      <div class="help--header flex items-center">
        <span>Не забудь</span>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="10.25" stroke="#FE7815" stroke-width="1.5"/>
          <path d="M11.7078 14.2604H10.1826L10.0639 5H11.8356L11.7078 14.2604ZM10 17.0784C10 16.8125 10.0822 16.591 10.2466 16.4138C10.417 16.2306 10.6667 16.1391 10.9954 16.1391C11.3242 16.1391 11.5738 16.2306 11.7443 16.4138C11.9148 16.591 12 16.8125 12 17.0784C12 17.3442 11.9148 17.5658 11.7443 17.743C11.5738 17.9143 11.3242 18 10.9954 18C10.6667 18 10.417 17.9143 10.2466 17.743C10.0822 17.5658 10 17.3442 10 17.0784Z" fill="#FE7815"/>
        </svg>
      </div>
      <transition name="fade">
        <div v-if="onHelp && correctHelper" class="help--container">
          <ul>
            <li>
              <div>Ниже указано максимальное количество инструментов, которое Вы можете добавить в свой портфель:</div>
              <div>
                <div v-for="element of correctHelper.max" :key="element.id">{{ element.name }} - <strong>{{ element.value }}</strong></div>
              </div>
              <div>P.S. Добавлять абсолютно все перечисленные инструменты в указанном количестве необязательно и не рекомендуется.</div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, inject } from 'vue-demi';
import calculation, { currency, numberSpaces } from '../calculation';
import correctDescription from '@/utils/correctEnd';
import { HELP_LIST } from '@/store/commonDatas';
import { Questionnaire } from '@/interfaces/dto/questionnaire';

export default defineComponent({
  name: 'QuestionnaireTableCommon',
  props: {
    target: {
      type: Object as PropType<Questionnaire.QTarget>,
      required: true
    },
    course: {
      type: String,
      required: true,
    },
  },
  setup() {
    const targetCurrencyId = inject('targetCurrencyId');
    const targetCurrencySign = inject('targetCurrencySign');
    return { targetCurrencyId, targetCurrencySign }
  },
  data() {
    return {
      elements: [],
      onHelp: false,
      helperList: HELP_LIST
    }
  },
  computed: {
    correctHelper() {
      return this.helperList.find(h => h.id === this.course);
    },
    income() {
      return Number(calculation.getCorrectCurrency(this.target.type.sections[0].modules, String(this.targetCurrencyId)))
    },
    term() {
      return this.target.type.sections[1].modules[0].data;
    },
    currentTerm() {
      return calculation.currentTerm(this.term);
    },
    correctInflation() {
      return this.target.main.data.inflation / 100;
    },
    FV() {
      const _fv = this.target.type.sections[2].modules[0].data;
      const target = this.target.main.data;
      const fv = currency(_fv.amount, _fv.currency_id, target.currency_id);
      const name = isNaN(fv) ? 'Не выбрано' : `${numberSpaces(fv)} ${target.currency_sign}`.trim()
      return name;
    },
    correctTerm() {
      const term = `${this.term.term} ${correctDescription(this.term)}`;
      if (!term) return 'Не выбран';
      return term.trim() || 'Не выбран';
    },
    riskPortfolio() {
      const risk = this.target.type.sections.find(s => s.default === 'portfolio-field');
      if (!risk) return 'Не выбран';
      return risk.modules[0].data.portfolio || 'Не выбран';
    },
  },
})
</script>

<style lang="scss" scoped>
.common {
  padding: 20px 30px;
  .elements {
    .element {
      max-width: 500px;
      width: fit-content;
      div {
        &:first-child {
          font-weight: 500;
          font-size: 30px;
          margin-bottom: 5px;
        }
        &:last-child {
          font-size: 12px;
          line-height: 14px;
          font-weight: 300;
          text-transform: uppercase;
          color: #858995;
        }
      }
      &:first-child {
        div {
          &:first-child {
            font-size: 16px;
          }
        }
      }
      &:not(:last-child) {
        margin-right: 70px;
      }
    }
  }
  .help {
    position: relative;
    &--header {
      cursor: help;
      span {
        color: #FE7815;
        margin-right: 10px;
        font-weight: 500;
      }
    }
    &--container {
      padding: 15px;
      position: absolute;
      right: 0;
      width: 400px;
      z-index: 100;
      top: 110%;
      background: #FFFFFF;
      box-shadow: 1px 1px 5px rgba(0, 50, 92, 0.1);
      border-radius: 20px;
      ul {
        li {
          > div {
            font-size: 14px;
            line-height: 14px;
            line-height: 16px;
            font-weight: 500;
            div {
              margin-top: 5px;
            }
            &:first-child {
              font-weight: 600;
              margin-bottom: 15px;
            }
            &:last-child {
              font-weight: 600;
              margin-top: 15px;
            }
          }
          &:not(:last-child) {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}

@media (max-width: 1550px) {
  .common {
    .elements {
      .element {
        max-width: 400px;
        &:not(:last-child) {
          margin-right: 50px;
        }
      }
    }
  }
}
@media (max-width: 1360px) {
  .common {
    .elements {
      .element {
        max-width: 400px;
        div {
          &:first-child {
            font-size: 24px;
          }
          &:last-child {
            font-size: 10px;
          }
        }
        &:not(:last-child) {
          margin-right: 40px;
        }
        &:first-child {
          div {
            &:first-child {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>