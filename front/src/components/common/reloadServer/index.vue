<template>
  <section>
    <header>Уважаемый {{ name }}!</header>
    <main>
      <span>Через <strong>{{ secondsFilter }}</strong> произойдет важное обновление системы. Это займёт не более 5 минут. Если Вы в процессе заполнения портфеля, просим Вас закрыть его во избежание потери данных 🙏</span>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import zero from '@/filters/zero.filter';
import { ROLES_ENUM } from '@/utils/enums';

export default defineComponent({
  name: "ReloadServer",
  props: {
    seconds: {
      type: Number,
      required: true
    }
  },
  computed: {
    name() {
      return this.$store.getters.user && this.$store.getters.user.role !== ROLES_ENUM.STUDENT ? 'эксперт' : 'студент'
    },
    secondsFilter() {
      const minutes = Math.floor(this.seconds / 60);
      const seconds = this.seconds % 60;
      return `${zero(minutes)}:${zero(seconds)}`;
    }
  },
  async updated() {
    if (this.seconds === 1) {
      this.$store.dispatch('logout');
      this.$router.push('/auth');
      await this.API.auth.onLogout();
      this.$store.dispatch('logout');
    }
  }
})
</script>

<style lang="scss" scoped>
section {
  width: 300px;
  position: fixed;
  bottom: 10px;
  left: 10px;
  border: 1px solid rgb(255, 44, 44);
  background-color: rgb(255, 172, 172);
  padding: 10px;
  border-radius: 5px;
  header {
    color: #a23434;
    font-size: 14px;
    font-weight: 500;
  }
  main {
    span {
      color: #a23434;
      font-size: 12px;
      strong {
        color: #a23434;
      }
    }
  }
}
</style>