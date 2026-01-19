import axios from "axios";

import { API_URL } from "../../config";

// Helper to get fresh token on each call
const getAuthKey = () => localStorage.getItem("token");

const batchService = {
  async addBatch(batch) {
    try {
      const {
        P_WHCODE,
        P_PCODE,
        P_BCODE,
        P_EXDATE,
        P_SUPCODE,
        P_BLQTY,
        P_PPRICE,
      } = batch;

      // API expects query params
      const url = `${API_URL}/ProductBatches/AddBatch?P_WHCODE=${encodeURIComponent(
        P_WHCODE
      )}&P_PCODE=${encodeURIComponent(P_PCODE)}&P_BCODE=${encodeURIComponent(
        P_BCODE
      )}&P_EXDATE=${
        P_EXDATE ? encodeURIComponent(P_EXDATE) : ""
      }&P_SUPCODE=${encodeURIComponent(P_SUPCODE)}&P_BLQTY=${encodeURIComponent(
        P_BLQTY
      )}&P_PPRICE=${encodeURIComponent(P_PPRICE)}`;

      const response = await axios.get(url, {
        headers: {
          "auth-key": getAuthKey(),
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },


    async getAll() {
    try {
      const response = await axios.get(
        `${API_URL}/ProductBatches/GetBatchDetails`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async getActiveBatches() {
    try {
      const response = await axios.get(
        `${API_URL}/ProductBatches/GetBatchDetails`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },


    async getInactiveBatches() {
    try {
      const response = await axios.get(
        `${API_URL}/ProductBatches/GetIBatchDetails`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async toggleStatus(batchId, newStatus) {
    try {
      const url = `${API_URL}/ProductBatches/UpdateBatchStatus?P_BATCHID=${batchId}&P_STATUS=${newStatus}`;
      const response = await axios.get(url, {
        headers: { "auth-key": getAuthKey() },
      });
      return response.data;
    } catch (error) {

      throw error;
    }
  },
};

export default batchService;
