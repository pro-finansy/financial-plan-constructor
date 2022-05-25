import { dynamicsObject } from "@/interfaces";
import axios from "axios";

export default {
  getCommon: async () => {
    return await axios.get(`/api/analytics/common`);
  },
  getCommonExpert: async () => {
    return await axios.get(`/api/analytics/common/expert`);
  },
  getAverage: async () => {
    return await axios.get("/api/analytics/average");
  },
  getActions: async (query: dynamicsObject) => {
    return await axios.get("/api/actions", query);
  },
  getExperts: async () => {
    return await axios.get("/api/analytics/experts");
  },
};
