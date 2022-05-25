<template>
  <transition name="fade">
    <div class="notification" v-if="notification.status" :class="notification.status">
      <div class="title">Произошла ошибка при попытке сохранить данные анкеты!</div>
      <div class="cancel" @click="cancel">
        <img src="/images/common/cancel.svg" alt="X">
      </div>
      <div class="container">
        <div>Это могло произойти по ряду причин:</div>
        <ul>
          <li>- Отсутствует интернет-соединение</li>
          <li>- У Вас установлен корпоративный интернет, который блокирует фоновую отправку данных</li>
          <li>- У Вас включен VPN-сервер, который блокирует фоновую отправку данных</li>
        </ul>
        <div class="more">Мы постараемся принудительно сохранить Ваши данные, чтобы они не потерялись!</div>
        <div class="more">Рекомендуется перезагрузить страницу во избежание потери данных!</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { mapGetters } from "vuex";
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "QuestionnaireError",
  data() {
    return {
      notification: {} as dynamicsObject,
      timeout: 0,
    };
  },
  computed: {
    ...mapGetters(['questionnaireError'])
  },
  watch: {
    "$store.state.questionnaireError": function () {
      if (this.$store.getters.questionnaireError) {
        this.sendReportError();
      } else {
        this.notification = {};
      }
    },
  },
  methods: {
    sendReportError() {
      this.axios
        .post(`/api/questionnaire/save/mode/error`, {
          err: this.questionnaireError.err,
          questionnaire: this.questionnaireError.questionnaire
        })
        .catch(err => {
          if (err?.response?.status === 400 || err?.response?.status === 401) {
            this.$store.commit("createNotification", {
              status: "error",
              message: err.response.data.message,
            });
            return this.$router.push('/auth');
          }
          this.notification = this.questionnaireError;
          this.timeout = setTimeout(() => {
            this.notification = {};
            this.$store.commit("destroyQuestionnaireError");
            clearTimeout(this.timeout);
          }, 10000);
          if (this.questionnaireError.err && this.questionnaireError.err.config && this.questionnaireError.err.config.data) {
            localStorage.setItem('saveMode', JSON.stringify({ questionnaire: this.questionnaireError.questionnaire, data: this.questionnaireError.err.config.data }));
          }
        });
    },
    cancel() {
      clearTimeout(this.timeout);
      this.$store.commit("destroyQuestionnaireError");
    },
  }
});
</script>

<style lang="scss" scoped>
.notification {
  z-index: 1000;
  animation: notification 3s ease;
  animation-fill-mode: forwards;
  position: fixed;
  bottom: 1%;
  right: 10px;
  text-align: center;
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #f5c6cb;
  letter-spacing: 0;
  color: #721c24;
  background-color: #f8d7da;
  .title {
    font-size: 14px;
    font-weight: 500;
  }
  .cancel {
    width: 14px;
    height: 14px;
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .container {
    text-align: left;
    margin-top: 15px;
    .more {
      font-size: 14px;
      margin-top: 15px;
    }
    .button {
      margin-top: 5px;
      text-align: center;
      button {
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 5px;
        background: #ff6565;
        color: #fff;
      }
    }
  }
}

@keyframes notification {
  0% {
    bottom: -10%;
  }
  100% {
    bottom: 1%;
  }
}
</style>