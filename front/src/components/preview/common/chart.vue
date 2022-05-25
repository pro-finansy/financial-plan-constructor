<template>
  <div class="page" :class="{ space: number !== 1 }" v-if="chart.length > 0">
    <main>
      <section class="info" :class="course">
        <div class="info--title">
          График пополнений
          <span v-if="course === 'one'">(Цель {{ number }})</span>
        </div>
        <div
          style="
            margin: 25px 25px;
            font-weight: 300;
            font-size: 14px;
            line-height: 14px;
          "
        >
          Предлагаем для удобства график пополнения вашей финансовой цели. Вы
          можете отмечать «галочками» те внесения, которые сделаны. Справа в
          графике вы можете писать суммы, которые вы уже накопили на счете.
          Пусть ваши финансовые цели будут достигнуты!
        </div>
        <div class="info--container">
          <table style="text-align: left">
            <thead>
              <tr>
                <th></th>
                <th style="width: 24%">Дата пополнения</th>
                <th style="width: 24%">Рекомендуемая сумма пополнений</th>
                <th style="width: 24%">Фактическая сумма пополнений</th>
                <th style="width: 24%">Накопленная сумма на счете</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(element, index) of chart"
                :key="index"
                class="space"
                :class="{ gray: index % 2 == 0 }"
              >
                <td>
                  <div
                    style="
                      width: 10px;
                      height: 10px;
                      border: 1px solid rgb(83, 83, 83);
                      position: relative;
                      top: 3px;
                    "
                  ></div>
                </td>
                <td>{{ element.date }}</td>
                <td>
                  {{ numberWithSpaces(element.amount) }} {{ element.sign }}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "CommonQuestionnaireTemplateChart",
  props: ["number", "chart", "course"],
  methods: {
    numberWithSpaces(x: number) {
      x = Number(x);
      return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
  },
});
</script>

<style lang="scss" scoped>
main {
  margin: 30px auto 0;
}
.info {
  border: 2px dashed rgba(0, 0, 0, 0.25);
  background: #fff;
  color: #000;
  margin: 30px 0;
  border-radius: 15px;
  margin: 0 42px;
  &.two {
    border: none;
    margin: 0;
    .info--title {
      padding: 20px 42px;
      color: #ffcc00;
      background: #000;
    }
    .info--container {
      border: 2px dashed rgba(0, 0, 0, 0.25);
      border-radius: 15px;
      padding: 15px 25px;
      margin: 20px 42px 0;
    }
    .description {
      margin: 20px 42px 0;
      font-size: 14px;
      font-style: italic;
    }
  }
  &--title {
    color: #000;
    font-weight: 800;
    font-size: 24px;
    padding: 20px 25px 0;
  }
  &--container {
    margin-top: 20px;
    padding: 0 25px 20px;
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      font-size: 13px;
      text-align: center;
      tr {
        td,
        th {
          padding: 10px 15px;
        }
        td {
          &:last-child {
            border-radius: 0 5px 5px 0;
          }
          &:first-child {
            border-radius: 5px 0 0 5px;
          }
        }
      }
      tbody {
        .gray {
          background-color: #e7e7e7;
        }
      }
    }
  }
}
</style>
