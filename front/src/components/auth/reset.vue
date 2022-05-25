<template>
  <section class="reset flex justify-center items-center">
    <main>
      <header>Восстановление пароля</header>
      <div class="inputs">
        <div v-if="token === 'null'">
          <input v-model="email" type="email" placeholder="Email" />
        </div>
        <div v-else>
          <input v-model="password" type="password" placeholder="Введите новый пароль" />
          <input v-model="resetPassword" type="password" placeholder="Повторите пароль" />
        </div>
      </div>
      <div class="actions">
        <button v-if="token === 'null'" class="btn btn--green" @click="onEmail">Отправить письмо на почту</button>
        <button v-else class="btn btn--green" @click="onReset">Изменить пароль</button>
        <div @click="$router.push('/auth')">Вспомнили пароль?</div>
      </div>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';

export default defineComponent({
  name: "ResetMain",
  data() {
    return {
      email: '',
      password: '',
      resetPassword: '',
      token: '' as string | unknown,
    }
  },
  created() {
    this.checkResetMode();
  },
  methods: {
    checkResetMode() {
      this.token = this.$.attrs.token;
    },
    onEmail() {
      this.API.auth.onReset({ email: this.email });
    },
    async onReset() {
      if (!this.password || !this.resetPassword) return;
      await this.API.auth.onChange({ password: this.password, resetPassword: this.resetPassword }, { Authorization: this.token });
      this.$router.push('/auth');
    },
  }
})
</script>

<style lang="scss" scoped>
.reset {
  background: #fff;
  width: 100%;
  height: 100%;
  main {
    text-align: center;
    width: 350px;
    header {
      font-size: 28px;
    }
    .inputs {
      margin: 20px 0;
      input:first-child {
        margin-bottom: 10px;
      }
    }
    .actions {
      div {
        margin-top: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>