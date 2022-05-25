<template>
  <component :is="layout">
    <router-view />
  </component>
  <notification></notification>
  <transition name="fade">
    <reload-server v-if="reloadServer" :seconds="seconds"></reload-server>
  </transition>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue-demi";

import Notification from "./components/common/notification/index.vue";
import ReloadServer from "./components/common/reloadServer/index.vue";
const MainLayout = defineAsyncComponent(() => import('./layouts/MainLayout.vue'));
const AuthLayout = defineAsyncComponent(() => import('./layouts/AuthLayout.vue'));
const PreviewLayout = defineAsyncComponent(() => import('./layouts/PreviewLayout.vue'));
const QuestionnaireLayout = defineAsyncComponent(() => import('./layouts/QuestionnaireLayout.vue'));

import { dynamicsObject } from "./interfaces";

export default defineComponent({
  name: "App",
  computed: {
    layout() {
      return (this.$route.meta.layout || "auth") + "-layout";
    },
  },
  data() {
    return {
      reloadServer: false,
      seconds: 300,
    };
  },
  created() {
    this.socket.on("reloadServer", ({ status, seconds }) => {
      this.reloadServer = status;
      this.seconds = seconds;
    });
    this.checkSaveMode();
  },
  methods: {
    async checkSaveMode() {
      let localSave = localStorage.getItem("saveMode");
      if (localSave) {
        try {
          const save: dynamicsObject = JSON.parse(localSave);
          let data = JSON.parse(save.data);
          if (save.questionnaire && data) {
            await this.API.questionnaire.onSaveMode(data, save.questionnaire);
          }
        } catch (err) {
          console.log(err);
        }
        localStorage.removeItem("saveMode");
        this.$router.push("/auth");
      }
    },
  },
  components: {
    MainLayout,
    AuthLayout,
    PreviewLayout,
    QuestionnaireLayout,
    Notification,
    ReloadServer,
  },
});
</script>

<style lang="scss">
@import url("../public/css/reset.min.css");
@import url("../public/css/general.css");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap");

html,
body {
  width: 100%;
  height: 100%;
  color: #292929;
  font-family: "Raleway", sans-serif;
  font-feature-settings: 'pnum' on, 'lnum' on;
}

#app {
  width: inherit;
  height: inherit;
  background: #ebecf0;
  > .app {
    width: inherit;
    height: inherit;
  }
  > main {
    background-color: #f4f5f9;
    height: 100%;
    overflow: auto;
  }
}
.avoid {
  page-break-before: always;
  padding-top: 0px;
  margin: 0;
  margin-top: 0;
  margin-bottom: 0;
}
strong {
  font-weight: 700;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.dNone {
  display: none;
}

.portfolioAnimation-enter-from,
.portfolioAnimation-leave-to {
  opacity: 0;
}
.portfolioAnimation-enter-active,
.portfolioAnimation-leave-active {
  transition: all 400ms ease-in-out;
}

.customNotification {
  .el-notification__content {
    line-height: 16px;
    text-align: left;
  }
}
</style>
