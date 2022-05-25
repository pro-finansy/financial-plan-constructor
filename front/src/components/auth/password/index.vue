<template>
  <section class="auth flex justify-center items-center">
    <form @submit.prevent="submit">
      <header>Получение пароля</header>
      <div class="inputs">
        <div>
          <input v-model="email" type="email" placeholder="Email" />
        </div>
      </div>
      <div class="actions">
        <button class="btn btn--green btn--static" type="submit">Получить пароль</button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';

export default defineComponent({
  name: "AuthPasswordMain",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    submit() {
      this.API.auth.onLoginPassword({ email: this.email });
    },
  },
});
</script>

<style scoped lang="scss">
.auth {
  background: #fff;
  width: 100%;
  height: 100%;
  form {
    text-align: center;
    width: 350px;
    header {
      font-size: 35px;
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