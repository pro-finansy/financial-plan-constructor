<template>
  <div class="page">
    <Header />
    <main>
      <CommonQuestionnaireTemplateUsers
        :expert="expert"
        questionnaire="one"
        :student="student"
      />
      <section class="targets">
        <div class="targets--title" style="color: #fff">Финансовые цели</div>
      </section>
      <CommonQuestionnaireTemplateTarget
        v-for="target of targets"
        questionnaire="one"
        :target="target"
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
  name: "FirstQuestionnaireTemplate",
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
  padding: 0 42px;
}
.targets {
  margin: 20px 0;
  background: #058255;
  border-radius: 15px;
  color: #fff;
  padding: 20px 25px;
  &--title {
    font-weight: 800;
    font-size: 24px;
  }
}
</style>
