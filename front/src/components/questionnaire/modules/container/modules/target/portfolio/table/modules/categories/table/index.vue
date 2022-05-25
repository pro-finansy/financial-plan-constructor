<template>
  <div class="table" :class="{green: portfolioId === 'existingPortfolio', yellow: portfolioId === 'studentPortfolio'}">
    <div class="table--container" v-if="core">
      <common-table
        v-for="_type of coreTypes"
        :key="_type.id"
        :course="course"
        :portfolioId="portfolioId"
        :length="modules.length"
        :instrumentArray="getCurrentInstruments(_type.id)"
        :type="_type"
      ></common-table>
    </div>
    <div class="table--container" v-else>
      <common-table
        :course="course"
        :portfolioId="portfolioId"
        :length="modules.length"
        :instrumentArray="modules.filter((m) => m.data.name).map((m) => m.data)"
      ></common-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { dynamicsObject, valueof } from "@/interfaces";
import { Instrument } from "@/interfaces/dto/instrument";
import { COURSES_ENUM } from "@/utils/enums";
import commonTable from "./table.vue";
import { TABLE_BOND_SORT, TABLE_CORE_TYPES, TABLE_CORE_TYPE_MIXED } from "../../../../constants";

export default defineComponent({
  name: "CategoryTable",
  props: {
    modules: {
      type: Array as PropType<Array<dynamicsObject>>,
      required: true,
    },
    core: {
      type: Boolean,
      required: true,
    },
    portfolioId: {
      type: String,
      required: true,
    },
    course: {
      type: String as PropType<valueof<typeof COURSES_ENUM>>,
      required: true,
    },
  },
  data() {
    return {
      coreTypes: TABLE_CORE_TYPES,
    };
  },
  created() {
    this.modules.filter(m => m.data.name && m.data.price).forEach((m, index) => {
      m.data.index = index;
    });
    if (this.course === COURSES_ENUM.TWO && this.portfolioId !== 'expertPortfolio') {
      this.coreTypes = [...this.coreTypes, TABLE_CORE_TYPE_MIXED];
    }
  },
  updated() {
    this.modules.filter(m => m.data.name && m.data.price).forEach((m, index) => {
      m.data.index = index;
    });
  },
  methods: {
    sortInstrumentsSection(instruments: Array<Instrument.Dto>) {
      return instruments.sort((a, b) => {
        if (a.section_two > b.section_two) return 1;
        if (a.section_two < b.section_two) return -1;
        return 0;
      });
    },
    sortInstruments(type: string | null, instruments: Array<Instrument.Dto>) {
      if (type === 'stock') {
        return [
          ...this.sortInstrumentsSection(instruments.filter(i => i.instrument_type_two === 'Акции')),
          ...this.sortInstrumentsSection(instruments.filter(i => i.instrument_type_two !== 'Акции')),
        ];
      }
      if (type === 'bond') {
        const sorting = TABLE_BOND_SORT;
        let array: Array<Instrument.Dto> = [];
        for (const sort of sorting) {
          for (const instrument of instruments) {
            if (instrument.instrument_type_two === sort) array = [...array, instrument];
          }
        }
        for (const instrument of instruments) {
          if (!array.find(e => e.name === instrument.name)) array = [...array, instrument];
        }
        return array;
      }
      return instruments;
    },
    getCurrentInstruments(type: string) {
      if (this.course === COURSES_ENUM.TWO) {
        const mixed = this.$store.getters.mixedAssets.map((m: dynamicsObject) => m.name.trim().toLowerCase());
        if (type === 'mixed') {
          return this.modules.filter(i => mixed.includes(i.data.name.trim().toLowerCase())).map(i => i.data);
        }
        if (this.portfolioId === 'expertPortfolio') {
          return this.sortInstruments(type, this.modules.filter((i) => i.data[`class_${this.course}_id`] === type).map((i) => i.data));
        } else {
          return this.sortInstruments(type, this.modules.filter((i) => i.data[`class_${this.course}_id`] === type && !mixed.includes(i.data.name.trim().toLowerCase())).map((i) => i.data));
        }
      }
      return this.modules.filter((i) => i.data[`class_${this.course}_id`] === type).map((i) => i.data);
    },
  },
  components: {
    commonTable,
  },
});
</script>

<style lang="scss" scoped>
.table {
  &.green {
    background: #f6fff8;
  }
  &.yellow {
    background: #ffffe8;
  }
}
</style>