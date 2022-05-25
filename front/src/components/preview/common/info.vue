<template>
  <section class="info" :class="course">
    <div class="info--title">Юридическая информация</div>
    <div class="info--container">
      <div class="el" v-for="(el, index) of content" :key="index">
        <div></div>
        <div>{{ el }}</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "CommonQuestionnaireTemplateInfo",
  props: ["content", "course"],
});
</script>

<style lang="scss" scoped>
.info {
  border: 2px dashed rgba(0, 0, 0, 0.25);
  background: #fff;
  color: #000;
  border-radius: 15px;
  margin: 30px 0;
  padding-bottom: 20px;
  &.two {
    border: none;
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
  }
  &--title {
    color: #000;
    font-weight: 800;
    font-size: 24px;
    padding: 20px 25px 0;
  }
  &--container {
    margin-top: 20px;
    padding: 0 25px;
    .el {
      margin-bottom: 10px;
      div {
        &:first-child {
          font-weight: 700;
          font-size: 10px;
          margin-bottom: 2px;
        }
        &:last-child {
          font-weight: 400;
          font-size: 13px;
          line-height: 16px;
        }
      }
    }
  }
}
</style>
