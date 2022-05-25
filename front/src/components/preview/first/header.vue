<template>
  <header>
    <div class="container">
      <div class="title">Ваш финансовый план</div>
      <div class="description">по итогам курса «Капитал: Инвестируем валюту»</div>
    </div>
    <div style="position: absolute; right: 50px; top: -30px; width: 130px">
      <img src="/images/questionnaire/header.webp" alt="" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "FirstQuestionnaireTemplateHeader",
});
</script>

<style lang="scss" scoped>
header {
  background: linear-gradient(272.18deg, #006a44 0%, #058255 100%);
  text-transform: uppercase;
  font-weight: 800;
  padding: 40px 45px;
  position: relative;
  .title {
    font-size: 32px;
    color: #fff;
    margin-bottom: 25px;
  }
  .description {
    font-size: 20px;
    color: #004d31;
  }
  div {
    img {
      width: 100%;
    }
  }
}
</style>
