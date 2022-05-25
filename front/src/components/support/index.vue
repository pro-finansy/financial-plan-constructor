<template>
  <section>
    <Table :options="options" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Table from "@/components/common/table/index.vue";

export default defineComponent({
  name: "ExpertMain",
  data() {
    return {
      options: {
        name: "Служба поддержки",
        id: "support",
        request: "/api/user/support/pag",
        actions: ["edit", "remove"],
        variables: ["avatar", "active", "name", "phone", "email"],
        header: [
          { id: "avatar", name: "Фото", width: "10%" },
          { id: "active", name: "Активность", width: "10%" },
          { id: "name", name: "ФИО", width: "17.5%" },
          { id: "phone", name: "Телефон", width: "15%" },
          { id: "email", name: "Email", width: "17.5%" },
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

<style lang="scss" scoped>
</style>
