<template>
  <table>
    <thead>
      <tr>
        <th style="width: 15%">Сотрудник</th>
        <th style="width: 15%">Дата</th>
        <th style="width: 70%">Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="action of actions" :key="action._id">
        <td v-for="variable of variables" :key="variable">
          <div v-if="variable === 'owner'">{{ action.owner ? (action.owner.name || action.owner.email) : '' }}</div>
          <div v-else-if="variable === 'createdAt'">
            {{ dateFilter(action.createdAt, "datetime") }}
          </div>
          <div v-else>{{ action[variable] }}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue-demi';
import dateFilter from '@/filters/date.filter';
import { Action } from '@/interfaces/dto/action';

export default defineComponent({
  name: 'AnalyticsActions',
  data() {
    return {
      variables: ['owner', 'createdAt', 'message'] as Array<keyof typeof Action.Props>,
    }
  },
  methods: {
    dateFilter,
  },
  props: {
    actions: {
      type: Array as PropType<Array<Action.Dto>>,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  tr {
    th,
    td {
      text-align: left;
      font-size: 13px;
      padding: 10px 15px;
      line-height: 16px;
    }
  }
  thead {
    tr {
      th {
        font-weight: 500;
      }
    }
  }
  tbody {
    tr {
      td {
        font-weight: 300;
      }
      &:nth-child(2n - 1) {
        background-color: rgb(245, 245, 245);
      }
    }
  }
}
</style>