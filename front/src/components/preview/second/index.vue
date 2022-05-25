<template>
  <div class="page">
    <Header />
    <main>
      <CommonQuestionnaireTemplateUsers
        :expert="expert"
        :student="student"
        questionnaire="two"
      />
      <div class="targets">
        <div class="targets--title">Финансовая цель</div>
      </div>
      <CommonQuestionnaireTemplateTarget
        v-for="target of targets"
        :target="target"
        questionnaire="two"
        :key="target.id"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Header from "./header.vue";
import CommonQuestionnaireTemplateUsers from "../common/users.vue";
import CommonQuestionnaireTemplateTarget from "../common/target.vue";

export default defineComponent({
  name: "SecondQuestionnaireTemplate",
  props: ["expert", "student", "targets"],
  components: {
    Header,
    CommonQuestionnaireTemplateUsers,
    CommonQuestionnaireTemplateTarget,
  },
});
</script>

<style lang="scss" scoped>
main {
  margin: 30px auto 0;
  section {
    padding: 0 42px;
  }
}
.targets {
  margin: 30px 0;
  background: #000;
  padding: 20px 42px;
  &--title {
    line-height: 23px;
    font-weight: 800;
    color: #ffcc00;
    font-size: 24px;
  }
}
</style>
