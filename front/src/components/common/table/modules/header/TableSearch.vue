<template>
  <label class="table--header-search flex">
    <img
      src="/images/common/search.svg"
      alt=""
      @click="$emit('onSearch', search)"
    />
    <input
      type="text"
      v-model="search"
      placeholder="Поиск..."
      @keyup.enter="$emit('onSearch', search)"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "TableSearch",
  emits: ["onSearch"],
  data() {
    return {
      search: "",
    };
  },
});
</script>

<style lang="scss" scoped>
.table--header-search {
  position: relative;
  margin: 0 25px;
  img {
    position: absolute;
    width: 16px;
    top: 10px;
    left: 12px;
    cursor: pointer;
  }
  input {
    width: 250px;
    box-shadow: none;
    font-size: 13px;
    transition: 0.5s all;
    padding: 10px 25px 10px 36px;
    &::-webkit-input-placeholder {
      letter-spacing: 0.05em;
    }
  }
}
</style>
