<template>
  <header class="table--header flex items-center justify-between">
    <div class="table--header-title">{{ options.name }}</div>
    <div class="flex items-center">
      <TableFilters 
        v-if="options.id === 'questionnaire_notverified'" 
        @onFilters="onFilters"
      />
      <TableSearch
        v-if="options.id !== 'questionnaire_student'"
        @onSearch="onSearch"
      />
      <TableExcel :options="options" />
      <TableActions :options="options" @updateTable="$emit('updateTable')" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import TableSearch from "./header/TableSearch.vue";
import TableActions from "./header/TableActions.vue";
import TableExcel from "./header/TableExcel.vue";
import TableFilters from "./header/TableFilters.vue";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "TableHeader",
  emits: ['onFilters', 'onSearch', 'updateTable'],
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onSearch(search: string) {
      this.$emit("onSearch", search);
    },
    onFilters(query: dynamicsObject) {
      this.$emit("onFilters", query);
    },
  },
  components: {
    TableSearch,
    TableActions,
    TableExcel,
    TableFilters,
  },
});
</script>

<style lang="scss" scoped>
.table--header {
  &-title {
    min-width: 300px;
    font-weight: 500;
    font-size: 20px;
    letter-spacing: 0.05em;
  }
}
</style>
