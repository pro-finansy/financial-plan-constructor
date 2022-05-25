<template>
  <th 
    :class="{ selected: element.filters?.filter }"
    :style="`width: ${element.width}`"
  >
    <span>{{ element.name }}</span>
    <span v-if="element.filters?.filter" class="absolute">*</span>
    <label v-if="element.filters?.type === 'DATE'">
      <input type="text" :ref="element.id" :id="element.filters.collection">
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-67f4da97=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-67f4da97=""></path></svg>
    </label>
    <svg v-if="element.id === 'targetLength'" @click="$emit('selectTargetLength')" :class="{max: query.targetLength === -1}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-67f4da97=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-67f4da97=""></path></svg>
    <svg v-if="element.filters && element.filters.type !== 'DATE'" @click="$emit('selectFilter', element)" :class="{ selected: element.filters.selected }" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-67f4da97=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-67f4da97=""></path></svg>
    <transition name="fade">
      <div class="filters" v-if="element.filters && element.filters.selected && element.filters.type !== 'DATE'">
        <ul>
          <li v-if="element.filters.filter" @click="$emit('cancelFilter', element.filters)">Отменить</li>
          <li 
            @click="$emit('selectElementFilter', element.filters, e)"
            v-for="e of element.filters.list" 
            :class="{selected: e._id === element.filters.filter}"
            :key="e._id"
          >{{ e.name }}</li>
        </ul>
      </div>
    </transition>
  </th>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import AirDatepicker from 'air-datepicker';

export default defineComponent({
  name: 'containerHeaderElement',
  emits: ['selectFilter', 'cancelFilter', 'selectTargetLength', 'selectElementFilter', 'selectDateQuery'],
  props: {
    element: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      datepicker: {} as AirDatepicker
    }
  },
  methods: {
    selectedDates(dates: Date[]) {
      this.datepicker.hide();
      this.$emit('selectDateQuery', { id: this.element.filters.collection, date: dates, element: this.element });
    }
  },
  mounted() {
    if (this.element.filters && this.element.filters.type === 'DATE') {
      this.datepicker = new AirDatepicker(`#${this.element.filters.collection}`, {
        range: true,
        multipleDates: true,
        toggleSelected: false,
        onSelect: ({ date }) => {
          if (Array.isArray(date) && date.length === 2) {
            this.selectedDates(date);
          }
        },
      });
    }
  },
})
</script>

<style lang="scss" scoped>
th {
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 10px 10px 0;
  letter-spacing: 0.03em;
  position: relative;
  span {
    text-transform: uppercase;
    &.absolute {
      position: absolute;
    }
  }
  svg {
    cursor: pointer;
    margin-left: 15px;
    width: 13px;
    height: 13px;
    transition: 0.3s all;
    &.max, &.selected {
      transform: rotate(180deg);
      transition: 0.3s all;
    }
  }
  input {
    width: 0;
    height: 0;
    opacity: 0;
    padding: 0;
  }
  .filters {
    z-index: 1;
    background: #ffffff;
    box-shadow: 2px 2px 10px rgba(0, 50, 92, 0.1);
    border: 1px solid #EFEFEF;
    border-radius: 10px;
    padding: 10px 0;
    position: absolute;
    top: 40px;
    left: 0;
    max-height: 200px;
    overflow: auto;
    width: 220px;
    ul {
      li {
        font-size: 13px;
        font-weight: 400;
        padding: 8px 15px;
        cursor: pointer;
        transition: 0.3s all;
        border-bottom: 1px solid rgb(245, 245, 245);
        &:hover {
          background-color: rgb(245, 245, 245);
          transition: 0.3s all;
        }
        &.selected {
          background-color: rgb(245, 245, 245);
        }
      }
    }
  }
}
</style>