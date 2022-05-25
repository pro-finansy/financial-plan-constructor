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
        name: "Отчёты в процессе",
        id: "questionnaire_process",
        request: ``,
        actions: ["remove"],
        variables: ["studentEmail", "preview", "sentedAt", "course", "seconds", "status"],
        header: [
          { id: "studentEmail", name: "Email клиента", width: "19%" },
          { id: "preview", name: "Предпросмотр", width: "12%" },
          { id: "sentedAt", name: "Дата сдачи", width: "14%", filters: { selected: false, filter: '', collection: 'sentedAt', type: 'DATE', list: [] } },
          { id: "course", name: "Курс", width: "15%" },
          { id: "seconds", name: "Затраченное время", width: "15%", filters: { selected: false, filter: '', collection: 'seconds', type: 'MAXMIN', list: [] } },
          { id: "status", name: "Статус", width: "15%" },
          { id: "", name: "", width: "10%" },
        ],
      },
    };
  },
  created() {
    this.options.request = `/api/questionnaire/expert/process/${this.$store.getters.user._id}`;
  },
  components: {
    Table,
  },
});
</script>