<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { mapGetters } from 'vuex';
import { ElNotification } from 'element-plus';

interface Notification {
  status: 'success' | 'error' | 'info' | 'warning',
  message: string,
  timeout: number 
}

export default defineComponent({
  name: "Notification",
  computed: mapGetters(['notification']),
  data() {
    return {
      titles: {
        success: 'Успешно',
        error: 'Ошибка',
        warning: 'Предупреждение',
        info: 'Информация'
      }
    }
  },
  watch: {
    "$store.state.notification": function () {
      const notification: Notification = this.notification;
      if (notification) {
        ElNotification({
          customClass: 'customNotification',
          message: notification.message,
          type: notification.status,
          duration: notification.timeout || 5000,
          title: this.titles[notification.status],
        })
      }
    },
  },
});
</script>