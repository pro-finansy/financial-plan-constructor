<template>
  <section class="flex justify-center items-center">
    <main>
      <header>Получение пароля</header>
      <div class="inputs">
        <div>
          <input v-model="password" type="password" placeholder="Введите пароль" />
          <input v-model="resetPassword" type="password" placeholder="Повторите пароль" />
        </div>
      </div>
      <div class="actions">
        <button class="btn btn--green" @click="onNew">Получить пароль</button>
      </div>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';

export default defineComponent({
  name: "NewMain",
  data() {
    return {
      password: '',
      resetPassword: '',
    }
  },
  methods: {
    async onNew() {
      if (!this.password || !this.resetPassword) return;
      await this.API.auth.onChange({ password: this.password, resetPassword: this.resetPassword }, { Authorization: this.$.attrs.token });
      this.$router.push('/auth');
    },
  }
})
</script>

<style lang="scss" scoped>
section {
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