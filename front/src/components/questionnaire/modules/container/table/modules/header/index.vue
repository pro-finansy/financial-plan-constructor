<template>
  <header class="flex items-center justify-between">
    <div class="targets flex">
      <div
        class="target"
        v-for="target of targets"
        :class="{ selected: selectedTargetId === target.id }"
        :key="target.id"
        @click="$emit('selectTarget', target)"
      >
        {{ target.name }}
      </div>
    </div>
    <div class="actions flex" v-if="!pivot">
      <button v-if="status" @click="$store.commit('createModal', { id: 'insurance-edit', data: insurance })" class="btn btn--border">{{ insuranceStatus }} страховые продукты</button>
      <button v-else class="btn btn--border btn--disabled">{{ insuranceStatus }} страховые продукты</button>
      <button @click="$store.commit('addTarget', 'STUDENT'); $emit('addStudentTarget')" v-if="status && targets.length < 3" class="btn btn--green">Добавить цель</button>
      <button v-else-if="targets.length < 3" class="btn btn--green btn--disabled">Добавить цель</button>
      <button @click="removeTarget" v-if="status && selectedTargetId !== 1" class="btn btn--green">Удалить цель</button>
      <button v-else-if="selectedTargetId !== 1" class="btn btn--green btn--disabled">Удалить цель</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from "vue-demi";
import { Questionnaire } from "@/interfaces/dto/questionnaire";

export default defineComponent({
  name: "QuestionnaireTableHeader",
  emits: ['selectTarget', 'addStudentTarget', 'removeStudentTarget'],
  props: {
    targets: {
      type: Array as PropType<Array<Questionnaire.QTarget>>,
      required: true,
    },
    insurance: {
      type: Object,
      required: true
    },
    selectedTargetId: {
      type: Number,
      required: true
    },
    pivot: {
      type: Boolean,
      default: false
    },
  },
  setup() {
    const status = inject('status');
    return { status };
  },
  computed: {
    insuranceStatus() {
      let status = Object.values(this.insurance).find(v => v);
      return status ? 'Изменить' : 'Добавить';
    }
  },
  methods: {
    removeTarget() {
      this.emitter.emit('removeStudentTarget', this.selectedTargetId);
    }
  }
});
</script>

<style lang="scss" scoped>
header {
  padding: 15px 30px;
  .targets {
    .target {
      cursor: pointer;
      color: #949494;
      transition: 0.2s all;
      border-bottom: 2px solid transparent;
      padding: 8px 0;
      &.selected {
        transition: 0.2s all;
        color: #292929;
        border-bottom-color: #292929;
      }
      &:not(:last-child) {
        margin-right: 25px;
      }
    }
  }
  .actions {
    button {
      &:nth-child(2), &:nth-child(3) {
        margin-left: 10px;
      }
    }
  }
}
</style>