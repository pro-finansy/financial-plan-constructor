<template>
  <div class="flex justify-end">
    <button class="btn btn--white" @click="$emit('removeModal')" v-if="data.content.action === 'message'">Нет</button>
    <button class="btn btn--white" @click="$emit('removeModal')" v-else>Отмена</button>
    <button class="btn btn--green" v-if="isAdd" @click="submit">Добавить</button>
    <button class="btn btn--green" v-else-if="isEdit" @click="submit">
      {{ data.content.button || 'Сохранить' }}
    </button>
    <button class="btn btn--green" v-else-if="isRemove" @click="submit">Удалить</button>
    <button class="btn btn--green" v-else-if="isMessage" @click="submit">Да</button>
    <button class="btn btn--green" v-else-if="isInfo" @click="submit">Ознакомлен(а)</button>
    <button class="btn btn--green btn--disabled" v-else-if="isInfoDisabled">Ознакомлен(а)</button>
    <button class="btn btn--green btn--disabled" v-else>Обработка...</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "ModalActions",
  emits: ["removeModal", "submit"],
  props: {
    data: {
      type: Object,
      required: true,
    },
    pending: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      date: 0
    }
  },
  computed: {
    isAdd() {
      return !this.pending && this.data.content.action === 'add';
    },
    isEdit() {
      return !this.pending && this.data.content.action === 'edit';
    },
    isRemove() {
      return !this.pending && this.data.content.action === 'remove';
    },
    isMessage() {
      return !this.pending && this.data.content.action === 'message';
    },
    isInfo() {
      return !this.pending && this.data.content.action === 'info';
    },
    isInfoDisabled() {
      return this.pending && this.data.content.action === 'info';
    }
  },
  methods: {
    submit() {
      if (Date.now() - this.date < 1000) return;
      this.date = Date.now();
      this.$emit('submit');
    }
  }
});
</script>

<style lang="scss" scoped>
div {
  padding: 0 30px;
  margin-top: 20px;
  button:nth-child(2) {
    margin-left: 10px;
  }
}
</style>