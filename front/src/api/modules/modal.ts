import { dynamicsObject } from "@/interfaces";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export default {
  onSubmit: async (options: AxiosRequestConfig) => {
    return await axios(options);
  },
  formDataRequest: async (request: string, data: dynamicsObject, headers: AxiosRequestHeaders) => {
    return await axios.patch(request, data, { headers });
  },
  onUploadFile: async (request: string, data: dynamicsObject, headers: AxiosRequestHeaders, params: dynamicsObject) => {
    return await axios.post(request, data, { headers, params });
  },
};
