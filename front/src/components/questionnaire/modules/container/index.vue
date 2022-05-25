<template>
  <section class="questionnaire--container" v-if="mode === 'list'">
    <Sections
      v-if="course === COURSES_ENUM.TWO && role === 'EXPERT'"
      :sections="sections"
      @selectQuestionnaireSection="selectQuestionnaireSection"
    />
    <Member
      :class="{ dNone: !checkSection('target') }"
      :course="course"
      :questionnaireMode="questionnaireMode"
      :memberStudent="questionnaireStudent.student"
      :role="role"
      :member="questionnaire.student"
      :status="status"
    />
    <section-targets
      v-if="course === COURSES_ENUM.ONE"
      :sections="sectionsTargets"
      :course="course"
      :role="role"
      :status="status"
      :questionnaireMode="questionnaireMode"
      :targets="questionnaire.targets"
      @selectTarget="selectTarget"
      @combine="$emit('combine')"
      @saveStudentQuestionnaire="$emit('saveStudentQuestionnaire')"
      @onuncombine="$emit('uncombine')"
    ></section-targets>
    <Targets
      :checkSection="checkSection"
      :course="course"
      :targets="questionnaire.targets"
      :targetsStudent="questionnaireStudent.targets"
      :questionnaireMode="questionnaireMode"
      :status="status"
      :role="role"
    />
    <Insurance
      v-if="questionnaireVersion === 'new' && course === COURSES_ENUM.ONE"
      :insurance="questionnaire.insuranceProduct"
      :insuranceStudent="questionnaireStudent.insuranceProduct"
      :questionnaireMode="questionnaireMode"
      :status="status"
    />
    <Comment
      :questionnaireMode="questionnaireMode"
      :comment="questionnaire.comment"
      :status="status"
    />
  </section>
  <QuestionnaireTable
    :targets="questionnaire.targets"
    :insurance="questionnaire.insuranceProduct.module.data"
    :status="status"
    :course="course"
    @addStudentTarget="$emit('addStudentTarget')"
    v-else
  />
  <Buttons
    @modeChange="$emit('modeChange')"
    @finish="$emit('finish')"
    :pending="pending"
    :mode="mode"
    :status="status"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue-demi";
import { mapGetters } from "vuex";
import Member from "./modules/member/index.vue";
import Sections from "./modules/sections/index.vue";
import Targets from "./modules/targets/index.vue";
import Insurance from "./modules/insurance/index.vue";
import Comment from "./modules/comment/index.vue";
import Buttons from "./modules/Buttons.vue";
import sectionTargets from "./modules/sectionsTargets/index.vue";

import QuestionnaireTable from "./table/index.vue";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import { valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "QuestionnaireContainer",
  emits: [
    "toggleExistingPortfolio",
    "selectQuestionnaireSection",
    "selectTarget",
    "finish",
    "modeChange",
    "addStudentTarget",
    "removeStudentTarget",
    "combine",
    "uncombine",
    "saveStudentQuestionnaire"
  ],
  props: {
    pending: {
      type: Boolean,
      required: true,
    },
    questionnaire: {
      type: Object,
      required: true,
    },
    questionnaireStudent: {
      type: Object,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
    correctSection: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      COURSES_ENUM: COURSES_ENUM,
      current_target: 0,
      status: false,
      sections: [
        { id: "target", name: "Цель" },
        { id: "existing", name: "Стартовый портфель" },
        { id: "student", name: "Портфель студента" },
        { id: "expert", name: "Портфель эксперта" },
      ],
    };
  },
  mounted() {
    this.jq("input, textarea").prop("disabled", true);
    this.jq(".input img").css("pointer-events", "none");
  },
  computed: {
    ...mapGetters([
      "Authorization",
      "questionnaireStatus",
      "questionnaireVersion",
      "user",
    ]),
    sectionsTargets() {
      return this.questionnaire.targets;
    },
  },
  provide() {
    return {
      status: computed(() => this.status),
    };
  },
  watch: {
    questionnaireStatus(value) {
      this.status = value;
      if (value) {
        this.disabledInputs();
      }
    },
  },
  methods: {
    disabledInputs() {
      if (this.mode === "list" && this.questionnaireStatus) {
        setTimeout(() => {
          this.jq("input, textarea").prop("disabled", false);
          this.jq(".input img").css("pointer-events", "all");
          this.questionnaire.targets.forEach((target: Questionnaire.QTarget) => {
            const statuses = Object.typedKeys(target.status);
            for (const key of statuses) {
              if (target.status[key] !== 1) {
                this.jq(`[data-id="${key}"] .portfolio--container [data-target="${target.id}"] input,
                  [data-id="${key}"] .portfolio--container [data-target="${target.id}"] textarea`).prop(
                  "disabled",
                  'true'
                );
              }
            }
            const portfolioKeys = Object.typedKeys(target.portfolios);
            for (const portfolioId of portfolioKeys) {
              if (
                portfolioId !== "expert" &&
                !target.portfolios[portfolioId].sections[2].selected
              ) {
                this.jq(`[data-id="target-${target.id}"] .target--portfolios [data-id="${portfolioId}"] [data-id="section-2"] .input input,
                  [data-id="target-${target.id}"] .target--portfolios [data-id="${portfolioId}"] [data-id="section-2"] .input textarea`).attr(
                  "disabled",
                  'true'
                );
              }
            }
          });
        }, 100);
      }
      return "";
    },
    start() {
      this.$store.commit("startTimer");
    },
    toggleExistingPortfolio(status: boolean) {
      this.$emit("toggleExistingPortfolio", status);
    },
    selectQuestionnaireSection(id: number) {
      this.$emit("selectQuestionnaireSection", id);
    },
    selectTarget(id: number) {
      this.$emit('selectTarget', id);
    },
    checkSection(type: string) {
      return (
        (this.correctSection === type && this.course === COURSES_ENUM.TWO) || this.course === COURSES_ENUM.ONE
      );
    },
  },
  components: {
    Member,
    Sections,
    Targets,
    Comment,
    Insurance,
    Buttons,
    QuestionnaireTable,
    sectionTargets,
  },
});
</script>

<style lang="scss" scoped>
.questionnaire--container {
  padding: 125px 0 50px;
  width: 100%;
  text-align: center;
  .element {
    margin: 70px auto;
  }
}
</style>
