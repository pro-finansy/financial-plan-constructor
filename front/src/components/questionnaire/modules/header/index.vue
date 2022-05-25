<template>
  <header class="flex justify-between">
    <div class="l flex items-center" @click="back">
      <Logotype :q="true" />
    </div>
    <div class="b flex justify-end">
      <Timer v-if="role === 'EXPERT'" :seconds="seconds" />
      <Actions
        v-if="showActions"
        @play="onPlay"
        @stop="onStop"
        @pause="onPause"
        :isPaused="isPaused"
        :role="role"
        :isStarted="isStarted"
      />
    </div>
    <div class="b" v-if="studentQuestionnaire">
      Работа не отправлена на проверку!
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { mapState } from "vuex";
import { QUESTIONNAIRE_STATUSES_ENUM, ROLES_ENUM } from "@/utils/enums";
import Timer from "./Timer.vue";
import Actions from "./Actions.vue";
import Logotype from "@/components/common/Logotype.vue";

export default defineComponent({
  name: "QuestionnaireActions",
  emits: [
    "onSeconds",
    "editQuestionnaire",
    "saveQuestionnaireInterval",
    "stopQuestionnaire",
    "pauseQuestionnaire",
  ],
  props: {
    seconds: Number,
    targets: Object,
    role: String,
    qqstatus: String,
  },
  data() {
    return {
      isPaused: false,
      isStarted: false,
      isStopped: false,
      timeout: 0,
    };
  },
  computed: {
    ...mapState(["timer"]),
    studentQuestionnaire() {
      return (
        this.role !== ROLES_ENUM.STUDENT &&
        this.qqstatus === QUESTIONNAIRE_STATUSES_ENUM.NOTSENT
      );
    },
    showActions() {
      return (
        (this.role === ROLES_ENUM.STUDENT &&
          this.qqstatus &&
          (this.qqstatus === QUESTIONNAIRE_STATUSES_ENUM.NOTSENT ||
            this.qqstatus === QUESTIONNAIRE_STATUSES_ENUM.NOTVERIFIED)) ||
        (this.role === ROLES_ENUM.EXPERT &&
          this.qqstatus !== QUESTIONNAIRE_STATUSES_ENUM.NOTSENT) ||
        !this.qqstatus
      );
    },
  },
  watch: {
    timer(value) {
      if (value && !this.timeout) this.onStart();
    },
  },
  methods: {
    back() {
      if (this.isStarted) return this.onStop();
      this.$router.back();
    },
    onStart() {
      this.isStarted = true;
      this.isPaused = false;
      this.onTimer();
      this.$emit("saveQuestionnaireInterval");
    },
    onStop() {
      clearInterval(this.timeout);
      this.isStopped = true;
      this.$emit("stopQuestionnaire");
      this.$store.commit("onQuestionnaireStatus", false);
    },
    onPause() {
      clearInterval(this.timeout);
      this.isStarted = false;
      this.isPaused = true;
      this.$emit("pauseQuestionnaire");
      this.stopTimer();
      this.$store.commit("onQuestionnaireStatus", false);
    },
    onPlay() {
      if (!this.isStarted) this.onStart();
      this.isPaused = false;
      this.$store.commit("onQuestionnaireStatus", true);
    },
    stopTimer() {
      clearInterval(this.timeout);
    },
    onTimer() {
      this.timeout = setInterval(() => {
        if (!this.isPaused) this.$emit("onSeconds");
      }, 1000);
    },
  },
  components: {
    Timer,
    Actions,
    Logotype,
  },
});
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background: #fff;
  width: 100%;
  .l {
    cursor: pointer;
    padding: 30px 5%;
  }
  .b {
    width: 60%;
    border-radius: 0 0 0 50px;
    padding: 20px 40px;
  }
}
</style>
