<template>
  <div class="section" :data-id="'section-' + indexSection">
    <div class="section--title">{{ section.name }}</div>
    <div class="section--container">
      <div class="modules">
        <div 
          class="module" 
          v-for="(module, indexModule) of section.modules"
          :key="indexModule"
          :data-id="'module-' + indexModule"
        >
          <div class="module--title flex">
            <PortfolioInput></PortfolioInput>
            <QuestionnaireInput
              v-for="input of titleInputs"
              :key="input.id"
              :data="module.data"
              :input="input"
              :block="input.block"
              :showName="true"
              :gap="false"
            ></QuestionnaireInput>
          </div>
          <transition name="fade">
            <div v-if="module.show" class="module--container">

            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import QuestionnaireInput from '../inputs/input.vue';

export default defineComponent({
  name: "sectionInstruments",
  props: {
    section: {
      type: Object,
      required: true,
    },
    sectionStudent: {
      type: Object,
      required: true,
    },
    targetId: {
      type: Number,
      required: true,
    },
    portfolioId: {
      type: String,
    },
    course: {
      type: String,
      required: true,
    },
    indexSection: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      titleInputs: [
        { block: true, show: true, id: 'name', name: 'Инструмент', placeholder: 'Введите инструмент', type: 'text', drop: true, error: false, required: true },
        { block: true, show: true, id: 'commentStudent', name: 'Комментарий студента', placeholder: 'Комментарий студента', type: 'textarea', drop: false, error: false, required: false },
        { block: false, show: true, id: 'comment', name: 'Комментарий эксперта', placeholder: 'Комментарий эксперта', type: 'textarea', drop: false, error: false, required: false },
      ]
    }
  },
  created() {
    this.section.modules.forEach((m: any) => m.show = false);
  },
  components: {
    QuestionnaireInput
  }
});
</script>

<style lang="scss" scoped>
.section {
  display: block !important;
  padding: 20px 0;
  position: relative;
  &--title {
    font-size: 18px;
    line-height: 21px;
    color: #5d6272;
  }
  &--container {
    width: 100%;
  }
}
</style>