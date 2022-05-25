<template>
  <div class="input">
    <span v-if="input.show">{{ input.name }}</span>
    <textarea
      v-if="input.type === 'textarea'"
      :placeholder="input.placeholder"
      v-model="data[input.id]"
      :data-id="input.id"
    ></textarea>
    <input
      v-else-if="input.mask"
      v-mask="input.mask"
      :type="input.type"
      :ref="input.id"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error }"
      maxlength="80"
    />
    <input
      v-else-if="input.formula_element"
      :type="input.type"
      :ref="input.id"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error }"
      maxlength="80"
    />
    <input
      v-else-if="input.drop"
      @click="$emit('toggleDrop', input)"
      :type="input.type"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error, active: input.showDrop }"
      maxlength="80"
    />
    <input
      v-else-if="input.datepicker"
      :id="input.id"
      :type="input.type"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error }"
    />
    <input
      v-else
      :type="input.type"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error }"
      maxlength="80"
    />
    <img
      v-if="input.drop"
      :class="{ active: input.showDrop }"
      @click="$emit('toggleDrop', input)"
      src="/images/common/arrow.svg"
      alt="arrow"
    />
    <transition name="fade">
      <div class="drop" v-if="input.drop && input.showDrop">
        <ul>
          <li
            @click="$emit('selectDropElement', el, input)"
            v-for="el of input.drop_data"
            :key="el._id"
          >
            {{ el.name || el.instrument }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { mask } from "vue-the-mask";
import { Instrument } from "@/interfaces/dto/instrument";
import { dynamicsObject } from "@/interfaces";
import AirDatepicker from "air-datepicker";

export default defineComponent({
  name: "Input",
  emits: ["selectDropElement", "toggleDrop"],
  directives: {
    mask,
  },
  props: {
    input: {
      type: Object as PropType<Instrument.Input>,
      required: true,
    },
    data: {
      type: Object as PropType<dynamicsObject>,
      required: true,
    },
    target: Object,
    investments: Array,
  },
  data() {
    return {
      datepicker: {} as AirDatepicker
    }
  },
  mounted() {
    this.datepicker = new AirDatepicker(`#days`, {
      range: true,
      multipleDates: true,
      toggleSelected: false,
      multipleDatesSeparator: ' - ',
      onSelect: ({ date }) => {
        if (Array.isArray(date) && date.length === 2) {
          this.selectedDates(date);
        }
      },
    });
  },
  methods: {
    selectedDates(dates: Date[]) {
      this.datepicker.hide();
      this.generateDate(dates)
    },
    months(month: number) {
      return (
        [
          { id: 0, name: "января" },
          { id: 1, name: "февраля" },
          { id: 2, name: "марта" },
          { id: 3, name: "апреля" },
          { id: 4, name: "мая" },
          { id: 5, name: "июня" },
          { id: 6, name: "июля" },
          { id: 7, name: "августа" },
          { id: 8, name: "сентября" },
          { id: 9, name: "октября" },
          { id: 10, name: "ноября" },
          { id: 11, name: "декабря" },
        ].find((m) => m.id === month)?.name || ""
      );
    },
    generateDate(dates: Date[]) {
      let text = "с FIRST MONTH1 по SECOND MONTH2";
      const firstDate = new Date(dates[0]);
      const secondDate = new Date(dates[1]);
      var daysLag = Math.ceil(
        Math.abs(secondDate.getTime() - firstDate.getTime()) /
          (1000 * 3600 * 24)
      );
      text = text.replace("FIRST", firstDate.getDate().toString());
      text = text.replace("SECOND", secondDate.getDate().toString());
      if (firstDate.getMonth() === secondDate.getMonth()) {
        text = text.replace("MONTH1 ", "");
      } else {
        text = text.replace("MONTH1", this.months(firstDate.getMonth()));
      }
      text = text.replace("MONTH2", this.months(secondDate.getMonth()));
      this.data.dayLength = daysLag + 1;
      this.data.days = text;
    },
  },
});
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  span {
    font-size: 12px;
    color: #7d8e9e;
  }
  input,
  textarea {
    font-family: "Raleway", sans-sarif;
    font-feature-settings: "pnum" on, "lnum" on;
    margin-top: 5px;
    background: #f4f5f9;
    box-shadow: inset 0px 0px 5px rgba(166, 171, 189, 0.2);
    border-radius: 10px;
    padding: 12px 15px;
    transition: 0.3s all;
    font-size: 14px;
    &.active {
      border-radius: 10px 10px 0 0;
    }
    &:disabled {
      opacity: 0.7;
      color: #cacaca;
    }
  }
  textarea {
    height: 200px;
  }
  img {
    position: absolute;
    top: 23px;
    right: 15px;
    transition: 0.3s all;
    &.active {
      transform: rotate(180deg);
      transition: 0.3s all;
    }
  }
  .drop {
    width: 100%;
    padding: 10px 20px;
    background-color: #fff;
    box-shadow: 5px 5px 20px rgba(166, 171, 189, 0.5);
    border-radius: 0 0 10px 10px;
    position: absolute;
    z-index: 1;
    max-height: 150px;
    overflow: auto;
    ul {
      li {
        cursor: pointer;
        text-align: left;
        color: #9499aa;
        padding: 5px 0;
        &:hover {
          color: #717583;
        }
      }
    }
  }
  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
