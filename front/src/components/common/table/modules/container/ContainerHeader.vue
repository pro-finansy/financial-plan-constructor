<template>
  <thead>
    <tr>
      <container-header-element 
        v-for="element of header" 
        :key="element.id"
        :element="element"
        :query="query"
        @select-filter="selectFilter"
        @cancel-filter="eventElementFilter"
        @select-date-query="selectDateQuery"
        @select-element-filter="eventElementFilter"
        @select-target-length="$emit('selectTargetLength')"
      ></container-header-element>
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi';
import containerHeaderElement from './containerHeaderElement.vue';
import { FILTER_MAX_MIX, QUESTIONNAIRE_STATUS, COURSE_ELEMENT_STATUS, FILTER_FILE_PRESENT } from '@/store/commonDatas'; 
import { dynamicsObject } from '@/interfaces';

interface HeaderElement {
  id: string,
  name: string,
  width: string,
  filters: {
    selected: boolean,
    filter: string,
    collection: string,
    type: 'REQUEST' | 'DATE' | 'MAXMIN' | 'STATIC',
    request: string,
    list: Array<dynamicsObject>
  }
}

export default defineComponent({
  name: 'ContainerHeader',
  emits: ['selectDateQuery', 'selectTargetLength', 'selectedFilter'],
  props: {
    header: {
      type: Array as PropType<Array<HeaderElement>>,
      required: true
    },
    query: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true
    }
  },
  created() {
    this.collectionFilters();
  },
  components: {
    containerHeaderElement
  },
  methods: {
    selectDateQuery({ id, date, element}: { id: string, date: Date[], element: HeaderElement }) {
      element.filters.filter = 'selected';
      this.$emit('selectDateQuery', { id, date });
    },
    eventElementFilter(filter: dynamicsObject, element = { _id: '' }) {
      filter.filter = element._id;
      filter.selected = false;
      this.$emit('selectedFilter', { _id: filter.collection, value: filter.filter });
    },
    collectionFilters() {
      const types = {
        'REQUEST': this.requestFilter,
        'DATE': this.dateFilter,
        'MAXMIN': this.maxMinFilter,
        'STATIC': this.staticFilter
      };
      for (const element of this.header) {
        if (element.filters) {
          types[element.filters.type](element.filters);
          element.filters.list.forEach((e: dynamicsObject) => e.selected = false);
        }
      }
    },
    async requestFilter(filter: dynamicsObject) {
      const result = await this.API.table.tableRequestFilter(filter.request);
      filter.list = result.data.sort((a: dynamicsObject, b: dynamicsObject) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
    },
    dateFilter() {
      console.log('date');
    },
    maxMinFilter(filter: dynamicsObject) {
      filter.list = FILTER_MAX_MIX;
    },
    staticFilter(filter: dynamicsObject) {
      if (filter.collection === 'status') {
        filter.list = (this.id === 'questionnaires' || this.id === 'questionnaires_archive') ? 
          QUESTIONNAIRE_STATUS : COURSE_ELEMENT_STATUS;
      }
      if (filter.collection.includes('file')) filter.list = FILTER_FILE_PRESENT;
    },
    selectFilter(element: dynamicsObject) {
      for (const e of this.header) {
        if (e.filters && e.id !== element.id) e.filters.selected = false;
      }
      element.filters.selected = !element.filters.selected;
    }
  },
})
</script>