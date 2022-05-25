<template>
  <div class="input" :style="'grid-column: ' + input.grid" v-if="input.show">
    <span v-if="input.show">{{ input.name }}</span>
    <label v-if="input.type === 'file'">
      <input type="file" ref="excel" name="excel" @change="selectFile">
      <div :class="{ error: input.error }" class="file">{{ data.excel ? `${data.excel.name} (${Math.round(+data.excel.size / 1024).toFixed(0)} кБ)` : 'Выберите файл' }}</div>
    </label>
    <div class="example" v-if="input.type === 'file'">
      <div class="title">Шаблон файла:</div>
      <div class="container">
        <img @click="exampleClick = !exampleClick" :class="{ scale: exampleClick }" :src="input.example" alt="">
      </div>
    </div>
    <input
      v-if="input.disabled"
      :value="data[input.id]"
      :type="input.type"
      @keyup="inputKeyUp"
      disabled
      :data-id="input.id"
      :class="{ error: input.error }"
      :placeholder="input.placeholder"
    />
    <textarea 
      v-else-if="input.type === 'textarea'" 
      @keyup="inputKeyUp"
      v-model="data[input.id]"
      :class="{ error: input.error }"
      :data-id="input.id"
      :placeholder="input.placeholder"
    ></textarea>
    <input
      v-else-if="input.mask && input.show"
      @keyup="inputKeyUp"
      v-mask="input.mask"
      :type="input.type"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error }"
      maxlength="80"
    />
    <input
      v-else-if="input.drop && input.show"
      @click="$emit('toggleDrop', input)"
      @keyup="inputKeyUp"
      @focus="$emit('inputFocus', input)"
      class="dd"
      :type="input.type"
      v-model="data[input.id]"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error, active: input.showDrop }"
      maxlength="80"
    />
    <input
      v-else-if="input.dropBox && input.show"
      @click="$emit('toggleDrop', input)"
      @keyup="inputKeyUp"
      :type="input.type"
      :value="data[input.id].join(', ')"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error, active: input.showDrop }"
      maxlength="80"
    />
    <input
      v-else-if="input.show"
      :type="input.type"
      v-model="data[input.id]"
      @keyup="inputKeyUp"
      :data-id="input.id"
      :placeholder="input.placeholder"
      :class="{ error: input.error }"
      maxlength="80"
    />
    <svg v-if="(input.drop || input.dropBox) && !input.disabled" :class="{ active: input.showDrop }" @click="$emit('toggleDrop', input)" version="1.1" fill="#848484" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" xml:space="preserve" data-v-67f4da97=""><path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" data-v-67f4da97=""></path></svg>
    <transition name="fade">
      <div class="drop" v-if="input.drop && input.showDrop">
        <ul>
          <li
            @click="$emit('selectDropElement', el, input)"
            v-for="el of input.drop_data"
            :key="el._id"
            clas="flex items-center"
          >
            {{ showInstrumentName(el) }}
          </li>
        </ul>
      </div>
    </transition>
    <transition name="fade">
      <div class="drop" v-if="input.dropBox && input.showDrop">
        <ul>
          <li
            @click="$emit('selectBoxElement', el, input)"
            v-for="el of input.drop_data"
            :key="el._id"
            clas="flex items-center"
          >
            <input type="checkbox" v-model="el.selected" />
            <span>{{ el.name }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { mask } from "vue-the-mask";
import { dynamicsObject } from "@/interfaces";
import { ERROR_UPLOAD_FILE, ERROR_UPLOAD_FILE_TYPE_XLSX } from "@/utils/constants";

export default defineComponent({
  name: "Input",
  emits: ["selectDropElement", "toggleDrop", "selectBoxElement", "inputKeyUp", "inputFocus"],
  directives: {
    mask
  },
  props: {
    input: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      exampleClick: false
    }
  },
  methods: {
    selectFile() {
      const file = (this.$refs.excel as any).files[0];
      if (!file)
        return this.$store.commit("createNotification", {
          status: "error",
          message: ERROR_UPLOAD_FILE,
        });
      if (!file.type.includes("openxml")) {
        return this.$store.commit("createNotification", {
          status: "error",
          message: ERROR_UPLOAD_FILE_TYPE_XLSX,
        });
      }
      this.data.excel = file;
    },
    showInstrumentName(el: dynamicsObject) {
      if (el.sign) return `${el.name} - ${el.sign}`;
      if (el.title) return `${el.name} (${el.title})`;
      
      return el.name || el.symbol;
    },
    inputKeyUp(event: any) {
      this.$emit('inputKeyUp', { event, input: this.input });
    }
  }
});
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  label {
    .file {
      font-family: 'Raleway', sans-sarif;
      font-feature-settings: 'pnum' on, 'lnum' on;
      width: 100%;
      color: #A9AEBC;
      font-size: 14px;
      background-color: #F4F5F9;
      border-radius: 10px;
      margin-top: 5px;
      padding: 12px 15px;
      border: 2px dashed #d0d0d0;
      cursor: pointer;
      transition: 0.3s all;
      &.error {
        transition: 0.3s all;
        background: #ffeaea !important;
        &::-webkit-input-placeholder {
          color: #b42b2b;
        }
      }
    }
  }
  .example {
    .title {
      font-size: 12px;
      margin: 20px 0 10px;
      color: #7D8E9E;
    }
    .container {
      img {
        width: 100%;
        transition: 0.3s all;
        cursor: pointer;
        &.scale {
          transition: 0.3s all;
          transform: scale(2);
        }
      }
    }
  }
  span {
    font-size: 12px;
    color: #32363a;
  }
  > input, textarea {
    font-family: 'Raleway', sans-sarif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    margin-top: 5px;
    background: #f4f5f9;
    box-shadow: inset 0px 0px 5px rgba(166, 171, 189, 0.2);
    border-radius: 10px;
    padding: 12px 15px;
    transition: 0.3s all;
    font-size: 14px;
    font-weight: 400;
    &.dd {
      padding: 12px 35px 12px 15px;
    }
    &.active {
      border-radius: 10px 10px 0 0;
    }
    &:disabled {
      background: #e7e7e7;
      color: #000000;
      box-shadow: none;
    }
  }
  textarea {
    height: 130px;
    &[data-id="comment"], &[data-id="commentInstrument"] {
      height: 200px;
    }
  }
  > svg {
    position: absolute;
    top: 36px;
    width: 12px;
    height: 12px;
    right: 12px;
    transition: 0.3s all;
    &.active {
      transform: rotate(180deg);
      transition: 0.3s all;
    }
  }
  .drop {
    width: 100%;
    background-color: #fff;
    box-shadow: 5px 5px 20px rgba(166, 171, 189, 0.5);
    position: absolute;
    z-index: 1;
    max-height: 150px;
    overflow: auto;
    ul {
      li {
        cursor: pointer;
        text-align: left;
        color: #717583;
        padding: 8px 15px;
        font-size: 13px;
        transition: 0.3s all;
        &:hover {
          transition: 0.3s all;
          background-color: rgb(245, 245, 245);
        }
        span {
          margin-left: 10px;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #f6f6f6;
        }
      }
    }
  }
}
</style>
