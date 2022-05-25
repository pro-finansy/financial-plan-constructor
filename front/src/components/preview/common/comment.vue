<template>
  <main class="space" :class="course">
    <section
      v-if="course === 'one'"
      class="analysis--header red"
      :class="course"
    >
      Итоговый комментарий эксперта:
    </section>
    <section
      v-if="course === 'two'"
      class="analysis--header red"
      :class="course"
    >
      Итоговый комментарий эксперта
    </section>
    <section class="comment" :class="course">
      <div class="comment--container">
        <pre
          style="white-space: pre-line; line-height: 16px"
          class="commentLinks"
          v-html="parseLinks(commonComment)"
        ></pre>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "CommonQuestionnaireTemplateComment",
  props: ["course", "commonComment"],
  methods: {
    parseLinks(text: string) {
      return text
        .replace(
          /\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g,
          '<a style="color: rgb(0, 89, 255);" href="$1">$1</a>'
        )
        .replace(/([*].+?[*])/g, "<strong>$1</strong>")
        .replace(/\*/g, "");
    },
  },
});
</script>

<style lang="scss" scoped>
.analysis--header {
  font-weight: 800;
  font-size: 20px;
  color: #fff;
  background: #f44336;
  border-radius: 15px;
  padding: 16px 25px;
  line-height: 23px;
  &.two {
    height: auto;
    margin: 0;
    border-radius: 0;
    background: #000 !important;
    padding: 20px 42px;
    color: #ffcc00;
    font-size: 24px;
  }
}
.comment {
  color: #000;
  padding: 20px 25px;
  font-size: 12px;
  border-radius: 15px;
  border: 2px dashed #f44336;
  margin-top: 20px;
  &.two {
    border: 2px dashed #ffcc00;
    font-size: 14px;
    margin: 20px 42px 0;
  }
}
</style>
