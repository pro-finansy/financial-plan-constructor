<template>
  <section>
    <Table :options="options" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Table from "@/components/common/table/index.vue";

export default defineComponent({
  name: "AssetsMain",
  data() {
    return {
      options: {
        name: "Смешанные активы",
        id: "asset",
        request: "/api/asset/pag",
        actions: ["edit", "remove"],
        variables: ["name", "stock", "bond", "alternative"],
        header: [
          { id: "name", name: "Наименование актива", width: "25%" },
          { id: "stock", name: "Процент акций", width: "20%" },
          { id: "bond", name: "Процент облигаций", width: "20%" },
          { id: "alternative", name: "Процент альтернативы", width: "20%" },
          { id: "", name: "", width: "10%" },
        ],
      },
    };
  },
  components: {
    Table,
  },
});
</script>