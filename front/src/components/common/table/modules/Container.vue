<template>
  <section class="table--container">
    <table>
      <ContainerHeader
        :header="options.header"
        :query="query"
        :id="options.id"
        @selectedFilter="selectedFilter"
        @selectDateQuery="selectDateQuery"
        @selectTargetLength="$emit('selectTargetLength')"
      />
      <ContainerPreloadBody v-if="pending" :variables="options.variables" />
      <ContainerBody v-else :data="data" :options="options" />
    </table>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import ContainerHeader from "./container/ContainerHeader.vue";
import ContainerBody from "./container/ContainerBody.vue";
import ContainerPreloadBody from "./container/ContainerPreloadBody.vue";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "TableContainer",
  emits: ["selectDateQuery", "selectTargetLength", "selectedFilter"],
  props: {
    options: {
      type: Object,
      required: true,
    },
    data: {
      type: Array as PropType<Array<dynamicsObject>>,
      required: true,
    },
    pending: {
      type: Boolean,
      required: true,
    },
    query: {
      type: Object,
      required: true,
    },
  },
  methods: {
    selectDateQuery(data: dynamicsObject) {
      this.$emit("selectDateQuery", data);
    },
    selectedFilter(filter: string) {
      this.$emit("selectedFilter", filter);
    },
  },
  components: {
    ContainerBody,
    ContainerHeader,
    ContainerPreloadBody,
  },
});
</script>

<style lang="scss" scoped>
.table--container {
  margin-top: 30px;
  table {
    width: 100%;
  }
}
</style>
