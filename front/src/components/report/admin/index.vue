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
        name: "Анкеты",
        id: "questionnaires",
        request: `/api/questionnaire/pag`,
        actions: ["remove"],
        export: true,
        variables: ["studentEmail", "expert", "course", "streamDate", "sentedAt", "completedAt", "report", "status"],
        header: [
          { id: "studentEmail", name: "Email клиента", width: "14%" },
          { id: "expert", name: "Эксперт", width: "12%", filters: { selected: false, filter: '', collection: 'expert', type: 'REQUEST', request: '/api/user/expert/list', list: [] } },
          { id: "course", name: "Курс", width: "15%", filters: { selected: false, filter: '', collection: 'course', type: 'REQUEST', request: '/api/course/list', list: [] } },
          { id: "streamDate", name: "Дата потока", width: "10%", filters: { selected: false, filter: '', collection: 'streamDate', type: 'REQUEST', request: '/api/courseelement/streams', list: [] } },
          { id: "sentedAt", name: "Дата сдачи", width: "12%", filters: { selected: false, filter: '', collection: 'sentedAt', type: 'DATE', list: [] } },
          { id: "completedAt", name: "Дата проверки", width: "12%", filters: { selected: false, filter: '', collection: 'completedAt', type: 'DATE', list: [] } },
          { id: "report", name: "Предпросмотр", width: "12%" },
          { id: "status", name: "Статус", width: "9%", filters: { selected: false, filter: '', collection: 'status', type: 'STATIC', list: [] } },
          { id: "", name: "", width: "9%" },
        ],
      },
    };
  },
  components: {
    Table,
  },
});
</script>