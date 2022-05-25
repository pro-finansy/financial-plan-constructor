<template>
  <div class="input" :class="{ gap: gap }" v-if="input.show">
    <span v-if="input.name" :class="{ white: !showName }">{{
      input.name
    }}</span>
    <textarea
      v-if="input.type === 'textarea' && !block"
      :placeholder="input.placeholder"
      v-model="data[input.id]"
      :class="{ error: input.error }"
      :data-id="input.id"
    ></textarea>
    <div v-else-if="input.type === 'textarea' && block" class="tt">
      {{ data[input.id] }}
    </div>
    <div v-else-if="block" class="ii">{{ data[input.id] }}</div>
    <input
      v-else-if="input.mask"
      @keyup="inputKeyUp"
      v-mask="input.mask"
      :type="input.type"
      :ref="input.id"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{
        error: input.error,
        warning: expert && data[input.id] !== dataStudent[input.id],
      }"
      maxlength="80"
      autocomplete="off"
    />
    <input
      v-else-if="input.formula_element"
      :type="input.type"
      :ref="input.id"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      @keyup="inputKeyUp"
      :class="{
        error: input.error,
        warning: expert && data[input.id] !== dataStudent[input.id],
      }"
      maxlength="80"
      autocomplete="off"
    />
    <input
      v-else-if="input.drop"
      @click="$emit('toggleDrop', input)"
      @focus="$emit('inputFocus', input)"
      @keyup="inputKeyUp"
      v-model="data[input.id]"
      data-type="drop"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{
        error: input.error,
        active: input.showDrop,
        warning: expert && data[input.id] !== dataStudent[input.id],
      }"
      autocomplete="off"
    />
    <input 
      v-else-if="input.type === 'number'" 
      type="number"
      v-model="data[input.id]"
      :placeholder="input.placeholder"
      :class="{
        error: input.error,
        warning: expert && data[input.id] !== dataStudent[input.id],
      }"
      :maxlength="input.maxlength || 80"
      @keyup="inputKeyUp"
      @keypress="onlyNumber"
      autocomplete="off"
    />
    <input
      v-else
      :type="input.type"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{
        error: input.error,
        warning: expert && data[input.id] !== dataStudent[input.id],
      }"
      :maxlength="input.maxlength || 80"
      @keyup="inputKeyUp"
      autocomplete="off"
    />
    <svg v-if="input.drop && !block && questionnaireStatus" @click="$emit('toggleDrop', input)" :class="{ active: input.showDrop }" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-67f4da97=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-67f4da97=""></path></svg>
    <svg v-else-if="input.drop && !block && !questionnaireStatus" class="disabled" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-67f4da97=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-67f4da97=""></path></svg>
    <span
      v-if="section.default === 'conclusion-replenishment-reality'"
      class="sign"
      >{{ targetCurrencySign }}</span
    >
    <transition name="fade">
      <div class="drop" v-if="input.drop && input.showDrop">
        <ul>
          <li
            @click.stop="$emit('selectDropElement', el, input)"
            v-for="el of input.drop_data"
            :key="el._id"
          >
            {{ el.symbol || el.name || el.instrument }}
            {{ el.sign ? ` - ${el.sign}` : '' }}
            {{ el.exchange_acronym ? `(${el.exchange_acronym})` : "" }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { mapGetters } from 'vuex';
import { mask } from "vue-the-mask";

export default defineComponent({
  emits: [
    "selectDropElement",
    "toggleDrop",
    "formula",
    "inputKeyUp",
    "inputFocus",
  ],
  directives: {
    mask
  },
  name: "QuestionnaireInput",
  props: {
    input: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    showName: {
      type: Boolean,
      required: true,
    },
    gap: {
      type: Boolean,
      required: true,
    },
    block: {
      type: Boolean,
      default: false,
    },
    section: {
      type: Object,
      default: () => ({
        show: true,
      }),
    },
    targetId: {
      type: Number,
    },
    targetCurrencySign: {
      type: String,
      default: "",
    },
    dataStudent: {
      type: Object,
      default: () => ({}),
    },
    expert: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    inputKeyUp(event: any) {
      this.$emit('inputKeyUp', { event, input: this.input });
    },
    onlyNumber ($event: any) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        $event.preventDefault();
      }
    }
  },
  computed: mapGetters(['questionnaireStatus']),
});
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  text-align: left;
  padding-bottom: 15px;
  .empty {
    height: 17px;
  }
  span {
    font-size: 13px;
    line-height: 16px;
    color: #9699a6;
    margin-bottom: 10px;
    &.white {
      color: transparent;
    }
  }
  input,
  textarea,
  .tt,
  .ii {
    font-weight: 500;
    box-shadow: inset 1px 1px 5px rgba(166, 171, 189, 0.3);
    border-radius: 8px;
    padding: 12px 20px;
    transition: 0.3s all;
    font-size: 16px;
    font-feature-settings: "pnum" on,"lnum" on;
    font-family: 'Raleway', sans-serif;
    &.active {
      border-radius: 10px 10px 0 0;
    }
    &:disabled {
      opacity: 0.7;
      color: #cacaca;
    }
  }
  .tt,
  .ii {
    padding: 15px 20px;
    background-color: #f4f5f9;
    box-shadow: none;
  }
  .ii {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tt {
    overflow: auto;
  }
  textarea,
  .tt {
    height: 200px;
  }
  .sign {
    position: absolute;
    top: 32px;
    font-size: 18px;
    right: 10px;
  }
  svg {
    width: 14px;
    height: 14px;
    cursor: pointer;
    position: absolute;
    bottom: 28px;
    right: 15px;
    transition: 0.3s all;
    &.active {
      transform: rotate(180deg);
      transition: 0.3s all;
    }
    &.disabled {
      cursor: default;
      opacity: 0.3;
    }
  }
  .drop {
    width: 100%;
    background-color: #fff;
    box-shadow: 5px 5px 20px rgba(166, 171, 189, 0.5);
    border-radius: 0 0 8px 8px;
    position: absolute;
    z-index: 1;
    max-height: 150px;
    overflow: auto;
    ul {
      li {
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        text-align: left;
        transition: 0.3s all;
        color: #717583;
        &:not(:last-child) {
          border-bottom: 1px solid #f6f6f6;
        }
        &:hover {
          background-color: rgb(247, 247, 247);
          transition: 0.3s all;
          color: rgb(36, 36, 36);
        }
      }
    }
  }
  &.gap {
    textarea,
    .tt {
      height: 100px;
    }
    input,
    textarea,
    .tt,
    .ii {
      padding: 10px 30px 10px 15px;
      font-size: 14px;
      border-radius: 8px;
    }
    .tt,
    .ii {
      min-height: 36px;
      padding: 11px 30px 11px 15px;
    }
    .sign {
      top: 28px;
      font-size: 14px;
    }
    svg {
      bottom: 20px;
      right: 10px;
      width: 10px;
    }
    padding-bottom: 10px;
  }
}
</style>