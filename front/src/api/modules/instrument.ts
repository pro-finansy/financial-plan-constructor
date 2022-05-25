import { dynamicsObject } from "@/interfaces";
import axios from "axios";

export default {
  getInstrumentList: async (query: dynamicsObject) => {
    return await axios.get("/api/investments/list", query);
  },
  getInstruments: async () => {
    return await axios.get("/api/investments");
  },
  actualPrices: async (data: dynamicsObject) => {
    return await axios.post("/api/investments/actual", data);
  },
  onBlockedInstrument: async (instrument: dynamicsObject) => {
    return await axios
      .patch(`/api/investment/blocked/${instrument._id}`, {
        blocked: instrument.blocked,
      })
      .catch(() => {
        instrument.blocked = false;
      });
  },
};