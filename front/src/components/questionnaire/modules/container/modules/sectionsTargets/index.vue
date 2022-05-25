<template>
  <section class="flex justify-between">
    <div class="sections flex">
      <div
        class="section"
        @click="$emit('selectTarget', section.id)"
        v-for="section of sections"
        :class="{ selected: section.selected }"
        :key="section.id"
      >
        {{ section.name }}
      </div>
    </div>
    <div class="action flex items-center" v-if="isExpertCapital">
      <button
        v-if="status && isAddTarget"
        @click="$store.commit('addTarget', 'EXPERT')"
        class="btn btn--orange"
      >
        Добавить цель
      </button>
      <button
        v-else-if="!status && isAddTarget"
        class="btn btn--orange btn--disabled"
      >
        Добавить цель
      </button>
      <button v-if="status && onCombineTargets" @click="combineTargets" class="btn btn--green">Объединить цели</button>
      <button v-else-if="onCombineTargets" class="btn btn--green btn--disabled">Объединить цели</button>
      <button v-if="status && onUncombineTargets" @click="$emit('onuncombine')" class="btn btn--green">Отменить объединение</button>
      <button v-else-if="onUncombineTargets" class="btn btn--green btn--disabled">Отменить объединение</button>
    </div>
    <transition name="fade">
      <div class="combine" v-if="showCombine">
        <div class="combine--title">Выберите цели для объединения</div>
        <div class="combine--container flex justify-between">
          <label>
            <span>Цель 1</span>
            <input type="checkbox" v-model="combines['1']" />
          </label>
          <label>
            <span>Цель 2</span>
            <input type="checkbox" v-model="combines['2']" />
          </label>
          <label>
            <span>Цель 3</span>
            <input type="checkbox" v-model="combines['3']" />
          </label>
        </div>
        <div class="combine--action flex justify-end">
          <button class="btn btn--orange" @click="combineTargetsMore">
            Объединить
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { mapGetters } from "vuex";
import { COURSES_ENUM, ROLES_ENUM } from "@/utils/enums";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "sectionTargets",
  emits: ["selectTarget", "combine", "onuncombine", "saveStudentQuestionnaire"],
  props: {
    sections: {
      required: true,
      type: Array as PropType<Array<dynamicsObject>>,
    },
    targets: {
      type: Array,
      required: true,
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    course: {
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
      showCombine: false,
      combines: {
        1: true,
        2: true,
        3: false,
      },
    };
  },
  methods: {
    async combineTargets() {
      if (this.targets.length === 3) {
        this.showCombine = !this.showCombine;
      } else if (this.targets.length === 2) {
        this.$emit("combine");
        await this.$store.commit("combineTargets", [1, 2]);
        this.$emit("saveStudentQuestionnaire");
      }
    },
    async combineTargetsMore() {
      this.showCombine = false;
      const targets = Object.entries(this.combines).filter((c) => c[1]);
      if (targets.length < 2)
        return this.$store.commit("createNotification", {
          status: "error",
          message: "Выбрано менее двух целей для объединения!",
        });
      this.$emit("combine");
      await this.$store.commit(
        "combineTargets",
        targets.map((c) => Number(c[0]))
      );
      this.$emit("saveStudentQuestionnaire");
    },
  },
  computed: {
    ...mapGetters(["uncombine"]),
    onCombineTargets() {
      return this.questionnaireMode === "GAP" && this.targets.length > 1;
    },
    onUncombineTargets() {
      return this.uncombine && this.questionnaireMode === "GAP";
    },
    isExpertCapital() {
      return this.course === COURSES_ENUM.ONE && this.role === ROLES_ENUM.EXPERT;
    },
    isAddTarget() {
      return this.targets.length < 3 && this.questionnaireMode === "DEFAULT";
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  width: 95%;
  margin: 0 auto;
  position: relative;
  .sections {
    .section {
      cursor: pointer;
      background-color: #ffecaf;
      width: 200px;
      padding: 20px;
      &.selected {
        background-color: #fef2cc;
      }
    }
  }
  .action {
    button {
      margin-left: 10px;
    }
  }
  .combine {
    background: #fff;
    border-radius: 10px;
    position: absolute;
    width: 300px;
    top: 65px;
    right: 10px;
    padding: 15px 20px;
    font-size: 14px;
    z-index: 1;
    &--container {
      margin: 10px 0 20px;
      label {
        cursor: pointer;
        display: flex;
        align-items: center;
        span {
          font-weight: 300;
          margin-right: 10px;
        }
      }
    }
    &--action {
      button {
        font-size: 12px;
        padding: 10px 15px;
      }
    }
  }
}
</style>
