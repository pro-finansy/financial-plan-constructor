<template>
  <div class="comment" data-id="comment" v-if="role !== 'STUDENT'">
    <div class="comment--title">{{ comment.name }}</div>
    <div class="comment--container">
      <QuestionnairenInputs 
        :questionnaireMode="questionnaireMode"
        :module="comment.module" 
        :id="comment.id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue-demi';
import QuestionnairenInputs from '../common/inputs/index.vue';

export default defineComponent({
  name: 'QuestionnaireComment',
  props: {
    comment: {
      type: Object,
      required: true
    },
    questionnaireMode: {
      type: String,
      required: true,
    },
  },
  setup() {
    const role = inject('role');
    return { role }
  },
  components: {
    QuestionnairenInputs
  }
})
</script>

<style lang="scss" scoped>
.comment {
  &--title {
    font-weight: 500;
    font-size: 30px;
    line-height: 35px;
    color: #5D6272;
    margin: 30px 0;
  }
  &--container {
    width: 650px;
    margin: 0 auto;
  }
}
</style>