<template>
  <section>
    <div class="information flex direction-column">
      <button class="btn btn--green" @click="$router.push('/expert/notverified')">
        Вернуться на главную
      </button>
      <button
        class="btn btn--green"
        style="margin-top: 10px"
        @click="$router.push(`/questionnaire/${questionnaire_id}`)"
      >
        Вернуться к редактированию
      </button>
      <div class="information--container">
        <div>
          Это предпросмотр анкеты. Вы можете ознакомиться с данными, которые
          увидит студент в PDF-файле.
        </div>
      </div>
    </div>
    <div class="download">
      <button v-if="loading" class="btn btn--green btn--disabled">
        Собираем итоговый отчёт...
      </button>
      <button
        v-else-if="!pending"
        class="btn btn--green"
        @click="$emit('create')"
      >
        Скачать отчёт
      </button>
      <button v-else class="btn btn--green btn--disabled">Качаем...</button>
    </div>
    <div class="student" v-if="!loading">
      <button
        v-if="!pendingStudent"
        class="btn btn--green"
        @click="modal('questionnaire-send', {})"
      >
        Отправить студенту
      </button>
      <button v-else class="btn btn--green btn--disabled">Отправляем...</button>
      <button
        v-if="!pendingOnePage"
        class="btn btn--green"
        @click="$emit('createOnePage')"
      >
        Собрать одностраничный отчёт
      </button>
      <button v-else class="btn btn--green btn--disabled">Собираем...</button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "CommonQuestionnaireActions",
  emits: ["create", "createOnePage"],
  props: [
    "loading",
    "pending",
    "pendingStudent",
    "pendingOnePage",
    "questionnaire_id",
  ],
  methods: {
    modal(id: string, data: dynamicsObject) {
      this.$store.commit("createModal", { id, data });
    },
  },
});
</script>

<style lang="scss" scoped>
.information {
  z-index: 1;
  position: fixed;
  top: 10px;
  left: 10px;
  &--container {
    border-radius: 10px;
    background: #fff;
    padding: 15px;
    max-width: 220px;
    font-weight: 400;
    font-size: 14px;
    margin-top: 10px;
  }
}
.download {
  button {
    z-index: 1;
    position: fixed;
    right: 10px;
    top: 10px;
  }
}
.student {
  button {
    position: fixed;
    top: 60px;
    right: 10px;
    z-index: 1;
    &:last-child {
      top: 110px;
    }
  }
}
</style>
