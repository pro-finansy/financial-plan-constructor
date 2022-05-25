<template>
  <section class="analytics">
    <div class="analytics--container">
      <div class="block common flex">
        <div class="actions">
          <div class="title">Общая статистика:</div>
          <div class="container">
            <div class="common flex" v-for="element of commonList" :key="element.id">
              <div class="name">{{ element.name }}</div>
              <div class="value">{{ common[element.id] }}</div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="title">Среднее время проверки работ по месяцам (мин):</div>
          <div class="container">
            <div class="common flex" v-for="element of averageList" :key="element.id">
              <div class="name">{{ element.name }}</div>
              <div class="value">{{ average[element.id] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="block" v-if="access">
        <div class="actions list">
          <div>
            <div class="action" :class="{selected: selected === 'actions'}" @click="selected = 'actions'">Список всех действий</div>
            <div class="action" :class="{selected: selected === 'expert'}" @click="selected = 'expert'">Среднее время проверки работ за последние 30 дней</div>
          </div>
          <label class="search" v-if="selected === 'actions'">
            <img src="/images/common/search.svg" alt="" @click="onSearch">
            <input type="text" placeholder="Поиск по действию..." v-model="query.search" @keyup.enter="onSearch">
          </label>
        </div>
        <div class="actions selected">
          <actions v-if="selected === 'actions'" :actions="actions"></actions>
          <experts v-if="selected === 'expert'" :experts="experts"></experts>
        </div>
      </div>
      <pagination v-if="selected === 'actions' && actions.length > 0 && staff" :query="query" :total="totalActions" @selectPage="page"></pagination>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { mapGetters } from 'vuex';
import Pagination from "../common/table/modules/Pagination.vue";
import { ROLES_ENUM } from '../../utils/enums';
import { dynamicsObject } from '@/interfaces';
import Actions from './modules/actions.vue';
import Experts from './modules/experts.vue';

export default defineComponent({
  name: 'AnalyticsMain',
  data() {
    return {
      common: {} as dynamicsObject,
      query: {
        limit: 20,
        page: 1,
        search: ''
      },
      totalActions: 0,
      average: {} as dynamicsObject,
      commonList: [
        { id: 'questionnaires', name: 'Кол-во сданных работ моими студентами:' },
        { id: 'completedQuestionnaires', name: 'Кол-во проверенных мною работ:' },
      ],
      averageList: [
        { id: 'august', name: 'Среднее время проверки работ в августе:' },
        { id: 'september', name: 'Среднее время проверки работ в сентябре:' },
        { id: 'october', name: 'Среднее время проверки работ в октябре:' },
        { id: 'november', name: 'Среднее время проверки работ в ноябре:' },
        { id: 'december', name: 'Среднее время проверки работ в декабре:' },
      ],
      actions: [],
      experts: [],
      selected: 'actions',
      access: false,
    }
  },
  computed: {
    ...mapGetters(['user']),
    staff() {
      const user = this.user as dynamicsObject;
      return user && (user.accesses.includes(ROLES_ENUM.EXPERT) || user.role === ROLES_ENUM.SUPPORT || user.role === ROLES_ENUM.OWNER);
    }
  },
  mounted() {
    if (this.user.role !== ROLES_ENUM.EXPERT || this.user.accesses.includes(ROLES_ENUM.EXPERT)) {
      this.access = true;
      this.getCommon();
      this.getExperts();
      this.getCommonList();
    } else {
      this.getCommonExpert();
    }
    this.getAverage();
    this.getActions();
  },
  components: {
    Actions,
    Experts,
    Pagination
  },
  methods: {
    onSearch() {
      this.getActions();
    },
    async getCommon() {
      const result = await this.API.analytics.getCommon();
      this.common = result.data;
    },
    async getCommonExpert() {
      const result = await this.API.analytics.getCommonExpert();
      this.common = result.data;
    },
    async getAverage() {
      const result = await this.API.analytics.getAverage();
      this.average = result.data;
    },
    async getActions() {
      const result = await this.API.analytics.getActions({ params: this.query });
      this.actions = result.data;
      this.totalActions = result.total;
    },
    async getExperts() {
      const result = await this.API.analytics.getExperts();
      this.experts = result.data;
    },
    getCommonList() {
      this.commonList = [
        { id: 'students', name: 'Всего студентов:' },
        { id: 'questionnairesLength', name: 'Всего работ:' },
        { id: 'questionnaires', name: 'Кол-во сданных работ студентами:' },
        { id: 'completedQuestionnaires', name: 'Кол-во проверенных работ экспертами:' },
      ];
    },
    page(page: number) {
      this.query.page = page;
      this.getActions();
    },
  },
});
</script>

<style lang="scss" scoped>
.analytics {
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 30px;
  margin: 30px 13%;
  &--header {
    padding-top: 10px; 
    min-width: 300px;
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 0.05em;
  }
  &--container {
    .common {
      margin-bottom: 5px;
      font-weight: 300;
      font-size: 14px;
      .name {
        margin-right: 10px;
      }
    }
    .block {
      .actions {
        margin: 20px 0;
        .title {
          font-weight: 500;
        }
        .container {
          margin-top: 15px;
          font-weight: 300;
          font-size: 14px;
        }
      }
      .list {
        align-items: center;
        justify-content: space-between;
        display: flex;
        > div {
          display: flex;
        }
        .action {
          font-size: 13px;
          padding: 12px 15px;
          cursor: pointer;
          background-color: #F5F5F5;
          &:first-child {
            border-radius: 5px 0 0 5px;
          }
          &:last-child {
            border-radius: 0 5px 5px 0;
          }
          &.selected {
            background-color: rgb(236, 236, 236);
          }
        }
      }
      &.common {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .search {
    position: relative;
    img {
      position: absolute;
      width: 16px;
      top: 10px;
      left: 12px;
      cursor: pointer;
    }
    input {
      width: 250px;
      box-shadow: none;
      font-size: 13px;
      transition: 0.5s all;
      padding: 10px 25px 10px 36px;
      font-weight: 300;
      font-family: 'Raleway', sans-serif;
      font-feature-settings: 'pnum' on, 'lnum' on;
      &::-webkit-input-placeholder {
        letter-spacing: 0.05em;
      }
    }
  }
}
</style>