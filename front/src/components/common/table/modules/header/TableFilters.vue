<template>
  <div class="fcontainer">
    <div @click="showMenu = !showMenu" class="flex justify-center items-center" :class="{selected: showMenu}">
      <Filter />
    </div>
    <transition name="fade">
      <div class="filters" v-if="showMenu">
        <div class="filters--header">Фильтры</div>
        <div class="filters--container">
          <div class="filter" v-for="filter of filters" :key="filter.id">
            <div class="filter--header">{{ filter.name }}</div>
            <div class="filter--container">
              <div v-for="element of filter.list" @click="selectFilter(filter, element)" :key="element._id" :class="{selected: element.selected}">
                <span>{{ element.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="filters--actions">
          <button class="btn btn--green" @click="onFilters">Применить</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { mapGetters } from "vuex";
import { Filter } from '@element-plus/icons';
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "TableFilters",
  emits: ['onFilters'],
  data() {
    return {
      showMenu: false,
      filters: [
        { id: 'civilServant', name: 'Госслужащий', list: [
          { _id: 1, name: 'Да', selected: false },
          { _id: 2, name: 'Нет', selected: false },
          { _id: 3, name: 'Нерезидент РФ', selected: false },
        ] },
        { id: 'risk', name: 'Риск-профиль', list: [
          { _id: 'careful', name: 'Осторожный', selected: false },
          { _id: 'conservative', name: 'Консервативный', selected: false },
          { _id: 'moderate', name: 'Умеренный', selected: false },
          { _id: 'aggressive', name: 'Агрессивный', selected: false },
          { _id: 'stocks', name: 'Акции 100%', selected: false },
        ] },
        { id: 'term', name: 'Срок цели', list: [
          { _id: 1, name: 'макс/мин', selected: false },
          { _id: -1, name: 'мин/макс', selected: false },
        ] },
      ]
    }
  },
  methods: {
    selectFilter(filter: dynamicsObject, element: dynamicsObject) {
      for (const el of filter.list) {
        if (el._id !== element._id) el.selected = false;
      }
      element.selected = !element.selected;
    },
    onFilters() {
      const query: dynamicsObject = {civilServant: '', risk: '', term: ''};
      this.filters.forEach(filter => {
        filter.list.forEach((element: dynamicsObject) => {
          if (element.selected) query[filter.id] = element._id;
        })
      });
      this.$emit('onFilters', query);
    }
  },
  computed: mapGetters(["pendingRequest"]),
  components: {
    Filter
  }
});
</script>

<style lang="scss" scoped>
.fcontainer {
  position: relative;
  .flex {
    width: 35px;
    height: 35px;
    background-color: #F4F5F9;
    border-radius: 10px;
    transition: 0.3s all;
    cursor: pointer;
    svg {
      width: 18px;
      height: 18px;
    }
    &.selected {
      transition: 0.3s all;
      border-radius: 10px 10px 0 0;
    }
  }
  .filters {
    z-index: 1;
    width: 275px;
    right: 0;
    background-color: #f6f7fa;
    padding: 15px;
    position: absolute;
    top: 28px;
    border-radius: 10px 0 10px 10px;
    &--header {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgb(235, 235, 235);
    }
    &--container {
      font-size: 14px;
      .filter {
        margin-bottom: 5px;
        &--header {
          margin-bottom: 5px;
        }
        &--container {
          font-size: 12px;
          display: flex;
          flex-wrap: wrap;
          div {
            cursor: pointer;
            margin: {
              right: 5px;
              bottom: 5px;
            };
            padding: 5px 12px;
            border: 1px solid #b9bdc7;
            background-color: #fff;
            border-radius: 15px;
            &.selected {
              border: 1px solid #3A90FF;
            }
          }
        }
      }
    }
    &--actions {
      margin-top: 10px;
      text-align: right;
      button {
        padding: 8px 10px;
        border-radius: 5px;
        font-size: 11px;
      }
    }
  }
}
</style>