<template>
  <section>
    <Table :options="options" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Table from "@/components/common/table/index.vue";

export default defineComponent({
  name: "StudentMain",
  data() {
    return {
      options: {
        name: "Мои работы",
        id: "questionnaire_student",
        request: "/api/student/questionnaires",
        actions: ["remove"],
        import: true,
        variables: ["course", "targetName", "updatedAt", "sentedAt", "completedAt", "filePortfolio", "fileExpert", "status"],
        header: [
          { id: "course", name: "Курс", width: "15%" },
          { id: "targetName", name: "Название", width: "12%" },
          { id: "updatedAt", name: "Дата редакт.", width: "12%" },
          { id: "sentedAt", name: "Дата сдачи", width: "12%" },
          { id: "completedAt", name: "Дата проверки", width: "12%" },
          { id: "filePortfolio", name: "Инвест. портфель", width: "12%" },
          { id: "fileExpert", name: "Отчёт эксперта", width: "12%" },
          { id: "status", name: "Статус", width: "10%" },
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