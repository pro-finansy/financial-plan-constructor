<template>
  <section>
    <Table :options="options" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Table from "@/components/common/table/index.vue";
import { COURSES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "ReportNotverifiedExpertMain",
  data() {
    return {
      options: {
        name: "Непроверенные работы",
        id: "questionnaire_notverified",
        request: ``,
        actions: [],
        variables: ["studentEmail", "sentedAt", "course", "streamDate", "preview", "status"],
        header: [
          { id: "studentEmail", name: "Email клиента", width: "15%" },
          { id: "sentedAt", name: "Дата сдачи", width: "15%", filters: { selected: false, filter: '', collection: 'sentedAt', type: 'DATE', list: [] } },
          { id: "course", name: "Курс", width: "15%" },
          { id: "streamDate", name: "Дата потока", width: "12%", filters: { selected: false, filter: '', collection: 'streamDate', type: 'REQUEST', request: '/api/courseelement/streams', list: [] } },
          { id: "preview", name: "Предпросмотр", width: "13%" },
          { id: "status", name: "Статус", width: "10%" },
          { id: "", name: "", width: "10%" },
        ],
      },
    };
  },
  created() {
    this.options.request = `/api/questionnaire/expert/notverified/${this.$store.getters.user._id}`;
    if (this.$store.getters.user && this.$store.getters.user.course.type === COURSES_ENUM.ONE) {
      this.options.variables.splice(2, 0, "targetLength");
      this.options.header.splice(2, 0, { id: "targetLength", name: "Количество целей", width: "15%" });
    }
  },
  components: {
    Table,
  },
});
</script>