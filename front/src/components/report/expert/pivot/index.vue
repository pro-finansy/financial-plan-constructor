<template>
  <section>
    <header class="flex items-center justify-between">
      <button class="btn btn--green" @click="$router.push(`/questionnaire/${questionnaire_id}`)">Перейти в проверку</button>
      <div class="flex items-center" @click="$router.push('/expert/notverified')">
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="8.50984" y1="8.66045" x2="25.6801" y2="25.8307" stroke="#5D6272" stroke-width="2"/>
          <line x1="25.6837" y1="8.5135" x2="8.51338" y2="25.6838" stroke="#5D6272" stroke-width="2"/>
        </svg>
        <span>Закрыть предпросмотр</span>
      </div>
    </header>
    <QuestionnaireTable
      v-if="loaded"
      :targets="questionnaire.targets"
      :insurance="questionnaire.insuranceProduct.module.data"
      :status="false"
      :pivot="true"
      :course="course"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { computed } from 'vue-demi';
import { mapGetters } from "vuex";
import QuestionnaireTable from '@/components/questionnaire/modules/container/table/index.vue';

export default defineComponent({
  name: 'ExpertQuestionnairePivot',
  data() {
    return {
      questionnaire_id: this.$attrs._id,
      loaded: false,
    }
  },
  provide() {
    return {
      status: computed(() => false)
    }
  },
  mounted() {
    if (!this.questionnaire_id) return this.$router.push('/');
    this.getQuestionnaire();
  },
  computed: {
    ...mapGetters(["user", "questionnaire", "course"]),
  },
  methods: {
    async getQuestionnaire() {
      const result = await this.API.questionnaire.getPivotQuestionnaire(this.questionnaire_id);
      this.$store.commit('fillQuestionnaireData', { questionnaireData: result.data, course: result.data.course.type, role: this.user.role, pivot: true });
      this.loaded = true;
    },
  },
  components: {
    QuestionnaireTable
  }
})
</script>

<style lang="scss" scoped>
  section {
    header {
      width: 100%;
      height: 80px;
      background-color: #fff;
      padding: 0 30px;
      div {
        cursor: pointer;
        svg {
          width: 25px;
          height: 25px;
        }
        span {
          margin-left: 5px;
        }
      }
    }
    .questionnaire--container {
      margin: 20px auto !important;
    }
  }
</style>