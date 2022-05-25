<template>
  <section>
    <Table :options="options" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Table from "@/components/common/table/index.vue";

export default defineComponent({
  name: "CurrenciesMain",
  data() {
    return {
      options: {
        name: "Валюты",
        id: "currency",
        request: "/api/currency/pag",
        actions: ["edit", "remove"],
        variables: ["name", "code", "sign"],
        header: [
          { id: "name", name: "Название", width: "50%" },
          { id: "code", name: "Код", width: "15%" },
          { id: "sign", name: "Символ валюты", width: "15%" },
          { id: "", name: "", width: "20%" },
        ],
      },
    };
  },
  components: {
    Table,
  },
});
</script>