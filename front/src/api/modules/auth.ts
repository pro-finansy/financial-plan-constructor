import { dynamicsObject } from "@/interfaces";
import axios, { AxiosRequestHeaders } from "axios";

export default {
  onLogin: async (data: dynamicsObject) => {
    return await axios.post("/api/login", data);
  },
  onReset: async (data: dynamicsObject) => {
    return await axios.post("/api/reset", data);
  },
  onChange: async (data: dynamicsObject, headers: AxiosRequestHeaders | dynamicsObject) => {
    return await axios.post("/api/change", data, { headers });
  },
  onLoginPassword: async (data: dynamicsObject) => {
    return await axios.post("/api/login/password", data);
  },
  onLogout: async () => {
    return await axios.post("/api/logout");
  },
};
