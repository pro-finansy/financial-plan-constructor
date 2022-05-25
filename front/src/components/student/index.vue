<template>
  <section>
    <Table :options="options" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Table from "@/components/common/table/index.vue";
import { ROLES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: "StudentMain",
  data() {
    return {
      options: {
        name: "Студенты",
        id: "students",
        request: "/api/student/list",
        actions: ['remove'],
        import: true,
        variables: ["studentData", "course", "expert", 'qqstatus', "streamDate", "qqsentedAt", "qqcompletedAt", "file", 'fileExpert'],
        header: [
          { id: "studentData", name: "Данные студента", width: "15%" },
          { id: "course", name: "Курс", width: "12%", filters: { selected: false, filter: '', collection: 'course', type: 'REQUEST', request: '/api/course/list', list: [] } },
          { id: "expert", name: "Эксперт", width: "12%", filters: { selected: false, filter: '', collection: 'expert', type: 'REQUEST', request: '/api/user/expert/list', list: [] } },
          { id: "qqstatus", name: "Статус", width: "10%", filters: { selected: false, filter: '', collection: 'status', type: 'STATIC', list: [] } },
          { id: "streamDate", name: "Дата потока", width: "10%", filters: { selected: false, filter: '', collection: 'streamDate', type: 'REQUEST', request: '/api/courseelement/streams', list: [] } },
          { id: "qqsentedAt", name: "Дата сдачи", width: "10%", filters: { selected: false, filter: '', collection: 'sentedAt', type: 'DATE', list: [] } },
          { id: "qqcompletedAt", name: "Дата проверки", width: "10%", filters: { selected: false, filter: '', collection: 'completedAt', type: 'DATE', list: [] } },
          { id: "file", name: "Файл студента", width: "10%", filters: { selected: false, filter: '', collection: 'fileStudent', type: 'STATIC', list: [] } },
          { id: "fileExpert", name: "Файл эксперта", width: "10%", filters: { selected: false, filter: '', collection: 'fileExpert', type: 'STATIC', list: [] } },
          { id: "", name: "", width: "6%" },
        ],
      },
    };
  },
  created() {
    if (this.$store.getters.user.role === ROLES_ENUM.EXPERT && !this.$store.getters.user.accesses.includes(ROLES_ENUM.EXPERT)) {
      this.options.header.splice(2, 1);
      this.options.variables.splice(2, 1);
    }
  },
  components: {
    Table,
  },
});
</script>