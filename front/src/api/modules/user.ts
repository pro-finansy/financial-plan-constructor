import { dynamicsObject } from "@/interfaces";
import axios from "axios";

export default {
  updateProfile: async (data: dynamicsObject) => {
    return await axios.patch("/api/user", data);
  },
  updateAvatar: async (data: dynamicsObject, params: dynamicsObject) => {
    return await axios.post("/api/user/avatar", data, {
      headers: { "Content-Type": "multipart/form-data" },
      params,
    });
  },
  changePassword: async (data: dynamicsObject) => {
    return await axios.patch("/api/user/password", data);
  },
  removeAvatar: async (_id: string) => {
    return await axios.delete(`/api/user/avatar/${_id}`);
  },
  getExpertList: async () => {
    return await axios.get('/api/user/expert/list');
  }
};
