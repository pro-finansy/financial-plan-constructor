import store from "@/store";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = store.getters.Authorization;
    if (token && config.headers) config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      store.commit("createNotification", {
        status: "success",
        message: response.data.message,
      });
    }
    store.commit('togglePendingRequest', false);
    return response.data;
  },
  (error) => {
    if (!error.response) {
      store.commit('togglePendingRequest', false);
      return Promise.reject(error);
    }
    if (error.response.status === 401 && error.response.config.url !== '/api/authorization') {
      store.commit("createNotification", {
        status: "error",
        message: error.response.data.message,
      });
    } else if (error.response.status === 403) {
      store.commit("createNotification", {
        status: "error",
        message: error.response.data.message,
      });
      store.dispatch("correctRoute");
    } else if (!error.response.data.success && error.response.data.message && error.response.status !== 401) {
      store.commit("createNotification", {
        status: "error",
        message: error.response.data.message,
      });
    } else if (error.response.status === 500) {
      store.commit("createNotification", {
        status: "error",
        message: "Что-то пошло не так!",
      });
    }
    store.commit('togglePendingRequest', false);
    return Promise.reject(error);
  }
);
