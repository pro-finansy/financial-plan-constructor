import { dynamicsObject } from "@/interfaces";
import axios from "axios";

export default {
  onSaveMode: async (data: dynamicsObject, _id: string) => {
    return await axios
      .post(`/api/questionnaire/save/mode/safely/${_id}`, { data });
  },
  onGenerateQuestionnaire: async (data: dynamicsObject) => {
    return await axios.post(`/api/questionnaire`, data);
  },
  getQuestionnaire: async (_id: string) => {
    return await axios.get(`/api/questionnaire/id/${_id}`);
  },
  getPivotQuestionnaire: async (_id: string) => {
    return await axios
      .get(`/api/questionnaire/id/${_id}`, { params: { pivot: true } });
  },
  createStudentFile: async (_id: string) => {
    return await axios.post(`/api/questionnaire/send/${_id}`);
  },
  createPDFOnePage: async (_id: string) => {
    return await axios
      .post(`/api/questionnaire/save/onepage/${_id}`, { questionnaire_id: _id });
  },
  createPDF: async (_id: string) => {
    return await axios
      .post(`/api/questionnaire/save/${_id}`, { questionnaire_id: _id });
  },
  saveStudentQuestionnaire: async (_id: string, data: dynamicsObject) => {
    return await axios
      .put(`/api/questionnaire/student/${_id}`, data);
  },
  onCombine: async (_id: string, data: dynamicsObject) => {
    return await axios
      .put(`/api/questionnaire/combine/${_id}`, data);
  },
  onUnCombine: async (_id: string) => {
    return await axios
      .put(`/api/questionnaire/uncombine/${_id}`);
  },
  onVerification: async (_id: string, data: dynamicsObject) => {
    return await axios
      .put(`/api/questionnaire/${_id}/verification`, data);
  },
  
  deleteTacticFile: async (params: dynamicsObject, value: string) => {
    return await axios
      .delete(`/api/questionnaire/${value}/tactic/file`, { params });
  },
  saveTacticFile: async (data: dynamicsObject, params: dynamicsObject, value: string) => {
    return await axios
      .put(`/api/questionnaire/${value}/tactic/file`, data, { headers: { "Content-Type": "multipart/form-data" }, params });
  }
}