<template>
  <main>
    <div class="block">
      <div class="block--title">
        При составлении портфеля просим учесть важные моменты:
      </div>
      <div class="block--container">
        <div>
          <div>
            1. Расчет цели зависит от сумм и ставок инфляции и доходности.
            Помимо внешних факторов на доходность портфеля влияет и
            риск-профиль. Чем больше рискованных инструментов в портфеле, тем
            больше потенциальная доходность портфеля. В начале инвестиционного
            пути рекомендуем ориентироваться на исторически сложившиеся
            значения:
          </div>
        </div>
        <div>
          <div>• осторожный риск-профиль - доходность 6%</div>
          <div>• консервативный риск-профиль - доходность 8%</div>
          <div>• умеренный риск-профиль - доходность 10%</div>
          <div>• агрессивный риск-профиль - доходность 13%.</div>
          <div>• риск-профиль "Акции 100%" - доходность 15-17%.</div>
        </div>
        <div>
          <div>
            Фактическую доходность именно вашего портфеля вы сможете определить
            самостоятельно после того, как начнете инвестировать. Для
            справедливого результата нужно учитывать показатели не менее чем за 3
            года.
          </div>
        </div>
        <div class="checkbox">
          <input type="checkbox" @change="onChange" v-model="checkboxes[0]" />
        </div>
      </div>
    </div>
    <div class="block">
      <div class="block--container">
        <div>
          <div>
            2. Помните, что цель должна быть реалистична и достижима. Если
            калькулятор показывает ежемесячные платежи, которые вам не по силам,
            лучше провести расчет еще раз. Увеличить горизонт инвестирования или
            уменьшить сумму цели. Эксперт проверяет и составляет портфель на
            указанную вами сумму цели.
          </div>
        </div>
        <div class="checkbox">
          <input type="checkbox" @change="onChange" v-model="checkboxes[1]" />
        </div>
      </div>
    </div>
    <div class="block">
      <div class="block--container">
        <div>
          <div>
            3. Чем меньше срок инвестирования, тем более консервативным должен
            быть ваш портфель. На коротком сроке рискованные активы могут не
            дать нужной доходности или привести к убыткам. Акции - высоко
            волатильный инструмент, использовать их более безопасно в
            долгосрочных целях.
          </div>
        </div>
        <div class="checkbox">
          <input type="checkbox" @change="onChange" v-model="checkboxes[2]" />
        </div>
      </div>
    </div>
    <div class="block">
      <div class="block--container">
        <div>
          <div>
            4. При отборе инструментов в портфель проверяйте возможность купить
            их у вашего брокера. Эксперт проверяет ваш портфель исходя из того,
            что вы полноценно выполнили домашнее задание и проверили наличие
            ценных бумаг у вашего брокера.
          </div>
        </div>
        <div class="checkbox">
          <input type="checkbox" @change="onChange" v-model="checkboxes[3]" />
        </div>
      </div>
    </div>
    <div class="block">
      <div class="block--container">
        <div>
          <div>
            5. Подтверждаю, что я изучил(а) все важные моменты перед
            составлением портфеля
          </div>
        </div>
        <div class="checkbox">
          <input type="checkbox" @change="onChange" v-model="checkboxes[4]" />
        </div>
      </div>
    </div>
    <div class="block">
      <div class="block--title">
        Для продолжения отметьте пункты в подтверждение того, что вы
        ознакомились.
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  emits: ['changePending'],
  name: "ModalContainerInfo",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checkboxes: [false, false, false, false, false],
    };
  },
  methods: {
    onChange() {
      if (this.checkboxes.filter((c) => !c).length === 0) {
        this.$emit('changePending', false);
      } else {
        this.$emit('changePending', true);
      }
    },
  },
});
</script>

<style scoped lang="scss">
main {
  flex-grow: 1;
  overflow: auto;
  padding: 0 25px;
  .block {
    font-size: 15px;
    line-height: 17px;
    padding-bottom: 10px;
    margin-right: 30px;
    &--title {
      font-weight: 600;
      margin-bottom: 15px;
    }
    &--container {
      position: relative;
      > div {
        > div {
          margin-bottom: 5px;
        }
      }
      .checkbox {
        right: -30px;
        top: calc(50% - 10px);
        position: absolute;
      }
    }
    &:last-child {
      padding-bottom: 0;
      margin-top: 10px;
      .block--title {
        margin-bottom: 0;
      }
    }
  }
}
</style>
