<template>
  <section class="table">
    <div class="table--body">
      <Header 
        :options="options" 
        @onSearch="onSearch" 
        @updateTable="getData"
        @onFilters="onFilters"
      />
      <Container
        :pending="pending"
        :options="options"
        :data="data"
        :query="query"
        @selectDateQuery="selectDateQuery"
        @selectedFilter="selectedFilter"
        @selectTargetLength="selectTargetLength"
      />
    </div>
    <Pagination
      v-if="total > query.limit"
      @selectPage="selectPage"
      :total="total"
      :query="query"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Header from "./modules/Header.vue";
import Container from "./modules/Container.vue";
import Pagination from "./modules/Pagination.vue";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "Table",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      pending: false,
      data: [] as Array<dynamicsObject>,
      total: 0,
      imageList: [],
      query: {
        limit: 10,
        page: 1,
        search: "",
        targetLength: "",
      } as dynamicsObject,
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.emits();
  },
  unmounted() {
    this.emitter.off("students", this.studentsEmitter);
    this.emitter.off("create", this.createEmitter);
    this.emitter.off("edit", this.editEmitter);
    this.emitter.off("editExpertStudents", this.editExpertStudentsEmitter);
    this.emitter.off("editExpertListStudents", this.editExpertListStudentsEmitter);
    this.emitter.off("deleteStudentsList", this.deleteStudentsListEmitter);
    this.emitter.off("upload", this.uploadEmitter);
    this.emitter.off("remove", this.removeEmitter);
  },
  methods: {
    onFilters(query: dynamicsObject) {
      this.query = { ...this.query, ...query };
      this.getData();
    },
    onSearch(search: string) {
      this.query.search = search;
      this.getData();
    },
    selectTargetLength() {
      this.query.targetLength = this.query.targetLength === -1 ? 1 : -1;
      this.getData();
    },
    selectDateQuery(data: dynamicsObject) {
      this.query[data.id] = data.date;
      this.getData();
    },
    selectedFilter(filter: dynamicsObject) {
      this.query[filter._id] = filter.value;
      this.getData();
    },
    async getData() {
      this.pending = true;
      const result = await this.API.table.getTableData(this.options.request, {
        params: this.query,
      });
      this.data = result.data;
      this.total = result.total;
      this.additional();
      this.pending = false;
      if (this.options.id === "expert") {
        const avatars = result.data
          .filter((u: dynamicsObject) => u.avatar)
          .map((u: dynamicsObject) => u.avatar.src);
        // TODO: lazy load images
        // if (avatars) this.preloadImages(avatars);
      }
    },
    additional() {
      if (
        this.options.id === "questionnaire_ready" ||
        this.options.id === "questionnaire_process" ||
        this.options.id === "questionnaire_notverified"
      ) {
        const status = this.options.header.find(
          (h: dynamicsObject) => h.id === "status"
        );
        status.name = `Статус (${this.total})`;
      }
      if (this.options.id === "students") {
        const actions = this.options.header.find((h: dynamicsObject) => !h.id);
        actions.name = `(${this.total})`;
      }
    },
    emits() {
      this.emitter.on("students", this.studentsEmitter);
      this.emitter.on("create", this.createEmitter);
      this.emitter.on("edit", this.editEmitter);
      this.emitter.on(
        "editExpertListStudents",
        this.editExpertListStudentsEmitter
      );
      this.emitter.on("editExpertStudents", this.editExpertStudentsEmitter);
      this.emitter.on("deleteStudentsList", this.deleteStudentsListEmitter);
      this.emitter.on("upload", this.uploadEmitter);
      this.emitter.on("remove", this.removeEmitter);
    },
    createEmitter(element: dynamicsObject) {
      this.data = [element, ...this.data];
    },
    editEmitter(element: dynamicsObject) {
      const correct = this.data.find(
        (el: dynamicsObject) => el._id === element._id
      );
      if (correct) for (const key in element) correct[key] = element[key];
    },
    deleteStudentsListEmitter(data: dynamicsObject) {
      this.data = this.data.filter((s) => !data.array.includes(s.studentEmail));
    },
    editExpertListStudentsEmitter(data: dynamicsObject) {
      this.data.forEach((e) => {
        for (const student of data.array) {
          if (
            String(e.expert._id) === String(data.expert_id) &&
            student === e.studentEmail
          ) {
            e.expert.name = data.change_expert;
            e.expert._id = data.change_expert_id;
          }
        }
      });
    },
    editExpertStudentsEmitter(data: dynamicsObject) {
      this.data.forEach((e) => {
        if (String(e.expert._id) === String(data.expert_id)) {
          e.expert.name = data.change_expert;
          e.expert._id = data.change_expert_id;
        }
      });
    },
    uploadEmitter({ _id, src }: { _id: string; src: string }) {
      const correct = this.data.find((el) => el._id === _id);
      if (correct) {
        correct.avatar = { src };
      }
    },
    removeEmitter(_id: string) {
      this.data = this.data.filter((element) => element._id !== _id);
    },
    studentsEmitter(data: Array<dynamicsObject>) {
      this.data = data;
    },
    selectPage(page: string) {
      this.data = [];
      this.query.page = page;
      this.getData();
    },
  },
  components: {
    Container,
    Header,
    Pagination,
  },
});
</script>

<style lang="scss" scoped>
.table {
  margin: 25px 25px;
  &--body {
    background: #ffffff;
    border-radius: 10px;
    padding: 10px 20px;
  }
}
</style>
