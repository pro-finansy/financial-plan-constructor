<template>
  <section class="auth flex justify-center items-center">
    <div>
      <header>Вход на платформу</header>
      <div class="inputs">
        <div>
          <input v-model="email" type="email" placeholder="Email"/>
        </div>
        <div>
          <input v-model="password" type="password" placeholder="Пароль"/>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn--green btn--static" @click="submit">Войти</button>
        <button class="btn btn--green btn--static" @click="$router.push('/auth/password')">Получить пароль</button>
        <div @click="$router.push('/reset/null')">Забыли пароль?</div>
      </div>
      <div class="inputs" style="color: #ccc">
        Оплатить доступ к сервису можно по <a href="https://investmafk.ru/">ссылке</a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue-demi';

export default defineComponent({
  name: "AuthMain",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  created() {
    this.$store.dispatch("checkAuthorization");
  },
  methods: {
    async submit() {
      const result = await this.API.auth.onLogin({email: this.email, password: this.password});
      this.$store.dispatch("setLogin", result.data);
    },
  },
});
</script>

<style scoped lang="scss">
.auth {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 30px;

  > div {
    text-align: center;
    width: 350px;

    header {
      font-size: 30px;
    }

    .inputs {
      margin: 20px 0;

      input:first-child {
        margin-bottom: 10px;
      }
    }

    .actions {
      button {
        margin-bottom: 10px;
      }

      div {
        cursor: pointer;
      }
    }
  }
}
</style>
