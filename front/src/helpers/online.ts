import router from '@/router';
import store from '@/store';

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  if (!navigator.onLine) {
    router.push('/auth');
    store.commit("createNotification", {
      status: "error",
      message: `Интернет-соединение разорвано!`,
    });
  } else {
    router.push('/auth');
    store.commit("createNotification", {
      status: "success",
      message: `Интернет-соединение восстановлено!`,
    });
  }
}