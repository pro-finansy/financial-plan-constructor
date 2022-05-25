<template>
  <div class="comment">
    <header>
      {{ current.name }}
    </header>
    <div class="inputs">
      <div class="input">
        <textarea
          :placeholder="current.module.inputs[0].placeholder"
          v-model="current.module.data.comment"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "CommonComment",
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.comment {
  width: 650px;
  header {
    font-size: 26px;
    color: #5d6272;
    margin-bottom: 60px;
  }
  .inputs {
    .input {
      textarea {
        height: 300px;
      }
    }
  }
}
</style>
