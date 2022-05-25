<template>
  <tbody>
    <tr v-for="row of number" :key="row">
      <td v-for="col of variables" :key="col">
        <div class="preloader"></div>
      </td>
      <td>
        <div class="preloader"></div>
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";

export default defineComponent({
  name: "ContainerBody",
  data() {
    return {
      number: 10,
    };
  },
  props: {
    variables: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@keyframes pulsate {
  50% {
    background-color: #fafafd;
  }
}

tbody {
  tr {
    td {
      border-top: 1px solid #efefef;
      padding: 28px 0;
      .preloader {
        width: 80%;
        height: 15px;
        border-radius: 10px;
        background-color: #f4f5f9;
        animation: pulsate 2s ease infinite;
      }
    }
  }
}
</style>
