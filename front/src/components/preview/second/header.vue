<template>
  <header class="flex justify-between">
    <div class="left">
      <img src="/images/questionnaire/header.png" alt="" />
    </div>
    <div class="right">
      <div class="title">Ваш финансовый план</div>
      <div class="description">по итогам курса «Я – Инвестор 2.0»</div>
      <div class="footer flex">
        <ul class="flex wrap-wrap">
          <li>Финансовая цель</li>
          <li>Портфель от эксперта</li>
          <li>Стартовый портфель</li>
          <li>Итоговый комментарий</li>
          <li>Портфель на сумму цели</li>
          <li>График пополнений</li>
        </ul>
        <div class="copyright">
          <div>Pro.Finansy</div>
          <div>Академия создания капитала</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "SecondQuestionnaireTemplateHeader",
});
</script>

<style lang="scss" scoped>
header {
  background: #000;
  font-weight: 800;
  padding: 5px 45px;
  position: relative;
  .left {
    min-width: 230px;
    img {
      width: 175px;
    }
  }
  .right {
    padding: 25px 0;
    .title {
      font-size: 34px;
      color: #fff;
      text-transform: uppercase;
      margin-bottom: 25px;
    }
    .description {
      font-size: 24px;
      font-weight: 800;
      text-transform: uppercase;
      color: #ffcc00;
    }
    .footer {
      margin-top: 45px;
      ul {
        list-style: disc;
        width: 80%;
        margin-left: 15px;
        li {
          width: 50%;
          margin-bottom: 5px;
          font-size: 12px;
          font-weight: 300;
          color: rgb(248, 248, 248);
        }
      }
      .copyright {
        width: 105px;
        div {
          &:first-child {
            color: #ffcc00;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          &:last-child {
            font-size: 11px;
            font-weight: 300;
            color: rgb(248, 248, 248);
          }
        }
      }
    }
  }
}
</style>
