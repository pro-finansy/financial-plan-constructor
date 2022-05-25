<template>
  <div class="inputs">
    <Input
      v-for="input of module.inputs"
      :key="input.id"
      :data="module.data"
      :input="input"
      @toggleDrop="toggleDrop"
      @selectDropElement="selectDropElement"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { dynamicsObject } from "@/interfaces";
import { Instrument } from "@/interfaces/dto/instrument";
import Input from "./Input.vue";

export default defineComponent({
  emits: ['amountInflation'],
  name: "Inputs",
  props: {
    module: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      amount: ''
    }
  },
  methods: {
    toggleDrop(input: Instrument.Input) {
      this.module.inputs.forEach((i: Instrument.Input) => {
        if (i.id !== input.id) i.showDrop = false;
      });
      input.showDrop = !input.showDrop;
      if (input.showDrop) {
        this.jq("body").bind("click", (e) => {
          if (
            this.jq(e.target).closest(".drop").length === 0 &&
            this.jq(e.target).siblings(".drop").length === 0
          )
            input.showDrop = false;
        });
      } else {
        this.jq("body").unbind("click");
      }
    },
    selectDropElement(el: dynamicsObject, input: Instrument.Input) {
      this.module.data[input.id] = el.name;
      this.module.data[input.id + "_id"] = el._id;
      input.showDrop = false;
    },
  },
  components: {
    Input,
  },
});
</script>

<style lang="scss" scoped>
.inputs {
  width: inherit;
}
.amount {
  position: absolute;
  bottom: 40px;
  left: 20px;
  color: #9499aa;
}
</style>
