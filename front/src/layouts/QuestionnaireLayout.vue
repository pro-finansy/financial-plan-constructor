<template>
  <main>
    <router-view />
    <transition name="fade">
      <modal v-if="onShowModal" :modal="modal" @showModal="showModal"></modal>
    </transition>
    <notification></notification>
  </main>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { defineAsyncComponent, defineComponent } from "vue-demi";
import Modal from "../components/common/modal/index.vue";
const Notification = defineAsyncComponent(() => import("../components/common/notification/questionnaire.vue"));

export default defineComponent({
  name: "questionnaire-layout",
  data() {
    return {
      onShowModal: false
    }
  },
  methods: {
    showModal(status: boolean) {
      this.onShowModal = status;
    }
  },
  computed: mapState(['modal']),
  created() {
    this.$store.dispatch("checkAuthorization");
    this.$store.dispatch("getConvert");
    this.$store.dispatch("getCurrencies");
    if (!this.$store.getters.user) this.$router.push('/auth');
  },
  watch: {
    modal() {
      this.onShowModal = true;
    }
  },
  components: {
    Modal,
    Notification
  }
});
</script>

<style scoped>
main {
  min-width: 1280px;
}
</style>