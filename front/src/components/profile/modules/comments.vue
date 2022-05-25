<template>
  <section class="comments">
    <div class="comments--title">Комментарии</div>
    <div class="comments--container">
      <div class="section" v-for="section of currentComments" :key="section.id">
        <div class="section--name">{{ section.name }}</div>
        <div class="section--container flex wrap-wrap justify-between">
          <div
            class="comment"
            v-for="comment of section.sections"
            :key="comment.id"
          >
            <div class="comment--name">{{ comment.name }}</div>
            <textarea
              v-model="user.comments[comment.id]"
              placeholder="Введите комментарий"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="comments--action flex justify-end">
      <button class="btn btn--green btn--fit" @click="saveComments">
        Сохранить
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { COMMENTS } from "../constants";
import { COURSES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "ProfileComments",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: COMMENTS,
    };
  },
  computed: {
    currentComments() {
      this.setComments();
      return this.comments;
    },
  },
  methods: {
    setComments() {
      if (this.user.course.type === COURSES_ENUM.ONE) {
        this.comments[2].sections = [
          { id: "student", name: "Комментарий эксперта на портфель студента" },
        ];
      } else {
        this.comments[2].sections = [
          { id: "stock", name: "Обзор рисковой части" },
          { id: "bond", name: "Обзор консервативной части" },
          { id: "alternative", name: "Обзор защитной части" },
          { id: "tactic", name: "Тактические идеи" },
        ];
      }
    },
    async saveComments() {
      const result = await this.API.common.onSaveComments({
        comments: this.user.comments,
      });
      this.$store.commit("updateUser", result.data);
    },
  },
});
</script>

<style lang="scss" scoped>
.comments {
  width: 100%;
  margin-top: 30px;
  background: #ffffff;
  border-radius: 10px;
  padding: 25px;
  &--title {
    font-weight: 500;
    font-size: 24px;
  }
  &--container {
    margin-top: 20px;
    .section {
      &--name {
        font-size: 24px;
      }
      &--container {
        margin-top: 10px;
        .comment {
          width: 48%;
          margin-bottom: 15px;
          &--name {
            margin-bottom: 5px;
            font-size: 12px;
            color: #7d8e9e;
          }
          textarea {
            height: 120px;
            font-size: 13px;
            padding: 10px 15px;
            font-family: "Raleway", sans-serif;
          }
        }
      }
    }
  }
}
</style>
