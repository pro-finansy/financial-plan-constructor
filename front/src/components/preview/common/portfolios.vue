<template>
  <div class="portfolios" v-if="target">
    <div
      class="page"
      style="position: relative"
      v-if="Number(target.status.existing) === 1"
    >
      <main>
        <section v-if="course === 'one'" class="analysis--header space">
          Анализ существующего портфеля: (Цель {{ target.number }})
        </section>
        <section v-if="course === 'two'" class="analysis--header space two">
          Стартовый портфель
        </section>
        <div class="description space" v-if="course === 'two'">
          Стартовый портфель — это портфель, который вы составили для
          первоначальных инвестиций. Сумма этого портфеля = сумма первых
          вложений, которые вы планируете осуществить.
        </div>
        <common-questionnaire-template-portfolio
          :course="course"
          :target="target"
          :index="0"
        />
      </main>
    </div>
    <div
      class="page"
      style="position: relative"
      v-if="Number(target.status.student) === 1"
    >
      <main>
        <section v-if="course === 'one'" class="analysis--header blue space">
          Анализ портфеля ученика на всю сумму цели: (Цель {{ target.number }})
        </section>
        <section
          v-if="course === 'two'"
          class="analysis--header green space two"
        >
          Портфель на сумму цели
        </section>
        <div class="description space" v-if="course === 'two'">
          Портфель на сумму цели — это портфель, который вы составили для общей
          (итоговой) суммы вашей цели. Сумма этого портфеля = итоговая сумма
          вашей финансовой цели.
        </div>
        <common-questionnaire-template-portfolio
          :course="course"
          :class="course === 'one' ? 'blue' : 'green'"
          :target="target"
          :index="1"
        />
      </main>
    </div>
    <div
      class="page"
      style="position: relative"
      v-if="Number(target.status.expert) === 1"
    >
      <main>
        <section v-if="course === 'one'" class="analysis--header purple space">
          Портфель, предлагаемый экспертом: (Цель {{ target.number }})
        </section>
        <section
          v-if="course === 'two'"
          class="analysis--header orange space two"
        >
          Портфель от эксперта
        </section>
        <div class="description space" v-if="course === 'two'">
          Портфель эксперта — это то, как может выглядеть инвестиционный
          портфель на финальную сумму цели с учётом корректировкок и предложений
          эксперта. Сумма этого портфеля = итоговая сумма вашей финансовой цели.
          Вы можете использовать этот портфель, как ориентир или один из
          вариантов, но не как инвестиционную рекомендацию.
        </div>
        <common-questionnaire-template-portfolio
          :course="course"
          :class="course === 'one' ? 'purple' : 'orange'"
          :target="target"
          :index="2"
        />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import CommonQuestionnaireTemplatePortfolio from "./portfolio.vue";

export default defineComponent({
  name: "CommonQuestionnaireTemplatePortfolios",
  props: ["target", "course"],
  components: {
    CommonQuestionnaireTemplatePortfolio,
  },
});
</script>

<style lang="scss" scoped>
main {
  .description {
    font-size: 13px;
    line-height: 16px;
    padding: 20px 60px 0;
  }
}
.analysis--header {
  margin: 0 42px;
  font-weight: 800;
  font-size: 20px;
  background: #fcc033;
  border-radius: 15px;
  padding: 16px 25px;
  line-height: 23px;
  height: 55px;
  &.two {
    height: auto;
    margin: 0;
    margin-top: 30px;
    border-radius: 0;
    background: #000 !important;
    padding: 20px 42px;
    color: #ffcc00;
    font-size: 24px;
  }
}

.analysis--header.blue {
  background: #5c6bc0;
  color: #fff;
}

.analysis--header.purple {
  background: #941e76;
  color: #ffffff;
}

.analysis--header.green {
  color: #27ab5d;
}

.analysis--header.orange {
  color: #ff8b22;
}

.analysis--header.red {
  background-color: #f44336;
  color: #ffffff;
}
</style>
