<template>
  <section>
    <router-view />
    <transition name="fade">
      <modal v-if="onShowModal" :modal="modal" @showModal="showModal"></modal>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { mapState } from 'vuex';
import Modal from "../components/common/modal/index.vue";
import { ROLES_ENUM } from '../utils/enums';

export default defineComponent({
  name: "preview-layout",
  data() {
    return {
      onShowModal: false
    }
  },
  computed: {
    ...mapState(['modal'])
  },
  async created() {
    await this.$store.dispatch("checkAuthorization");
    this.$store.dispatch("getConvert");
    this.$store.dispatch("getCurrencies");
    if (this.$store.getters.user && this.$store.getters.user.role === ROLES_ENUM.STUDENT) this.$router.push('/');
  },
  methods: {
    showModal(status: boolean) {
      this.onShowModal = status;
    }
  },
  watch: {
    modal() {
      this.onShowModal = true;
    }
  },
  components: {
    Modal,
  },
});
</script>

<style lang="scss" scoped>
section {
  overflow: auto;
  min-width: 1280px;
  background: #ebecf0;
}
</style>