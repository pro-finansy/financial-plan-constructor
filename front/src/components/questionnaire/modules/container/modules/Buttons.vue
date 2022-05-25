<template>
  <div class="questionnaire--buttons flex justify-center" v-if="role !== 'STUDENT'">
    <button v-if="!status && !pending" class="btn btn--qn btn--green btn--disabled">
      Закончить
    </button>
    <button v-else-if="!pending" class="btn btn--qn btn--green" @click="$emit('finish')">
      Закончить
    </button>
    <button v-else-if="pending" class="btn btn--qn btn--green btn--disabled">
      Обработка...
    </button>
  </div>
  <div class="questionnaire--buttons flex justify-center" v-else>
    <button class="btn btn--qn btn--border" @click="$emit('modeChange')">{{ mode === 'list' ? 'Портфель' : 'В анкету' }}</button>
    <button v-if="!status && mode !== 'list'" class="btn btn--qn btn--green btn--disabled">Отправить на проверку</button>
    <button v-else-if="!pending && mode !== 'list'" class="btn btn--qn btn--green" @click="$store.commit('createModal', { id: 'verification', data: {} })">Отправить на проверку</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue-demi";

export default defineComponent({
  name: "QuestionnaireButtons",
  emits: ["modeChange", "finish"],
  props: {
    pending: {
      type: Boolean,
      required: true
    },
    status: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  setup() {
    const role = inject('role');
    return { role }
  }
});
</script>

<style lang="scss" scoped>
.questionnaire--buttons {
  width: 70%;
  margin: 40px auto 80px;
  button {
    &:nth-child(2) {
      margin-left: 10px;
    }
  }
}
</style>
