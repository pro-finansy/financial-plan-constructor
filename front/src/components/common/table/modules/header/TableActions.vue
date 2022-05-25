<template>
  <div class="table--header-actions" v-if="options.id === 'expert'">
    <button class="btn btn--green" @click="modal('expert-add')">
      Добавить эксперта
    </button>
  </div>
  <div class="table--header-actions" v-if="options.id === 'support'">
    <button class="btn btn--green" @click="modal('support-add')">
      Добавить аккаунт СП
    </button>
  </div>
  <div class="table--header-actions" v-if="options.id === 'currency'">
    <button class="btn btn--green" @click="modal('currency-add')">
      Добавить валюту
    </button>
  </div>
  <div class="table--header-actions" v-if="options.id === 'asset'">
    <button class="btn btn--green" @click="modal('asset-add')">
      Добавить актив
    </button>
  </div>
  <div class="table--header-actions" v-if="options.id.includes('questionnaire_') && user">
    <button class="btn btn--green" @click="createQuestionnaire">Создать работу</button>
  </div>
  <div class="table--header-actions" v-if="options.id === 'students'">
    <div class="actions" @click="showActions = !showActions">
      <span>Действия</span>
      <svg :class="{show: showActions}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-67f4da97=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-67f4da97=""></path></svg>
    </div>
    <transition name="fade">
      <div v-if="showActions" class="actions--container">
        <ul>
          <li @click="showActions = false; downloadStudents()">
            <download />
            <span>Скачать список</span>
          </li>
          <li v-if="access && options.import" @click="showActions = false; modal('students-added-list')">
            <upload />
            <span>Загрузить студентов</span>
          </li>
          <li v-if="access" @click="showActions = false; modal('students-add')">
            <plus />
            <span>Добавить студента</span>
          </li>
          <li v-if="access" @click="showActions = false; modal('students-expert-change')">
            <avatar />
            <span>Сменить эксперта</span>
          </li>
          <li v-if="access" @click="showActions = false; modal('students-expert-change-list')">
            <files />
            <span>Переместить работы</span>
          </li>
          <li v-if="access" @click="showActions = false; modal('stream-course-add')">
            <calendar />
            <span>Добавить поток</span>
          </li>
          <li v-if="access" @click="showActions = false; modal('students-delete-list')">
            <user-filled />
            <span>Удалить студентов</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { mapGetters } from 'vuex';
import { Download, Upload, Plus, UserFilled, Files, Avatar, Calendar } from '@element-plus/icons';
import collectionData from '../../../../questionnaire/modules/collectionData';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { dynamicsObject } from '@/interfaces';

export default defineComponent({
  name: "TableActions",
  emits: ['updateTable'],
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      select: '',
      showActions: false
    }
  },
  computed: {
    ...mapGetters(['user', 'questionnaire']),
    access() {
      return this.user && (this.user.role === ROLES_ENUM.OWNER || this.user.role === ROLES_ENUM.SUPPORT || this.user.accesses.includes(ROLES_ENUM.EXPERT))
    }
  },
  unmounted() {
    this.emitter.off('selectQuestionnaireCourse', this.selectQuestionnaireCourseEmitter);
    this.emitter.off('questionnaireCreate', this.questionnaireCreateEmitter);
  },
  mounted() {
    this.emitter.on('questionnaireCreate', this.questionnaireCreateEmitter);
    this.emitter.on('selectQuestionnaireCourse', this.selectQuestionnaireCourseEmitter);
  },
  methods: {
    modal(id: string, data = {}) {
      this.$store.commit('createModal', { id, data });
    },
    createQuestionnaire() {
      if (this.user && this.user.courses) {
        this.$store.commit('createModal', { id: 'questionaire-select-course', data: {} });
      } else {
        this.generateQuestionnaire(true);
      }
    },
    async selectQuestionnaireCourseEmitter(data: dynamicsObject) {
      await this.$store.commit('updateUser', data);
      this.generateQuestionnaire(true);
    },
    questionnaireCreateEmitter() {
      this.generateQuestionnaire(false);
    },
    async generateQuestionnaire(showInfo: boolean) {
      if (showInfo && this.user.course.type === COURSES_ENUM.TWO && this.user.role === ROLES_ENUM.STUDENT) {
        this.$store.commit('createModal', { id: 'questionnaire-create-info', data: {} });
        return;
      } 
      await this.$store.commit('clearQuestionnaire', { course: this.user.course.type, role: this.user.role, owner: this.user.role });
      const data: dynamicsObject = {};
      data[`content_${this.user.role}`] = collectionData(this.questionnaire);
      const result = await this.API.questionnaire.onGenerateQuestionnaire(data);
      this.$router.push(`/questionnaire/${result.data._id}`);
    },
    async downloadStudents() {
      this.$store.commit("createNotification", { status: "success", message: 'Скачивание списка началось!' });
      const query: dynamicsObject = {};
      const array = this.options.header.filter((h: dynamicsObject) => h.filters?.filter).map((h: dynamicsObject) => ({ id: h.id, value: h.filters?.filter }));
      for (const element of array) {
        query[element.id] = element.value;
      }

      const result = await this.API.table.onDownloadStudents(query);
      const href = (window.URL || window.webkitURL).createObjectURL(result);
      const a = document.createElement("a");
      a.href = href;
      a.download = `Список студентов.xlsx`;
      a.click();
    },
  },
  components: {
    Download, Upload, Plus, UserFilled, Files, Avatar, Calendar
  }
});
</script>

<style lang="scss" scoped>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.table--header-actions {
  position: relative;
  display: flex;
  justify-content: flex-end;
  button:nth-child(2) {
    margin-left: 15px;
  }
  .actions {
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 14px;
      color: #2A2A2A;
      margin-right: 10px;
    }
    svg {
      width: 11px;
      height: 11px;
      transition: 0.3s all;
      &.show {
        transition: 0.3s all;
        transform: rotate(180deg);
      }
    }
  }
  .actions--container {
    position: absolute;
    top: 30px;
    right: 0;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    z-index: 1;
    width: 200px;
    box-shadow: 2px 2px 10px rgba(0,50,92, 0.1);
    ul {
      li {
        display: flex;
        align-items: center;
        font-size: 14px;
        transition: 0.3s all;
        cursor: pointer;
        padding: 10px 15px;
        svg {
          width: 15px;
          height: 15px;
        }
        span {
          margin-left: 12px;
        }
        label {
          cursor: pointer;
        }
        &:hover {
          color: #222222;
          background-color: #fafafa;
          transition: all 0.3s;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #f3f3f3;
        }
        &:last-child {
          border-radius: 0 0 10px 10px;
        }
      }
    }
  }
}
</style>
