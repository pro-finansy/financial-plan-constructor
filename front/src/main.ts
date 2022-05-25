import VueTheMask from 'vue-the-mask';
import io from 'socket.io-client';
import axios from "axios";
import jquery from "jquery";
import { createApp } from "vue";
import mitt from 'mitt';
import App from "./App.vue";
import router from "./router";
import store from "./store";

import api from './api';
import './helpers/interceptors';
import ElementPlus from 'element-plus';
import "./helpers/online";
import './utils/math';

import 'element-plus/dist/index.css';
import 'air-datepicker/air-datepicker.css';

if (!process.env.VUE_APP_SOCKET_DEV_URL) throw new Error('Заполните VUE_APP_SOCKET_DEV_URL!');
const socket = io(process.env.VUE_APP_SOCKET_URL, {
  transports: ["websocket"]
});

socket.on("disconnect", () => {
  socket.connect();
});

const app = createApp(App);

app.config.globalProperties.axios = axios;
app.config.globalProperties.jq = jquery;
app.config.globalProperties.emitter = mitt();
app.config.globalProperties.API = api;
app.config.globalProperties.socket = socket;
Object.typedKeys = Object.keys as any;

app
  // .use(socket)
  .use(VueTheMask.default)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount("#app");
