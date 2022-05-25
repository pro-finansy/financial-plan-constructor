import { dynamicsObject } from "@/interfaces";
import axios from "axios";

export default {
  getTableData: async (request: string, data: dynamicsObject) => {
    return await axios.get(request, data);
  },
  toggleExpertActive: async (request: string, data: dynamicsObject) => {
    return await axios.put(request, data);
  },
  downloadQuestionnaireFile: async (request: string) => {
    return await axios.post(request);
  },
  tableRequestFilter: async (request: string) => {
    return await axios.get(request);
  },
  onDownloadStudentFile: async (data: dynamicsObject) => {
    return await axios.post("/api/student/file/download", data);
  },
  onDownloadExpertFile: async (data: dynamicsObject) => {
    return await axios.post("/api/expert/file/download", data);
  },
  onDownloadStudents: async (data: dynamicsObject) => {
    return await axios.post(
      "/api/excel/students/download", data,
      { responseType: "blob" }
    );
  },
  onDownloadQuestionnaires: async (data: dynamicsObject) => {
    return await axios.post(
      "/api/excel/questionnaires",
      data,
      { responseType: "blob" }
    );
  },
};
