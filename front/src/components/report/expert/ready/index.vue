<template>
  <section>
    <Table :options="options" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Table from "@/components/common/table/index.vue";

export default defineComponent({
  name: "ReportProcessExpertMain",
  data() {
    return {
      options: {
        name: "Готовые отчёты",
        id: "questionnaire_ready",
        request: ``,
        actions: ["download", "remove"],
        variables: ["studentEmail", "report", "sentedAt", "course", "completedAt", "seconds", "status"],
        header: [
          { id: "studentEmail", name: "Email клиента", width: "15%" },
          { id: "report", name: "Отчёт", width: "10%" },
          { id: "sentedAt", name: "Дата сдачи", width: "15%", filters: { selected: false, filter: '', collection: 'sentedAt', type: 'DATE', list: [] } },
          { id: "course", name: "Курс", width: "15%" },
          { id: "completedAt", name: "Дата проверки", width: "15%", filters: { selected: false, filter: '', collection: 'completedAt', type: 'DATE', list: [] } },
          { id: "seconds", name: "Затраченное время", width: "15%", filters: { selected: false, filter: '', collection: 'seconds', type: 'MAXMIN', list: [] } },
          { id: "status", name: "Статус", width: "15%" },
          { id: "", name: "", width: "10%" },
        ],
      },
    };
  },
  created() {
    this.options.request = `/api/questionnaire/expert/ready/${this.$store.getters.user._id}`;
  },
  components: {
    Table,
  },
});
</script>