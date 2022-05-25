<template>
  <section class="profile">
    <div class="profile--title">Смена пароля</div>
    <div class="profile--container flex">
      <div class="password">
        <Inputs :module="module" />
      </div>
    </div>
    <div class="profile--actions flex justify-end">
      <div class="btn btn--green" @click="changePassword">Сменить</div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import Inputs from '@/components/common/inputs/index.vue';

export default defineComponent({
  name: 'ProfilePassword',
  data() {
    return {
      module: {
        data: {
          password: '',
          reset_password: '',
        },
        inputs: [
          { id: 'password', placeholder: 'Введите новый пароль', name: 'Пароль', grid: '1 / 10', type: 'password', drop: false, error: false, required: false, show: true },
          { id: 'reset_password', placeholder: 'Повторите пароль', name: 'Повторите пароль', grid: '1 / 10', type: 'password', drop: false, error: false, required: false, show: true },
        ],
      }
    }
  },
  methods: {
    async changePassword() {
      const result = await this.API.user.changePassword(this.module.data);
      this.$store.commit('updateUser', result.data);
    }
  },
  components: {
    Inputs
  }
})
</script>

<style lang="scss" scoped>
.profile {
  margin-top: 30px;
  width: 51% !important;
  &--title {
    font-weight: 500;
    font-size: 24px;
  }
  &--container {
    margin-top: 20px;
    .password {
      width: 100%;
    }
  }
  &--actions {
    margin-top: 15px;
  }
}
</style>