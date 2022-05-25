<template>
  <main>
    <div v-if="isMessage">{{ data.content.message }}</div>
    <Inputs
      :action="data.content.action"
      :datas="datas"
      :module="data.inputs"
      :targetTotal="targetTotal"
      :targetCurrencyId="targetCurrencyId"
      :targetId="targetId"
      :course="$store.getters.course"
      v-if="data.content.action !== 'remove'"
    />
    <div v-else-if="isRemove">{{ messageRemove }}</div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Inputs from "./ModalInputs.vue";

export default defineComponent({
  name: "ModalContainer",
  props: {
    data: {
      type: Object,
      required: true,
    },
    datas: {
      type: Object,
      required: true,
    },
    targetTotal: {},
    targetCurrencyId: {
      type: String,
      default: 'RUB',
    },
    targetId: {
      type: [Number, String]
    }
  },
  computed: {
    isMessage() {
      return this.data.content.action === 'message';
    },
    isRemove() {
      return this.data.content.action === 'remove';
    },
    messageRemove() {
      return `Вы действительно хотите удалить ${ this.data.content.message }?`;
    }
  },
  components: {
    Inputs,
  },
});
</script>

<style lang="scss" scoped>
main {
  flex-grow: 1;
  overflow: auto;
  padding: 0 25px;
  .inputs {
    background-color: #fff;
  }
  &.overflowMain {
    overflow: visible;
  }
}
</style>