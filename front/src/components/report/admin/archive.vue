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
        name: "Архив отчётов",
        id: "questionnaires_archive",
        request: `/api/questionnaire/archive/pag`,
        actions: ["remove"],
        export: false,
        variables: ["studentEmail", "expert", "course", "streamDate", "completedAt", "report", "status"],
        header: [
          { id: "studentEmail", name: "Email клиента", width: "15%" },
          { id: "expert", name: "Пред. эксперт", width: "15%" },
          { id: "course", name: "Курс", width: "16%", filters: { selected: false, filter: '', collection: 'course', type: 'REQUEST', request: '/api/course/list', list: [] } },
          { id: "streamDate", name: "Дата потока", width: "10%", filters: { selected: false, filter: '', collection: 'streamDate', type: 'REQUEST', request: '/api/courseelement/streams', list: [] } },
          { id: "completedAt", name: "Дата проверки", width: "13%", filters: { selected: false, filter: '', collection: 'completedAt', type: 'DATE', list: [] } },
          { id: "report", name: "Предпросмотр", width: "13%" },
          { id: "status", name: "Статус", width: "10%", filters: { selected: false, filter: '', collection: 'status', type: 'STATIC', list: [] } },
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