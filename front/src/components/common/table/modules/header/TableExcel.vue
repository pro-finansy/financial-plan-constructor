<template>
  <button
    v-if="options.export && !pendingRequest"
    class="btn btn--green"
    @click="onExport"
  >
    xlsx
  </button>
  <button
    v-if="options.export && pendingRequest"
    class="btn btn--green btn--disabled"
  >
    xlsx
  </button>
</template>

<script lang="ts">
import { dynamicsObject } from "@/interfaces";
import { defineComponent } from "vue-demi";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "TableExcel",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async onExport() {
      const query: dynamicsObject = {};
      const array = this.options.header.filter((h: dynamicsObject) => h.filters?.filter).map((h: dynamicsObject) => ({ id: h.id, value: h.filters?.filter }));
      for (const element of array) {
        query[element.id] = element.value;
      }
      this.$store.commit("togglePendingRequest", true);
      const result = await this.API.table.onDownloadQuestionnaires(query);
      const urlCreator = window.URL || window.webkitURL;
      const href = urlCreator.createObjectURL(result);
      const a = document.createElement("a");
      a.href = href;
      a.download = `Анкеты.xlsx`;
      a.click();
    },
  },
  computed: mapGetters(["pendingRequest"]),
});
</script>

<style lang="scss" scoped>
div,
button {
  margin: 0 8px;
}
</style>
