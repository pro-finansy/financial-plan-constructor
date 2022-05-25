<template>
  <main>
    <Header v-if="user" :user="user" />
    <router-view />
    <transition name="fade">
      <modal v-if="onShowModal" :modal="modal" @showModal="showModal"></modal>
    </transition>
  </main>
</template>

<script lang="ts">
import { mapGetters, mapState } from "vuex";
import { defineComponent } from "vue-demi";
import Header from "../components/header/index.vue";
import Modal from "../components/common/modal/index.vue";

export default defineComponent({
  name: "main-layout",
  data() {
    return {
      onShowModal: false
    }
  },
  created() {
    this.$store.dispatch("checkAuthorization");
    this.$store.dispatch("getConvert");
    this.$store.dispatch("getCurrencies");
  },
  mounted() {
    this.socket.on(`logout_${this.user._id}`, ({ status }) => {
      this.$store.commit('logout');
      this.$router.push('/auth');
      this.$store.commit("createNotification", {
        status: "error",
        message: "Ваш аккаунт деактивирован!",
      });
    });
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapState(['modal'])
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
    Header,
    Modal,
  },
});
</script>

<style scoped>
main {
  min-width: 1280px;
}
</style>