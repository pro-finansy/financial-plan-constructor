<template>
  <td v-if="isFileStudentCourse" @click="downloadStudentFile(_id)"></td>
  <td v-else-if="isFileStudent" @click="downloadStudentFile(element.courseElement)"></td>
  <td v-else-if="isStudentEmail" @click="editStudent"></td>
  <td v-else-if="isFileQuestionnaire" @click="downloadQuestionnaireFile(_id)"></td>
  <td v-else-if="isFileExpert" @click="downloadExpertFile(_id)"></td>
  <td v-else-if="expertChangeRules" @click="changeExpert"></td>
  <td v-else-if="streamDateRules" @click="changeStreamDate"></td>
  <td v-else :data-id="element._id"></td>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import {
  ACCESSES_ENUM,
  QUESTIONNAIRE_STATUSES_ENUM,
  ROLES_ENUM,
} from "@/utils/enums";

export default defineComponent({
  name: "TableElement",
  props: {
    _id: {
      type: String,
      required: true,
    },
    variable: {
      type: String,
      required: true,
    },
    table: {
      type: String,
      required: true,
    },
    element: {
      type: Object,
      default: () => {
        return {}
      },
    },
    role: {
      default: "",
    },
    accesses: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  computed: {
    streamDateRules() {
      return (
        this.variable === "streamDate" &&
        this.table === "students" &&
        (this.role === ROLES_ENUM.OWNER ||
          this.role === ROLES_ENUM.SUPPORT ||
          this.accesses.includes(ACCESSES_ENUM.EXPERT))
      );
    },
    expertChangeRules() {
      return (
        this.variable === "expert" &&
        this.table === "students" &&
        (this.role === ROLES_ENUM.OWNER ||
          this.role === ROLES_ENUM.SUPPORT ||
          this.accesses.includes(ACCESSES_ENUM.EXPERT))
      );
    },
    isFileStudent() {
      return (
        this.variable === "filePortfolio" &&
        this.table === "questionnaire_student" &&
        this.element.fileStudent
      );
    },
    isFileQuestionnaire() {
      return (
        this.variable === "fileExpert" &&
        this.table === "questionnaire_student" &&
        this.element.fileStudent
      );
    },
    isFileExpert() {
      return (
        this.variable === "fileExpert" &&
        this.table === "students" &&
        this.element.fileExpert &&
        this.element.questionnaire?.status ===
          QUESTIONNAIRE_STATUSES_ENUM.SENDED
      );
    },
    isStudentEmail() {
      return this.variable === "studentData" && this.table === "students";
    },
    isFileStudentCourse() {
      return (
        this.variable === "file" &&
        this.table === "students" &&
        this.element.fileStudent
      );
    },
  },
  methods: {
    editStudent() {
      this.$store.commit("createModal", {
        id: "students-edit",
        data: {
          ...this.element,
          expert: this.element.expert.name,
          expert_id: this.element.expert._id,
          course: this.element.course.name,
          course_id: this.element.course._id,
        },
      });
    },
    changeExpert() {
      this.$store.commit("createModal", {
        id: "students-expert",
        data: {
          ...this.element,
          expert: this.element.expert?.name,
          expert_id: this.element.expert?._id,
        },
      });
    },
    changeStreamDate() {
      this.$store.commit("createModal", {
        id: "students-stream",
        data: {
          ...this.element,
          streamDate: this.element.streamDate || this.element.course.streamDate,
        },
      });
    },
    async downloadStudentFile(_id: string) {
      const result = await this.API.table.onDownloadStudentFile({ _id });
      const name = this.element.studentEmail
        ? `Инвест. портфель - ${this.element.studentEmail}.xlsx`
        : `Инвест. портфель.xlsx`;
      const a = document.createElement("a");
      a.href = result.data.fileStudent.src;
      a.download = name;
      a.click();
    },
    async downloadQuestionnaireFile(_id: string) {
      const result = await this.API.table.downloadQuestionnaireFile(`/api/questionnaire/file/${_id}`);
      const a = document.createElement('a');
      a.href = result.data.src;
      a.download = result.data.name;
      a.click();
    },
    async downloadExpertFile(_id: string) {
      const result = await this.API.table.onDownloadExpertFile({ _id });
      const a = document.createElement("a");
      a.href = result.data.src;
      a.download = this.element.studentEmail + ".pdf";
      a.click();
    },
  },
});
</script>
