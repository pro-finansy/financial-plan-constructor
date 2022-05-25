<template>
  <div class="table--pagination flex justify-end">
    <el-pagination
      background
      @current-change="onSelectPage"
      layout="prev, pager, next"
      :page-size="query.limit"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  emits: ["selectPage"],
  name: "TablePagination",
  props: {
    total: {
      type: Number,
      required: true,
    },
    query: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onSelectPage(page: number) {
      this.$emit("selectPage", page);
    },
  },
});
</script>

<style lang="scss" scoped>
.table--pagination {
  margin-top: 20px;
}
</style>
