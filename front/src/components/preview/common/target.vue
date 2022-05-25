<template>
  <section class="target" :class="questionnaire">
    <div class="target--title" v-if="questionnaire !== COURSES_ENUM.TWO">
      Цель {{ target.id }}
    </div>
    <div class="target--container">
      <div class="element space">
        <div v-if="questionnaire === COURSES_ENUM.ONE">Финансовое благополучие:</div>
        <div v-if="questionnaire === COURSES_ENUM.TWO">Формулировка цели по SMART:</div>
        <div>{{ target.name }}</div>
      </div>
      <div v-if="target.type === 2" class="element space">
        <div>Желаемый пассивный доход в месяц (по текущим ценам):</div>
        <div>
          {{ numberWithSpaces(target.income) }} {{ target.mainCurrency }}
        </div>
      </div>
      <div v-if="target.type === 1" class="element space">
        <div>Сумма цели с учетом инфляции:</div>
        <div>
          {{ numberWithSpaces(target.passive) }} {{ target.mainCurrency }}
        </div>
      </div>
      <div class="element space">
        <div>Срок:</div>
        <div>{{ target.term }}</div>
      </div>
      <div class="element space">
        <div>Имеющиеся ресурсы для достижения цели:</div>
        <div>
          {{ numberWithSpaces(target.resourses) }} {{ target.mainCurrency }}
        </div>
      </div>
      <div class="element space">
        <div>Процент достижения цели:</div>
        <div>Цель достигнута на {{ target.percent }}%</div>
      </div>
      <div v-if="target.type === 2" class="element space">
        <div>Сумма пассивного дохода в месяц с учетом инфляции:</div>
        <div>
          {{ numberWithSpaces(target.passive) }} {{ target.mainCurrency }}
        </div>
      </div>
      <div v-if="target.type === 2" class="element space">
        <div>Необходимый капитал для пассивного дохода с учетом инфляции:</div>
        <div>
          {{ numberWithSpaces(target.capital) }} {{ target.mainCurrency }}
        </div>
      </div>
      <div class="element space">
        <div>Необходимые финансы для достижения цели:</div>
        <div>
          {{ numberWithSpaces(target.conclusion.amount) }}
          {{ target.mainCurrency }}
        </div>
      </div>
      <div class="element space">
        <div>Риск-профиль:</div>
        <div>
          <div>{{ target.riskPortfolio.name }}</div>
          <div>
            Рекомендуется при {{ target.riskPortfolio.tag }} риск-профиле
            придерживаться данного соотношения классов активов:
          </div>
          <div>
            <img
              style="width: 375px"
              :src="'../' + target.riskPortfolio.src"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="element space">
        <div>Периодичность пополнения портфеля:</div>
        <div>
          В конце отчета для удобства есть график пополнений вашей цели. Вы
          можете отмечать «галочками» те внесения, которые сделаны. Справа в
          графике вы можете писать суммы, которые вы уже накопили на счете.
          Пусть ваши финансовые цели будут достигнуты!
        </div>
      </div>
      <div class="element space">
        <div>Сумма, которую сейчас посильно вносить:</div>
        <div v-if="target.conclusion.period === 'без пополнений'">
          Без пополнений
        </div>
        <div v-else>
          {{ numberWithSpaces(target.conclusion.replenishment) }}
          {{ target.mainCurrency }}/{{ target.conclusion.period }}
        </div>
      </div>
      <div class="element space">
        <div>Комментарий по формированию цели:</div>
        <div v-html="parseLinks(target.conclusion.comment)"></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { COURSES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "CommonQuestionnaireTemplateTarget",
  props: ["target", "questionnaire"],
  data() {
    return {
      COURSES_ENUM: COURSES_ENUM
    }
  },
  methods: {
    numberWithSpaces(x: number) {
      if (this.questionnaire === COURSES_ENUM.ONE) return x;
      x = Number(x);
      return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    parseLinks(text: string) {
      return `<pre style="white-space: pre-wrap; text-align: justify;">${text
        .replace(
          /\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g,
          '<a style="color: rgb(0, 89, 255);" href="$1">$1</a>'
        )
        .replace(/([*].+?[*])/g, "<strong>$1</strong>")
        .replace(/\*/g, "")}</pre>`;
    },
  },
});
</script>

<style lang="scss" scoped>
.target {
  margin: 25px 0 0;
  padding: 15px;
  border: 2px dashed #369b5f;
  border-radius: 15px;
  background: #ffffff;
  color: #000000;
  &.two {
    margin: 25px 42px 0 42px;
    border: 2px dashed #ffcc00;
  }
  &--title {
    font-weight: 800;
    font-size: 24px;
    margin-bottom: 20px;
  }
  &--container {
    .description {
      font-style: italic;
      font-size: 12px;
      margin-bottom: 15px;
      font-weight: 400;
      word-break: break-all;
    }
    .element {
      margin-bottom: 15px;
      position: relative;
      > div {
        display: table-cell;
        &:first-child {
          font-weight: 700;
          margin-right: 40px;
          padding: 0 30px 0 0;
          vertical-align: top;
          width: 200px;
          font-size: 12px;
        }
        &:last-child {
          font-size: 12px;
          font-weight: 400;
          > div:not(:last-child) {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
