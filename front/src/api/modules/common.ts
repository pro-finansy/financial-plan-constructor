import { dynamicsObject } from "@/interfaces";
import axios from "axios";

export default {
  getConvert: async () => {
    return await axios.get("/api/convert");
  },
  getCurrencies: async () => {
    return await axios.get("/api/currency/list");
  },
  getMixeds: async () => {
    return await axios.get("/api/asset/list");
  },
  onSaveComments: async (data: dynamicsObject) => {
    return await axios.put("/api/user/comments", data);
  },
  getCourses: async () => {
    return await axios.get("/api/courses");
  },
  getCourseList: async () => {
    return await axios.get("/api/course/list");
  },
  changeCourse: async (data: dynamicsObject) => {
    return await axios.patch("/api/course", data);
  },
  getFAQList: async (data: dynamicsObject) => {
    return await axios.get("/api/faq/list", {
      params: data
    });
  },
};
